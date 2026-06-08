# AGENTS.md

# Project Name

Manual Photography Exposure Simulator

---

# Mission

Build a professional-grade React application that simulates a real mirrorless DSLR camera and teaches users the relationship between:

- Aperture
- Shutter Speed
- ISO

The application must feel like operating a real camera rather than interacting with a standard web dashboard.

The simulator must visually demonstrate:

- Exposure
- Depth of Field
- Motion Blur
- ISO Noise

using real-time canvas-based image processing.

The application should resemble the rear interface of a Sony A7 IV-inspired camera body.

The LCD screen is the hero element.

The camera body exists to support the simulation.

---

# Core Educational Goal

A user with no photography experience should understand:

- what aperture does
- what shutter speed does
- what ISO does
- how exposure value (EV) works
- how settings interact with each other

after using the simulator.

---

# Non-Negotiable Technical Requirements

Build using:

- React
- TypeScript
- Vite
- Zustand
- Canvas API
- CSS Modules

Do NOT use:

- NextJS
- Redux
- Backend
- Database
- Firebase
- Supabase
- ThreeJS
- WebGL

The entire application must run locally in the browser.

---

# Deployment Target

Desktop only.

Target machine:

MacBook Air M4

Do not implement mobile responsiveness.

Optimize for:

- 1440x900
- 1512x982
- 1920x1080

---

# Design Philosophy

The application must NOT look like:

- admin dashboard
- analytics dashboard
- SaaS product
- educational slideshow

The application MUST look like:

- virtual camera
- mirrorless camera simulator
- photography tool

The design should be heavily inspired by the rear side of a Sony A7 IV.

Do not use Sony logos.

Do not directly copy Sony assets.

Create an original UI inspired by Sony's layout and ergonomics.

---

# Visual Layout

Application fills entire viewport.

Main structure:

CameraBody

Inside CameraBody:

Top Region:

- EVF Viewfinder

Center Region:

- Large LCD Screen

Right Region:

- Control Wheel
- Parameter Selector

Left Region:

- Camera Buttons

Bottom Region:

- Status Strip

---

# Camera Body Appearance

Color:

Graphite Black

Material style:

Matte

Subtle gradients only.

No bright colors.

No glassmorphism.

No neumorphism.

Professional camera aesthetic.

---

# Startup Experience

When application loads:

Show boot screen for 2.5 seconds.

Sequence:

MANUAL EXPOSURE SIMULATOR

Initializing Sensor...

Loading Scene Profiles...

Calibrating Light Meter...

Preparing Live View...

READY

Then fade into main interface.

---

# Main Camera Screen

The LCD screen is the most important UI element.

The screen should occupy roughly 65% of the visible camera body.

Screen contains:

- Rendered Scene
- Histogram Overlay
- Light Meter Overlay
- Grid Overlay
- Telemetry Overlay

---

# Built-In Scenes

Create the following built-in scene library.

Scene 1

Portrait

Purpose:

Demonstrate aperture.

Characteristics:

Sharp subject.

Blur-capable background.

Target EV:

11

---

Scene 2

Landscape

Purpose:

Balanced exposure.

Target EV:

14

---

Scene 3

Sports

Purpose:

Demonstrate motion blur.

Target EV:

13

---

Scene 4

Wildlife

Purpose:

Mixed focus and motion.

Target EV:

12

---

Scene 5

Street Photography

Purpose:

General-purpose learning.

Target EV:

12

---

Scene 6

Night City

Purpose:

ISO demonstration.

Target EV:

6

---

Scene 7

Indoor Cafe

Purpose:

Mixed lighting.

Target EV:

8

---

Scene 8

Golden Hour

Purpose:

Warm light exposure.

Target EV:

10

---

# Custom Upload Mode

Users can upload images.

Accepted:

- JPG
- PNG
- WEBP

When uploaded:

Create default focus region centered in image.

Disable advanced motion masks.

Apply all exposure simulation features.

---

# Exposure Engine

Create dedicated exposure engine.

Location:

src/core/exposure

Responsible for:

- EV calculation
- ISO compensation
- exposure difference
- light meter position

---

# EV Formula

Use:

EV = log2(N² / t)

Where:

N = aperture

t = shutter time in seconds

---

# ISO Compensation

Use:

adjustedEV = EV - log2(ISO / 100)

---

# Exposure Difference

deltaEV = targetEV - adjustedEV

---

# Exposure Interpretation

deltaEV < 0

Image is overexposed.

---

deltaEV > 0

Image is underexposed.

---

deltaEV = 0

Image is correctly exposed.

---

# Supported Apertures

Use:

f/1.4

f/1.8

f/2

f/2.8

f/4

f/5.6

f/8

f/11

f/16

f/22

---

# Supported ISO Values

Use:

100

200

400

800

1600

3200

6400

12800

---

# Supported Shutter Speeds

Use:

1/4000

1/2000

1/1000

1/500

1/250

1/125

1/60

1/30

1/15

1/8

1/4

1/2

1

2

4

8

15

30

seconds

---

# Camera Controls

Use one main control wheel.

Users first select parameter:

- Aperture
- ISO
- Shutter

The wheel then controls the selected parameter.

The wheel must remember the previous position for every parameter.

Example:

Aperture = f/2.8

Switch to ISO

ISO = 800

Switch back to Aperture

Wheel returns to f/2.8 position.

---

# Camera Buttons

Left Side Buttons:

MENU

INFO

PLAY

DELETE

CAPTURE

Each button must be functional.

No decorative controls.

---

# MENU Behavior

Opens camera menu overlay.

Menu Sections:

Scenes

Profiles

Challenge Mode

Upload Image

Settings

About

---

# INFO Behavior

Cycles through display modes.

Mode 1:

Image Only

Mode 2:

Image + Histogram

Mode 3:

Image + Histogram + EXIF

Mode 4:

Image + Full Telemetry

---

# PLAY Behavior

Open playback gallery.

Show saved captures.

---

# DELETE Behavior

Delete selected capture.

Require confirmation.

---

# CAPTURE Behavior

Capture current processed image.

Store image and metadata.

---

# Canvas Renderer

Create dedicated rendering pipeline.

Location:

src/core/renderer

Pipeline:

Original Image

↓

Exposure Processing

↓

Depth Of Field Processing

↓

Motion Blur Processing

↓

Noise Processing

↓

Histogram Analysis

↓

Canvas Output

---

# Brightness Processing

Driven exclusively by EV difference.

Do NOT use arbitrary brightness sliders.

Use exposure difference to calculate brightness multiplier.

Clamp values.

Avoid clipping.

---

# Depth Of Field Simulation

Purpose:

Represent aperture.

Use focus masks.

Blur only non-focus regions.

Blur intensity:

f/1.4

Very strong

f/22

Minimal

Use canvas blur techniques.

---

# Motion Blur Simulation

Purpose:

Represent shutter speed.

Blur intensity increases as shutter speed slows.

1/4000

No blur

30 seconds

Maximum blur

Use directional blur approximation.

---

# Noise Simulation

Purpose:

Represent ISO.

Generate procedural film grain.

ISO 100

Almost invisible.

ISO 12800

Heavy visible grain.

Noise should appear photographic.

Avoid colorful static noise.

---

# Histogram

Create luminance histogram.

Not RGB.

Display top-right corner.

Update in real time.

Use canvas pixel analysis.

256 bins.

---

# Light Meter

Display:

-3 -2 -1 0 +1 +2 +3

Needle moves based on exposure difference.

Animate movement.

Needle position derives from deltaEV.

---

# Telemetry Panel

Display:

Aperture

ISO

Shutter

EV

Adjusted EV

Target EV

Exposure Difference

Scene Name

Capture Count

System Time

---

# Grid Overlay

Toggleable.

Rule of thirds.

3x3 composition grid.

Displayed over image.

---

# Playback System

Store captures in localStorage.

Capture structure:

id

timestamp

scene

imageData

aperture

iso

shutter

ev

adjustedEV

deltaEV

Playback view must show:

Original Image

Processed Image

Metadata

Side-by-side comparison.

---

# Challenge Mode

Educational mini-game.

Random scene selected.

Target EV shown.

User must match exposure.

Scoring:

deltaEV <= 0.5

Pass

deltaEV <= 0.25

Good

deltaEV <= 0.1

Perfect

Award stars accordingly.

---

# Local Storage Keys

camera_profiles

camera_captures

camera_settings

challenge_progress

---

# End of Part 1

# AGENTS.md — PART 2

# Folder Structure

Create the project using the following structure.

```text
src/

├── assets/
│   ├── scenes/
│   │   ├── portrait/
│   │   ├── landscape/
│   │   ├── sports/
│   │   ├── wildlife/
│   │   ├── street/
│   │   ├── night-city/
│   │   ├── cafe/
│   │   └── golden-hour/
│   │
│   ├── icons/
│   └── overlays/
│
├── app/
│   ├── App.tsx
│   ├── Layout.tsx
│   └── Router.tsx
│
├── components/
│
│   ├── camera/
│   │
│   ├── CameraBody/
│   ├── CameraScreen/
│   ├── CameraButtons/
│   ├── ControlWheel/
│   ├── TelemetryPanel/
│   ├── LightMeter/
│   ├── Histogram/
│   ├── EVF/
│   ├── StatusStrip/
│   │
│   └── overlays/
│
│       ├── MenuOverlay/
│       ├── PlaybackOverlay/
│       ├── ChallengeOverlay/
│       ├── UploadOverlay/
│       └── AboutOverlay/
│
├── core/
│
│   ├── exposure/
│   │   ├── calculateEV.ts
│   │   ├── adjustedEV.ts
│   │   ├── deltaEV.ts
│   │   └── exposureHelpers.ts
│
│   ├── renderer/
│   │   ├── CanvasRenderer.ts
│   │   ├── ExposureProcessor.ts
│   │   ├── DepthProcessor.ts
│   │   ├── MotionProcessor.ts
│   │   ├── NoiseProcessor.ts
│   │   └── HistogramProcessor.ts
│
│   ├── storage/
│   │   ├── localStorageManager.ts
│   │   └── persistence.ts
│
│   └── challenge/
│       └── challengeEngine.ts
│
├── hooks/
│
│   ├── useRenderer.ts
│   ├── useExposure.ts
│   ├── useHistogram.ts
│   └── useCapture.ts
│
├── stores/
│
│   ├── cameraStore.ts
│   ├── sceneStore.ts
│   ├── uiStore.ts
│   ├── galleryStore.ts
│   └── challengeStore.ts
│
├── types/
│
│   ├── camera.ts
│   ├── scene.ts
│   ├── telemetry.ts
│   ├── gallery.ts
│   └── challenge.ts
│
├── constants/
│
│   ├── aperture.ts
│   ├── iso.ts
│   ├── shutter.ts
│   ├── scenes.ts
│   └── cameraConfig.ts
│
├── styles/
│
│   ├── globals.css
│   ├── variables.css
│   └── reset.css
│
└── main.tsx
```

---

# State Management Strategy

Use Zustand.

Do not use Redux.

Do not use Context API for business state.

Context is only allowed for theme-like concerns.

All camera logic must live in Zustand.

---

# Store Architecture

Create exactly five stores.

```text
cameraStore
sceneStore
uiStore
galleryStore
challengeStore
```

---

# cameraStore

Responsible for:

```text
aperture
iso
shutter
selectedControl
currentEV
adjustedEV
deltaEV
captureCount
```

---

Structure

```ts
interface CameraStore {
  aperture: number;

  iso: number;

  shutter: number;

  selectedControl: "aperture" | "iso" | "shutter";

  ev: number;

  adjustedEV: number;

  deltaEV: number;

  captureCount: number;

  setAperture();

  setISO();

  setShutter();

  setSelectedControl();

  recalculateExposure();
}
```

---

# sceneStore

Responsible for:

```text
current scene
scene switching
uploaded image
focus masks
motion masks
```

---

Structure

```ts
interface SceneStore {
  activeScene: Scene;

  uploadedImage?: string;

  setScene();

  uploadScene();

  resetScene();
}
```

---

# uiStore

Responsible for:

```text
menu state
playback state
challenge state
info mode
overlay visibility
boot sequence
```

---

Structure

```ts
interface UIStore {
  booting: boolean;

  menuOpen: boolean;

  playbackOpen: boolean;

  challengeOpen: boolean;

  infoMode: number;

  toggleMenu();

  togglePlayback();

  toggleChallenge();

  cycleInfoMode();
}
```

---

# galleryStore

Responsible for:

```text
captures
selected capture
capture loading
capture deletion
```

---

Structure

```ts
interface GalleryStore {
  captures: Capture[];

  selectedCapture?: Capture;

  addCapture();

  removeCapture();

  loadCaptures();

  clearCaptures();
}
```

---

# challengeStore

Responsible for:

```text
current challenge
score
completion state
```

---

Structure

```ts
interface ChallengeStore {
  challenge?: Challenge;

  score: number;

  completed: boolean;

  startChallenge();

  evaluateChallenge();

  resetChallenge();
}
```

---

# Type Definitions

Create strict TypeScript interfaces.

No any.

No unknown.

No unsafe casting.

---

# Scene Interface

```ts
export interface Scene {
  id: string;

  name: string;

  image: string;

  targetEV: number;

  focusMask?: string;

  motionMask?: string;

  description: string;
}
```

---

# Capture Interface

```ts
export interface Capture {
  id: string;

  timestamp: number;

  sceneId: string;

  imageData: string;

  aperture: number;

  iso: number;

  shutter: number;

  ev: number;

  adjustedEV: number;

  deltaEV: number;
}
```

---

# Challenge Interface

```ts
export interface Challenge {
  id: string;

  sceneId: string;

  targetEV: number;

  tolerance: number;

  completed: boolean;
}
```

---

# Camera Constants

Create dedicated constants.

Never hardcode values.

---

# aperture.ts

```ts
export const APERTURES = [1.4, 1.8, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
```

---

# iso.ts

```ts
export const ISO_VALUES = [100, 200, 400, 800, 1600, 3200, 6400, 12800];
```

---

# shutter.ts

```ts
export const SHUTTER_SPEEDS = [
  1 / 4000,
  1 / 2000,
  1 / 1000,
  1 / 500,
  1 / 250,
  1 / 125,
  1 / 60,
  1 / 30,
  1 / 15,
  1 / 8,
  1 / 4,
  1 / 2,
  1,
  2,
  4,
  8,
  15,
  30,
];
```

---

# Scene Configuration

Each built-in scene must contain:

```ts
{
  (id, name, image, targetEV, description, focusMask, motionMask);
}
```

---

# Local Storage Manager

Create centralized manager.

Never directly call localStorage in components.

All access must go through:

```text
localStorageManager.ts
```

---

Supported Methods

```ts
saveCapture();

loadCaptures();

saveSettings();

loadSettings();

saveProfiles();

loadProfiles();

clearAll();
```

---

# Persistence Strategy

Auto-save every time:

```text
aperture changes
iso changes
shutter changes
scene changes
```

Restore automatically on refresh.

---

# Hooks

Create custom hooks.

---

# useExposure

Responsible for:

```text
EV calculation
deltaEV calculation
adjustedEV calculation
```

---

# useRenderer

Responsible for:

```text
renderer initialization
canvas lifecycle
frame updates
```

---

# useHistogram

Responsible for:

```text
histogram generation
histogram updates
```

---

# useCapture

Responsible for:

```text
capture generation
gallery integration
metadata creation
```

---

# Coding Standards

Every component:

```text
one component per file
```

No component larger than:

```text
300 lines
```

Extract logic into hooks.

Extract calculations into core.

Keep components focused on UI.

---

# Naming Standards

Use:

```text
PascalCase
```

for:

```text
components
interfaces
types
```

Use:

```text
camelCase
```

for:

```text
variables
functions
hooks
```

Use:

```text
UPPER_SNAKE_CASE
```

for:

```text
constants
```

---

# Import Rules

Always use:

```ts
import type
```

for type-only imports.

Avoid circular dependencies.

Core modules must never import UI components.

UI components may consume core modules.

---

# Performance Rules

Avoid unnecessary rerenders.

Memoize expensive calculations.

Throttle histogram updates.

Reuse offscreen canvases.

Avoid recreating image objects.

---

# End of Part 2

# AGENTS.md — PART 3

# Canvas Rendering Engine

This section defines the most important technical subsystem in the project.

The renderer is responsible for transforming an original scene image into a simulated camera output using:

- Exposure
- Aperture
- Shutter Speed
- ISO

The renderer must run entirely in-browser using the Canvas API.

React must NEVER directly manipulate pixels.

React updates state.

Renderer updates pixels.

---

# Rendering Philosophy

Treat the renderer like a virtual camera sensor pipeline.

Real cameras perform image processing internally.

This simulator should mimic that workflow.

Pipeline:

```text
Original Image

↓

Sensor Exposure

↓

Depth Of Field

↓

Motion Blur

↓

ISO Noise

↓

Histogram Analysis

↓

Display Output
```

Each stage is isolated.

Each stage receives:

```ts
ImageData;
```

and returns:

```ts
ImageData;
```

This keeps the architecture clean.

---

# Renderer Entry Point

File:

```text
src/core/renderer/CanvasRenderer.ts
```

Responsibilities:

- Canvas initialization
- Frame rendering
- Image loading
- Pipeline execution
- Overlay drawing

---

# Canvas Structure

Use:

```ts
mainCanvas;
```

visible to user

and

```ts
offscreenCanvas;
```

for processing.

Never repeatedly manipulate the visible canvas directly.

Render flow:

```text
Offscreen Processing

↓

Final Frame

↓

Main Canvas
```

---

# Render Cycle

The renderer should rerender whenever:

```text
aperture changes

iso changes

shutter changes

scene changes

uploaded image changes

info mode changes
```

Avoid continuous animation loops.

Only rerender when needed.

---

# Canvas Resolution

Use:

```ts
1280 × 720
```

internal render size.

Scale to fit LCD viewport.

This provides:

- high quality
- smooth processing
- acceptable performance

---

# Exposure Processor

File:

```text
ExposureProcessor.ts
```

Purpose:

Simulate image brightness.

---

# Exposure Algorithm

Input:

```ts
deltaEV;
```

Convert deltaEV into brightness multiplier.

Use:

```ts
brightness = Math.pow(2, -deltaEV);
```

Examples:

```text
deltaEV = 0

brightness = 1
```

---

```text
deltaEV = 1

brightness = 0.5
```

---

```text
deltaEV = -1

brightness = 2
```

---

# Exposure Clamping

Prevent blown highlights.

Clamp brightness:

```ts
0.1;
```

minimum

```ts
4;
```

maximum

---

# Exposure Pixel Processing

For every pixel:

```ts
r *= brightness;

g *= brightness;

b *= brightness;
```

Clamp:

```ts
0 - 255;
```

---

# Exposure Appearance Goals

Underexposure:

- darker shadows
- visible loss of detail

Overexposure:

- brighter highlights
- visible clipping

Must visually communicate exposure mistakes.

---

# Depth Processor

File:

```text
DepthProcessor.ts
```

Purpose:

Simulate aperture.

---

# Important Note

Real depth of field depends on:

- focal length
- sensor size
- focus distance

We do not have those.

We will create an educational approximation.

---

# Focus Masks

Each built-in scene contains:

```ts
focusMask;
```

Mask format:

```text
white = sharp

black = blurred
```

---

Example

Portrait:

```text
Face

white

Background

black
```

---

# Blur Mapping

Map aperture to blur radius.

| Aperture | Blur Radius |
| -------- | ----------- |
| f/1.4    | 16          |
| f/1.8    | 14          |
| f/2      | 12          |
| f/2.8    | 10          |
| f/4      | 8           |
| f/5.6    | 6           |
| f/8      | 4           |
| f/11     | 3           |
| f/16     | 2           |
| f/22     | 0           |

---

# Blur Strategy

Create:

```text
Original Image

Blurred Image
```

Then blend using mask.

Formula:

```ts
finalPixel = sharpPixel * mask + blurredPixel * (1 - mask);
```

---

# Blur Quality

Use:

```ts
ctx.filter = "blur(px)";
```

on offscreen canvas.

Avoid expensive convolution kernels.

---

# Motion Processor

File:

```text
MotionProcessor.ts
```

Purpose:

Simulate shutter speed.

---

# Motion Blur Mapping

Fast shutter:

```text
1/4000
```

No blur.

Slow shutter:

```text
30s
```

Maximum blur.

---

# Blur Strength Formula

Calculate:

```ts
motionFactor = Math.log2(30 / shutter);
```

Normalize:

```ts
0 → 1
```

---

# Motion Masks

Only some scenes use motion masks.

Examples:

```text
Sports

Runner
```

---

```text
Wildlife

Bird
```

---

```text
Street

Cars
```

---

Areas without motion mask remain sharp.

---

# Motion Blur Technique

Create multiple draws.

Example:

```ts
for (
 i = 0;
 i < samples;
 i++
)
```

Draw image slightly offset.

Blend using alpha.

This creates realistic directional blur.

---

# Motion Directions

Sports:

Horizontal

---

Street:

Horizontal

---

Wildlife:

Diagonal

---

Night City:

Minimal

---

# Noise Processor

File:

```text
NoiseProcessor.ts
```

Purpose:

Simulate ISO grain.

---

# Noise Philosophy

Do NOT create:

```text
TV static
```

Do NOT create:

```text
random RGB pixels
```

Create:

```text
photographic film grain
```

---

# Noise Mapping

| ISO   | Strength |
| ----- | -------- |
| 100   | 0        |
| 200   | 0.02     |
| 400   | 0.04     |
| 800   | 0.08     |
| 1600  | 0.12     |
| 3200  | 0.18     |
| 6400  | 0.24     |
| 12800 | 0.30     |

---

# Noise Algorithm

For every pixel:

Generate:

```ts
grain = (Math.random() - 0.5) * 255 * strength;
```

Apply equally:

```ts
r += grain;

g += grain;

b += grain;
```

Monochrome grain only.

---

# Histogram Processor

File:

```text
HistogramProcessor.ts
```

Purpose:

Generate live luminance histogram.

---

# Histogram Type

Use:

```text
Luminance Histogram
```

not RGB.

---

# Histogram Formula

Luminance:

```ts
0.2126 * r + 0.7152 * g + 0.0722 * b;
```

---

# Histogram Buckets

Create:

```ts
256;
```

buckets.

Each luminance value increments bucket.

---

# Histogram Output

Return:

```ts
number[256];
```

---

# Histogram Rendering

Use lightweight canvas.

Dimensions:

```ts
220 × 100
```

---

# Histogram Appearance

Dark background.

White graph.

Professional camera style.

---

# Live Light Meter

Component:

```text
LightMeter
```

---

# Scale

Display:

```text
-3
-2
-1
0
+1
+2
+3
```

---

# Needle Position

Map:

```ts
deltaEV;
```

to:

```ts
-3 → +3
```

Clamp extremes.

---

# Needle Animation

Animate using:

```ts
requestAnimationFrame;
```

or

```ts
Framer Motion
```

Smooth movement only.

No jumps.

---

# Capture Engine

File:

```text
useCapture.ts
```

---

# Capture Workflow

User presses:

```text
CAPTURE
```

---

System:

1.

Grab final canvas.

---

2.

Generate PNG.

---

3.

Collect metadata.

---

4.

Create Capture object.

---

5.

Save to localStorage.

---

6.

Increment capture counter.

---

# Capture Metadata

Store:

```ts
{
  aperture;
  iso;
  shutter;
  ev;
  adjustedEV;
  deltaEV;
  scene;
  timestamp;
}
```

---

# Before / After View

Playback screen contains:

Left:

Original Image

Right:

Captured Processed Image

---

Below:

Metadata Table

---

# Rendering Performance Rules

Must remain smooth.

---

Avoid:

```text
new Image()

every frame
```

---

Cache images.

---

Reuse canvases.

---

Reuse imageData buffers.

---

Throttle histogram updates.

---

Maximum histogram frequency:

```ts
10fps
```

---

# Memory Rules

Destroy unused image references.

Clear temporary canvases.

Avoid memory leaks.

---

# Error Handling

Renderer failures must never crash UI.

If render fails:

Display:

```text
Renderer Error

Reload Scene
```

inside LCD screen.

---

# Testing Requirements

Verify:

Exposure Changes

✔

---

Histogram Updates

✔

---

Blur Works

✔

---

Noise Works

✔

---

Playback Works

✔

---

Custom Upload Works

✔

---

Challenge Mode Works

✔

---

No Console Errors

✔

---

# End of Part 3

# AGENTS.md — PART 4

# User Interface System

This section defines the complete UI architecture.

The goal is NOT to build a photography dashboard.

The goal is to build a virtual camera.

Users should feel like they are operating a real mirrorless camera.

The interface must resemble the rear side of a Sony A7 IV-inspired camera.

Do not directly copy Sony assets.

Do not use Sony logos.

Use Sony-like ergonomics and layout only.

---

# Global Design Principles

The LCD screen is the hero.

Everything else supports the LCD.

Visual importance:

```text
1. Camera Screen

2. Control Wheel

3. Light Meter

4. Telemetry

5. Camera Buttons

6. Camera Body
```

---

# Application Layout

Root Component:

```text
CameraBody
```

Contains:

```text
CameraBody

├── EVF
├── CameraButtons
├── CameraScreen
├── ControlWheel
├── StatusStrip
└── OverlayLayer
```

---

# Full Screen Usage

Application occupies:

```text
100vw
100vh
```

No scrolling.

No page transitions.

Single application surface.

---

# Camera Body

Component:

```text
CameraBody
```

Purpose:

Render physical camera shell.

---

# Camera Body Dimensions

Use:

```text
Width:
90vw

Height:
90vh
```

Max Width:

```text
1600px
```

Max Height:

```text
1000px
```

---

# Camera Body Styling

Color:

```text
#1f1f1f
```

Primary.

---

Secondary:

```text
#2b2b2b
```

---

Highlights:

```text
#444444
```

---

Use:

- subtle gradients
- subtle shadows
- rounded corners

Avoid:

- bright colors
- glossy plastic
- gaming aesthetic

---

# EVF Component

Electronic Viewfinder.

Top center.

Small rectangular element.

Purpose:

Realism.

---

Contains:

```text
EVF
```

label.

Minimal styling.

No functionality required.

---

# Camera Screen Component

Component:

```text
CameraScreen
```

Most important component.

---

Position:

Center.

---

Size:

```text
70%
```

of camera body width.

---

Aspect Ratio:

```text
16:9
```

---

Contains:

```text
RenderCanvas

Histogram

LightMeter

Grid

Telemetry

OverlayMessages
```

---

# Screen Border

Use:

```text
dark matte bezel
```

around LCD.

Thickness:

```text
10px
```

approximately.

---

# LCD Appearance

Background:

```text
black
```

when loading.

---

Add subtle:

```text
screen glow
```

effect.

Very mild.

---

# Overlay Layer System

Overlays appear on top of image.

Never outside LCD.

---

Supported overlays:

```text
Histogram

Light Meter

Grid

Telemetry

Challenge

Notifications
```

---

# Histogram Placement

Top Right.

Size:

```text
220px × 100px
```

---

Appearance:

Dark background.

White graph.

Opacity:

```text
90%
```

---

# Light Meter Placement

Bottom Center.

Style:

Real DSLR meter.

---

Display:

```text
-3
-2
-1
0
+1
+2
+3
```

Needle centered.

---

Needle color:

```text
white
```

---

When perfect exposure:

Needle centered on:

```text
0
```

---

# Grid Overlay

Rule of Thirds.

3 vertical lines.

3 horizontal lines.

---

Color:

```text
rgba(
255,
255,
255,
0.25
)
```

---

Toggleable.

---

# Telemetry Panel

Position:

Top Left.

---

Display:

```text
f/2.8

1/125

ISO 400

EV 10.2

Target EV 10

ΔEV -0.2
```

---

Appearance:

Professional camera OSD.

White text.

Semi-transparent black background.

---

# Overlay Notifications

Temporary messages.

Examples:

```text
Capture Saved

Profile Loaded

Challenge Complete

Image Uploaded
```

---

Display duration:

```text
2 seconds
```

---

Animate in/out.

---

# Camera Buttons

Component:

```text
CameraButtons
```

Position:

Left side of body.

Vertical stack.

---

Buttons:

```text
MENU

INFO

PLAY

DELETE

CAPTURE
```

---

Button Styling

Appearance:

Physical camera buttons.

---

Color:

```text
#2d2d2d
```

---

Hover:

```text
#3a3a3a
```

---

Active:

```text
#555555
```

---

Animation:

Physical press effect.

---

Press Depth:

```text
2px
```

---

# MENU Button

Opens:

```text
MenuOverlay
```

---

# INFO Button

Cycles display modes.

Mode 1:

Image only

---

Mode 2:

Image + Histogram

---

Mode 3:

Image + Histogram + Telemetry

---

Mode 4:

Full Information

---

# PLAY Button

Opens playback gallery.

---

# DELETE Button

Deletes selected capture.

Require confirmation.

---

# CAPTURE Button

Triggers:

Capture workflow.

---

Animation:

Camera flash effect.

Subtle.

---

# Control Wheel

Component:

```text
ControlWheel
```

Position:

Right side.

Large circular wheel.

---

Purpose:

Primary camera interaction.

---

Wheel Diameter

```text
180px
```

approximately.

---

Appearance

Dark metal.

Textured ring.

Center button.

---

Wheel Behavior

Mouse wheel support.

Drag support.

Click support.

---

# Parameter Selector

Above wheel.

Three options:

```text
APERTURE

SHUTTER

ISO
```

---

Selected option highlighted.

---

Changing parameter:

Wheel rotates to stored position.

---

Example

Current:

```text
ISO 800
```

Switch to Aperture.

Wheel animates to:

```text
f/2.8
```

position.

---

Switch back.

Wheel returns to ISO position.

---

# Wheel Interaction

Rotate Right:

Increase parameter.

---

Rotate Left:

Decrease parameter.

---

Smooth animation required.

---

# Status Strip

Bottom of camera body.

Purpose:

Camera feedback.

---

Display:

```text
Scene

Exposure Status

Capture Count

System Time
```

---

Example:

```text
Portrait

Correct Exposure

12 Captures

14:32:15
```

---

# Boot Screen

Component:

```text
BootScreen
```

---

Displayed on startup.

Duration:

```text
2500ms
```

---

Sequence:

```text
MANUAL EXPOSURE SIMULATOR

Initializing Sensor...

Loading Scene Profiles...

Calibrating Light Meter...

Preparing Live View...

READY
```

---

Fade into camera.

---

# Menu Overlay

Component:

```text
MenuOverlay
```

---

Fullscreen overlay above camera.

Dark translucent background.

---

Menu Sections

```text
Scenes

Profiles

Upload Image

Challenge Mode

Settings

About
```

---

# Scene Menu

Display cards.

Each card:

```text
Scene Thumbnail

Scene Name

Target EV

Description
```

---

Selecting card:

Switch scene.

Close menu.

---

# Upload Menu

Allow:

```text
JPG

PNG

WEBP
```

---

Preview uploaded image.

---

Apply immediately.

---

# Profiles Menu

Saved camera settings.

Each profile:

```text
Name

Aperture

ISO

Shutter
```

---

Options:

```text
Load

Delete
```

---

# About Menu

Explain:

```text
Exposure Triangle

Aperture

ISO

Shutter Speed

EV
```

---

Educational content.

---

# Playback Overlay

Component:

```text
PlaybackOverlay
```

---

Purpose:

Review captures.

---

Layout

Left:

Original image.

---

Right:

Captured image.

---

Bottom:

Metadata panel.

---

Metadata Fields

```text
Scene

Aperture

ISO

Shutter

EV

Adjusted EV

Exposure Difference

Timestamp
```

---

Navigation

Previous

Next

Delete

Close

---

# Challenge Overlay

Component:

```text
ChallengeOverlay
```

---

Display:

```text
Target Scene

Target EV

Current EV
```

---

Live update.

---

When completed:

Show:

```text
PERFECT

GOOD

PASS
```

---

Display stars.

---

3 Stars

Perfect.

---

2 Stars

Good.

---

1 Star

Pass.

---

# Animations

Use:

```text
Framer Motion
```

---

Allowed animations:

Fade.

Scale.

Slide.

Wheel rotation.

Needle movement.

---

Avoid:

Fancy page transitions.

Excessive motion.

---

# Typography

Problem statement requires:

```text
Times New Roman
```

---

Use:

```css
font-family: "Times New Roman", serif;
```

globally.

---

Base Size

```text
12pt
```

where PS requires.

---

Camera overlays may use:

```text
11–14pt
```

for readability.

---

# Accessibility

Keyboard shortcuts.

---

M:

Menu

---

I:

Info

---

P:

Playback

---

C:

Capture

---

Arrow Left:

Decrease selected parameter.

---

Arrow Right:

Increase selected parameter.

---

# Final UI Goal

When the application opens, evaluators should immediately think:

```text
This feels like operating
a real camera.
```

not:

```text
This feels like a React assignment.
```

# End of Part 4

# AGENTS.md — PART 5

# Implementation Roadmap

This section defines the exact order in which the application should be built.

Follow this order strictly.

Do not jump ahead.

Do not start polishing before core functionality exists.

---

# Phase 1

Project Foundation

Goal:

Create working React application structure.

Tasks:

- Create Vite React TypeScript project
- Configure CSS Modules
- Install Zustand
- Install Framer Motion
- Create folder structure
- Create global styles
- Create constants
- Create TypeScript interfaces

Completion Criteria:

```text id="w9j0wa"
Application compiles

No TypeScript errors

Folder structure complete

Stores created
```

---

# Phase 2

Camera State System

Goal:

Create complete camera logic.

Tasks:

- Build cameraStore
- Build sceneStore
- Build galleryStore
- Build challengeStore
- Build uiStore

Implement:

- aperture updates
- ISO updates
- shutter updates
- EV calculations

Completion Criteria:

```text id="1dyjpm"
Changing settings updates EV correctly

State persists

No UI required yet
```

---

# Phase 3

Exposure Engine

Goal:

Implement photography mathematics.

Tasks:

- calculateEV
- adjustedEV
- deltaEV
- exposure status

Verification:

Known camera values should produce expected EV values.

---

# Phase 4

Canvas Renderer

Goal:

Display images.

Tasks:

- initialize canvas
- load scenes
- display scene

Verification:

```text id="ym9wgu"
Scene image visible

Canvas scales correctly

No visual artifacts
```

---

# Phase 5

Exposure Processing

Goal:

Brightness simulation.

Tasks:

- implement ExposureProcessor
- connect EV difference
- render exposure changes

Verification:

```text id="s5k3oe"
Underexposed images darker

Overexposed images brighter

Transition smooth
```

---

# Phase 6

Depth Of Field Processing

Goal:

Aperture simulation.

Tasks:

- implement focus masks
- create blur engine
- map blur to aperture

Verification:

```text id="u4d7m7"
f/1.4 visibly blurred

f/22 nearly sharp
```

---

# Phase 7

Motion Blur Processing

Goal:

Shutter simulation.

Tasks:

- implement directional blur
- support motion masks
- map blur strength

Verification:

```text id="7lff2j"
Sports scene clearly demonstrates motion blur
```

---

# Phase 8

ISO Noise Processing

Goal:

Noise simulation.

Tasks:

- create grain generator
- map grain to ISO

Verification:

```text id="hjlwm8"
ISO 100 nearly clean

ISO 12800 visibly noisy
```

---

# Phase 9

Histogram

Goal:

Professional camera histogram.

Tasks:

- calculate luminance
- generate histogram
- render histogram

Verification:

```text id="a0e4q7"
Histogram changes with exposure
```

---

# Phase 10

Light Meter

Goal:

Implement DSLR exposure meter.

Tasks:

- build scale
- animate needle
- connect deltaEV

Verification:

```text id="h8v4dm"
Needle tracks exposure correctly
```

---

# Phase 11

Camera Body UI

Goal:

Build Sony-inspired shell.

Tasks:

- EVF
- body
- LCD frame
- buttons
- control wheel

Verification:

```text id="ikq6fd"
Application visually resembles camera
```

---

# Phase 12

Control Wheel

Goal:

Primary interaction method.

Tasks:

- wheel rotation
- parameter switching
- value updates

Verification:

```text id="3y8kpn"
Wheel controls all camera settings
```

---

# Phase 13

Menu System

Goal:

Scene management.

Tasks:

- menu overlay
- scene selection
- upload image

Verification:

```text id="vkv9tr"
All scenes switch correctly
```

---

# Phase 14

Capture System

Goal:

Store photographs.

Tasks:

- capture canvas
- save metadata
- save image

Verification:

```text id="aqrygh"
Capture persists after refresh
```

---

# Phase 15

Playback System

Goal:

Review images.

Tasks:

- gallery UI
- image comparison
- metadata display

Verification:

```text id="g2ub89"
Saved captures can be reviewed
```

---

# Phase 16

Challenge Mode

Goal:

Educational game.

Tasks:

- challenge generation
- EV target
- scoring

Verification:

```text id="4v1mvr"
Challenge evaluates correctly
```

---

# Phase 17

Boot Sequence

Goal:

Professional startup experience.

Verification:

```text id="lz8eqw"
Camera startup feels polished
```

---

# Phase 18

Polish

Goal:

Final refinement.

Tasks:

- transitions
- animations
- performance tuning
- visual consistency

---

# Performance Targets

Target:

```text id="v8j2y7"
60 FPS
```

during interaction.

---

Histogram:

```text id="mq8i3o"
10 FPS maximum
```

---

Render Time:

```text id="vr4t0j"
< 50ms
```

per update.

---

# Acceptance Criteria

The project is complete only if ALL conditions are satisfied.

---

# Core Photography Features

Must demonstrate:

```text id="44vmm0"
Aperture

Shutter Speed

ISO
```

visually.

---

Must calculate:

```text id="kkmr7z"
EV

Adjusted EV

Exposure Difference
```

correctly.

---

Must include:

```text id="p4qdfv"
Histogram

Light Meter

Telemetry
```

---

# UI Requirements

Must feel like camera.

Must NOT feel like dashboard.

Must include:

```text id="xjlwmf"
Camera Body

LCD Screen

Buttons

Control Wheel
```

---

# Storage Requirements

Must persist:

```text id="jjv8nn"
Settings

Profiles

Captures
```

through refresh.

---

# Upload Requirements

User must be able to:

```text id="z3rppq"
Upload Image

Apply Effects

Capture Result
```

---

# Playback Requirements

Must show:

```text id="l3j7hz"
Original Image

Processed Image

Metadata
```

simultaneously.

---

# Challenge Requirements

Must:

```text id="mjlwm0"
Generate Target EV

Evaluate User

Provide Score
```

---

# Visual Quality Requirements

Must look:

```text id="2kafeb"
Professional

Clean

Photography-focused
```

---

Must avoid:

```text id="hfzjga"
Student Project Look

Bootstrap Look

Admin Dashboard Look
```

---

# Coding Requirements

No TypeScript errors.

No ESLint errors.

No console errors.

No warnings.

No unused variables.

No dead code.

---

# File Organization Requirements

All logic:

```text id="3i1klj"
core/
stores/
hooks/
```

---

All UI:

```text id="onrtpq"
components/
```

---

No business logic inside UI components.

---

# Local Storage Schema

camera_settings

```json id="dbz80m"
{
  "aperture": 2.8,
  "iso": 400,
  "shutter": 0.008
}
```

---

camera_profiles

```json id="o0hgsf"
[
  {
    "name": "Portrait",
    "aperture": 2,
    "iso": 100,
    "shutter": 0.008
  }
]
```

---

camera_captures

```json id="3s6dzf"
[
  {
    "id": "...",
    "imageData": "...",
    "metadata": {}
  }
]
```

---

# Stretch Goals

Implement only if core project is complete.

---

# Feature 1

Exposure Assistant

Provides hints:

```text id="0w7zsp"
Too Dark

Increase ISO

or

Slow Shutter
```

---

# Feature 2

Photography Lessons

Small educational panel.

---

# Feature 3

Scene Recommendations

Example:

```text id="ns5ynq"
Sports

Suggested:
1/1000
f/4
ISO 400
```

---

# Feature 4

Exposure Warning

Display:

```text id="qfsk6j"
OVEREXPOSED
```

or

```text id="m3eh92"
UNDEREXPOSED
```

inside LCD.

---

# Feature 5

Live EV Graph

Display EV history.

---

# Definition Of Done

Project is DONE when:

✔ Camera boots

✔ Camera body visible

✔ LCD screen operational

✔ Scene switching works

✔ Exposure simulation works

✔ Aperture simulation works

✔ Motion blur works

✔ ISO noise works

✔ Histogram works

✔ Light meter works

✔ Telemetry works

✔ Upload works

✔ Capture works

✔ Playback works

✔ Challenge mode works

✔ Local storage works

✔ No TypeScript errors

✔ No console errors

✔ UI resembles professional camera

✔ Educational objectives achieved

✔ Entire application runs locally with no backend

---

# Final Directive To Codex

Do not simplify this project into sliders and images.

Build a virtual camera.

Every design decision should reinforce the feeling that the user is operating a real photographic device.

The LCD screen is the hero.

The camera body supports the experience.

The purpose of the application is not merely to calculate exposure values.

The purpose is to teach photography through interaction, visual feedback, and simulation.

# END OF AGENTS.MD
