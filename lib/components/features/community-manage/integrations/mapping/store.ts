import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';

import type { ConflictPolicy, DryRunResult, MappingConfig } from './types';
import {
  addFieldMapping,
  createDefaultMappingConfig,
  removeFieldMapping,
  runDryRun,
  saveMappingConfig,
  updateConflictPolicy,
  updateUpsertKeys,
} from './mock-adapter';

// ---------------------------------------------------------------------------
// Atoms
// ---------------------------------------------------------------------------

export const mappingConfigAtom = atom<MappingConfig>(createDefaultMappingConfig('event'));
export const dryRunResultAtom = atom<DryRunResult | null>(null);
export const dryRunLoadingAtom = atom(false);
export const saveLoadingAtom = atom(false);
export const activeScopeAtom = atom<'event' | 'space'>('event');

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

export function useMappingConfig() {
  return useAtomValue(mappingConfigAtom);
}

export function useActiveScope() {
  return useAtom(activeScopeAtom);
}

export function useDryRunResult() {
  return useAtomValue(dryRunResultAtom);
}

export function useDryRunLoading() {
  return useAtomValue(dryRunLoadingAtom);
}

export function useSaveLoading() {
  return useAtomValue(saveLoadingAtom);
}

export function useMappingActions() {
  const setConfig = useSetAtom(mappingConfigAtom);
  const setDryRun = useSetAtom(dryRunResultAtom);
  const setDryRunLoading = useSetAtom(dryRunLoadingAtom);
  const setSaveLoading = useSetAtom(saveLoadingAtom);

  const handleAddMapping = (sourceField: string, targetField: string, transform?: string) => {
    setConfig((prev) => addFieldMapping(prev, sourceField, targetField, transform));
  };

  const handleRemoveMapping = (mappingId: string) => {
    setConfig((prev) => removeFieldMapping(prev, mappingId));
  };

  const handleSetConflictPolicy = (policy: ConflictPolicy) => {
    setConfig((prev) => updateConflictPolicy(prev, policy));
  };

  const handleSetUpsertKeys = (keys: string[]) => {
    setConfig((prev) => updateUpsertKeys(prev, keys));
  };

  const handleSwitchScope = (scope: 'event' | 'space') => {
    setConfig(createDefaultMappingConfig(scope));
    setDryRun(null);
  };

  const handleRunDryRun = async () => {
    setDryRunLoading(true);
    try {
      const config = createDefaultMappingConfig('event'); // will be replaced by current
      // We need to read current value — use a workaround via setter
      let currentConfig: MappingConfig | undefined;
      setConfig((prev) => {
        currentConfig = prev;
        return prev;
      });
      if (currentConfig) {
        const result = await runDryRun(currentConfig);
        setDryRun(result);
      }
    } finally {
      setDryRunLoading(false);
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);
    try {
      let currentConfig: MappingConfig | undefined;
      setConfig((prev) => {
        currentConfig = prev;
        return prev;
      });
      if (currentConfig) {
        const saved = await saveMappingConfig(currentConfig);
        setConfig(saved);
      }
    } finally {
      setSaveLoading(false);
    }
  };

  const handleResetConfig = (scope: 'event' | 'space') => {
    setConfig(createDefaultMappingConfig(scope));
    setDryRun(null);
  };

  return {
    addMapping: handleAddMapping,
    removeMapping: handleRemoveMapping,
    setConflictPolicy: handleSetConflictPolicy,
    setUpsertKeys: handleSetUpsertKeys,
    switchScope: handleSwitchScope,
    runDryRun: handleRunDryRun,
    save: handleSave,
    resetConfig: handleResetConfig,
  };
}
