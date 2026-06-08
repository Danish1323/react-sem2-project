/* src/core/exposure/exposureHelpers.ts */
export function formatAperture(aperture: number): string {
  return `f/${aperture}`;
}

export function formatShutter(shutter: number): string {
  if (shutter >= 1) {
    return `${shutter}"`;
  }
  // Convert fractional speed to string e.g. 1/125
  const denominator = Math.round(1 / shutter);
  return `1/${denominator}`;
}

export function formatISO(iso: number): string {
  return `ISO ${iso}`;
}

export function getExposureStatus(delta: number): string {
  const absDelta = Math.abs(delta);
  if (absDelta <= 0.1) {
    return "Correct Exposure";
  } else if (delta < 0) {
    return "Overexposed";
  } else {
    return "Underexposed";
  }
}
