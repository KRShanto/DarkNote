import { ViewType } from "@/types/view";
import { create } from "zustand";

interface ViewState {
  view: ViewType;
  setView: (view: ViewType) => void;
}

export const useViewStore = create<ViewState>((set) => ({
  view: "GRID",
  setView: (view) => set({ view }),
}));
