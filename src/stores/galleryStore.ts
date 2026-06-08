/* src/stores/galleryStore.ts */
import { create } from "zustand";
import { localStorageManager } from "../core/storage/localStorageManager";
import type { Capture } from "../types/gallery";

interface GalleryState {
  captures: Capture[];
  selectedCapture: Capture | null;

  // Actions
  addCapture: (capture: Capture) => void;
  removeCapture: (id: string) => void;
  loadCaptures: () => void;
  clearCaptures: () => void;
  setSelectedCapture: (capture: Capture | null) => void;
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
  captures: [],
  selectedCapture: null,

  addCapture: (capture) => {
    const updated = [capture, ...get().captures]; // Show newest captures first
    set({ captures: updated, selectedCapture: capture });
    localStorageManager.saveCaptures(updated);
  },

  removeCapture: (id) => {
    const { captures, selectedCapture } = get();
    const updated = captures.filter((c) => c.id !== id);
    
    let nextSelected = selectedCapture;
    if (selectedCapture && selectedCapture.id === id) {
      nextSelected = updated.length > 0 ? updated[0] : null;
    }
    
    set({ captures: updated, selectedCapture: nextSelected });
    localStorageManager.saveCaptures(updated);
  },

  loadCaptures: () => {
    const loaded = localStorageManager.loadCaptures();
    set({ captures: loaded, selectedCapture: loaded.length > 0 ? loaded[0] : null });
  },

  clearCaptures: () => {
    set({ captures: [], selectedCapture: null });
    localStorageManager.saveCaptures([]);
  },

  setSelectedCapture: (selectedCapture) => {
    set({ selectedCapture });
  }
}));
