/* src/components/overlays/MenuOverlay/MenuOverlay.tsx */
import React, { useEffect, useState } from "react";
import { useUIStore } from "../../../stores/uiStore";
import { useSceneStore } from "../../../stores/sceneStore";
import { useCameraStore } from "../../../stores/cameraStore";
import { SCENES } from "../../../constants/scenes";
import { localStorageManager } from "../../../core/storage/localStorageManager";
import { formatAperture, formatISO, formatShutter } from "../../../core/exposure/exposureHelpers";
import type { CameraProfile } from "../../../types/camera";
import styles from "./MenuOverlay.module.css";

export default function MenuOverlay() {
  const toggleMenu = useUIStore((state) => state.toggleMenu);
  const activeScene = useSceneStore((state) => state.activeScene);
  const setScene = useSceneStore((state) => state.setScene);
  const uploadScene = useSceneStore((state) => state.uploadScene);

  const { aperture, iso, shutter, setAperture, setISO, setShutter } = useCameraStore();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<"scenes" | "profiles" | "upload" | "settings" | "about">("scenes");

  // Profile management states
  const [profiles, setProfiles] = useState<CameraProfile[]>([]);
  const [profileName, setProfileName] = useState<string>("");

  // Load profiles on mount
  useEffect(() => {
    setProfiles(localStorageManager.loadProfiles());
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) return;

    const newProfile: CameraProfile = {
      id: `profile-${Date.now()}`,
      name: profileName.trim(),
      aperture,
      iso,
      shutter
    };

    const updatedProfiles = [...profiles, newProfile];
    setProfiles(updatedProfiles);
    localStorageManager.saveProfiles(updatedProfiles);
    setProfileName("");
  };

  const handleLoadProfile = (prof: CameraProfile) => {
    setAperture(prof.aperture);
    setISO(prof.iso);
    setShutter(prof.shutter);
    toggleMenu(); // Close menu
  };

  const handleDeleteProfile = (id: string) => {
    const updated = profiles.filter((p) => p.id !== id);
    setProfiles(updated);
    localStorageManager.saveProfiles(updated);
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        uploadScene(result);
        toggleMenu(); // Close menu
      }
    };
    reader.readAsDataURL(file);
  };

  // Clear all data
  const handleClearAll = () => {
    const confirmClear = window.confirm("Are you sure you want to delete all captures, custom profiles, and settings?");
    if (confirmClear) {
      localStorageManager.clearAll();
      window.location.reload();
    }
  };

  return (
    <div className={styles.overlayContainer}>
      {/* Sidebar Navigation */}
      <div className={styles.sidebar}>
        <span className={styles.menuTitle}>Camera Menu</span>
        
        <button
          className={`${styles.sidebarButton} ${activeTab === "scenes" ? styles.activeSidebar : ""}`}
          onClick={() => setActiveTab("scenes")}
        >
          Scene Library
        </button>

        <button
          className={`${styles.sidebarButton} ${activeTab === "profiles" ? styles.activeSidebar : ""}`}
          onClick={() => setActiveTab("profiles")}
        >
          Custom Profiles
        </button>

        <button
          className={`${styles.sidebarButton} ${activeTab === "upload" ? styles.activeSidebar : ""}`}
          onClick={() => setActiveTab("upload")}
        >
          Upload Image
        </button>

        <button
          className={styles.sidebarButton}
          onClick={() => {
            toggleMenu();
            useUIStore.getState().setChallengeOpen(true);
          }}
        >
          Challenge Mode
        </button>

        <button
          className={`${styles.sidebarButton} ${activeTab === "settings" ? styles.activeSidebar : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Maintenance
        </button>

        <button
          className={`${styles.sidebarButton} ${activeTab === "about" ? styles.activeSidebar : ""}`}
          onClick={() => setActiveTab("about")}
        >
          Exposure Triangle
        </button>
      </div>

      {/* Content Pane */}
      <div className={styles.contentArea}>
        <div className={styles.headerRow}>
          <span className={styles.sectionTitle}>
            {activeTab === "scenes" && "Built-In Scenes"}
            {activeTab === "profiles" && "Settings Profiles"}
            {activeTab === "upload" && "Custom Upload Mode"}
            {activeTab === "settings" && "Camera Maintenance"}
            {activeTab === "about" && "Photography Lesson"}
          </span>
          <button className={styles.closeButton} onClick={toggleMenu}>
            EXIT
          </button>
        </div>

        {/* Scene List Tab */}
        {activeTab === "scenes" && (
          <div className={styles.scenesGrid}>
            {SCENES.map((scene) => {
              const isActive = activeScene.id === scene.id;
              return (
                <div
                  key={scene.id}
                  className={`${styles.sceneCard} ${isActive ? styles.activeCard : ""}`}
                  onClick={() => {
                    setScene(scene);
                    toggleMenu();
                  }}
                >
                  <img src={scene.image} alt={scene.name} className={scene.id === 'custom-upload' ? '' : styles.sceneThumb} />
                  <div className={styles.sceneCardBody}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className={styles.sceneName}>{scene.name}</span>
                      <span className={styles.sceneEV}>EV {scene.targetEV}</span>
                    </div>
                    <p className={styles.sceneDesc}>{scene.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Profiles Tab */}
        {activeTab === "profiles" && (
          <div className={styles.profilesSection}>
            {/* Form to Save Profile */}
            <form className={styles.profileForm} onSubmit={handleSaveProfile}>
              <input
                type="text"
                className={styles.profileInput}
                placeholder="Enter Profile Name (e.g. Portrait Setup)..."
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                maxLength={30}
              />
              <button type="submit" className={styles.profileSaveBtn}>
                SAVE CURRENT
              </button>
            </form>

            {/* List of Saved Profiles */}
            <div className={styles.profilesList}>
              {profiles.length === 0 ? (
                <div className={styles.emptyState}>No custom settings profiles saved yet.</div>
              ) : (
                profiles.map((prof) => (
                  <div key={prof.id} className={styles.profileItem}>
                    <div className={styles.profileDetails}>
                      <span className={styles.profileName}>{prof.name}</span>
                      <span className={styles.profileMeta}>
                        Aperture: {formatAperture(prof.aperture)} | Shutter: {formatShutter(prof.shutter)} | ISO: {formatISO(prof.iso)}
                      </span>
                    </div>
                    <div className={styles.profileActions}>
                      <button className={styles.profileLoadBtn} onClick={() => handleLoadProfile(prof)}>
                        LOAD
                      </button>
                      <button className={styles.profileDelBtn} onClick={() => handleDeleteProfile(prof.id)}>
                        DELETE
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Image Upload Tab */}
        {activeTab === "upload" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <label className={styles.uploadZone}>
              <input
                type="file"
                className={styles.uploadInput}
                accept="image/png, image/jpeg, image/webp"
                onChange={handleImageUpload}
              />
              <span style={{ fontSize: "14pt", fontWeight: "bold" }}>Choose Photographic Image File</span>
              <span style={{ fontSize: "10pt", color: "var(--text-secondary)" }}>Supports JPG, PNG, WEBP formats</span>
            </label>
            {activeScene.id === "custom-upload" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "10pt", fontWeight: "bold" }}>Active Custom Scene Preview:</span>
                <img src={activeScene.image} alt="Upload Preview" className={styles.uploadPreview} />
              </div>
            )}
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className={styles.settingsSection}>
            <p style={{ color: "var(--text-secondary)" }}>
              Use the following maintenance tools to reset the camera back to factory configurations. This clears all captures, custom profiles, and settings.
            </p>
            <button className={styles.dangerBtn} onClick={handleClearAll}>
              FACTORY RESET CAMERA
            </button>
          </div>
        )}

        {/* About / Educational Tab */}
        {activeTab === "about" && (
          <div className={styles.aboutContent}>
            <p>
              The <strong>Exposure Triangle</strong> represents the three core variables that determine the exposure (brightness) of an image captured on a camera sensor:
            </p>
            
            <span className={styles.conceptTitle}>1. Aperture (f-number)</span>
            <p>
              Controls the physical size of the opening in the lens. Smaller f-numbers (e.g. f/1.4) create a larger opening, letting in more light but producing a very shallow depth of field (blurred background). Larger f-numbers (e.g. f/22) create a small opening, letting in less light but keeping the entire landscape sharp.
            </p>

            <span className={styles.conceptTitle}>2. Shutter Speed (seconds)</span>
            <p>
              Controls the duration of time the sensor is exposed to light. Fast speeds (e.g. 1/4000s) freeze fast-moving action (like sports runner) without blur. Slow speeds (e.g. 30s) let in light for a long duration, but cause moving subjects to become heavily motion-blurred (creating light trails or stream flows).
            </p>

            <span className={styles.conceptTitle}>3. ISO (sensitivity)</span>
            <p>
              Controls the sensor's sensitivity amplification to light. Higher ISO values (e.g. 12800) amplify faint light to make dark scenes visible, but introduce severe procedural monochrome grain (noise). Lower ISO values (e.g. 100) yield clean, crisp images but require bright lighting.
            </p>

            <span className={styles.conceptTitle}>4. Mathematical Calculations</span>
            <p>
              The light value is represented as <strong>Exposure Value (EV)</strong>. The base EV is computed by the lens settings: <code>EV = log2(N² / t)</code>.
              Adding sensor sensitivity gives the <strong>Adjusted EV</strong>: <code>adjustedEV = EV - log2(ISO / 100)</code>.
              The final exposure difference is <code>deltaEV = targetEV - adjustedEV</code>.
              When <code>deltaEV = 0</code>, the exposure matches the environment perfectly!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
