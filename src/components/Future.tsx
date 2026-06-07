import { Starfield } from "./Starfield";

export function Future() {
  return (
    <section id="future" className="relative py-40 overflow-hidden">
      <div className="absolute inset-0">
        <Starfield density={1.8} />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--obsidian)_70%)]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <div className="text-xs tracking-[0.4em] uppercase text-[color:var(--photonic-cyan)]/80 mb-8">
          The next layer · 05
        </div>
        <h2 className="text-[clamp(2.4rem,6vw,5.4rem)] font-light leading-[0.98] text-grad">
          The sky is no<br />longer empty.
        </h2>
        <p className="mt-8 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          By 2030, the atmosphere above every city will carry messages, art and
          coordinated infrastructure. Lucen Sky is building the operating system
          for that layer — today.
        </p>

        <div id="contact" className="mt-14 inline-flex flex-col sm:flex-row items-center gap-3 glass-strong rounded-full p-2 pl-6 ring-hairline">
          <span className="text-sm text-muted-foreground">Commission a sky.</span>
          <a
            href="mailto:hello@lucen.sky"
            className="rounded-full bg-[color:var(--photonic-cyan)] px-6 py-3 text-sm text-[color:var(--primary-foreground)] hover:scale-[1.02] transition-transform glow-cyan"
          >
            hello@lucen.sky →
          </a>
        </div>
      </div>

      <footer className="relative mt-32 mx-auto max-w-7xl px-6">
        <div className="border-t border-white/5 pt-8 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground font-mono tracking-[0.2em] uppercase">
          <span>© 2026 Lucen Sky Atmospheric Media</span>
          <span>FAA · EASA · CAAC certified operations</span>
          <span>v1.0 · sky-os</span>
        </div>
      </footer>
    </section>
  );
}
