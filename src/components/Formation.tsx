import { SwarmCanvas } from "./SwarmCanvas";

export function Formation() {
  return (
    <section id="experience" className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 grid-lines opacity-30 mask-fade-b" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5">
            <div className="text-xs tracking-[0.4em] uppercase text-[color:var(--photonic-cyan)]/80 mb-6">
              Formation Engine · 02
            </div>
            <h2 className="text-[clamp(2rem,4vw,3.6rem)] font-light leading-[1.05] text-grad">
              Many drones.<br />One intelligence.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed max-w-md">
              Lucen Sky compiles your brief into a swarm program. Particles
              converge, dissolve and re-form continuously — a single distributed
              organism choreographed in real time.
            </p>

            <dl className="mt-10 space-y-3">
              {[
                ["Convergence latency", "< 40 ms"],
                ["Per-craft compute", "ARM Cortex-M7"],
                ["Positioning accuracy", "± 2 cm RTK"],
                ["Failsafe layers", "7"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-white/5 py-3">
                  <dt className="text-sm text-muted-foreground">{k}</dt>
                  <dd className="font-mono text-sm text-[color:var(--photonic-cyan)]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="glass-strong rounded-3xl p-2 ring-hairline">
              <div className="rounded-[20px] overflow-hidden relative h-[80vh] md:h-auto md:aspect-[4/3] bg-[color:var(--deep-space)]">
                <SwarmCanvas />
                {/* HUD overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-4 left-4 text-[10px] tracking-[0.3em] uppercase text-[color:var(--photonic-cyan)]/80">
                    SWARM · LIVE
                  </div>
                  <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--photonic-cyan)] animate-pulse-glow" />
                    520 / 520 SYNCED
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between font-mono text-[10px] text-muted-foreground">
                    <span>LAT 40.7128° N</span>
                    <span>LON 74.0060° W</span>
                    <span>ALT 142m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
