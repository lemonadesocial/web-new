import { Event, Space } from '$lib/graphql/generated/backend/graphql';
import { atom, createStore, useAtomValue } from 'jotai';

export const aiManageLayoutStore = createStore();

type DeviceType = 'desktop' | 'mobile';
type LayoutType = 'event' | 'community';
export type ActiveTabType = 'manage' | 'design' | 'preview';
export type BuilderTabType = 'template' | 'sections' | 'theme';
export type DesignModeType = 'builder' | 'ai';
export type MobilePaneType = 'main' | 'chat' | 'config';

interface IStore {
  showSidebarLeft: boolean;
  device: DeviceType;
  layoutType: LayoutType;
  activeTab: ActiveTabType;
  builderTab: BuilderTabType;
  designMode: DesignModeType;
  mobilePane: MobilePaneType;
  data?: Event | Space;
  isCreatingTemplate: boolean;
  templateName?: string;
}

const defaultStore: IStore = {
  layoutType: 'event',
  showSidebarLeft: true,
  device: 'desktop',
  activeTab: 'manage',
  builderTab: 'template',
  designMode: 'builder',
  mobilePane: 'main',
  isCreatingTemplate: false,
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
  reset: () => aiManageLayoutStore.set(storeAtom, { ...defaultStore }),
};
