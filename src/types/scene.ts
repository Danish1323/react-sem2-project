/* src/types/scene.ts */
export interface Scene {
  id: string;
  name: string;
  image: string;
  targetEV: number;
  focusMask?: string;
  motionMask?: string;
  description: string;
  motionDirection?: "horizontal" | "vertical" | "diagonal" | "none";
}
