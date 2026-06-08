/* src/constants/scenes.ts */
import portraitScene from "../assets/scenes/portrait/scene.jpg";
import portraitFocus from "../assets/scenes/portrait/focus-mask.png";
import portraitMotion from "../assets/scenes/portrait/motion-mask.png";

import landscapeScene from "../assets/scenes/landscape/scene.jpg";
import landscapeFocus from "../assets/scenes/landscape/focus-mask.png";
import landscapeMotion from "../assets/scenes/landscape/motion-mask.png";

import sportsScene from "../assets/scenes/sports/scene.jpg";
import sportsFocus from "../assets/scenes/sports/focus-mask.png";
import sportsMotion from "../assets/scenes/sports/motion-mask.png";

import wildlifeScene from "../assets/scenes/wildlife/scene.jpg";
import wildlifeFocus from "../assets/scenes/wildlife/focus-mask.png";
import wildlifeMotion from "../assets/scenes/wildlife/motion-mask.png";

import streetScene from "../assets/scenes/street/scene.jpg";
import streetFocus from "../assets/scenes/street/focus-mask.png";
import streetMotion from "../assets/scenes/street/motion-mask.png";

import nightCityScene from "../assets/scenes/night-city/scene.jpg";
import nightCityFocus from "../assets/scenes/night-city/focus-mask.png";
import nightCityMotion from "../assets/scenes/night-city/motion-mask.png";

import cafeScene from "../assets/scenes/cafe/scene.jpg";
import cafeFocus from "../assets/scenes/cafe/focus-mask.png";
import cafeMotion from "../assets/scenes/cafe/motion-mask.png";

import goldenHourScene from "../assets/scenes/golden-hour/scene.jpg";
import goldenHourFocus from "../assets/scenes/golden-hour/focus-mask.png";
import goldenHourMotion from "../assets/scenes/golden-hour/motion-mask.png";

import type { Scene } from "../types/scene";

export const SCENES: Scene[] = [
  {
    id: "portrait",
    name: "Portrait",
    image: portraitScene,
    targetEV: 11,
    focusMask: portraitFocus,
    motionMask: portraitMotion,
    description: "Demonstrate aperture. Portrait with shallow depth of field. Subject is sharp, background is blurred.",
    motionDirection: "none"
  },
  {
    id: "landscape",
    name: "Landscape",
    image: landscapeScene,
    targetEV: 14,
    focusMask: landscapeFocus,
    motionMask: landscapeMotion,
    description: "Balanced exposure. Beautiful wide landscape. High depth of field is desired.",
    motionDirection: "none"
  },
  {
    id: "sports",
    name: "Sports",
    image: sportsScene,
    targetEV: 13,
    focusMask: sportsFocus,
    motionMask: sportsMotion,
    description: "Demonstrate motion blur. Sprinting athlete on the track. Slow shutter speeds cause blur.",
    motionDirection: "horizontal"
  },
  {
    id: "wildlife",
    name: "Wildlife",
    image: wildlifeScene,
    targetEV: 12,
    focusMask: wildlifeFocus,
    motionMask: wildlifeMotion,
    description: "Mixed focus and motion. Kingfisher bird on branch with moving wings.",
    motionDirection: "diagonal"
  },
  {
    id: "street",
    name: "Street Photography",
    image: streetScene,
    targetEV: 12,
    focusMask: streetFocus,
    motionMask: streetMotion,
    description: "General-purpose learning. Bustling Tokyo street crossing with moving pedestrians and cars.",
    motionDirection: "horizontal"
  },
  {
    id: "night-city",
    name: "Night City",
    image: nightCityScene,
    targetEV: 6,
    focusMask: nightCityFocus,
    motionMask: nightCityMotion,
    description: "ISO demonstration. City skyline with glowing windows at night and a flowing river.",
    motionDirection: "horizontal"
  },
  {
    id: "cafe",
    name: "Indoor Cafe",
    image: cafeScene,
    targetEV: 8,
    focusMask: cafeFocus,
    motionMask: cafeMotion,
    description: "Mixed lighting. Coffee cup on a table with cozy warm cafe background.",
    motionDirection: "none"
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    image: goldenHourScene,
    targetEV: 10,
    focusMask: goldenHourFocus,
    motionMask: goldenHourMotion,
    description: "Warm light exposure. Tree in a field with warm sunlight filtering through branches.",
    motionDirection: "none"
  }
];
