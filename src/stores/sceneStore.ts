/* src/stores/sceneStore.ts */
import { create } from "zustand";
import { SCENES } from "../constants/scenes";
import type { Scene } from "../types/scene";

interface SceneState {
  activeScene: Scene;
  uploadedImage: string | null;

  // Actions
  setScene: (scene: Scene) => void;
  uploadScene: (imageDataUrl: string) => void;
  resetScene: () => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  activeScene: SCENES[0], // default to portrait
  uploadedImage: null,

  setScene: (activeScene) => {
    set({ activeScene, uploadedImage: null });
  },

  uploadScene: (imageDataUrl) => {
    // Custom upload scene details
    const customScene: Scene = {
      id: "custom-upload",
      name: "Custom Upload",
      image: imageDataUrl,
      targetEV: 10, // default target EV for custom uploads
      description: "Your uploaded image. DOF focus is centered; motion blur is disabled.",
      motionDirection: "none",
      // Grayscale focus mask: centered circle is black (sharp), outside is white (blurred)
      // We will generate the mask programmatically or handle it inside DepthProcessor on-the-fly!
      focusMask: "generate-radial",
      motionMask: "generate-black"
    };

    set({
      activeScene: customScene,
      uploadedImage: imageDataUrl
    });
  },

  resetScene: () => {
    set({
      activeScene: SCENES[0],
      uploadedImage: null
    });
  }
}));
