import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  onChangeOpen: () => void;
}

export const useModal = create<ModalState>()((set) => ({
  isOpen: false,
  onChangeOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
