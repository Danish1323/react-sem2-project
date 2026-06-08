/* src/components/camera/CameraStage/CameraStage.tsx */
import React from "react";
import CameraScreen from "../CameraScreen/CameraScreen";
import StatusStrip from "../StatusStrip/StatusStrip";
import styles from "./CameraStage.module.css";

interface CameraStageProps {
  captureRef: React.MutableRefObject<{ captureFn: (() => void) | null }>;
}

export default function CameraStage({ captureRef }: CameraStageProps) {
  return (
    <div className={styles.stageContainer}>
      {/* Visual Rendering Section */}
      <div className={styles.renderingSection}>
        <CameraScreen captureRef={captureRef} />
      </div>

      {/* Status Bar */}
      <div className={styles.statusSection}>
        <StatusStrip />
      </div>
    </div>
  );
}
