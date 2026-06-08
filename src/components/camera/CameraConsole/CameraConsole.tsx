/* src/components/camera/CameraConsole/CameraConsole.tsx */
import EnvironmentActionStrip from "./EnvironmentActionStrip";
import ExposureTriangleForm from "./ExposureTriangleForm";
import styles from "./CameraConsole.module.css";

export default function CameraConsole() {
  return (
    <div className={styles.consoleContainer}>
      <EnvironmentActionStrip />
      <ExposureTriangleForm />
    </div>
  );
}
