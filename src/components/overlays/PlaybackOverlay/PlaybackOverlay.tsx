/* src/components/overlays/PlaybackOverlay/PlaybackOverlay.tsx */
import { useUIStore } from "../../../stores/uiStore";
import { useGalleryStore } from "../../../stores/galleryStore";
import { SCENES } from "../../../constants/scenes";
import { formatAperture, formatISO, formatShutter } from "../../../core/exposure/exposureHelpers";
import styles from "./PlaybackOverlay.module.css";

export default function PlaybackOverlay() {
  const togglePlayback = useUIStore((state) => state.togglePlayback);
  const { captures, selectedCapture, setSelectedCapture, removeCapture } = useGalleryStore();

  const handleClose = () => {
    togglePlayback();
  };

  const handleDelete = () => {
    if (!selectedCapture) return;

    const confirmDelete = window.confirm("Are you sure you want to delete this capture?");
    if (confirmDelete) {
      removeCapture(selectedCapture.id);
    }
  };

  // Find index of selected capture
  const currentIndex = selectedCapture
    ? captures.findIndex((c) => c.id === selectedCapture.id)
    : -1;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedCapture(captures[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < captures.length - 1) {
      setSelectedCapture(captures[currentIndex + 1]);
    }
  };

  // Get original scene image matching capture sceneId
  const getOriginalImage = (): string => {
    if (!selectedCapture) return "";
    const matchedScene = SCENES.find((s) => s.id === selectedCapture.sceneId);
    return matchedScene ? matchedScene.image : selectedCapture.imageData;
  };

  const formatDelta = (value: number): string => {
    if (Math.abs(value) <= 0.05) return "0.0 (Correct)";
    return value > 0 ? `+${value.toFixed(2)} (Underexposed)` : `${value.toFixed(2)} (Overexposed)`;
  };

  if (captures.length === 0 || !selectedCapture) {
    return (
      <div className={styles.playbackContainer}>
        <div className={styles.headerRow}>
          <span className={styles.galleryTitle}>Playback Mode</span>
          <button className={styles.closeButton} onClick={handleClose}>
            EXIT
          </button>
        </div>
        <div className={styles.emptyState}>
          <span className={styles.emptyStateText}>No Captures Found</span>
          <span className={styles.emptyStateSubtext}>Press the Shutter button (C) to capture a photograph!</span>
        </div>
      </div>
    );
  }

  const dateStr = new Date(selectedCapture.timestamp).toLocaleString();

  return (
    <div className={styles.playbackContainer}>
      {/* Header */}
      <div className={styles.headerRow}>
        <span className={styles.galleryTitle}>Playback Mode</span>
        <button className={styles.closeButton} onClick={handleClose}>
          EXIT
        </button>
      </div>

      {/* Side-by-Side Images */}
      <div className={styles.comparisonView}>
        {/* Left Side: Original Scene */}
        <div className={styles.imageFrame}>
          <span className={styles.imageLabel}>Original Scene</span>
          <img
            src={getOriginalImage()}
            alt="Original Scene"
            className={styles.compareImg}
          />
        </div>

        {/* Right Side: Captured Processed Canvas Output */}
        <div className={styles.imageFrame}>
          <span className={styles.imageLabel}>Captured Snapshot</span>
          <img
            src={selectedCapture.imageData}
            alt="Captured Canvas"
            className={styles.compareImg}
          />
        </div>
      </div>

      {/* Bottom section */}
      <div className={styles.footerArea}>
        {/* Metadata Table */}
        <div className={styles.metadataGrid}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Scene Name</span>
            <span className={styles.metaValue}>{selectedCapture.sceneName}</span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Aperture</span>
            <span className={styles.metaValue}>{formatAperture(selectedCapture.aperture)}</span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Shutter Speed</span>
            <span className={styles.metaValue}>{formatShutter(selectedCapture.shutter)}</span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>ISO</span>
            <span className={styles.metaValue}>{formatISO(selectedCapture.iso)}</span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Base EV</span>
            <span className={styles.metaValue}>{selectedCapture.ev.toFixed(1)}</span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Adjusted EV</span>
            <span className={styles.metaValue}>{selectedCapture.adjustedEV.toFixed(1)}</span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Exp. Diff</span>
            <span className={styles.metaValue} style={{ color: "var(--text-orange)" }}>
              {formatDelta(selectedCapture.deltaEV)}
            </span>
          </div>

          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Timestamp</span>
            <span className={styles.metaValue} style={{ fontSize: "8.5pt" }}>{dateStr}</span>
          </div>
        </div>

        {/* Gallery Controls */}
        <div className={styles.controlsRow}>
          <div className={styles.navGroup}>
            <button
              className={styles.navBtn}
              onClick={handlePrev}
              disabled={currentIndex <= 0}
            >
              PREVIOUS
            </button>
            <button
              className={styles.navBtn}
              onClick={handleNext}
              disabled={currentIndex >= captures.length - 1}
            >
              NEXT
            </button>
          </div>

          <span className={styles.counter}>
            IMAGE {currentIndex + 1} / {captures.length}
          </span>

          <button className={`${styles.navBtn} ${styles.deleteBtn}`} onClick={handleDelete}>
            DELETE CAPTURE
          </button>
        </div>
      </div>
    </div>
  );
}
