/* src/hooks/useRenderer.ts */
import { useEffect, useRef, useState } from "react";
import { CanvasRenderer } from "../core/renderer/CanvasRenderer";
import { useCameraStore } from "../stores/cameraStore";
import { useSceneStore } from "../stores/sceneStore";

export function useRenderer(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const aperture = useCameraStore((state) => state.aperture);
  const iso = useCameraStore((state) => state.iso);
  const shutter = useCameraStore((state) => state.shutter);
  const deltaEV = useCameraStore((state) => state.deltaEV);
  const activeScene = useSceneStore((state) => state.activeScene);

  const [histogram, setHistogram] = useState<number[]>(new Array(256).fill(0));
  const [renderError, setRenderError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const rendererRef = useRef<CanvasRenderer | null>(null);
  const lastHistogramTimeRef = useRef<number>(0);

  // Initialize renderer once
  useEffect(() => {
    rendererRef.current = new CanvasRenderer();
    return () => {
      rendererRef.current = null;
    };
  }, []);

  // Update canvas reference in renderer
  useEffect(() => {
    if (rendererRef.current) {
      rendererRef.current.setMainCanvas(canvasRef.current);
    }
  }, [canvasRef]);

  // Load new scene assets and perform initial render
  useEffect(() => {
    let active = true;
    if (!rendererRef.current) return;

    const loadAndDraw = async () => {
      setLoading(true);
      setRenderError(null);
      try {
        await rendererRef.current!.prepareScene(activeScene);
        if (!active) return;

        const startTime = performance.now();
        const hist = rendererRef.current!.render(aperture, iso, shutter, deltaEV);
        const endTime = performance.now();
        useCameraStore.getState().setLatencyMs(endTime - startTime);

        if (hist) {
          setHistogram(hist);
        }
      } catch (err: any) {
        console.error("Renderer load error:", err);
        setRenderError("Renderer Error: Reload Scene");
      } finally {
        setLoading(false);
      }
    };

    loadAndDraw();

    return () => {
      active = false;
    };
  }, [activeScene]);

  // Re-render when camera parameters change
  useEffect(() => {
    if (!rendererRef.current || loading) return;

    try {
      const startTime = performance.now();
      const hist = rendererRef.current.render(aperture, iso, shutter, deltaEV);
      const endTime = performance.now();
      useCameraStore.getState().setLatencyMs(endTime - startTime);

      if (hist) {
        const now = performance.now();
        // Throttle histogram updates to 10 FPS (100ms)
        if (now - lastHistogramTimeRef.current >= 100) {
          setHistogram(hist);
          lastHistogramTimeRef.current = now;
        }
      }
    } catch (err) {
      console.error("Render processing error:", err);
      setRenderError("Renderer Error: Reload Scene");
    }
  }, [aperture, iso, shutter, deltaEV, loading]);

  return {
    histogram,
    renderError,
    loading,
    rendererInstance: rendererRef.current
  };
}
