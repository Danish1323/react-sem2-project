/* src/types/gallery.ts */
export interface Capture {
  id: string;
  timestamp: number;
  sceneId: string;
  sceneName: string;
  imageData: string; // Base64 PNG data URL
  aperture: number;
  iso: number;
  shutter: number;
  ev: number;
  adjustedEV: number;
  deltaEV: number;
}
