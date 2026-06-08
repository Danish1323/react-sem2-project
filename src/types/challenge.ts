/* src/types/challenge.ts */
export interface Challenge {
  id: string;
  sceneId: string;
  targetEV: number;
  tolerance: number; // e.g. 0.5, 0.25, 0.1
  completed: boolean;
  starsAwarded?: number; // 1, 2, or 3
}
