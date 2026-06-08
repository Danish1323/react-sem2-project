/* src/constants/cameraConfig.ts */
export const DEFAULT_CAMERA_SETTINGS = {
  aperture: 2.8,
  iso: 400,
  shutter: 1 / 125,
} as const;

export const LOCAL_STORAGE_KEYS = {
  SETTINGS: "camera_settings",
  PROFILES: "camera_profiles",
  CAPTURES: "camera_captures",
  CHALLENGE: "challenge_progress",
} as const;
