/* src/core/renderer/CanvasRenderer.ts */
import { processExposure } from "./ExposureProcessor";
import { getBlurRadius, processDepthOfField } from "./DepthProcessor";
import { getMotionBlurStrength, processMotionBlur } from "./MotionProcessor";
import { processNoise } from "./NoiseProcessor";
import { calculateLuminanceHistogram } from "./HistogramProcessor";
import type { Scene } from "../../types/scene";

export class CanvasRenderer {
  private mainCanvas: HTMLCanvasElement | null = null;
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D;

  private sharpCanvas: HTMLCanvasElement;
  private sharpCtx: CanvasRenderingContext2D;

  private blurredCanvas: HTMLCanvasElement;
  private blurredCtx: CanvasRenderingContext2D;

  private motionCanvas: HTMLCanvasElement;
  private motionCtx: CanvasRenderingContext2D;

  private maskCanvas: HTMLCanvasElement;
  private maskCtx: CanvasRenderingContext2D;

  private imageCache: Map<string, HTMLImageElement> = new Map();
  private currentScene: Scene | null = null;
  private isLoaded: boolean = false;

  constructor() {
    // 1280x720 internal rendering resolution
    const W = 1280;
    const H = 720;

    this.offscreenCanvas = document.createElement("canvas");
    this.offscreenCanvas.width = W;
    this.offscreenCanvas.height = H;
    this.offscreenCtx = this.offscreenCanvas.getContext("2d", { willReadFrequently: true })!;

    this.sharpCanvas = document.createElement("canvas");
    this.sharpCanvas.width = W;
    this.sharpCanvas.height = H;
    this.sharpCtx = this.sharpCanvas.getContext("2d", { willReadFrequently: true })!;

    this.blurredCanvas = document.createElement("canvas");
    this.blurredCanvas.width = W;
    this.blurredCanvas.height = H;
    this.blurredCtx = this.blurredCanvas.getContext("2d", { willReadFrequently: true })!;

    this.motionCanvas = document.createElement("canvas");
    this.motionCanvas.width = W;
    this.motionCanvas.height = H;
    this.motionCtx = this.motionCanvas.getContext("2d", { willReadFrequently: true })!;

    this.maskCanvas = document.createElement("canvas");
    this.maskCanvas.width = W;
    this.maskCanvas.height = H;
    this.maskCtx = this.maskCanvas.getContext("2d", { willReadFrequently: true })!;
  }

  public setMainCanvas(canvas: HTMLCanvasElement | null) {
    this.mainCanvas = canvas;
    if (canvas && this.isLoaded && this.currentScene) {
      this.drawToMain();
    }
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    if (this.imageCache.has(src)) {
      return Promise.resolve(this.imageCache.get(src)!);
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        this.imageCache.set(src, img);
        resolve(img);
      };
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }

  public async prepareScene(scene: Scene): Promise<void> {
    this.isLoaded = false;
    this.currentScene = scene;

    try {
      // Load scene image
      await this.loadImage(scene.image);

      // Load masks if present and are actual URLs
      if (scene.focusMask && scene.focusMask !== "generate-radial") {
        await this.loadImage(scene.focusMask);
      }
      if (scene.motionMask && scene.motionMask !== "generate-black") {
        await this.loadImage(scene.motionMask);
      }

      this.isLoaded = true;
    } catch (error) {
      console.error("Error preparing scene assets", error);
      throw error;
    }
  }

  // Generate programmatic masks on maskCanvas
  private drawFocusMask(scene: Scene): ImageData {
    const W = 1280;
    const H = 720;
    this.maskCtx.fillStyle = "#ffffff"; // Default background is white (blurred)
    this.maskCtx.fillRect(0, 0, W, H);

    if (scene.focusMask === "generate-radial" || !scene.focusMask) {
      // Center oval focus (custom upload focus mask)
      const grad = this.maskCtx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, 400);
      grad.addColorStop(0, "#000000"); // Center is sharp (black)
      grad.addColorStop(1, "#ffffff"); // Edges are blurred (white)
      this.maskCtx.fillStyle = grad;
      this.maskCtx.fillRect(0, 0, W, H);
    } else {
      // Draw loaded mask image
      const maskImg = this.imageCache.get(scene.focusMask);
      if (maskImg) {
        this.maskCtx.drawImage(maskImg, 0, 0, W, H);
      }
    }
    return this.maskCtx.getImageData(0, 0, W, H);
  }

  private drawMotionMask(scene: Scene): ImageData {
    const W = 1280;
    const H = 720;
    this.maskCtx.fillStyle = "#000000"; // Default is black (unaffected/sharp)
    this.maskCtx.fillRect(0, 0, W, H);

    if (scene.motionMask && scene.motionMask !== "generate-black") {
      const maskImg = this.imageCache.get(scene.motionMask);
      if (maskImg) {
        this.maskCtx.drawImage(maskImg, 0, 0, W, H);
      }
    }
    return this.maskCtx.getImageData(0, 0, W, H);
  }

  public render(
    aperture: number,
    iso: number,
    shutter: number,
    deltaEV: number
  ): number[] | null {
    if (!this.isLoaded || !this.currentScene) return null;

    const W = 1280;
    const H = 720;

    const sceneImg = this.imageCache.get(this.currentScene.image);
    if (!sceneImg) return null;

    // --- PIPELINE STAGE 1: Draw original image to sharpCanvas ---
    this.sharpCtx.clearRect(0, 0, W, H);
    this.sharpCtx.drawImage(sceneImg, 0, 0, W, H);

    // --- PIPELINE STAGE 2: Depth of Field (Aperture) ---
    const blurRadius = getBlurRadius(aperture);
    if (blurRadius > 0) {
      this.blurredCtx.clearRect(0, 0, W, H);
      this.blurredCtx.filter = `blur(${blurRadius}px)`;
      this.blurredCtx.drawImage(sceneImg, 0, 0, W, H);
      this.blurredCtx.filter = "none"; // reset

      const sharpData = this.sharpCtx.getImageData(0, 0, W, H);
      const blurredData = this.blurredCtx.getImageData(0, 0, W, H);
      const focusMaskData = this.drawFocusMask(this.currentScene);
      
      const dofData = this.sharpCtx.createImageData(W, H);
      processDepthOfField(sharpData, blurredData, focusMaskData, dofData);
      
      // Put the DOF blended image back onto sharpCanvas
      this.sharpCtx.putImageData(dofData, 0, 0);
    }

    // --- PIPELINE STAGE 3: Motion Blur (Shutter Speed) ---
    const { samples, offset } = getMotionBlurStrength(shutter);
    if (offset > 0 && this.currentScene.motionDirection !== "none") {
      this.motionCtx.clearRect(0, 0, W, H);
      
      // Render multi-draw directional offset blur
      this.motionCtx.globalAlpha = 1.0 / samples;
      const dir = this.currentScene.motionDirection || "horizontal";
      
      for (let i = 0; i < samples; i++) {
        // Spread draw offsets centered around 0
        const step = (i - (samples - 1) / 2) * (offset / samples);
        let dx = 0;
        let dy = 0;

        if (dir === "horizontal") {
          dx = step;
        } else if (dir === "vertical") {
          dy = step;
        } else if (dir === "diagonal") {
          dx = step * 0.707;
          dy = step * 0.707;
        }

        this.motionCtx.drawImage(this.sharpCanvas, dx, dy, W, H);
      }
      this.motionCtx.globalAlpha = 1.0; // reset

      // Blend motion blur only into motion mask regions
      const sharpData = this.sharpCtx.getImageData(0, 0, W, H);
      const motionData = this.motionCtx.getImageData(0, 0, W, H);
      const motionMaskData = this.drawMotionMask(this.currentScene);

      const motionBlended = this.sharpCtx.createImageData(W, H);
      processMotionBlur(sharpData, motionData, motionMaskData, motionBlended);
      
      this.sharpCtx.putImageData(motionBlended, 0, 0);
    }

    // --- PIPELINE STAGE 4: Exposure and ISO Noise ---
    const finalData = this.sharpCtx.getImageData(0, 0, W, H);
    
    // Apply exposure brightness compensation
    processExposure(finalData, deltaEV);
    
    // Apply procedural film grain
    processNoise(finalData, iso);

    // Write final pixel output buffer to offscreenCanvas
    this.offscreenCtx.putImageData(finalData, 0, 0);

    // --- PIPELINE STAGE 5: Histogram Analysis ---
    const histogram = calculateLuminanceHistogram(finalData);

    // --- PIPELINE STAGE 6: Draw to main visible canvas ---
    this.drawToMain();

    return histogram;
  }

  private drawToMain() {
    if (!this.mainCanvas) return;
    const ctx = this.mainCanvas.getContext("2d");
    if (!ctx) return;
    
    // Scale to fit main canvas (1280x720 -> viewport)
    ctx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);
    ctx.drawImage(
      this.offscreenCanvas,
      0,
      0,
      this.offscreenCanvas.width,
      this.offscreenCanvas.height,
      0,
      0,
      this.mainCanvas.width,
      this.mainCanvas.height
    );
  }

  public getCaptureDataURL(): string {
    return this.offscreenCanvas.toDataURL("image/png");
  }
}
