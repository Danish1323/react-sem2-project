# PROJECT EVALUATION REPORT (LISA DOCUMENTATION)

---

## 🎓 STUDENT DETAILS
*   **Student Name:** Danish Shaikh
*   **Roll Number:** 150096725147
*   **Course / Program:** B.Tech Computer Science and Engineering
*   **Subject:** React JS
*   **Batch / Cohort:** 2025-29 / Jeff Bezos
*   **Project Number:** 186
*   **Project Title:** Photography Camera Manual Exposure Simulator

---

## 📋 1. PROBLEM STATEMENT

### Project Overview & Educational Objective
Mastering manual camera exposure is a classic challenge for beginner photographers. The core objective of this project is to construct a professional-grade ReactJS web application that simulates a real mirrorless DSLR camera (inspired by the ergonomics and layout of the Sony A7 IV) to teach users the interplay within the **Exposure Triangle** (Aperture, Shutter Speed, and ISO).

The application evaluates setting configurations in-memory with zero network latency, dynamically modeling how shifts in the camera sensor parameters alter:
1.  **Exposure / Brightness** (image brightness multiplier)
2.  **Depth of Field** (radial focal blur mapping)
3.  **Motion Blur** (shutter duration streaking)
4.  **Sensor Noise** (logarithmic ISO film grain)

### Key Educational Goals
*   **Interactiveness:** The simulator must feel like operating a physical device, utilizing command buttons and rotary scroll/drag dials rather than an standard web administrative dashboard.
*   **Scientific Accuracy:** The simulated sensor output must run entirely client-side using custom Canvas rendering pipelines, applying real camera physics formulas reactively.
*   **Gamified Validation:** Users must test their skills via a Challenge Mode that evaluates settings against ambient light targets and scores them with stars.

---

## 🛠️ 2. TECHNOLOGY STACK

The project is built entirely client-side as a high-performance single page application (SPA):

*   **Core Framework:** React 18 (TypeScript)
*   **Build Tool & Dev Server:** Vite
*   **State Management:** Zustand (for reactive, decoupled state tracking)
*   **Image Processing Engine:** HTML5 Canvas API (ImageData pixel buffer arrays)
*   **Styling & Theme:** Vanilla CSS Modules (Graphite Matte DSLR layout)
*   **Accessibility & Interactivity:** Keyboard listeners, Mouse dragging, and Scroll-wheel wheel event listeners.
*   **Animations:** Framer Motion (used for dial cylinders and needle sweeps)

---

## 🏛️ 3. COMPONENT ARCHITECTURE

The UI represents the rear casing of a DSLR mirrorless camera. The centerpiece structure splits the layout cleanly between configurations (sliders, action bar) and rendering overlays:

```text
CameraBody (DSLR graphite outer chassis)
 ├── TopPlate (silver shutter button, dial plates, hot shoe mount)
 ├── CameraButtons (Left vertical mechanical menu controls: MENU, INFO, PLAY, DELETE, CAPTURE)
 ├── ControlWheel (Right interactive dial; rotates and animates to parameter angles)
 └── CameraStage (Center Column Organizer)
       ├── EVF (Electronic Viewfinder decorative plate)
       ├── CameraScreen (LCD Viewport Glass Bezel)
       │     ├── LiveViewFinderCanvas (Core viewport drawing raw canvas buffers, warnings, and flash)
       │     ├── CameraTelemetryHUD (OSD telemetry stats: EV, adjusted EV, DoF, latency, noise coeff)
       │     ├── LightMeterScaleDisplay (Analog light meter slider)
       │     ├── Histogram (Real-time luminance bin visualizer)
       │     ├── MenuOverlay (Scenes, profiles list, file upload, and lessons tabs)
       │     ├── PlaybackOverlay (Before/After side-by-side gallery viewer)
       │     └── ChallengeOverlay (Mini-game target scorer)
       └── StatusStrip (Bottom OSD dashboard showing clock, capture counts, and exposure status)
```

### State Management Separation (Zustand Stores)
*   `useCameraStore`: Holds states for Aperture, Shutter, ISO, EV values, and Dial rotation angles.
*   `useSceneStore`: Tracks the active photo scene, mask URLs, and uploaded base64 image strings.
*   `useUIStore`: Manages overlay visibility flags (Menu, Playback, Challenge), OSD Info modes, and shutter click events.
*   `useGalleryStore`: Manages captured snapshot list arrays persisted inside browser local storage.
*   `useChallengeStore`: Manages target EV parameters, challenge outcomes, and star rankings.

---

## 🚀 4. CORE FEATURES & LOGIC ENGINES

### 1. Exposure Triangle Mathematical Compiler
Exposure is compiled reactively from standard logarithmic stops:
1.  **Base EV:** $EV = \log_2(N^2 / t)$ (where $N = \text{Aperture}$, $t = \text{Shutter speed}$)
2.  **Adjusted Sensitivity:** $\text{adjustedEV} = EV - \log_2(\text{ISO} / 100)$
3.  **Exposure Difference:** $\Delta EV = \text{targetEV} - \text{adjustedEV}$
4.  **Brightness Scaling:** $\text{multiplier} = 2^{\Delta EV}$ (clamped between $0.1$ and $4.0$ to prevent clipping)

### 2. Canvas Sensor Rendering Pipeline
Every parameter shift triggers the virtual camera sensor pipeline:
*   **DoF Blur:** Blends blurred and sharp canvases using scene focus masks:
    $$\text{Pixel} = \text{sharp} \times (1 - \text{mask}) + \text{blurred} \times \text{mask}$$
*   **Motion Blur:** Computes kinetic vectors and renders multi-draw stamps offset along the horizontal or diagonal plane in motion-mask regions.
*   **ISO Grain:** Generates monochrome noise vectors on image buffers based on ISO strength.
*   **Luminance Histogram:** Traverses the output ImageData buffer, computes luminance values $(0.2126R + 0.7152G + 0.0722B)$, increments a 256-bucket array, and draws the graph.

### 3. Settings Profiles & LocalStorage Sync
*   Snapshots and custom named settings profiles (e.g. "Sunset Setup") are automatically stringified and saved to `localStorage` via `localStorageManager.ts` to survive browser refreshes.

---

## 📸 5. INTERFACE SCREENSHOTS

*(Below are relative references to the screenshots generated from the running application:)*

### 1. Bios Boot Calibration
![Boot Screen](src/assets/screenshot_boot.png)

### 2. Viewfinder View & Settings Console Overlay
![Main Viewfinder HUD](src/assets/screenshot_main.png)

### 3. Camera Menu System
![Menu System Panel](src/assets/screenshot_menu.png)

### 4. Photo Playback Compare Grid
![Playback comparison](src/assets/screenshot_playback.png)

### 5. Challenge Evaluator
![Challenge Mode](src/assets/screenshot_challenge.png)

---

## 🔗 6. PROJECT SUBMISSION LINKS

*   **GitHub Repository URL:** [https://github.com/Danish1323/react-sem2-project](https://github.com/Danish1323/react-sem2-project)
*   **Vercel Production Deployment URL:** [https://react-project-cyan-iota.vercel.app](https://react-project-cyan-iota.vercel.app)

---

## 📝 7. CONCLUSION & LEARNING OUTCOMES

By building the **Manual Exposure Simulator** like an interactive product rather than a simple static page, several core concepts were mastered:

1.  **State Management (Zustand):** Separating business logic (exposure calculations, dial cylinder angles) from React rendering logic prevented redundant component renders and maintained 60 FPS performance.
2.  **Canvas Image Processing:** Gained deep experience manipulating raw image buffers, creating custom blending techniques with grayscale alpha masks, implementing multi-stamp motion trails, and computing real-time luminance histograms client-side.
3.  **Tactile User Experience:** Mapping arrow keys, scroll-wheels, mouse-drags, and range sliders to identical state values created a responsive control layout mirroring a physical Sony mirrorless camera.
4.  **Browser Persistence & Local Storage:** Managed a reliable client-side caching mechanism to ensure captures, challenge completion records, and customized settings profiles are persisted.
5.  **Vite + Vercel Deployment:** Configured Vite compiler presets to successfully build TSX and asset chunks, establishing a clean build pipeline deployed live onto Vercel.
