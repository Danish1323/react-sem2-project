/* src/core/exposure/deltaEV.ts */
export function deltaEV(targetEV: number, adjustedEV: number): number {
  return targetEV - adjustedEV;
}
