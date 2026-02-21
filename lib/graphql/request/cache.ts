import { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { OperationDefinitionNode, FieldNode } from 'graphql';

export class InMemoryCache {
  private store: Record<string, Record<string, unknown>> = {
    ROOT_QUERY: { __typename: 'Query' },
  };

  private listeners: Record<string, Set<() => void>> = {};

  private getTypename(data: unknown): string | null {
    if (!data || typeof data !== 'object') return null;
    return (data as Record<string, unknown>).__typename as string || null;
  }

  private generateEntityId(typename: string, id: string | number): string {
    return `${typename}:${id}`;
  }

  private generateFieldCacheKey<V>(fieldName: string, args?: V): string {
    if (!args || Object.keys(args).length === 0) {
      return fieldName;
    }

    const argString = Object.entries(args)
      .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
      .join(',');

    return `${fieldName}(${argString})`;
  }

  private denormalizeData(data: unknown): unknown {
    if (!data) return data;

    // Handle reference
    if (typeof data === 'object' && data !== null && '__ref' in data) {
      const entity = this.store[(data as { __ref: string }).__ref];
      if (!entity) return null;
      return this.denormalizeData(entity);
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map((item) => this.denormalizeData(item));
    }

    // Handle objects
    if (typeof data === 'object') {
      const result: Record<string, unknown> = {};

      for (const [key, value] of Object.entries(data)) {
        result[key] = this.denormalizeData(value);
      }

      return result;
    }

    // Handle primitives
    return data;
  }

  readQuery<T, V>(query: TypedDocumentNode<T, V>, variables?: Record<string, V>) {
    try {
      const operationDef = query.definitions.find(
        (def): def is OperationDefinitionNode => def.kind === 'OperationDefinition',
      );

      if (!operationDef || operationDef.operation !== 'query') return null;

      const result: Record<string, unknown> = {};

      // Process each selection (field) at the root level
      operationDef.selectionSet.selections.forEach((selection) => {
        if (selection.kind !== 'Field') return;

        const fieldName = selection.name.value;
        const args = this.extractArguments(selection, variables);
        const fieldKey = this.generateFieldCacheKey(fieldName, args);

        // Check if field exists in cache
        if (!(fieldKey in this.store.ROOT_QUERY)) return null;

        const cachedValue = this.store.ROOT_QUERY[fieldKey];
        result[fieldName] = this.denormalizeData(cachedValue);
      });

      // it's because included __typename
      return Object.keys(result).length > 1 ? (result as T) : null;
    } catch (error) {
      console.error('[InMemoryCache]: Error reading from cache:', error);
      return null;
    }
  }

  readFragment({ id }: { id: string }) {
    return this.store[id];
  }

  writeFragment<T>({ id, data }: { id: string; data: Partial<T> }) {
    if (!this.store[id]) {
      console.error(`[InMemoryCache]: ${id} not found`);
      return;
    }

    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (key === '__typename' || key === 'id' || key === '_id') continue;
      this.store[id][key] = value;
    }

    Object.keys(this.listeners).forEach((key) => this.notifyListeners(key));
  }

  writeQuery<T, V extends Record<string, unknown>>({
    query,
    variables = {} as V,
    data,
  }: {
    query: TypedDocumentNode<T, V>;
    variables?: V;
    data: T;
  }) {
    try {
      this.normalizeAndStore(query, variables, data);

      const queryKey = this.createCacheKey(query, variables);
      if (queryKey) {
        this.notifyListeners(queryKey);
      }
    } catch (error) {
      console.error('[InMemoryCache]: Error writing to cache:', error);
    }
  }

  private storeEntity(data: Record<string, unknown>): { __ref: string } | null {
    if (!data || typeof data !== 'object') return null;

    const typename = this.getTypename(data);
    if (!typename) return null;

    // Try to get ID from common ID fields
    const id = data.id || data._id;
    if (!id || (typeof id !== 'string' && typeof id !== 'number')) return null;

    const entityId = this.generateEntityId(typename, id);

    // Store entity if it doesn't exist yet
    if (!this.store[entityId]) {
      this.store[entityId] = { __typename: typename };
    }

    // Update entity fields
    for (const [key, value] of Object.entries(data)) {
      if (key === '__typename') continue;

      if (Array.isArray(value)) {
        // Handle arrays of objects
        this.store[entityId][key] = value.map((item) => {
          if (item && typeof item === 'object') {
            const nestedTypename = this.getTypename(item);
            if (nestedTypename) {
              const normalized = this.storeEntity(item as Record<string, unknown>);
              return normalized || item;
            }
          }
          return item;
        });
      } else if (value && typeof value === 'object') {
        // Handle nested objects
        const nestedTypename = this.getTypename(value);
        if (nestedTypename) {
          const normalized = this.storeEntity(value as Record<string, unknown>);
          this.store[entityId][key] = normalized || value;
        } else {
          this.store[entityId][key] = value;
        }
      } else {
        // Handle primitive values
        this.store[entityId][key] = value;
      }
    }

    return { __ref: entityId };
  }

  normalizeAndStore<T, V extends object>(query: TypedDocumentNode<T, V>, variables: Record<string, V>, data: T) {
    const queryKey = this.createCacheKey<T, V>(query, variables);

    // Get operation name and extract root fields
    const operationDef = query.definitions.find((def) => def.kind === 'OperationDefinition');

    if (!operationDef) return;

    operationDef.selectionSet.selections.forEach((selection) => {
      if (selection.kind !== 'Field') return;

      const fieldName = selection.name.value as keyof T;

      if (fieldName === '__typename') return;

      const args = this.extractArguments(selection, variables);
      const fieldKey = this.generateFieldCacheKey(fieldName as string, args);
      const resultData = data[fieldName];

      if (resultData === undefined) return;

      if (Array.isArray(resultData)) {
        // Handle arrays (lists)
        this.store.ROOT_QUERY[fieldKey] = resultData.map((item) => {
          if (item && typeof item === 'object') {
            const normalized = this.storeEntity(item as Record<string, unknown>);
            return normalized || item;
          }
          return item;
        });
      } else if (resultData && typeof resultData === 'object') {
        // Handle objects
        const normalized = this.storeEntity(resultData as Record<string, unknown>);
        this.store.ROOT_QUERY[fieldKey] = normalized || resultData;
      } else {
        // Handle primitives
        this.store.ROOT_QUERY[fieldKey] = resultData;
      }
    });

    if (queryKey) this.notifyListeners(queryKey);
  }

  // Extract arguments from query field
  private extractArguments(field: FieldNode, variables?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!field.arguments || field.arguments.length === 0) return undefined;

    const args: Record<string, unknown> = {};

    field.arguments.forEach((arg) => {
      const name = arg.name.value;

      // Handle variable references
      if (arg.value.kind === 'Variable') {
        const varName = arg.value.name.value;
        if (variables && varName in variables) {
          args[name] = variables[varName];
        }
      }
      // Handle literal values
      else if (arg.value.kind === 'StringValue') {
        args[name] = arg.value.value;
      } else if (arg.value.kind === 'IntValue') {
        args[name] = parseInt(arg.value.value, 10);
      } else if (arg.value.kind === 'FloatValue') {
        args[name] = parseFloat(arg.value.value);
      } else if (arg.value.kind === 'BooleanValue') {
        args[name] = arg.value.value;
      }
      // Add handling for other value types as needed
    });

    return Object.keys(args).length > 0 ? args : undefined;
  }

  // Helper to generate a consistent cache key
  createCacheKey<T, V extends object>(query: TypedDocumentNode<T, V>, variables?: Record<string, unknown>) {
    // Extract operation name
    const operationDef = query.definitions.find(
      (def): def is OperationDefinitionNode => def.kind === 'OperationDefinition' && !!def.name,
    );

    if (!operationDef) return null;

    const operationName = operationDef.name?.value;

    // Format variables
    const varStrings = [];
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        let formattedValue = '';
        if (typeof value === 'object' || Array.isArray(value)) formattedValue = JSON.stringify(value);
        if (typeof value === 'string') formattedValue = `"${value}"`;
        if (typeof value === 'number' || typeof value === 'boolean') formattedValue = value.toString();

        varStrings.push(`${key}: ${formattedValue}`);
      }
    }

    // Combine operation name and variables
    return `${operationName}(${varStrings.join(', ')})`;
  }

  private notifyListeners(queryKey: string): void {
    this.listeners[queryKey]?.forEach((callback) => {
      callback();
    });
  }

  // Subscribe to cache updates
  subscribe(queryKey: string, callback: () => void): () => void {
    if (!this.listeners[queryKey]) {
      this.listeners[queryKey] = new Set();
    }

    this.listeners[queryKey].add(callback);

    return () => {
      this.listeners[queryKey]?.delete(callback);
      if (this.listeners[queryKey]?.size === 0) {
        delete this.listeners[queryKey];
      }
    };
  }
}
