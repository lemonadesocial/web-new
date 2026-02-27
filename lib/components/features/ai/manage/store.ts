import { Event, Space } from '$lib/graphql/generated/backend/graphql';
import { atom, createStore, useAtomValue } from 'jotai';

export const aiManageLayoutStore = createStore();

type DeviceType = 'desktop' | 'mobile';
type LayoutType = 'event' | 'community';
export type ActiveTabType = 'manage' | 'design' | 'preview';

interface IStore {
  showSidebarLeft: boolean;
  device: DeviceType;
  layoutType: LayoutType;
  activeTab: ActiveTabType;
  data?: Event | Space;
}

const defaultStore: IStore = {
  layoutType: 'event',
  showSidebarLeft: true,
  device: 'desktop',
  activeTab: 'manage',
};

const storeAtom = atom(defaultStore);
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
  setData: (data: Event | Space) => aiManageLayoutStore.set(storeAtom, (prev) => ({ ...prev, data })),
  unsubscribe: aiManageLayoutStore.sub(storeAtom, () => {
    aiManageLayoutStore.set(storeAtom, defaultStore);
  }),
};
