import { create } from "zustand";

export type ModalType = "EXPORT" | "SETTINGS" | null;

interface ModalState {
  isOpen: boolean;
  type: ModalType;

  openModal: (type: ModalType) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  type: null,

  openModal: (type) => set({ isOpen: true, type }),

  closeModal: () => set({ isOpen: false, type: null }),
}));
