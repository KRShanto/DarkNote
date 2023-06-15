import { create } from "zustand";

interface CollapseState {
  collapse: number;
  collapseNow: () => void;
}

export const useCollapseStore = create<CollapseState>((set) => ({
  collapse: 0,
  collapseNow: () => set((state) => ({ collapse: state.collapse + 1 })),
}));
