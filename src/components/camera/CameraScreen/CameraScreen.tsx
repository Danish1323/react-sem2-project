/* src/components/camera/CameraScreen/CameraScreen.tsx */
import { useEffect, useRef, useState } from "react";
import { useCameraStore } from "../../../stores/cameraStore";
import { useSceneStore } from "../../../stores/sceneStore";
import { useUIStore } from "../../../stores/uiStore";
import { useRenderer } from "../../../hooks/useRenderer";
import { useCapture } from "../../../hooks/useCapture";

import Histogram from "../Histogram/Histogram";
import CameraTelemetryHUD from "../CameraTelemetryHUD/CameraTelemetryHUD";
import LightMeterScaleDisplay from "../LightMeterScaleDisplay/LightMeterScaleDisplay";
import LiveViewFinderCanvas from "../LiveViewFinderCanvas/LiveViewFinderCanvas";

import MenuOverlay from "../../overlays/MenuOverlay/MenuOverlay";
import PlaybackOverlay from "../../overlays/PlaybackOverlay/PlaybackOverlay";
import ChallengeOverlay from "../../overlays/ChallengeOverlay/ChallengeOverlay";
import CameraConsole from "../CameraConsole/CameraConsole";

import styles from "./CameraScreen.module.css";

interface CameraScreenProps {
  captureRef: React.MutableRefObject<{ captureFn: (() => void) | null }>;
}

export default function CameraScreen({ captureRef }: CameraScreenProps) {
  const booting = useUIStore((state) => state.booting);
  const infoMode = useUIStore((state) => state.infoMode);
  const menuOpen = useUIStore((state) => state.menuOpen);
  const playbackOpen = useUIStore((state) => state.playbackOpen);
  const challengeOpen = useUIStore((state) => state.challengeOpen);
  
  const deltaEV = useCameraStore((state) => state.deltaEV);
  const activeScene = useSceneStore((state) => state.activeScene);
  const shutterTriggerCount = useUIStore((state) => state.shutterTriggerCount);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Custom hooks
  const { histogram, renderError, rendererInstance } = useRenderer(canvasRef);
  const { capture } = useCapture(rendererInstance);

  // States
  const [notification, setNotification] = useState<string | null>(null);
  const [showFlash, setShowFlash] = useState<boolean>(false);
  const [gridEnabled, setGridEnabled] = useState<boolean>(true);
  const [consoleCollapsed, setConsoleCollapsed] = useState<boolean>(false);

  // Boot Screen Text Timers
  const [bootLines, setBootLines] = useState<string[]>([]);
  const bootLinesSequence = [
    "MANUAL EXPOSURE SIMULATOR",
    "Initializing Sensor...",
    "Loading Scene Profiles...",
    "Calibrating Light Meter...",
    "Preparing Live View...",
    "READY"
  ];

  useEffect(() => {
    if (!booting) return;
    
    setBootLines([]);
    const timers: any[] = [];
    
    bootLinesSequence.forEach((line, idx) => {
      const t = setTimeout(() => {
        setBootLines((prev) => [...prev, line]);
      }, idx * 400); // progressive typing speed
      timers.push(t);
    });

    return () => timers.forEach(clearTimeout);
  }, [booting]);

  // Hook the capture trigger to the parent component ref
  useEffect(() => {
    captureRef.current.captureFn = () => {
      setShowFlash(true);
      const newCapture = capture();
      
      // Clear flash after 150ms
      setTimeout(() => setShowFlash(false), 150);

      if (newCapture) {
        setNotification("CAPTURE SAVED");
      }
    };
  }, [capture, captureRef]);

  // Hook shutterTriggerCount to trigger captures from Action Strip
  useEffect(() => {
    if (shutterTriggerCount > 0 && captureRef.current.captureFn) {
      captureRef.current.captureFn();
    }
  }, [shutterTriggerCount]);

  // Handle temporary notifications fading out after 2s
  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 2000);
    return () => clearTimeout(t);
  }, [notification]);

  // Display scene-loaded notification on scene change
  useEffect(() => {
    if (booting) return;
    setNotification(`LOADED: ${activeScene.name}`);
  }, [activeScene.id, booting]);

  // Determine HUD visibility flags based on cycle infoMode
  // Mode 0: Image Only
  // Mode 1: Image + Histogram
  // Mode 2: Image + Histogram + Telemetry + Grid
  // Mode 3: Image + Histogram + Telemetry + Grid + LightMeter (Full OSD)
  const showTelemetry = infoMode >= 2;
  const showHistogram = infoMode >= 1;
  const showGrid = gridEnabled && infoMode >= 2;
  const showLightMeter = infoMode >= 3;

  // Exposure Warnings threshold (recalculated sign math)
  // OVEREXPOSED when deltaEV > 1
  // UNDEREXPOSED when deltaEV < -1
  const isOverexposed = deltaEV > 1.0;
  const isUnderexposed = deltaEV < -1.0;

  // We only show live OSD graphics when no fullscreen overlay is active
  const anyOverlayOpen = menuOpen || playbackOpen || challengeOpen;

  return (
    <div className={styles.screenBezel}>
      {/* 2.5s Boot Terminal Loader */}
      {booting && (
        <div className={styles.bootOverlay}>
          <div className={styles.bootTitle}>CAMERA FIRMWARE v1.0.4</div>
          {bootLines.map((line, idx) => (
            <div
              key={idx}
              className={styles.bootLine}
              style={{
                color: idx === 0 ? "#ffffff" : idx === bootLinesSequence.length - 1 ? "#00ff00" : "#00dd00",
                fontWeight: idx === 0 || idx === bootLinesSequence.length - 1 ? "bold" : "normal"
              }}
            >
              {line}
            </div>
          ))}
        </div>
      )}

      {/* Primary LCD Viewport */}
      <div className={styles.screenViewport}>
        {/* Shutter Camera Flash Effect */}
        {showFlash && <div className={styles.shutterFlash} />}

        {/* Core Canvas Viewfinder */}
        <LiveViewFinderCanvas
          canvasRef={canvasRef}
          showGrid={showGrid}
          showFlash={showFlash}
          isOverexposed={isOverexposed}
          isUnderexposed={isUnderexposed}
          booting={booting}
          renderError={renderError}
          anyOverlayOpen={anyOverlayOpen}
        />

        {/* Fullscreen Overlay Pages (rendered inside LCD screen) */}
        {menuOpen && <MenuOverlay />}
        {playbackOpen && <PlaybackOverlay />}
        {challengeOpen && <ChallengeOverlay />}

        {/* Overlay HUD Layer */}
        {!booting && !renderError && !anyOverlayOpen && (
          <div className={styles.hudLayer}>
            {/* Top Left: Exposure Settings HUD */}
            <div className={styles.topLeft}>
              {showTelemetry && <CameraTelemetryHUD />}
            </div>

            {/* Top Right: Live Luminance Histogram */}
            <div className={styles.topRight}>
              {showHistogram && <Histogram data={histogram} />}
            </div>

            {/* Center Zone left empty since warnings are rendered in LiveViewFinderCanvas */}
            <div className={styles.centerZone} />

            {/* Bottom Zone: Live DSLR Exposure Light Meter */}
            <div className={styles.bottomZone} style={{ bottom: consoleCollapsed ? "42px" : "185px" }}>
              {showLightMeter && <LightMeterScaleDisplay />}
            </div>
          </div>
        )}

        {/* Collapsible Touch Controls Console (docked overlay) */}
        {!booting && !anyOverlayOpen && (
          <div className={`${styles.consoleDock} ${consoleCollapsed ? styles.dockCollapsed : ""}`}>
            <div className={styles.dockHeader}>
              <span className={styles.dockTitle}>LCD Settings Console</span>
              <button
                className={styles.dockToggleBtn}
                onClick={() => setConsoleCollapsed((prev) => !prev)}
                title={consoleCollapsed ? "Expand Console Sliders" : "Collapse Console Sliders"}
              >
                {consoleCollapsed ? "▲ Expand" : "▼ Collapse"}
              </button>
            </div>
            {!consoleCollapsed && (
              <div className={styles.dockBody}>
                <CameraConsole />
              </div>
            )}
          </div>
        )}

        {/* Renderer Failure Screen */}
        {renderError && (
          <div className={styles.lcdErrorBox}>
            <span className={styles.lcdErrorText}>{renderError}</span>
            <button className={styles.lcdErrorBtn} onClick={() => window.location.reload()}>
              Reload Camera
            </button>
          </div>
        )}

        {/* HUD Notifications (drawn on top of menus if active) */}
        {notification && (
          <div className={styles.hudNotification}>
            <span className={styles.hudNotificationLabel}>[OSD]</span>
            <span>{notification}</span>
          </div>
        )}

        {/* Composition Grid Toggle Button on Viewport corner */}
        {infoMode >= 2 && !booting && !anyOverlayOpen && (
          <button
            className={styles.hudGridToggle}
            onClick={() => setGridEnabled((prev) => !prev)}
            title="Toggle Rule-of-Thirds Grid"
          >
            GRID: {gridEnabled ? "ON" : "OFF"}
          </button>
        )}
      </div>
    </div>
  );
}
