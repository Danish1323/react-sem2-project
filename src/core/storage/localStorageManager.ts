/* src/core/storage/localStorageManager.ts */
import { LOCAL_STORAGE_KEYS } from "../../constants/cameraConfig";
import type { CameraSettings, CameraProfile } from "../../types/camera";
import type { Capture } from "../../types/gallery";

export const localStorageManager = {
  saveSettings(settings: CameraSettings): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error("Error saving camera settings", e);
    }
  },

  loadSettings(): CameraSettings | null {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error("Error loading camera settings", e);
      return null;
    }
  },

  saveProfiles(profiles: CameraProfile[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.PROFILES, JSON.stringify(profiles));
    } catch (e) {
      console.error("Error saving camera profiles", e);
    }
  },

  loadProfiles(): CameraProfile[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.PROFILES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error loading camera profiles", e);
      return [];
    }
  },

  saveCaptures(captures: Capture[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CAPTURES, JSON.stringify(captures));
    } catch (e) {
      console.error("Error saving captures", e);
    }
  },

  loadCaptures(): Capture[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.CAPTURES);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error loading captures", e);
      return [];
    }
  },

  saveChallengeProgress(completedChallenges: string[]): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CHALLENGE, JSON.stringify(completedChallenges));
    } catch (e) {
      console.error("Error saving challenge progress", e);
    }
  },

  loadChallengeProgress(): string[] {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEYS.CHALLENGE);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Error loading challenge progress", e);
      return [];
    }
  },

  clearAll(): void {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.PROFILES);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CAPTURES);
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CHALLENGE);
    } catch (e) {
      console.error("Error clearing local storage", e);
    }
  }
};
