export function SkyOS() {
  return (
    <section id="sky-os" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-20" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-xs tracking-[0.4em] uppercase text-[color:var(--photonic-cyan)]/80 mb-6">
            Sky OS · 04
          </div>
          <h2 className="text-[clamp(2rem,4vw,3.6rem)] font-light leading-[1.05] text-grad">
            Mission control for the<br />programmable atmosphere.
          </h2>
        </div>

        <div className="glass-strong rounded-3xl p-4 md:p-6 ring-hairline">
          <div className="grid lg:grid-cols-12 gap-4">
            {/* Left: telemetry */}
            <div className="lg:col-span-3 space-y-3">
              {[
                { k: "Fleet Health", v: "98.4%", c: "var(--photonic-cyan)" },
                { k: "Wind", v: "6.2 m/s", c: "var(--aurora-violet)" },
                { k: "Show Time", v: "12:42", c: "var(--photonic-cyan)" },
                { k: "Battery Avg", v: "76%", c: "var(--photonic-cyan)" },
              ].map((m) => (
                <div key={m.k} className="glass rounded-xl p-4">
                  <div className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">{m.k}</div>
                  <div className="font-mono text-lg mt-1" style={{ color: `oklch(0.86 0.16 220)` }}>
                    {m.v}
                  </div>
                  <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-2/3" style={{ background: `linear-gradient(90deg, ${m.c}, transparent)` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Center: radar/viewport */}
            <div className="lg:col-span-6 relative aspect-square rounded-2xl overflow-hidden bg-[color:var(--deep-space)] ring-hairline">
              {/* concentric rings */}
              {[0.95, 0.7, 0.45, 0.22].map((s) => (
                <div
                  key={s}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[color:var(--photonic-cyan)]/15"
                  style={{ width: `${s * 100}%`, height: `${s * 100}%` }}
                />
              ))}
              {/* crosshair */}
              <div className="absolute inset-0">
                <div className="absolute top-1/2 inset-x-0 h-px bg-[color:var(--photonic-cyan)]/15" />
                <div className="absolute left-1/2 inset-y-0 w-px bg-[color:var(--photonic-cyan)]/15" />
              </div>
              {/* sweep */}
              <div className="absolute top-1/2 left-1/2 h-1/2 w-1/2 origin-top-left animate-orbit"
                   style={{ background: "conic-gradient(from 0deg, transparent 0deg, oklch(0.86 0.16 220 / 0.25) 30deg, transparent 60deg)" }} />
              {/* drone dots */}
              {Array.from({ length: 60 }).map((_, i) => {
                const a = (i / 60) * Math.PI * 2 + i * 0.7;
                const r = 8 + (i % 8) * 5;
                const x = 50 + Math.cos(a) * r;
                const y = 50 + Math.sin(a) * r * 0.95;
                const violet = i % 7 === 0;
                return (
                  <span
                    key={i}
                    className="absolute h-1 w-1 rounded-full animate-pulse-glow"
                    style={{
                      left: `${x}%`, top: `${y}%`,
                      background: violet ? "oklch(0.66 0.22 290)" : "oklch(0.86 0.16 220)",
                      boxShadow: `0 0 8px ${violet ? "oklch(0.66 0.22 290)" : "oklch(0.86 0.16 220)"}`,
                      animationDelay: `${(i % 9) * 0.2}s`,
                    }}
                  />
                );
              })}
              <div className="absolute top-4 left-4 font-mono text-[10px] tracking-[0.3em] uppercase text-[color:var(--photonic-cyan)]">
                SKY-OS / RADAR
              </div>
              <div className="absolute bottom-4 right-4 font-mono text-[10px] text-muted-foreground">
                SECTOR-A · 1.2 km²
              </div>
            </div>

            {/* Right: log */}
            <div className="lg:col-span-3 glass rounded-2xl p-4 font-mono text-[11px] leading-relaxed text-muted-foreground space-y-1.5 max-h-[420px] overflow-hidden">
              <div className="text-[color:var(--photonic-cyan)] tracking-[0.25em] uppercase text-[10px] mb-2">// telemetry stream</div>
              {[
                "12:42:18  formation A → B  ok",
                "12:42:19  drift correction Δ 0.04m",
                "12:42:20  cluster-7 link 5GHz",
                "12:42:21  light cue #014  start",
                "12:42:23  battery 76% nominal",
                "12:42:24  wind shear -2°  stable",
                "12:42:26  formation B → C  ok",
                "12:42:27  vertex 412 reassigned",
                "12:42:28  swarm coherence 0.998",
                "12:42:30  light cue #015  start",
                "12:42:31  payload sync 1.2 MB",
                "12:42:33  attention map +3.4%",
              ].map((l, i) => (
                <div key={i} className="opacity-0 animate-[fade-in_.5s_ease_forwards]" style={{ animationDelay: `${i * 0.12}s` }}>
                  {l}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
