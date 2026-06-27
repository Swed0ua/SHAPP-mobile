import { create } from "zustand";

type ShowSuccessOptions = {
  readonly onDone?: () => void;
};

type SuccessOverlayState = {
  readonly visible: boolean;
  readonly onDone: (() => void) | null;
  show: (options?: ShowSuccessOptions) => void;
  complete: () => void;
};

export const useSuccessOverlayStore = create<SuccessOverlayState>((set, get) => ({
  visible: false,
  onDone: null,
  show: (options) =>
    set({
      visible: true,
      onDone: options?.onDone ?? null,
    }),
  complete: () => {
    const { onDone } = get();
    set({ visible: false, onDone: null });
    onDone?.();
  },
}));
