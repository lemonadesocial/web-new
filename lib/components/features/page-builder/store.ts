import { atom } from 'jotai';
import type { DevicePreview, OwnerType, PageConfig, RightPanelType } from './types';

// --- Editor identity ---
export const configIdAtom = atom<string | null>(null);
export const ownerTypeAtom = atom<OwnerType>('event');
export const ownerIdAtom = atom<string>('');

// --- Persistence flags ---
export const isDirtyAtom = atom(false);
export const isSavingAtom = atom(false);
export const isPublishingAtom = atom(false);
export const isLockedAtom = atom(false);

// --- Viewport ---
export const devicePreviewAtom = atom<DevicePreview>('desktop');
export const zoomAtom = atom(100);

// --- Selection & panels ---
export const selectedNodeIdAtom = atom<string | null>(null);
export const activeRightPanelAtom = atom<RightPanelType | null>(null);

// --- Page config snapshot (source of truth from server) ---
export const pageConfigAtom = atom<PageConfig | null>(null);

// --- Derived atoms ---
export const canUndoAtom = atom(false);
export const canRedoAtom = atom(false);
