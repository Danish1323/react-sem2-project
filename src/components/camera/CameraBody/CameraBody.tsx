/* src/components/camera/CameraBody/CameraBody.tsx */
import { useEffect, useRef } from "react";
import { useCameraStore } from "../../../stores/cameraStore";
import { useUIStore } from "../../../stores/uiStore";
import { useGalleryStore } from "../../../stores/galleryStore";
import { APERTURES } from "../../../constants/aperture";
import { ISO_VALUES } from "../../../constants/iso";
import { SHUTTER_SPEEDS } from "../../../constants/shutter";

import EVF from "../EVF/EVF";
import CameraButtons from "../CameraButtons/CameraButtons";
import CameraStage from "../CameraStage/CameraStage";
import ControlWheel from "../ControlWheel/ControlWheel";
import { useExposure } from "../../../hooks/useExposure";

import styles from "./CameraBody.module.css";

// Declare ref for capturing functions to avoid stale closures in listeners
interface CaptureRef {
  captureFn: (() => void) | null;
}

export default function CameraBody() {
  // Initialize the exposure calculator loop
  useExposure();

  const {
    aperture,
    iso,
    shutter,
    selectedControl,
    setAperture,
    setISO,
    setShutter,
    loadSavedSettings
  } = useCameraStore();

  const {
    booting,
    toggleMenu,
    cycleInfoMode,
    togglePlayback,
    closeAllOverlays,
    setBooting
  } = useUIStore();

  const loadCaptures = useGalleryStore((state) => state.loadCaptures);

  // Storing a capture trigger callback ref that the screen component will expose
  const captureRef = useRef<CaptureRef>({ captureFn: null });

  // Initialize camera settings and captures
  useEffect(() => {
    loadSavedSettings();
    loadCaptures();
    
    // Simulate boot screen delay of 2.5s
    const timer = setTimeout(() => {
      setBooting(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, [loadSavedSettings, loadCaptures, setBooting]);

  // Handle arrow key adjustments
  const adjustParameter = (direction: "up" | "down") => {
    if (selectedControl === "aperture") {
      const idx = APERTURES.indexOf(aperture as any);
      if (idx !== -1) {
        const nextIdx = direction === "up" 
          ? Math.min(APERTURES.length - 1, idx + 1)
          : Math.max(0, idx - 1);
        setAperture(APERTURES[nextIdx]);
      }
    } else if (selectedControl === "iso") {
      const idx = ISO_VALUES.indexOf(iso as any);
      if (idx !== -1) {
        const nextIdx = direction === "up"
          ? Math.min(ISO_VALUES.length - 1, idx + 1)
          : Math.max(0, idx - 1);
        setISO(ISO_VALUES[nextIdx]);
      }
    } else if (selectedControl === "shutter") {
      const idx = SHUTTER_SPEEDS.indexOf(shutter as any);
      if (idx !== -1) {
        const nextIdx = direction === "up"
          ? Math.min(SHUTTER_SPEEDS.length - 1, idx + 1)
          : Math.max(0, idx - 1);
        setShutter(SHUTTER_SPEEDS[nextIdx]);
      }
    }
  };

  // Keyboard accessibility listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (booting) return;

      const key = e.key.toLowerCase();
      
      // Stop keyboard propagation if the user is typing in a profile name input box
      if (document.activeElement?.tagName === "INPUT") {
        return;
      }

      switch (key) {
        case "m":
          toggleMenu();
          break;
        case "i":
          cycleInfoMode();
          break;
        case "p":
          togglePlayback();
          break;
        case "c":
          // Trigger capture callback
          if (captureRef.current.captureFn) {
            captureRef.current.captureFn();
          }
          break;
        case "arrowleft":
          e.preventDefault();
          adjustParameter("down");
          break;
        case "arrowright":
          e.preventDefault();
          adjustParameter("up");
          break;
        case "escape":
          closeAllOverlays();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [booting, selectedControl, aperture, iso, shutter, toggleMenu, cycleInfoMode, togglePlayback, closeAllOverlays]);

  const triggerShutterPress = () => {
    if (captureRef.current.captureFn) {
      captureRef.current.captureFn();
    }
  };

  return (
    <div className={styles.bodyContainer}>
      {/* Mechanical Top Plate Dials */}
      <div className={styles.topPlate}>
        <div className={styles.modeDial} />
        <div className={styles.hotShoe} />
        <div className={styles.exposureDial} />
        <button
          className={styles.silverShutter}
          onClick={triggerShutterPress}
          title="Physical Shutter Button (Silver)"
        />
      </div>

      {/* Decorative metal corner screws */}
      <div className={`${styles.screw} ${styles.screwTL}`} />
      <div className={`${styles.screw} ${styles.screwTR}`} />
      <div className={`${styles.screw} ${styles.screwBL}`} />
      <div className={`${styles.screw} ${styles.screwBR}`} />

      {/* Left Column: Mechanical Buttons */}
      <div className={styles.leftColumn}>
        <CameraButtons onCapturePress={triggerShutterPress} />
      </div>

      {/* Center Column: Viewfinder, screen, status info */}
      <div className={styles.centerColumn}>
        <EVF />
        <CameraStage captureRef={captureRef} />
      </div>

      {/* Right Column: Mode selector, control wheel */}
      <div className={styles.rightColumn}>
        <ControlWheel onWheelStep={(dir) => adjustParameter(dir)} />
      </div>
    </div>
  );
}
