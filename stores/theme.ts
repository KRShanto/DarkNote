import { ThemeType } from "@/types/theme";
import { create } from "zustand";

interface ThemeState {
  theme: ThemeType;
  changeTheme: (theme: ThemeType) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "DARK",
  changeTheme: (theme) =>
    set((state) => ({
      ...state,
      theme,
    })),
}));
