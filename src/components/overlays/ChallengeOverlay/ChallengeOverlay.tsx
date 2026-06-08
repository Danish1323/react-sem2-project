/* src/components/overlays/ChallengeOverlay/ChallengeOverlay.tsx */
import { useEffect } from "react";
import { Star } from "lucide-react";
import { useUIStore } from "../../../stores/uiStore";
import { useChallengeStore } from "../../../stores/challengeStore";
import { useCameraStore } from "../../../stores/cameraStore";
import { useSceneStore } from "../../../stores/sceneStore";
import { SCENES } from "../../../constants/scenes";
import styles from "./ChallengeOverlay.module.css";

export default function ChallengeOverlay() {
  const toggleChallenge = useUIStore((state) => state.toggleChallenge);
  
  const {
    challenge,
    completed,
    starsAwarded,
    score,
    startChallenge,
    evaluateChallenge,
    resetChallenge
  } = useChallengeStore();

  const adjustedEV = useCameraStore((state) => state.adjustedEV);
  const activeScene = useSceneStore((state) => state.activeScene);
  const setScene = useSceneStore((state) => state.setScene);

  // Sync challenge scene to the camera's active scene
  useEffect(() => {
    if (challenge && !completed) {
      const matchedScene = SCENES.find((s) => s.id === challenge.sceneId);
      if (matchedScene && activeScene.id !== matchedScene.id) {
        setScene(matchedScene);
      }
    }
  }, [challenge, completed, activeScene.id, setScene]);

  // Live evaluation as settings are adjusted
  useEffect(() => {
    if (challenge && !completed) {
      evaluateChallenge(adjustedEV);
    }
  }, [adjustedEV, challenge, completed, evaluateChallenge]);

  const handleStart = () => {
    startChallenge();
  };

  const handleClose = () => {
    resetChallenge();
    toggleChallenge();
  };

  // Find target scene details
  const getSceneName = (): string => {
    if (!challenge) return "";
    const matched = SCENES.find((s) => s.id === challenge.sceneId);
    return matched ? matched.name : "";
  };

  const delta = challenge ? Math.abs(challenge.targetEV - adjustedEV) : 999;

  return (
    <div className={styles.challengeContainer}>
      {/* Header */}
      <div className={styles.headerRow}>
        <span className={styles.title}>Challenge Mode</span>
        <button className={styles.closeButton} onClick={handleClose}>
          EXIT
        </button>
      </div>

      {/* Main Game Screen */}
      <div className={styles.gameBoard}>
        {!challenge ? (
          <div className={styles.taskCard}>
            <span style={{ fontSize: "14pt", fontWeight: "bold" }}>Test Your Skills</span>
            <p className={styles.instructions}>
              A random scene and a target exposure value (EV) will be selected. 
              Adjust the Aperture, ISO, and Shutter Speed until your adjusted exposure matches the target to pass!
            </p>
            <button className={styles.actionBtn} onClick={handleStart}>
              START CHALLENGE
            </button>
          </div>
        ) : completed ? (
          /* Success Screen */
          <div className={styles.resultCard}>
            <span className={`${styles.grade} ${starsAwarded === 3 ? styles.perfect : starsAwarded === 2 ? styles.good : styles.pass}`}>
              {starsAwarded === 3 && "PERFECT EXPOSURE"}
              {starsAwarded === 2 && "GOOD EXPOSURE"}
              {starsAwarded === 1 && "EXPOSURE PASSED"}
            </span>

            {/* Stars rendering */}
            <div className={styles.starsRow}>
              {[1, 2, 3].map((starNum) => (
                <Star
                  key={starNum}
                  size={48}
                  fill={starNum <= starsAwarded ? "#ffd700" : "none"}
                  className={`${styles.star} ${starNum <= starsAwarded ? styles.starActive : ""}`}
                  style={{ animationDelay: `${(starNum - 1) * 150}ms` }}
                />
              ))}
            </div>

            <p className={styles.instructions} style={{ fontSize: "11pt" }}>
              Target EV: {challenge.targetEV.toFixed(1)} | Your EV: {adjustedEV.toFixed(1)} <br />
              Difference: {delta.toFixed(2)} EV stops!
            </p>

            <button className={styles.actionBtn} onClick={handleStart}>
              PLAY AGAIN
            </button>
          </div>
        ) : (
          /* Active Challenge Play */
          <div className={styles.taskCard}>
            <span className={styles.taskSceneName}>TARGET: {getSceneName()}</span>
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
              <span className={styles.metaLabel} style={{ fontSize: "9pt" }}>Target Exposure</span>
              <span className={styles.evTargetDisplay}>EV {challenge.targetEV.toFixed(1)}</span>
            </div>

            <p className={styles.instructions}>
              Rotate the dial on the right to adjust Aperture, Shutter Speed, and ISO.
              Get your adjusted exposure value as close as possible to the target EV!
            </p>

            {/* Live Stats */}
            <div className={styles.liveStats}>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Current EV</span>
                <span className={styles.statValue}>{adjustedEV.toFixed(1)}</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Difference</span>
                <span className={styles.statValue} style={{ color: "var(--text-orange)" }}>
                  {delta > 10 ? "Too Dark" : `${delta.toFixed(1)} EV`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer tracker */}
      <div className={styles.footerArea}>
        <span className={styles.scoreTracker}>Cumulative Stars: {score} ⭐</span>
        {challenge && !completed && (
          <button className={styles.closeButton} onClick={handleClose} style={{ background: "rgba(0,0,0,0.5)" }}>
            CANCEL
          </button>
        )}
      </div>
    </div>
  );
}
