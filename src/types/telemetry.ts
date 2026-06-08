/* src/types/telemetry.ts */
export interface TelemetryData {
  aperture: string; // formatted e.g. "f/2.8"
  shutter: string; // formatted e.g. "1/125"
  iso: string; // formatted e.g. "ISO 400"
  ev: string;
  adjustedEV: string;
  targetEV: string;
  deltaEV: string;
  sceneName: string;
  captureCount: number;
  systemTime: string;
}
