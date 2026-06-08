/* src/core/exposure/calculateEV.ts */
export function calculateEV(aperture: number, shutter: number): number {
  return Math.log2((aperture * aperture) / shutter);
}
