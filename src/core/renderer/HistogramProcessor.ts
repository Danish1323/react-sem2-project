/* src/core/renderer/HistogramProcessor.ts */
export function calculateLuminanceHistogram(imageData: ImageData): number[] {
  const data = imageData.data;
  const len = data.length;
  const histogram = new Array(256).fill(0);

  // We can sample pixels (e.g. every 4th pixel) to speed up histogram calculations 
  // since 1280*720 is ~1M pixels. Performance rules: Throttle histogram updates.
  // Sampling every 4th pixel gives 250k pixels, which is more than enough for a high-quality graph.
  for (let i = 0; i < len; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const luminance = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
    const clampedLuminance = Math.max(0, Math.min(255, luminance));
    histogram[clampedLuminance]++;
  }

  return histogram;
}
