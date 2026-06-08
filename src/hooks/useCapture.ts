/* src/hooks/useCapture.ts */
import { useCameraStore } from "../stores/cameraStore";
import { useSceneStore } from "../stores/sceneStore";
import { useGalleryStore } from "../stores/galleryStore";
import type { Capture } from "../types/gallery";
import type { CanvasRenderer } from "../core/renderer/CanvasRenderer";

export function useCapture(rendererInstance: CanvasRenderer | null) {
  const aperture = useCameraStore((state) => state.aperture);
  const iso = useCameraStore((state) => state.iso);
  const shutter = useCameraStore((state) => state.shutter);
  const ev = useCameraStore((state) => state.ev);
  const adjustedEV = useCameraStore((state) => state.adjustedEV);
  const deltaEV = useCameraStore((state) => state.deltaEV);
  const incrementCaptureCount = useCameraStore((state) => state.incrementCaptureCount);

  const activeScene = useSceneStore((state) => state.activeScene);
  const addCapture = useGalleryStore((state) => state.addCapture);

  const capture = (): Capture | null => {
    if (!rendererInstance) {
      console.warn("Capture failed: Renderer instance is not ready.");
      return null;
    }

    try {
      // 1. Grab final canvas PNG Data URL
      const imageData = rendererInstance.getCaptureDataURL();

      // 2. Assemble capture and metadata object
      const newCapture: Capture = {
        id: `capture-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: Date.now(),
        sceneId: activeScene.id,
        sceneName: activeScene.name,
        imageData,
        aperture,
        iso,
        shutter,
        ev,
        adjustedEV,
        deltaEV
      };

      // 3. Save to gallery store (persisted in localStorage)
      addCapture(newCapture);

      // 4. Increment capture count
      incrementCaptureCount();

      return newCapture;
    } catch (err) {
      console.error("Error creating capture:", err);
      return null;
    }
  };

  return { capture };
}
