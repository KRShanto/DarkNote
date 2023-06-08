import { create } from "zustand";
import { PopupType } from "../types/popup";

interface PopupState {
  popup: PopupType;
  data: any;
  shouldClose: boolean;
  openPopup: (popup: PopupType, data: any) => void;
  closePopup: () => void;
  closeActually: () => void;
}

export const usePopupStore = create<PopupState>((set) => ({
  popup: null,
  data: null,
  shouldClose: false,
  openPopup: (popup, data: any) => set({ popup, data }),
  closePopup: () =>
    set({
      shouldClose: true,
    }),
  closeActually: () => set({ popup: null, data: null, shouldClose: false }),
}));
