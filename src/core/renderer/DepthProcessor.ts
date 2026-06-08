/* src/core/renderer/DepthProcessor.ts */
export function getBlurRadius(aperture: number): number {
  if (aperture <= 1.4) return 16;
  if (aperture <= 1.8) return 14;
  if (aperture <= 2.0) return 12;
  if (aperture <= 2.8) return 10;
  if (aperture <= 4.0) return 8;
  if (aperture <= 5.6) return 6;
  if (aperture <= 8.0) return 4;
  if (aperture <= 11.0) return 3;
  if (aperture <= 16.0) return 2;
  return 0; // f/22 is fully sharp
}

export function processDepthOfField(
  sharpData: ImageData,
  blurredData: ImageData,
  maskData: ImageData,
  outData: ImageData
): void {
  const sharp = sharpData.data;
  const blurred = blurredData.data;
  const mask = maskData.data;
  const dest = outData.data;
  const len = dest.length;

  for (let i = 0; i < len; i += 4) {
    // Mask uses grayscale: White (255) = affected (blurred), Black (0) = unaffected (sharp)
    // Grayscale value (R channel of mask is sufficient since it is grayscale)
    const maskVal = mask[i] / 255.0; 
    const invMask = 1.0 - maskVal;

    dest[i] = sharp[i] * invMask + blurred[i] * maskVal;     // Red
    dest[i + 1] = sharp[i + 1] * invMask + blurred[i + 1] * maskVal; // Green
    dest[i + 2] = sharp[i + 2] * invMask + blurred[i + 2] * maskVal; // Blue
    dest[i + 3] = sharp[i + 3]; // Alpha remains same
  }
}
