/* src/components/camera/StatusStrip/StatusStrip.tsx */
import { useEffect, useState } from "react";
import { useCameraStore } from "../../../stores/cameraStore";
import { useSceneStore } from "../../../stores/sceneStore";
import { getExposureStatus } from "../../../core/exposure/exposureHelpers";
import styles from "./StatusStrip.module.css";

export default function StatusStrip() {
  const deltaEV = useCameraStore((state) => state.deltaEV);
  const captureCount = useCameraStore((state) => state.captureCount);
  const activeScene = useSceneStore((state) => state.activeScene);

  const [timeStr, setTimeStr] = useState<string>("");

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (num: number) => String(num).padStart(2, "0");
      setTimeStr(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const expStatus = getExposureStatus(deltaEV);
  const isCorrect = expStatus === "Correct Exposure";

  return (
    <div className={styles.statusStrip}>
      {/* Left Segment: Active Scene & Exposure Status */}
      <div className={styles.leftSegment}>
        <div className={styles.item}>
          SCENE: <span className={styles.sceneName}>{activeScene.name}</span>
        </div>
        <span className={styles.divider}>|</span>
        <div className={`${styles.item} ${styles.exposureStatus} ${isCorrect ? styles.correctExposure : styles.imperfectExposure}`}>
          <span className={styles.indicatorDot} />
          <span>{expStatus}</span>
        </div>
      </div>

      {/* Right Segment: Capture Count & Ticking Clock */}
      <div className={styles.rightSegment}>
        <div className={styles.item}>
          CAPTURES: <span style={{ color: "#ffffff" }}>{captureCount}</span>
        </div>
        <span className={styles.divider}>|</span>
        <div className={styles.clock}>{timeStr}</div>
      </div>
    </div>
  );
}
