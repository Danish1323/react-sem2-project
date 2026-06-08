/* src/types/camera.ts */
export type SelectedControl = "aperture" | "iso" | "shutter";

export interface CameraSettings {
  aperture: number;
  iso: number;
  shutter: number;
}

export interface CameraProfile {
  id: string;
  name: string;
  aperture: number;
  iso: number;
  shutter: number;
}
