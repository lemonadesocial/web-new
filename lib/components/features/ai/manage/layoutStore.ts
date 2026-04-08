import { atom, createStore, useAtomValue } from 'jotai';
import { cloneDeep } from 'lodash';

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface ComponentData {
  type: string;
  props: Record<string, any>;
}

export interface LayoutState {
  layout: LayoutItem[];
  components: Record<string, ComponentData>;
}

export const gridLayoutStore = createStore();

// Atoms
const stateAtom = atom<LayoutState>({ layout: [], components: {} });
const historyAtom = atom<LayoutState[]>([]);
const historyIndexAtom = atom<number>(-1);
const selectedIdAtom = atom<string | null>(null);

// Derived Atoms for reading
export const useGridState = () => useAtomValue(stateAtom, { store: gridLayoutStore });
export const useGridSelectedId = () => useAtomValue(selectedIdAtom, { store: gridLayoutStore });
export const useGridHistory = () => {
  const history = useAtomValue(historyAtom, { store: gridLayoutStore });
  const index = useAtomValue(historyIndexAtom, { store: gridLayoutStore });
  return {
    canUndo: index > 0,
    canRedo: index < history.length - 1,
  };
};

// Helper function to push state to history
const pushHistory = (newState: LayoutState) => {
  gridLayoutStore.set(historyAtom, (prev) => {
    const currentIndex = gridLayoutStore.get(historyIndexAtom);
    const newHistory = prev.slice(0, currentIndex + 1);
    newHistory.push(cloneDeep(newState));
    return newHistory;
  });
  gridLayoutStore.set(historyIndexAtom, (prev) => prev + 1);
};

// Actions
export const gridLayoutActions = {
  initState: (initialState: LayoutState) => {
    const clonedState = cloneDeep(initialState);
    gridLayoutStore.set(stateAtom, clonedState);
    gridLayoutStore.set(historyAtom, [clonedState]);
    gridLayoutStore.set(historyIndexAtom, 0);
    gridLayoutStore.set(selectedIdAtom, null);
  },
  
  updateLayout: (newLayout: LayoutItem[]) => {
    gridLayoutStore.set(stateAtom, (prev) => {
      const newState = { ...prev, layout: newLayout };
      pushHistory(newState);
      return newState;
    });
  },

  addSection: (type: string, initialProps: Record<string, any> = {}) => {
    gridLayoutStore.set(stateAtom, (prev) => {
      const id = `${type}-${Date.now()}`;
      // Default to 12 columns wide, placing it at the bottom
      const maxY = prev.layout.reduce((max, item) => Math.max(max, item.y + item.h), 0);
      const newLayoutItem: LayoutItem = { i: id, x: 0, y: maxY, w: 12, h: 6 };
      
      const newState = {
        layout: [...prev.layout, newLayoutItem],
        components: { ...prev.components, [id]: { type, props: initialProps } },
      };
      pushHistory(newState);
      return newState;
    });
  },

  removeSection: (id: string) => {
    gridLayoutStore.set(stateAtom, (prev) => {
      const newLayout = prev.layout.filter((item) => item.i !== id);
      const newComponents = { ...prev.components };
      delete newComponents[id];
      
      const newState = { layout: newLayout, components: newComponents };
      pushHistory(newState);
      
      if (gridLayoutStore.get(selectedIdAtom) === id) {
        gridLayoutStore.set(selectedIdAtom, null);
      }
      
      return newState;
    });
  },

  updateProps: (id: string, newProps: Record<string, any>) => {
    gridLayoutStore.set(stateAtom, (prev) => {
      const component = prev.components[id];
      if (!component) return prev;

      const newState = {
        ...prev,
        components: {
          ...prev.components,
          [id]: {
            ...component,
            props: { ...component.props, ...newProps },
          },
        },
      };
      pushHistory(newState);
      return newState;
    });
  },

  selectNode: (id: string | null) => {
    gridLayoutStore.set(selectedIdAtom, id);
  },

  undo: () => {
    const currentIndex = gridLayoutStore.get(historyIndexAtom);
    if (currentIndex > 0) {
      const history = gridLayoutStore.get(historyAtom);
      const previousState = history[currentIndex - 1];
      gridLayoutStore.set(stateAtom, cloneDeep(previousState));
      gridLayoutStore.set(historyIndexAtom, currentIndex - 1);
    }
  },

  redo: () => {
    const currentIndex = gridLayoutStore.get(historyIndexAtom);
    const history = gridLayoutStore.get(historyAtom);
    if (currentIndex < history.length - 1) {
      const nextState = history[currentIndex + 1];
      gridLayoutStore.set(stateAtom, cloneDeep(nextState));
      gridLayoutStore.set(historyIndexAtom, currentIndex + 1);
    }
  },
};
