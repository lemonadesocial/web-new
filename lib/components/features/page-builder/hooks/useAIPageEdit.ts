'use client';

import React from 'react';
import { useEditor } from '@craftjs/core';
import { useSetAtom, useAtomValue } from 'jotai';
import { useMutation } from '$lib/graphql/request/hooks';
import {
  AiCreatePageConfigDocument,
  AiUpdatePageConfigSectionDocument,
  AiGeneratePageFromDescriptionDocument,
} from '$lib/graphql/generated/backend/graphql';

import { pageConfigToCraftState } from '../serializer';
import {
  isDirtyAtom,
  pageConfigAtom,
  aiDraftPhaseAtom,
  aiPreSnapshotAtom,
  aiPrePageConfigAtom,
  aiDraftConfigAtom,
  aiDraftErrorAtom,
} from '../store';
import type { AIDraftPhase } from '../store';
import type { PageConfig } from '../types';
import { classifyError, pbEvent } from '../observability';

// ── Types ──

type MutationKind = 'create' | 'updateSection' | 'generate';

interface LastMutation {
  kind: MutationKind;
  args: unknown[];
}

export interface UseAIPageEditReturn {
  phase: AIDraftPhase;
  requestCreate: (input: Record<string, unknown>) => Promise<void>;
  requestUpdateSection: (configId: string, sectionId: string, input: Record<string, unknown>) => Promise<void>;
  requestGenerate: (input: Record<string, unknown>) => Promise<void>;
  applyDraft: () => void;
  revertDraft: () => void;
  retryLast: () => Promise<void>;
  dismissError: () => void;
}

// ── Hook ──

export function useAIPageEdit(): UseAIPageEditReturn {
  const { query, actions } = useEditor();

  const phase = useAtomValue(aiDraftPhaseAtom);
  const preSnapshot = useAtomValue(aiPreSnapshotAtom);
  const prePageConfig = useAtomValue(aiPrePageConfigAtom);
  const setPhase = useSetAtom(aiDraftPhaseAtom);
  const setPreSnapshot = useSetAtom(aiPreSnapshotAtom);
  const setPrePageConfig = useSetAtom(aiPrePageConfigAtom);
  const setDraftConfig = useSetAtom(aiDraftConfigAtom);
  const setDraftError = useSetAtom(aiDraftErrorAtom);
  const setPageConfig = useSetAtom(pageConfigAtom);
  const setIsDirty = useSetAtom(isDirtyAtom);
  const pageConfig = useAtomValue(pageConfigAtom);

  const [aiCreate] = useMutation(AiCreatePageConfigDocument);
  const [aiUpdateSection] = useMutation(AiUpdatePageConfigSectionDocument);
  const [aiGenerate] = useMutation(AiGeneratePageFromDescriptionDocument);

  const lastMutationRef = React.useRef<LastMutation | null>(null);
  const cancelledRef = React.useRef(false);
  const pageConfigRef = React.useRef(pageConfig);
  pageConfigRef.current = pageConfig;
  const preSnapshotRef = React.useRef(preSnapshot);
  preSnapshotRef.current = preSnapshot;
  const prePageConfigRef = React.useRef(prePageConfig);
  prePageConfigRef.current = prePageConfig;

  // ── Core executor ──

  const executeAIMutation = React.useCallback(
    async (mutationFn: () => Promise<PageConfig | null | undefined>) => {
      // 1. Capture pre-AI snapshot
      cancelledRef.current = false;
      const serialized = query.serialize();
      setPreSnapshot(serialized);
      setPrePageConfig(pageConfigRef.current);

      // 2. Set loading
      setPhase('loading');

      try {
        // 3. Run the AI mutation
        const result = await mutationFn();

        // 3b. Bail if cancelled while awaiting
        if (cancelledRef.current) return;

        if (!result) throw new Error('AI mutation returned no data');

        // 4. Deserialize AI result into Craft.js
        const craftState = pageConfigToCraftState(result);
        actions.deserialize(craftState);
        setPageConfig(result);
        setDraftConfig(result);

        // 5. Enter previewing phase
        setPhase('previewing');
      } catch (err) {
        // Bail if cancelled while awaiting
        if (cancelledRef.current) return;

        // 6. Restore snapshot on error
        try {
          actions.deserialize(JSON.parse(serialized));
        } catch {
          // best effort restore
        }
        setPageConfig(pageConfigRef.current);
        setDraftError(err);
        setPhase('error');
        const ec = classifyError(err);
        pbEvent({ op: 'ai_mutation', errorClass: ec, message: 'AI page edit failed' });
      }
    },
    [query, actions, setPreSnapshot, setPrePageConfig, setPhase, setPageConfig, setDraftConfig, setDraftError],
  );

  // ── Clear all draft atoms ──

  const clearDraftState = React.useCallback(() => {
    setPhase('idle');
    setPreSnapshot(null);
    setPrePageConfig(null);
    setDraftConfig(null);
    setDraftError(null);
  }, [setPhase, setPreSnapshot, setPrePageConfig, setDraftConfig, setDraftError]);

  // ── Public API ──

  const requestCreate = React.useCallback(
    async (input: Record<string, unknown>) => {
      lastMutationRef.current = { kind: 'create', args: [input] };
      await executeAIMutation(async () => {
        const { data } = await aiCreate({ variables: { input } });
        return data?.aiCreatePageConfig;
      });
    },
    [executeAIMutation, aiCreate],
  );

  const requestUpdateSection = React.useCallback(
    async (configId: string, sectionId: string, input: Record<string, unknown>) => {
      lastMutationRef.current = { kind: 'updateSection', args: [configId, sectionId, input] };
      await executeAIMutation(async () => {
        const { data } = await aiUpdateSection({
          variables: { config_id: configId, section_id: sectionId, input },
        });
        return data?.aiUpdatePageConfigSection;
      });
    },
    [executeAIMutation, aiUpdateSection],
  );

  const requestGenerate = React.useCallback(
    async (input: Record<string, unknown>) => {
      lastMutationRef.current = { kind: 'generate', args: [input] };
      await executeAIMutation(async () => {
        const { data } = await aiGenerate({ variables: { input } });
        return data?.aiGeneratePageFromDescription;
      });
    },
    [executeAIMutation, aiGenerate],
  );

  const applyDraft = React.useCallback(() => {
    setIsDirty(true);
    clearDraftState();
  }, [setIsDirty, clearDraftState]);

  const revertDraft = React.useCallback(() => {
    cancelledRef.current = true;
    const snap = preSnapshotRef.current;
    const prevConfig = prePageConfigRef.current;
    if (snap) {
      try {
        actions.deserialize(JSON.parse(snap));
      } catch {
        // best effort restore
      }
    }
    if (prevConfig) {
      setPageConfig(prevConfig);
    }
    clearDraftState();
  }, [actions, setPageConfig, clearDraftState]);

  const retryLast = React.useCallback(async () => {
    const last = lastMutationRef.current;
    if (!last) return;
    if (last.kind === 'create') await requestCreate(last.args[0] as Record<string, unknown>);
    else if (last.kind === 'updateSection') await requestUpdateSection(last.args[0] as string, last.args[1] as string, last.args[2] as Record<string, unknown>);
    else if (last.kind === 'generate') await requestGenerate(last.args[0] as Record<string, unknown>);
  }, [requestCreate, requestUpdateSection, requestGenerate]);

  const dismissError = React.useCallback(() => {
    revertDraft();
  }, [revertDraft]);

  return {
    phase,
    requestCreate,
    requestUpdateSection,
    requestGenerate,
    applyDraft,
    revertDraft,
    retryLast,
    dismissError,
  };
}
