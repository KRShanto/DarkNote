import { create } from "zustand";

interface EditModeState {
  editMode: boolean;
  noteId: string | null;
  turnOn: (noteId: string) => void;
  turnOff: () => void;
  toggle: (noteId: string) => void;
}

export const useEditModeStore = create<EditModeState>((set) => ({
  editMode: false,
  noteId: null,
  turnOn: (noteId) => set({ editMode: true, noteId }),
  turnOff: () => set({ editMode: false, noteId: null }),
  toggle: (noteId) => set((state) => ({ editMode: !state.editMode, noteId })),
}));
