/* src/stores/challengeStore.ts */
import { create } from "zustand";
import { SCENES } from "../constants/scenes";
import type { Challenge } from "../types/challenge";

interface ChallengeState {
  challenge: Challenge | null;
  score: number; // accumulated stars
  completed: boolean;
  starsAwarded: number;

  // Actions
  startChallenge: () => void;
  evaluateChallenge: (adjustedEV: number) => void;
  resetChallenge: () => void;
}

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  challenge: null,
  score: 0,
  completed: false,
  starsAwarded: 0,

  startChallenge: () => {
    // Pick a random scene
    const randomScene = SCENES[Math.floor(Math.random() * SCENES.length)];
    
    // Create random target EV centered around scene's base target EV
    // e.g. offset by -1.5, -1, -0.5, 0, 0.5, 1, 1.5
    const offsets = [-1.5, -1.0, -0.5, 0.0, 0.5, 1.0, 1.5];
    const randomOffset = offsets[Math.floor(Math.random() * offsets.length)];
    const targetEV = Math.max(3, Math.min(16, randomScene.targetEV + randomOffset));

    const newChallenge: Challenge = {
      id: `challenge-${Date.now()}`,
      sceneId: randomScene.id,
      targetEV: Math.round(targetEV * 10) / 10,
      tolerance: 0.5,
      completed: false
    };

    set({
      challenge: newChallenge,
      completed: false,
      starsAwarded: 0
    });
  },

  evaluateChallenge: (adjustedEV) => {
    const { challenge } = get();
    if (!challenge) return;

    const diff = Math.abs(challenge.targetEV - adjustedEV);
    
    if (diff <= 0.5) {
      let stars = 1;
      if (diff <= 0.25) {
        stars = 2;
      }
      if (diff <= 0.1) {
        stars = 3;
      }

      set((state) => ({
        completed: true,
        starsAwarded: stars,
        score: state.score + stars,
        challenge: challenge ? { ...challenge, completed: true, starsAwarded: stars } : null
      }));
    } else {
      set({
        completed: false,
        starsAwarded: 0
      });
    }
  },

  resetChallenge: () => {
    set({
      challenge: null,
      completed: false,
      starsAwarded: 0
    });
  }
}));
