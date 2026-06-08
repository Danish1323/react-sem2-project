/* src/components/camera/LightMeter/LightMeter.tsx */
import { useCameraStore } from "../../../stores/cameraStore";
import styles from "./LightMeter.module.css";

export default function LightMeter() {
  const deltaEV = useCameraStore((state) => state.deltaEV);

  // Map deltaEV (-3 to +3) to horizontal percentage (0% to 100%)
  // deltaEV < 0 (overexposed) goes to the right (+)
  // deltaEV > 0 (underexposed) goes to the left (-)
  const getNeedlePosition = (): string => {
    // Clamp deltaEV between -3 and +3
    const clampedDelta = Math.max(-3, Math.min(3, deltaEV));
    
    // Calculate percentage: 0% represents underexposed -3 EV, 100% represents overexposed +3 EV
    const percentage = 50 + (clampedDelta / 3) * 50;
    
    return `${percentage}%`;
  };

  return (
    <div className={styles.bind}>
      <div className={styles.meterContainer}>
        {/* Scale labels */}
        <div className={styles.scaleWrapper}>
          <span className={styles.scaleItem}>-3</span>
          <span className={styles.scaleItem}>-2</span>
          <span className={styles.scaleItem}>-1</span>
          <span className={`${styles.scaleItem} ${styles.centerMark}`}>0</span>
          <span className={styles.scaleItem}>+1</span>
          <span className={styles.scaleItem}>+2</span>
          <span className={styles.scaleItem}>+3</span>
        </div>

        {/* Physical Ticks */}
        <div className={styles.ticksWrapper}>
          <div className={styles.tickMajor} />
          <div className={styles.tick} />
          <div className={styles.tick} />
          <div className={styles.tickMajor} />
          <div className={styles.tick} />
          <div className={styles.tick} />
          <div className={styles.tickMajor} />
          <div className={styles.tick} />
          <div className={styles.tick} />
          <div className={styles.tickCenter} />
          <div className={styles.tick} />
          <div className={styles.tick} />
          <div className={styles.tickMajor} />
          <div className={styles.tick} />
          <div className={styles.tick} />
          <div className={styles.tickMajor} />
          <div className={styles.tick} />
          <div className={styles.tick} />
          <div className={styles.tickMajor} />
        </div>

        {/* Sliding Pointer Needle */}
        <div className={styles.track}>
          <div
            className={styles.needle}
            style={{ left: getNeedlePosition() }}
          />
        </div>
      </div>
    </div>
  );
}
