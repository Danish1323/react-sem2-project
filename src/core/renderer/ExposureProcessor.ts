/* src/core/renderer/ExposureProcessor.ts */
export function processExposure(imageData: ImageData, deltaEV: number): void {
  const data = imageData.data;
  // Convert deltaEV into brightness multiplier
  const brightness = Math.max(0.1, Math.min(4.0, Math.pow(2, deltaEV)));

  if (brightness === 1.0) return; // No compensation needed

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.max(0, Math.min(255, data[i] * brightness));     // Red
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] * brightness)); // Green
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] * brightness)); // Blue
    // Alpha channel (data[i + 3]) remains untouched
  }
}
