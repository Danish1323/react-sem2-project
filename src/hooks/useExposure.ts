/* src/hooks/useExposure.ts */
import { useEffect } from "react";
import { useCameraStore } from "../stores/cameraStore";
import { useSceneStore } from "../stores/sceneStore";

export function useExposure() {
  const aperture = useCameraStore((state) => state.aperture);
  const iso = useCameraStore((state) => state.iso);
  const shutter = useCameraStore((state) => state.shutter);
  const ev = useCameraStore((state) => state.ev);
  const adjustedEV = useCameraStore((state) => state.adjustedEV);
  const deltaEV = useCameraStore((state) => state.deltaEV);
  const recalculateExposure = useCameraStore((state) => state.recalculateExposure);

  const activeScene = useSceneStore((state) => state.activeScene);

  // Automatically recalculate exposure when settings or the scene changes
  useEffect(() => {
    recalculateExposure(activeScene.targetEV);
  }, [aperture, iso, shutter, activeScene.targetEV, recalculateExposure]);

  return { ev, adjustedEV, deltaEV };
}
