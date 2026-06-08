/* src/components/camera/LiveViewFinderCanvas/LiveViewFinderCanvas.tsx */
import React from "react";
import styles from "./LiveViewFinderCanvas.module.css";

interface LiveViewFinderCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  showGrid: boolean;
  showFlash: boolean;
  isOverexposed: boolean;
  isUnderexposed: boolean;
  booting: boolean;
  renderError: string | null;
  anyOverlayOpen: boolean;
}

export default function LiveViewFinderCanvas({
  canvasRef,
  showGrid,
  showFlash,
  isOverexposed,
  isUnderexposed,
  booting,
  renderError,
  anyOverlayOpen
}: LiveViewFinderCanvasProps) {
  return (
    <div className={styles.viewportContainer}>
      {/* Shutter Camera Flash Effect */}
      {showFlash && <div className={styles.shutterFlash} />}

      {/* Core Canvas Viewfinder */}
      <canvas
        ref={canvasRef}
        width={1280}
        height={720}
        className={styles.renderCanvas}
      />

      {/* Rule of Thirds Grid Lines */}
      {showGrid && !booting && !renderError && !anyOverlayOpen && (
        <div className={styles.gridOverlay}>
          <div className={styles.gridCell} />
          <div className={styles.gridCell} />
          <div className={styles.gridCell} />
          <div className={styles.gridCell} />
          <div className={styles.gridCell} />
          <div className={styles.gridCell} />
          <div className={styles.gridCell} />
          <div className={styles.gridCell} />
          <div className={styles.gridCell} />
        </div>
      )}

      {/* Center: Over/Under Exposure Warnings */}
      {!booting && !renderError && !anyOverlayOpen && (
        <div className={styles.warningOverlay}>
          {isOverexposed && <div className={styles.exposureWarning}>OVEREXPOSED</div>}
          {isUnderexposed && <div className={styles.exposureWarning}>UNDEREXPOSED</div>}
        </div>
      )}
    </div>
  );
}
