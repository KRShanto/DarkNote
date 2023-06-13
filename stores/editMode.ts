import { create } from "zustand";

interface EditModeState {
  editMode: boolean;
  turnOn: () => void;
  turnOff: () => void;
  toggle: () => void;
}

export const useEditModeStore = create<EditModeState>((set) => ({
  editMode: false,
  turnOn: () => set({ editMode: true }),
  turnOff: () => set({ editMode: false }),
  toggle: () => set((state) => ({ editMode: !state.editMode })),
}));
