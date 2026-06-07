import { useEffect, useRef } from "react";

// A particle swarm that morphs between formations (circle, grid, ring, heart-ish).
export function SwarmCanvas({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, t = 0, formIdx = 0, formT = 0;

    const COUNT = 520;
    type P = { x: number; y: number; tx: number; ty: number; vx: number; vy: number; hue: number };
    const parts: P[] = [];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildTargets();
    };

    const targets: { x: number; y: number }[][] = [];
    const buildTargets = () => {
      targets.length = 0;
      const cx = w / 2, cy = h / 2;
      const R = Math.min(w, h) * 0.32;

      // ring
      targets.push(Array.from({ length: COUNT }, (_, i) => {
        const a = (i / COUNT) * Math.PI * 2;
        return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R * 0.55 };
      }));
      // grid
      const cols = Math.ceil(Math.sqrt(COUNT));
      const rows = Math.ceil(COUNT / cols);
      const gw = R * 2.2, gh = R * 1.3;
      targets.push(Array.from({ length: COUNT }, (_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        return { x: cx - gw / 2 + (c / (cols - 1)) * gw, y: cy - gh / 2 + (r / (rows - 1)) * gh };
      }));
      // spiral
      targets.push(Array.from({ length: COUNT }, (_, i) => {
        const a = i * 0.35;
        const rr = (i / COUNT) * R * 1.1;
        return { x: cx + Math.cos(a) * rr, y: cy + Math.sin(a) * rr * 0.6 };
      }));
      // wing / arc
      targets.push(Array.from({ length: COUNT }, (_, i) => {
        const u = i / COUNT;
        const a = (u - 0.5) * Math.PI * 1.4;
        return { x: cx + Math.sin(a) * R * 1.3, y: cy - Math.cos(a) * R * 0.9 + R * 0.2 };
      }));
    };

    for (let i = 0; i < COUNT; i++) {
      parts.push({
        x: Math.random() * 800, y: Math.random() * 400,
        tx: 0, ty: 0, vx: 0, vy: 0,
        hue: Math.random() < 0.3 ? 290 : 220,
      });
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const setTargets = () => {
      const set = targets[formIdx];
      for (let i = 0; i < COUNT; i++) {
        parts[i].tx = set[i].x;
        parts[i].ty = set[i].y;
      }
    };
    setTargets();

    const loop = () => {
      t += 0.016; formT += 0.016;
      if (formT > 4.5) {
        formT = 0;
        formIdx = (formIdx + 1) % targets.length;
        setTargets();
      }
      ctx.fillStyle = "oklch(0.08 0.012 250 / 0.25)";
      ctx.fillRect(0, 0, w, h);

      for (const p of parts) {
        const dx = p.tx - p.x, dy = p.ty - p.y;
        p.vx = (p.vx + dx * 0.012) * 0.86;
        p.vy = (p.vy + dy * 0.012) * 0.86;
        p.x += p.vx; p.y += p.vy;
        const a = 0.7 + Math.sin(t * 2 + p.x * 0.01) * 0.3;
        ctx.fillStyle = `oklch(0.9 0.16 ${p.hue} / ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={ref} className={`block w-full h-full ${className}`} aria-hidden />;
}
