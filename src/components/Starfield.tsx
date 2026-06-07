import { useEffect, useRef } from "react";

export function Starfield({ density = 1, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let stars: { x: number; y: number; z: number; r: number; tw: number; hue: number }[] = [];
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.floor((w * h) / 9000 * density);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 0.8 + 0.2,
        r: Math.random() * 1.2 + 0.2,
        tw: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.15 ? 290 : 220,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let t = 0;
    const loop = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = 0.4 + Math.sin(t * 1.2 + s.tw) * 0.5;
        ctx.beginPath();
        ctx.fillStyle = `oklch(0.95 0.12 ${s.hue} / ${a * s.z})`;
        ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI * 2);
        ctx.fill();
        // subtle parallax drift
        s.y += 0.02 * s.z;
        if (s.y > h) s.y = 0;
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, [density]);

  return <canvas ref={ref} className={`block w-full h-full ${className}`} aria-hidden />;
}
