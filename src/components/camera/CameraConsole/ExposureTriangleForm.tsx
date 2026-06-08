/* src/components/camera/CameraConsole/ExposureTriangleForm.tsx */
import { useCameraStore } from "../../../stores/cameraStore";
import { APERTURES } from "../../../constants/aperture";
import { ISO_VALUES } from "../../../constants/iso";
import { SHUTTER_SPEEDS } from "../../../constants/shutter";
import { formatAperture, formatISO, formatShutter } from "../../../core/exposure/exposureHelpers";
import styles from "./ExposureTriangleForm.module.css";

export default function ExposureTriangleForm() {
  const {
    aperture,
    iso,
    shutter,
    selectedControl,
    setAperture,
    setISO,
    setShutter,
    setSelectedControl
  } = useCameraStore();

  // Find index positions of current settings in discrete arrays
  const apertureIdx = APERTURES.indexOf(aperture);
  const shutterIdx = SHUTTER_SPEEDS.indexOf(shutter);
  const isoIdx = ISO_VALUES.indexOf(iso);

  return (
    <div className={styles.formContainer}>
      <div className={styles.slidersRow}>
        {/* Aperture Slider Rail */}
        <div
          className={`${styles.railWrapper} ${selectedControl === "aperture" ? styles.activeRail : ""}`}
          onClick={() => setSelectedControl("aperture")}
        >
          <div className={styles.railHeader}>
            <label className={styles.label}>Aperture (DoF):</label>
            <span className={styles.value}>{formatAperture(aperture)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={APERTURES.length - 1}
            value={apertureIdx !== -1 ? apertureIdx : 0}
            onChange={(e) => setAperture(APERTURES[parseInt(e.target.value)])}
            className={styles.slider}
          />
          <div className={styles.railBoundaries}>
            <span>f/1.4 (Blur)</span>
            <span>f/22 (Sharp)</span>
          </div>
        </div>

        {/* Shutter Speed Slider Rail */}
        <div
          className={`${styles.railWrapper} ${selectedControl === "shutter" ? styles.activeRail : ""}`}
          onClick={() => setSelectedControl("shutter")}
        >
          <div className={styles.railHeader}>
            <label className={styles.label}>Shutter Speed:</label>
            <span className={styles.value}>{formatShutter(shutter)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={SHUTTER_SPEEDS.length - 1}
            value={shutterIdx !== -1 ? shutterIdx : 0}
            onChange={(e) => setShutter(SHUTTER_SPEEDS[parseInt(e.target.value)])}
            className={styles.slider}
          />
          <div className={styles.railBoundaries}>
            <span>1/4000s (Stop)</span>
            <span>30s (Blur)</span>
          </div>
        </div>

        {/* ISO Sensitivity Slider Rail */}
        <div
          className={`${styles.railWrapper} ${selectedControl === "iso" ? styles.activeRail : ""}`}
          onClick={() => setSelectedControl("iso")}
        >
          <div className={styles.railHeader}>
            <label className={styles.label}>ISO (Noise):</label>
            <span className={styles.value}>{formatISO(iso)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={ISO_VALUES.length - 1}
            value={isoIdx !== -1 ? isoIdx : 0}
            onChange={(e) => setISO(ISO_VALUES[parseInt(e.target.value)])}
            className={styles.slider}
          />
          <div className={styles.railBoundaries}>
            <span>100 (Clean)</span>
            <span>12800 (Grain)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
