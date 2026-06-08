/* src/components/camera/CameraTelemetryHUD/CameraTelemetryHUD.tsx */
import { useCameraStore } from "../../../stores/cameraStore";
import { useSceneStore } from "../../../stores/sceneStore";
import { formatAperture, formatISO, formatShutter } from "../../../core/exposure/exposureHelpers";
import { getNoiseStrength } from "../../../core/renderer/NoiseProcessor";
import styles from "./CameraTelemetryHUD.module.css";

export default function CameraTelemetryHUD() {
  const aperture = useCameraStore((state) => state.aperture);
  const iso = useCameraStore((state) => state.iso);
  const shutter = useCameraStore((state) => state.shutter);
  const ev = useCameraStore((state) => state.ev);
  const adjustedEV = useCameraStore((state) => state.adjustedEV);
  const deltaEV = useCameraStore((state) => state.deltaEV);
  const latencyMs = useCameraStore((state) => state.latencyMs);
  
  const activeScene = useSceneStore((state) => state.activeScene);

  // Depth of field metric: Narrow if aperture <= f/4, Wide if aperture >= f/5.6
  const getDoFMetric = (ap: number): string => {
    return ap <= 4.0 ? "Narrow (Shallow)" : "Wide (Deep)";
  };

  // Noise coefficient (from NoiseProcessor mapping)
  const noiseCoeff = getNoiseStrength(iso);

  // Format delta value to look like a real exposure compensation display (e.g. +0.3, -1.0, 0.0)
  const formatDelta = (value: number): string => {
    if (Math.abs(value) <= 0.05) return "0.0";
    return value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1);
  };

  // Export current settings profile as JSON
  const handleExportProfile = () => {
    const profile = {
      profileName: `${activeScene.name} Setup Blueprint`,
      sceneId: activeScene.id,
      timestamp: Date.now(),
      parameters: {
        aperture: formatAperture(aperture),
        shutter: formatShutter(shutter),
        iso: formatISO(iso)
      },
      exposureDiagnostics: {
        calculatedEV: parseFloat(ev.toFixed(2)),
        adjustedEV: parseFloat(adjustedEV.toFixed(2)),
        targetEV: activeScene.targetEV,
        deltaEV: parseFloat(deltaEV.toFixed(2))
      },
      opticalMetrics: {
        depthOfFieldMetric: getDoFMetric(aperture),
        sensorNoiseCoefficient: parseFloat(noiseCoeff.toFixed(2)),
        imageProcessingLatencyMs: parseFloat(latencyMs.toFixed(2))
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `exposure_blueprint_${activeScene.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className={styles.telemetryBox}>
      <span className={styles.title}>Camera Telemetry HUD</span>
      
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

      <div className={styles.row} style={{ marginTop: "6px", borderTop: "1px dashed rgba(255,255,255,0.15)" }}>
        <span className={styles.label}>Calculated EV</span>
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

      <div className={styles.row}>
        <span className={styles.label}>Exp. Diff (EV)</span>
        <span className={`${styles.value} ${Math.abs(deltaEV) > 0.1 ? styles.highlightValue : ""}`}>
          {formatDelta(deltaEV)}
        </span>
      </div>

      <div className={styles.row} style={{ marginTop: "6px", borderTop: "1px dashed rgba(255,255,255,0.15)" }}>
        <span className={styles.label}>DoF Metric</span>
        <span className={styles.value} style={{ color: aperture <= 4.0 ? "#ff9800" : "#a8ffb2" }}>
          {getDoFMetric(aperture)}
        </span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Noise Coeff.</span>
        <span className={styles.value}>{noiseCoeff.toFixed(2)}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Render Latency</span>
        <span className={styles.value}>{latencyMs.toFixed(1)} ms</span>
      </div>

      <button className={styles.exportBtn} onClick={handleExportProfile}>
        Export Profile JSON
      </button>
    </div>
  );
}
