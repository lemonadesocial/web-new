import { Event, Space } from '$lib/graphql/generated/backend/graphql';
import { atom, createStore, useAtomValue } from 'jotai';

export const aiManageLayoutStore = createStore();

type DeviceType = 'desktop' | 'mobile';
export type LayoutType = 'event' | 'community';
export type ActiveTabType = 'manage' | 'design' | 'preview';
export type BuilderTabType = 'template' | 'sections' | 'theme';
export type DesignModeType = 'builder' | 'ai';
export type MobilePaneType = 'main' | 'chat' | 'config';
export const defaultAvailableTabs: ActiveTabType[] = ['manage', 'design', 'preview'];
export type PageCustomCode = {
  css?: string;
  head_html?: string;
  body_html?: string;
  scripts?: Array<{ src?: string; content?: string; strategy: string }>;
};

interface IStore {
  showSidebarLeft: boolean;
  device: DeviceType;
  layoutType: LayoutType;
  activeTab: ActiveTabType;
  availableTabs: ActiveTabType[];
  builderTab: BuilderTabType;
  designMode: DesignModeType;
  mobilePane: MobilePaneType;
  data?: Event | Space;
  isCreatingTemplate: boolean;
  templateName?: string;
  fullScreen: boolean;
  pageConfigId?: string;
  /** Last persisted PageConfig.theme — used for dirty-check and Reset in the theme editor */
  savedPageTheme?: Record<string, unknown>;
  /** Last persisted PageConfig.custom_code — used for save round-tripping and preview reset. */
  savedPageCustomCode?: PageCustomCode;
  /** Current in-editor custom_code state, including AI-authored CSS. */
  pageCustomCode?: PageCustomCode;
}

const defaultStore: IStore = {
  layoutType: 'event',
  showSidebarLeft: true,
  device: 'desktop',
  activeTab: 'manage',
  availableTabs: defaultAvailableTabs,
  builderTab: 'template',
  designMode: 'builder',
  mobilePane: 'main',
  isCreatingTemplate: false,
  fullScreen: false,
};

export const storeAtom = atom(defaultStore);
export const useStoreManageLayout = () => useAtomValue(storeAtom, { store: aiManageLayoutStore });

export const storeManageLayout = {
  toggleSidebarLeft: () =>
    aiManageLayoutStore.set(storeAtom, (prev) => ({
      ...prev,
      showSidebarLeft: !prev.showSidebarLeft,
    })),
  setPreviewMode: (device: DeviceType) =>
    aiManageLayoutStore.set(storeAtom, (prev) => ({
      ...prev,
      device,
    })),
  setLayoutType: (type: LayoutType) => aiManageLayoutStore.set(storeAtom, (prev) => ({ ...prev, layoutType: type })),
  setActiveTab: (tab: ActiveTabType) => aiManageLayoutStore.set(storeAtom, (prev) => ({ ...prev, activeTab: tab })),
  setAvailableTabs: (availableTabs: ActiveTabType[]) =>
    aiManageLayoutStore.set(storeAtom, (prev) => ({
      ...prev,
      availableTabs,
      activeTab: availableTabs.includes(prev.activeTab) ? prev.activeTab : availableTabs[0] || 'manage',
    })),
  setBuilderTab: (tab: BuilderTabType) => aiManageLayoutStore.set(storeAtom, (prev) => ({ ...prev, builderTab: tab })),
  setDesignMode: (mode: DesignModeType) => aiManageLayoutStore.set(storeAtom, (prev) => ({ ...prev, designMode: mode })),
  setMobilePane: (pane: MobilePaneType) =>
    aiManageLayoutStore.set(storeAtom, (prev) => ({
      ...prev,
      mobilePane: pane,
    })),
  setData: (data: Event | Space) => aiManageLayoutStore.set(storeAtom, (prev) => ({ ...prev, data })),
  setIsCreatingTemplate: (isCreatingTemplate: boolean, templateName?: string) =>
    aiManageLayoutStore.set(storeAtom, (prev) => ({ ...prev, isCreatingTemplate, templateName })),
  setFullScreen: (fullScreen: boolean) => aiManageLayoutStore.set(storeAtom, (prev) => ({ ...prev, fullScreen })),
  setPageConfigId: (pageConfigId: string | undefined) => aiManageLayoutStore.set(storeAtom, (prev) => ({ ...prev, pageConfigId })),
  setSavedPageTheme: (savedPageTheme: Record<string, unknown> | undefined) => aiManageLayoutStore.set(storeAtom, (prev) => ({ ...prev, savedPageTheme })),
  setSavedPageCustomCode: (savedPageCustomCode: PageCustomCode | undefined) =>
    aiManageLayoutStore.set(storeAtom, (prev) => ({ ...prev, savedPageCustomCode })),
  setPageCustomCode: (pageCustomCode: PageCustomCode | undefined) =>
    aiManageLayoutStore.set(storeAtom, (prev) => ({ ...prev, pageCustomCode })),
  reset: () => aiManageLayoutStore.set(storeAtom, { ...defaultStore }),
};
