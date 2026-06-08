/* src/components/camera/ControlWheel/ControlWheel.tsx */
import React, { useRef } from "react";
import { useCameraStore } from "../../../stores/cameraStore";
import { formatAperture, formatISO, formatShutter } from "../../../core/exposure/exposureHelpers";
import styles from "./ControlWheel.module.css";

interface ControlWheelProps {
  onWheelStep: (direction: "up" | "down") => void;
}

export default function ControlWheel({ onWheelStep }: ControlWheelProps) {
  const {
    aperture,
    iso,
    shutter,
    selectedControl,
    apertureAngle,
    isoAngle,
    shutterAngle,
    setSelectedControl
  } = useCameraStore();

  const wheelRef = useRef<HTMLDivElement>(null);
  const dragStartAngleRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  // Determine current active display angle based on control selection
  const getActiveAngle = (): number => {
    switch (selectedControl) {
      case "aperture":
        return apertureAngle;
      case "iso":
        return isoAngle;
      case "shutter":
        return shutterAngle;
      default:
        return 0;
    }
  };

  // Center button press cycles selected control (Aperture -> Shutter -> ISO)
  const handleCenterButtonClick = () => {
    if (selectedControl === "aperture") {
      setSelectedControl("shutter");
    } else if (selectedControl === "shutter") {
      setSelectedControl("iso");
    } else {
      setSelectedControl("aperture");
    }
  };

  // Handle scroll events on the wheel
  const handleScrollWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 0) {
      onWheelStep("up");
    } else if (e.deltaY < 0) {
      onWheelStep("down");
    }
  };

  // Mouse Drag Angle Tracking
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!wheelRef.current) return;
    isDraggingRef.current = true;

    const rect = wheelRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Calculate start angle of click relative to center
    dragStartAngleRef.current = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;

      const currentAngle = Math.atan2(moveEvent.clientY - cy, moveEvent.clientX - cx) * (180 / Math.PI);
      let diff = currentAngle - dragStartAngleRef.current;

      // Handle wrapping at 180/-180 degrees boundary
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      // Threshold: 15 degrees per parameter tick adjustment
      const stepAngle = 15;
      if (diff >= stepAngle) {
        onWheelStep("up");
        dragStartAngleRef.current = currentAngle;
      } else if (diff <= -stepAngle) {
        onWheelStep("down");
        dragStartAngleRef.current = currentAngle;
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className={styles.controlContainer}>
      {/* Parameter Selection Grid */}
      <div className={styles.selectorContainer}>
        <span className={styles.selectorTitle}>Controls</span>
        
        {/* Aperture Tab */}
        <button
          className={`${styles.tab} ${selectedControl === "aperture" ? styles.activeTab : ""}`}
          onClick={() => setSelectedControl("aperture")}
        >
          <span className={styles.tabLabel}>Aperture</span>
          <span className={styles.tabValue}>{formatAperture(aperture)}</span>
        </button>

        {/* Shutter Tab */}
        <button
          className={`${styles.tab} ${selectedControl === "shutter" ? styles.activeTab : ""}`}
          onClick={() => setSelectedControl("shutter")}
        >
          <span className={styles.tabLabel}>Shutter</span>
          <span className={styles.tabValue}>{formatShutter(shutter)}</span>
        </button>

        {/* ISO Tab */}
        <button
          className={`${styles.tab} ${selectedControl === "iso" ? styles.activeTab : ""}`}
          onClick={() => setSelectedControl("iso")}
        >
          <span className={styles.tabLabel}>ISO</span>
          <span className={styles.tabValue}>{formatISO(iso)}</span>
        </button>
      </div>

      {/* Control Dial Wheel */}
      <div className={styles.wrapper}>
        <div
          ref={wheelRef}
          className={styles.wheelOuter}
          onWheel={handleScrollWheel}
          onMouseDown={handleMouseDown}
        >
          {/* Cylinder rotates visually */}
          <div
            className={styles.dialCylinder}
            style={{ transform: `rotate(${getActiveAngle()}deg)` }}
          />

          {/* Static Bezel Highlights */}
          <div className={styles.dialFace}>
            <div className={styles.indicatorTicks}>
              <div className={styles.tick} />
              <div className={styles.tick} />
              <div className={styles.tick} />
              <div className={styles.tick} />
            </div>
            
            {/* Center button */}
            <button
              className={styles.wheelCenterButton}
              onClick={handleCenterButtonClick}
              onMouseDown={(e) => e.stopPropagation()} // Prevent button drag triggering wheel drag
              title="Switch control parameter"
            >
              SET
            </button>
          </div>
        </div>
        <div className={styles.scrollHint}>Drag dial or Scroll mouse wheel</div>
      </div>
    </div>
  );
}
