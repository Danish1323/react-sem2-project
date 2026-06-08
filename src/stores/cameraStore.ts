/* src/stores/cameraStore.ts */
import { create } from "zustand";
import { APERTURES } from "../constants/aperture";
import { ISO_VALUES } from "../constants/iso";
import { SHUTTER_SPEEDS } from "../constants/shutter";
import { DEFAULT_CAMERA_SETTINGS } from "../constants/cameraConfig";
import { localStorageManager } from "../core/storage/localStorageManager";
import { calculateEV } from "../core/exposure/calculateEV";
import { adjustedEV } from "../core/exposure/adjustedEV";
import { deltaEV } from "../core/exposure/deltaEV";

interface CameraState {
  aperture: number;
  iso: number;
  shutter: number;
  selectedControl: "aperture" | "iso" | "shutter";
  ev: number;
  adjustedEV: number;
  deltaEV: number;
  captureCount: number;
  latencyMs: number;
  
  // Wheel rotation angles (in degrees) for each parameter
  apertureAngle: number;
  isoAngle: number;
  shutterAngle: number;

  // Actions
  setAperture: (aperture: number) => void;
  setISO: (iso: number) => void;
  setShutter: (shutter: number) => void;
  setSelectedControl: (control: "aperture" | "iso" | "shutter") => void;
  incrementCaptureCount: () => void;
  recalculateExposure: (targetEV: number) => void;
  loadSavedSettings: () => void;
  saveCurrentSettings: () => void;
  setApertureAngle: (angle: number) => void;
  setISOAngle: (angle: number) => void;
  setShutterAngle: (angle: number) => void;
  setLatencyMs: (ms: number) => void;
  resetBaselineExposure: () => void;
}

export const useCameraStore = create<CameraState>((set, get) => ({
  aperture: DEFAULT_CAMERA_SETTINGS.aperture,
  iso: DEFAULT_CAMERA_SETTINGS.iso,
  shutter: DEFAULT_CAMERA_SETTINGS.shutter,
  selectedControl: "aperture",
  ev: calculateEV(DEFAULT_CAMERA_SETTINGS.aperture, DEFAULT_CAMERA_SETTINGS.shutter),
  adjustedEV: adjustedEV(
    calculateEV(DEFAULT_CAMERA_SETTINGS.aperture, DEFAULT_CAMERA_SETTINGS.shutter),
    DEFAULT_CAMERA_SETTINGS.iso
  ),
  deltaEV: 0, // Recalculated dynamically relative to active scene
  captureCount: 0,
  latencyMs: 0,

  apertureAngle: APERTURES.indexOf(DEFAULT_CAMERA_SETTINGS.aperture as any) * 36,
  isoAngle: ISO_VALUES.indexOf(DEFAULT_CAMERA_SETTINGS.iso as any) * 45,
  shutterAngle: SHUTTER_SPEEDS.indexOf(DEFAULT_CAMERA_SETTINGS.shutter as any) * 20,

  setAperture: (aperture) => {
    const idx = APERTURES.indexOf(aperture as any);
    const angle = idx !== -1 ? idx * 36 : get().apertureAngle;
    
    set({ aperture, apertureAngle: angle });
    get().saveCurrentSettings();
  },

  setISO: (iso) => {
    const idx = ISO_VALUES.indexOf(iso as any);
    const angle = idx !== -1 ? idx * 45 : get().isoAngle;

    set({ iso, isoAngle: angle });
    get().saveCurrentSettings();
  },

  setShutter: (shutter) => {
    const idx = SHUTTER_SPEEDS.indexOf(shutter as any);
    const angle = idx !== -1 ? idx * 20 : get().shutterAngle;

    set({ shutter, shutterAngle: angle });
    get().saveCurrentSettings();
  },

  setSelectedControl: (selectedControl) => {
    set({ selectedControl });
  },

  incrementCaptureCount: () => {
    set((state) => ({ captureCount: state.captureCount + 1 }));
  },

  recalculateExposure: (targetEV) => {
    const { aperture, shutter, iso } = get();
    const evVal = calculateEV(aperture, shutter);
    const adjEV = adjustedEV(evVal, iso);
    const dEV = deltaEV(targetEV, adjEV);
    set({ ev: evVal, adjustedEV: adjEV, deltaEV: dEV });
  },

  setApertureAngle: (apertureAngle) => set({ apertureAngle }),
  setISOAngle: (isoAngle) => set({ isoAngle }),
  setShutterAngle: (shutterAngle) => set({ shutterAngle }),
  setLatencyMs: (latencyMs) => set({ latencyMs }),

  resetBaselineExposure: () => {
    set({
      aperture: DEFAULT_CAMERA_SETTINGS.aperture,
      iso: DEFAULT_CAMERA_SETTINGS.iso,
      shutter: DEFAULT_CAMERA_SETTINGS.shutter,
      apertureAngle: APERTURES.indexOf(DEFAULT_CAMERA_SETTINGS.aperture as any) * 36,
      isoAngle: ISO_VALUES.indexOf(DEFAULT_CAMERA_SETTINGS.iso as any) * 45,
      shutterAngle: SHUTTER_SPEEDS.indexOf(DEFAULT_CAMERA_SETTINGS.shutter as any) * 20,
    });
    get().saveCurrentSettings();
  },

  loadSavedSettings: () => {
    const saved = localStorageManager.loadSettings();
    const captures = localStorageManager.loadCaptures();
    if (saved) {
      const apIdx = APERTURES.indexOf(saved.aperture as any);
      const isoIdx = ISO_VALUES.indexOf(saved.iso as any);
      const shIdx = SHUTTER_SPEEDS.indexOf(saved.shutter as any);

      set({
        aperture: saved.aperture,
        iso: saved.iso,
        shutter: saved.shutter,
        apertureAngle: apIdx !== -1 ? apIdx * 36 : 0,
        isoAngle: isoIdx !== -1 ? isoIdx * 45 : 0,
        shutterAngle: shIdx !== -1 ? shIdx * 20 : 0,
        captureCount: captures.length
      });
    } else {
      set({ captureCount: captures.length });
    }
  },

  saveCurrentSettings: () => {
    const { aperture, iso, shutter } = get();
    localStorageManager.saveSettings({ aperture, iso, shutter });
  }
}));
