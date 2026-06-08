/* src/components/camera/CameraButtons/CameraButtons.tsx */
import { Menu, Info, Play, Trash, Camera } from "lucide-react";
import { useUIStore } from "../../../stores/uiStore";
import { useGalleryStore } from "../../../stores/galleryStore";
import styles from "./CameraButtons.module.css";

interface CameraButtonsProps {
  onCapturePress: () => void;
}

export default function CameraButtons({ onCapturePress }: CameraButtonsProps) {
  const { menuOpen, playbackOpen, toggleMenu, cycleInfoMode, togglePlayback } = useUIStore();
  const { selectedCapture, removeCapture } = useGalleryStore();

  const handleDelete = () => {
    if (!selectedCapture) {
      alert("No image selected to delete. Go to Playback mode (P) first.");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this capture?");
    if (confirmDelete) {
      removeCapture(selectedCapture.id);
    }
  };

  return (
    <div className={styles.buttonStack}>
      {/* MENU BUTTON */}
      <div className={styles.buttonWrapper}>
        <button
          className={`${styles.physicalButton} ${menuOpen ? styles.activeButton : ""}`}
          onClick={toggleMenu}
          title="Toggle Menu (M)"
        >
          <Menu size={20} color={menuOpen ? "var(--text-orange)" : "#ffffff"} />
        </button>
        <span className={styles.label}>Menu</span>
      </div>

      {/* INFO BUTTON */}
      <div className={styles.buttonWrapper}>
        <button
          className={styles.physicalButton}
          onClick={cycleInfoMode}
          title="Cycle Info Mode (I)"
        >
          <Info size={20} />
        </button>
        <span className={styles.label}>Info</span>
      </div>

      {/* PLAY BUTTON */}
      <div className={styles.buttonWrapper}>
        <button
          className={`${styles.physicalButton} ${playbackOpen ? styles.activeButton : ""}`}
          onClick={togglePlayback}
          title="Toggle Playback (P)"
        >
          <Play size={20} color={playbackOpen ? "var(--text-orange)" : "#ffffff"} />
        </button>
        <span className={styles.label}>Play</span>
      </div>

      {/* DELETE BUTTON */}
      <div className={styles.buttonWrapper}>
        <button
          className={styles.physicalButton}
          onClick={handleDelete}
          title="Delete Selected Capture (Del)"
        >
          <Trash size={20} />
        </button>
        <span className={styles.label}>Trash</span>
      </div>

      {/* CAPTURE BUTTON */}
      <div className={styles.buttonWrapper}>
        <button
          className={`${styles.physicalButton} ${styles.captureButton}`}
          onClick={onCapturePress}
          title="Capture Image (C)"
        >
          <Camera size={22} color="var(--camera-accent-red)" />
        </button>
        <span className={styles.label} style={{ color: "var(--camera-accent-red)" }}>Shutter</span>
      </div>
    </div>
  );
}
