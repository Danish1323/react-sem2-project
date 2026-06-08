/* src/components/camera/TelemetryPanel/TelemetryPanel.tsx */
import { useCameraStore } from "../../../stores/cameraStore";
import { useSceneStore } from "../../../stores/sceneStore";
import { formatAperture, formatISO, formatShutter } from "../../../core/exposure/exposureHelpers";
import styles from "./TelemetryPanel.module.css";

export default function TelemetryPanel() {
  const aperture = useCameraStore((state) => state.aperture);
  const iso = useCameraStore((state) => state.iso);
  const shutter = useCameraStore((state) => state.shutter);
  const ev = useCameraStore((state) => state.ev);
  const adjustedEV = useCameraStore((state) => state.adjustedEV);
  const deltaEV = useCameraStore((state) => state.deltaEV);
  const activeScene = useSceneStore((state) => state.activeScene);

  // Format delta value to look like a real exposure compensation display (e.g. +0.3, -1.0, 0.0)
  const formatDelta = (value: number): string => {
    if (Math.abs(value) <= 0.05) return "0.0";
    return value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
  };

  return (
    <div className={styles.telemetryBox}>
      <span className={styles.title}>Camera HUD</span>
      
      <div className={styles.row}>
        <span className={styles.label}>Aperture</span>
        <span className={styles.value}>{formatAperture(aperture)}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Shutter</span>
        <span className={styles.value}>{formatShutter(shutter)}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>ISO</span>
        <span className={styles.value}>{formatISO(iso)}</span>
      </div>

      <div className={styles.row} style={{ marginTop: "6px", borderTop: "1px dashed rgba(255,255,255,0.1)" }}>
        <span className={styles.label}>Current EV</span>
        <span className={styles.value}>{ev.toFixed(1)}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Adjusted EV</span>
        <span className={styles.value}>{adjustedEV.toFixed(1)}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Target EV</span>
        <span className={styles.value}>{activeScene.targetEV.toFixed(1)}</span>
      </div>

      <div className={styles.row} style={{ marginTop: "4px" }}>
        <span className={styles.label}>Exp. Diff</span>
        <span className={`${styles.value} ${Math.abs(deltaEV) > 0.1 ? styles.highlightValue : ""}`}>
          {formatDelta(deltaEV)}
        </span>
      </div>
    </div>
  );
}
