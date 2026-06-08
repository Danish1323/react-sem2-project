/* src/core/exposure/adjustedEV.ts */
export function adjustedEV(ev: number, iso: number): number {
  return ev - Math.log2(iso / 100);
}
