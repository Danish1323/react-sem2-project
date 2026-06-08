/* src/core/renderer/MotionProcessor.ts */
export function getMotionBlurStrength(shutter: number): { samples: number; offset: number } {
  // Fast shutter: 1/4000 -> 0 blur
  // Slow shutter: 30s -> maximum blur
  const maxFactor = Math.log2(30 / (1 / 4000)); // ~16.87
  const factor = Math.log2(30 / shutter);
  
  // Normalized between 0 (no blur) and 1 (max blur)
  const normalized = Math.max(0, Math.min(1, 1 - factor / maxFactor));

  // Let's set a maximum pixel offset of 40px for motion blur
  const maxOffset = 40;
  const offset = normalized * maxOffset;

  // Number of rendering passes to approximate motion trail
  const samples = Math.max(1, Math.round(normalized * 10));

  return { samples, offset };
}

export function processMotionBlur(
  sharpData: ImageData,
  motionBlurredData: ImageData,
  maskData: ImageData,
  outData: ImageData
): void {
  const sharp = sharpData.data;
  const blurred = motionBlurredData.data;
  const mask = maskData.data;
  const dest = outData.data;
  const len = dest.length;

  for (let i = 0; i < len; i += 4) {
    // Mask uses grayscale: White (255) = affected (motion blurred), Black (0) = unaffected (sharp)
    const maskVal = mask[i] / 255.0;
    const invMask = 1.0 - maskVal;

    dest[i] = sharp[i] * invMask + blurred[i] * maskVal;     // Red
    dest[i + 1] = sharp[i + 1] * invMask + blurred[i + 1] * maskVal; // Green
    dest[i + 2] = sharp[i + 2] * invMask + blurred[i + 2] * maskVal; // Blue
    dest[i + 3] = sharp[i + 3]; // Alpha
  }
}
