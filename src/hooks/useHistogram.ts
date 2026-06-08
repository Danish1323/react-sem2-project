/* src/hooks/useHistogram.ts */
import { useEffect } from "react";

export function useHistogram(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  histogram: number[]
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Clear and draw background
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(12, 12, 12, 0.75)";
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, W, H);

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.beginPath();
    // Vertical grid lines (quarters)
    for (let i = 1; i <= 3; i++) {
      const x = (W / 4) * i;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    // Horizontal grid lines (halves)
    ctx.moveTo(0, H / 2);
    ctx.lineTo(W, H / 2);
    ctx.stroke();

    // Check if histogram has data
    const maxVal = Math.max(...histogram, 1);

    // Draw graph path
    ctx.beginPath();
    ctx.moveTo(0, H);

    const step = W / 256;
    for (let i = 0; i < 256; i++) {
      const x = i * step;
      // Invert Y coordinate since 0,0 is top-left
      const y = H - (histogram[i] / maxVal) * (H - 5);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(W, H);
    ctx.closePath();

    // Fill graph area with subtle gradient
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.45)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0.05)");
    ctx.fillStyle = grad;
    ctx.fill();

    // Draw graph outline
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, H - (histogram[0] / maxVal) * (H - 5));
    for (let i = 1; i < 256; i++) {
      const x = i * step;
      const y = H - (histogram[i] / maxVal) * (H - 5);
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [canvasRef, histogram]);
}
