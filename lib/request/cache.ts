/* eslint-disable  @typescript-eslint/no-explicit-any */
import { TypedDocumentNode } from '@graphql-typed-document-node/core';

export class InMemoryCache {
  private readonly store: Record<string, any> = {
    ROOT_QUERY: { __typename: 'Query' },
  };

  private listeners: Record<string, Set<() => void>> = {};

  // Helper to extract typename from data
  private getTypename(data: any): string | null {
    if (!data || typeof data !== 'object') return null;
    return data.__typename || null;
  }

  // Generate ID for an entity
  private generateEntityId(typename: string, id: any): string {
    return `${typename}:${id}`;
  }

  // Generate cache key for a query field
  private generateFieldCacheKey(fieldName: string, args?: Record<string, any>): string {
    if (!args || Object.keys(args).length === 0) {
      return fieldName;
    }

    const argString = Object.entries(args)
      .map(([key, value]) => `${key}:${JSON.stringify(value)}`)
      .join(',');

    return `${fieldName}(${argString})`;
  }

  // Normalize and store entity
  private storeEntity(data: any): { __ref: string } | null {
    if (!data || typeof data !== 'object') return null;

    const typename = this.getTypename(data);
    if (!typename) return null;

    // Try to get ID from common ID fields
    const id = data.id || data._id;
    if (!id) return null;

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
              const normalized = this.storeEntity(item);
              return normalized || item;
            }
          }
          return item;
        });
      } else if (value && typeof value === 'object') {
        // Handle nested objects
        const nestedTypename = this.getTypename(value);
        if (nestedTypename) {
          const normalized = this.storeEntity(value);
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

  // Normalize query result and store in cache
  normalizeAndStore<T, V extends object>(
    query: TypedDocumentNode<T, V>,
    variables: Record<string, any>,
    data: any,
  ): void {
    const queryKey = this.createCacheKey<T, V>(query, variables);
    // Get operation name and extract root fields
    const operationDef = query.definitions.find((def) => def.kind === 'OperationDefinition') as any;

    if (!operationDef) return;

    // Process each selection (field) at the root level
    operationDef.selectionSet.selections.forEach((selection: any) => {
      if (selection.kind !== 'Field') return;

      const fieldName = selection.name.value;
      const args = this.extractArguments(selection, variables);
      const fieldKey = this.generateFieldCacheKey(fieldName, args);
      const resultData = data[fieldName];

      if (resultData === undefined) return;

      if (Array.isArray(resultData)) {
        // Handle arrays (lists)
        this.store.ROOT_QUERY[fieldKey] = resultData.map((item) => {
          if (item && typeof item === 'object') {
            const normalized = this.storeEntity(item);
            return normalized || item;
          }
          return item;
        });
      } else if (resultData && typeof resultData === 'object') {
        // Handle objects
        const normalized = this.storeEntity(resultData);
        this.store.ROOT_QUERY[fieldKey] = normalized || resultData;
      } else {
        // Handle primitives
        this.store.ROOT_QUERY[fieldKey] = resultData;
      }
    });

    // Notify listeners
    if (queryKey) this.notifyListeners(queryKey);
  }

  // Extract arguments from query field
  private extractArguments(field: any, variables?: Record<string, any>): Record<string, any> | undefined {
    if (!field.arguments || field.arguments.length === 0) return undefined;

    const args: Record<string, any> = {};

    field.arguments.forEach((arg: any) => {
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

  // Denormalize data from cache
  private denormalizeData(data: any): any {
    if (!data) return data;

    // Handle reference
    if (data.__ref) {
      const entity = this.store[data.__ref];
      if (!entity) return null;
      return this.denormalizeData(entity);
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return data.map((item) => this.denormalizeData(item));
    }

    // Handle objects
    if (typeof data === 'object') {
      const result: Record<string, any> = {};

      for (const [key, value] of Object.entries(data)) {
        result[key] = this.denormalizeData(value);
      }

      return result;
    }

    // Handle primitives
    return data;
  }

  // Read data from cache for a query
  readQuery<T, V>(query: TypedDocumentNode<T, V>, variables?: Record<string, any>): T | null {
    try {
      const operationDef = query.definitions.find((def) => def.kind === 'OperationDefinition') as any;

      if (!operationDef || operationDef.operation !== 'query') return null;

      const result: Record<string, any> = {};

      // Process each selection (field) at the root level
      operationDef.selectionSet.selections.forEach((selection: any) => {
        if (selection.kind !== 'Field') return;

        const fieldName = selection.name.value;
        const args = this.extractArguments(selection, variables);
        const fieldKey = this.generateFieldCacheKey(fieldName, args);

        // Check if field exists in cache
        if (!(fieldKey in this.store.ROOT_QUERY)) return null;

        const cachedValue = this.store.ROOT_QUERY[fieldKey];
        result[fieldName] = this.denormalizeData(cachedValue);
      });

      return Object.keys(result).length > 0 ? (result as T) : null;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }

  readFragment({ id }: { id: string }) {
    return this.store[id];
  }

  writeFragment({ id, data }: { id: string; data: any }) {
    if (!this.store[id]) return null;
    // Update fields
    for (const [key, value] of Object.entries(data)) {
      if (key === '__typename' || key === 'id' || key === '_id') continue;
      this.store[id][key] = value;
    }

    Object.keys(this.listeners).forEach((key) => this.notifyListeners(key));
  }

  // Notify listeners for a specific query
  private notifyListeners(queryKey: string): void {
    this.listeners[queryKey]?.forEach((callback) => callback());
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

  // Helper to generate a consistent cache key
  createCacheKey<T, V extends object>(query: TypedDocumentNode<T, V>, variables?: Record<string, any>) {
    // Extract operation name
    const operationDef: any = query.definitions.find((def) => def.kind === 'OperationDefinition' && def.name);

    if (!operationDef) return null;

    const operationName = operationDef.name?.value;

    // Format variables
    const varStrings = [];
    if (variables) {
      for (const [key, value] of Object.entries(variables)) {
        const formattedValue = typeof value === 'string' ? `"${value}"` : value;
        varStrings.push(`${key}: ${formattedValue}`);
      }
    }

    // Combine operation name and variables
    return `${operationName}(${varStrings.join(', ')})`;
  }
}
