/* src/stores/uiStore.ts */
import { create } from "zustand";

interface UIState {
  booting: boolean;
  menuOpen: boolean;
  playbackOpen: boolean;
  challengeOpen: boolean;
  infoMode: number; // 0: Image Only, 1: Image + Histogram, 2: Image + Histogram + Telemetry, 3: Full OSD (All overlays)
  shutterTriggerCount: number;

  // Actions
  toggleMenu: () => void;
  setMenuOpen: (open: boolean) => void;
  togglePlayback: () => void;
  setPlaybackOpen: (open: boolean) => void;
  toggleChallenge: () => void;
  setChallengeOpen: (open: boolean) => void;
  cycleInfoMode: () => void;
  setBooting: (booting: boolean) => void;
  closeAllOverlays: () => void;
  triggerShutter: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  booting: true, // starts in booting state
  menuOpen: false,
  playbackOpen: false,
  challengeOpen: false,
  infoMode: 3, // start with Full OSD by default for high educational value
  shutterTriggerCount: 0,

  toggleMenu: () => set((state) => ({ menuOpen: !state.menuOpen, playbackOpen: false, challengeOpen: false })),
  setMenuOpen: (open) => set({ menuOpen: open }),
  
  togglePlayback: () => set((state) => ({ playbackOpen: !state.playbackOpen, menuOpen: false, challengeOpen: false })),
  setPlaybackOpen: (open) => set({ playbackOpen: open }),

  toggleChallenge: () => set((state) => ({ challengeOpen: !state.challengeOpen, menuOpen: false, playbackOpen: false })),
  setChallengeOpen: (open) => set({ challengeOpen: open }),

  cycleInfoMode: () => set((state) => ({ infoMode: (state.infoMode + 1) % 4 })),
  
  setBooting: (booting) => set({ booting }),

  closeAllOverlays: () => set({ menuOpen: false, playbackOpen: false, challengeOpen: false }),

  triggerShutter: () => set((state) => ({ shutterTriggerCount: state.shutterTriggerCount + 1 }))
}));
