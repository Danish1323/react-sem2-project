/* src/core/renderer/NoiseProcessor.ts */
export function getNoiseStrength(iso: number): number {
  if (iso <= 100) return 0.0;
  if (iso <= 200) return 0.02;
  if (iso <= 400) return 0.04;
  if (iso <= 800) return 0.08;
  if (iso <= 1600) return 0.12;
  if (iso <= 3200) return 0.18;
  if (iso <= 6400) return 0.24;
  return 0.30; // ISO 12800
}

export function processNoise(imageData: ImageData, iso: number): void {
  const strength = getNoiseStrength(iso);
  if (strength === 0.0) return; // No noise at ISO 100

  const data = imageData.data;
  const len = data.length;

  for (let i = 0; i < len; i += 4) {
    // Generate monochrome grain: value between -127.5 * strength and +127.5 * strength
    const grain = (Math.random() - 0.5) * 255.0 * strength;

    data[i] = Math.max(0, Math.min(255, data[i] + grain));     // Red
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain)); // Green
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain)); // Blue
    // Alpha channel left unmodified
  }
}
