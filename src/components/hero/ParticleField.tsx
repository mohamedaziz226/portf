import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type ParticleFieldProps = {
  className?: string;
  /** One particle per `density` px² (higher = fewer particles). */
  density?: number;
  maxParticles?: number;
  /** Distance (px) under which two particles are linked. */
  linkDistance?: number;
};

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

const COLORS = ["rgba(56, 189, 248,", "rgba(139, 92, 246,", "rgba(34, 211, 238,"];

/**
 * Ultra-light canvas particle network used as a Hero background.
 * - caps the device pixel ratio (1.5 on touch devices),
 * - pauses when the tab is hidden AND when the hero scrolls out of view,
 * - renders a single static frame when the user prefers reduced motion,
 * - throttled to ~30fps on touch devices to save battery.
 */
export function ParticleField({
  className,
  density = 26000,
  maxParticles = 52,
  linkDistance = 128,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let width = 1;
    let height = 1;
    let particles: Particle[] = [];
    let frameId = 0;
    let running = false;
    let lastFrame = 0;
    let coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    // ~30fps on touch devices, ~60fps on desktop.
    const frameInterval = () => (coarsePointer ? 1000 / 30 : 1000 / 60);
    const linkDistanceSq = linkDistance * linkDistance;

    const buildParticles = () => {
      // Mobile GPUs: cap DPR at 1.5 (huge fill-rate saving on 3x phones).
      const maxRatio = coarsePointer ? 1.5 : 1.75;
      const ratio = Math.min(window.devicePixelRatio || 1, maxRatio);
      const rect = canvas.getBoundingClientRect();
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);

      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const smallScreen = Math.min(width, height) < 520;
      const count = Math.min(
        // Fewer particles on phones: cap ~30 instead of 52.
        smallScreen ? Math.min(maxParticles, 30) : maxParticles,
        Math.max(12, Math.round((width * height) / density)),
      );

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.24,
        vy: (Math.random() - 0.5) * 0.24,
        r: Math.random() * 1.5 + 0.7,
      }));
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;

      for (let i = 0; i < particles.length; i += 1) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j += 1) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < linkDistanceSq) {
            const alpha = (1 - Math.sqrt(distanceSq) / linkDistance) * 0.22;
            context.strokeStyle = `rgba(148, 163, 184, ${alpha.toFixed(3)})`;
            context.beginPath();
            context.moveTo(a.x, a.y);
            context.lineTo(b.x, b.y);
            context.stroke();
          }
        }
      }

      particles.forEach((particle, index) => {
        context.fillStyle = `${COLORS[index % COLORS.length]}0.85)`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fill();
      });
    };

    const tick = (now: number) => {
      if (!running) return;
      // Throttle touch devices to ~30fps: skip frames, same visuals.
      if (now - lastFrame < frameInterval()) {
        frameId = window.requestAnimationFrame(tick);
        return;
      }
      lastFrame = now;

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -20) particle.x = width + 20;
        else if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        else if (particle.y > height + 20) particle.y = -20;
      });

      draw();
      frameId = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || prefersReducedMotion) return;
      running = true;
      lastFrame = 0;
      frameId = window.requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frameId);
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    const onPointerChange = (event: MediaQueryListEvent) => {
      coarsePointer = event.matches;
      buildParticles();
      if (prefersReducedMotion) draw();
    };
    const pointerQuery = window.matchMedia("(pointer: coarse)");
    pointerQuery.addEventListener("change", onPointerChange);

    buildParticles();
    if (prefersReducedMotion) draw();
    else start();

    const resizeObserver = new ResizeObserver(() => {
      buildParticles();
      if (prefersReducedMotion) draw();
    });
    resizeObserver.observe(canvas);

    // Pause the rAF loop as soon as the hero leaves the viewport.
    const visibilityObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) start();
        else stop();
      },
      { threshold: 0 },
    );
    visibilityObserver.observe(canvas);

    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      pointerQuery.removeEventListener("change", onPointerChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [density, linkDistance, maxParticles, prefersReducedMotion]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
