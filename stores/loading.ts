import { create } from "zustand";

interface LoadingState {
  loading: boolean;
  turnOn: () => void;
  turnOff: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  loading: false,
  turnOn: () => set({ loading: true }),
  turnOff: () => set({ loading: false }),
}));
