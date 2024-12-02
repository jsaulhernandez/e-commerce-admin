import { create } from "zustand";

import { UseStoreModalState } from "@/data/interfaces/use-store-modal-state.interface";

export const useStoreModal = create<UseStoreModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
