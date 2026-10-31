"use client";
import { useEffect, useRef } from "react";
import { drawWorld } from "./draw-world";
import { journeyProgress } from "./world-model";
import styles from "./PixelWorld.module.css";

function getInitialMotion(): boolean {
  if (typeof window === "undefined") return true;
  const stored = localStorage.getItem("motion");
  if (stored === "paused") return false;
  if (stored === "running") return true;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PixelWorld() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current,
      ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    let width = 0,
      height = 0,
      pageHeight = 0,
      viewportHeight = 0,
      frame = 0,
      lastFrame = 0,
      clock = 0;
    let isAnimated = getInitialMotion();

    function render() {
      if (!canvas || !ctx) return;
      const progress = journeyProgress(
        window.scrollY,
        pageHeight,
        viewportHeight,
      );
      drawWorld(ctx, width, height, progress, clock);
      canvas.dataset.progress = progress.toFixed(3);
    }
    const FRAME_INTERVAL = 1000 / 24;
    function tick(now: number) {
      const elapsed = now - lastFrame;
      if (elapsed >= FRAME_INTERVAL) {
        clock += Math.min(elapsed / 1000, 0.1);
        lastFrame = now - (elapsed % FRAME_INTERVAL);
        render();
      }
      frame = requestAnimationFrame(tick);
    }
    function syncMotion() {
      cancelAnimationFrame(frame);
      const paused = document.hidden || !isAnimated;
      if (canvas) canvas.dataset.animated = String(!paused);
      lastFrame = performance.now();
      render();
      if (!paused) frame = requestAnimationFrame(tick);
    }
    function resize() {
      if (!canvas) return;
      viewportHeight = window.innerHeight;
      pageHeight = document.documentElement.scrollHeight;
      const scale = window.innerWidth < 600 ? 3 : 4;
      width = Math.ceil(window.innerWidth / scale);
      height = Math.ceil(viewportHeight / scale);
      canvas.width = width;
      canvas.height = height;
      // Crop at most one native pixel instead of stretching fractional pixels.
      canvas.style.width = `${width * scale}px`;
      canvas.style.height = `${height * scale}px`;
      render();
    }
    const onScroll = () => {
      render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(document.body);
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", syncMotion);

    const handleMotionChange = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      if (typeof customEvent.detail === "boolean") {
        isAnimated = customEvent.detail;
      } else {
        isAnimated = getInitialMotion();
      }
      syncMotion();
    };
    window.addEventListener("motion-change", handleMotionChange);

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMql = () => {
      if (localStorage.getItem("motion") === null) {
        isAnimated = !mql.matches;
        syncMotion();
      }
    };
    mql.addEventListener("change", handleMql);

    resize();
    syncMotion();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", syncMotion);
      window.removeEventListener("motion-change", handleMotionChange);
      mql.removeEventListener("change", handleMql);
    };
  }, []);
  return (
    <div className={styles.world} aria-hidden="true">
      <canvas
        ref={canvasRef}
        data-world
        data-progress="0.000"
        className={styles.canvas}
      />
      <div className={styles.shade} />
    </div>
  );
}
