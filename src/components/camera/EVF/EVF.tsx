/* src/components/camera/EVF/EVF.tsx */
import styles from "./EVF.module.css";

export default function EVF() {
  return (
    <div className={styles.evfPlate}>
      <div className={styles.evfGlass}>
        <span className={styles.evfLabel}>EVF</span>
      </div>
    </div>
  );
}
