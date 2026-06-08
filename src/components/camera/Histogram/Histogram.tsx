/* src/components/camera/Histogram/Histogram.tsx */
import { useRef } from "react";
import { useHistogram } from "../../../hooks/useHistogram";
import styles from "./Histogram.module.css";

interface HistogramProps {
  data: number[];
}

export default function Histogram({ data }: HistogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Call custom hook to handle the low-level rendering context calls on this canvas
  useHistogram(canvasRef, data);

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={100}
      className={styles.histogramCanvas}
      title="Luminance Histogram"
    />
  );
}
