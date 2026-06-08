/* src/components/camera/CameraConsole/EnvironmentActionStrip.tsx */
import { useCameraStore } from "../../../stores/cameraStore";
import { useSceneStore } from "../../../stores/sceneStore";
import { useUIStore } from "../../../stores/uiStore";
import { SCENES } from "../../../constants/scenes";
import { localStorageManager } from "../../../core/storage/localStorageManager";
import styles from "./EnvironmentActionStrip.module.css";

export default function EnvironmentActionStrip() {
  const activeScene = useSceneStore((state) => state.activeScene);
  const setScene = useSceneStore((state) => state.setScene);
  const triggerShutter = useUIStore((state) => state.triggerShutter);
  const resetBaselineExposure = useCameraStore((state) => state.resetBaselineExposure);

  // Map ambient profiles to SCENE IDs
  const profiles = [
    { label: "Sunny Day", sceneId: "landscape" },
    { label: "Golden Hour", sceneId: "golden-hour" },
    { label: "Indoor Studio", sceneId: "cafe" },
    { label: "Night Exterior", sceneId: "night-city" }
  ];

  const handleProfileClick = (sceneId: string) => {
    const scene = SCENES.find((s) => s.id === sceneId);
    if (scene) {
      setScene(scene);
    }
  };

  const handleFlushCache = () => {
    if (window.confirm("Are you sure you want to flush all saved snapshots and camera configurations?")) {
      localStorageManager.clearAll();
      window.location.reload();
    }
  };

  return (
    <div className={styles.stripContainer}>
      {/* Ambient profiles section */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Ambient Profile:</span>
        <div className={styles.buttonGroup}>
          {profiles.map((prof) => {
            const isSelected = activeScene.id === prof.sceneId;
            return (
              <button
                key={prof.sceneId}
                className={`${styles.actionBtn} ${isSelected ? styles.activeProfile : ""}`}
                onClick={() => handleProfileClick(prof.sceneId)}
              >
                {prof.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick actions section */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Workbench Actions:</span>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.actionBtn} ${styles.captureBtn}`}
            onClick={triggerShutter}
            title="Trigger Shutter Capture"
          >
            Trigger Capture
          </button>
          
          <button
            className={styles.actionBtn}
            onClick={resetBaselineExposure}
            title="Reset Baseline Exposure"
          >
            Reset Exposure
          </button>

          <button
            className={`${styles.actionBtn} ${styles.dangerBtn}`}
            onClick={handleFlushCache}
            title="Flush Workbench Storage Cache"
          >
            Flush Cache
          </button>
        </div>
      </div>
    </div>
  );
}
