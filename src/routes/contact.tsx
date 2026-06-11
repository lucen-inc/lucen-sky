import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Starfield } from "@/components/Starfield";
import { SwarmCanvas } from "@/components/SwarmCanvas";
import { submitContact } from "@/lib/contact.functions";
import gala from "@/assets/media-gala.jpg.asset.json";
import cat from "@/assets/media-cat.png.asset.json";
import cocacola from "@/assets/media-cocacola.png.asset.json";
import heartMedia from "@/assets/media-heart.jpg.asset.json";
import cloudRain from "@/assets/media-cloud-rain.jpg.asset.json";
import { src } from "@/lib/media";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Lucen Sky" },
      {
        name: "description",
        content:
          "Commission a sky. Reach the Lucen Sky flight-ops studio — phone, email, callbacks and scheduling for atmospheric programs.",
      },
      { property: "og:title", content: "Contact — Lucen Sky" },
      { property: "og:description", content: "Commission a sky." },
    ],
  }),
  component: ContactPage,
});

type Intent = "Pilot program" | "Commission a show" | "Press & partnerships" | "Careers";

const CONTACT = {
  studio: { phone: "+254 7-2775-007", tel: "+25472775007", note: "MON–FRI · 09:00–19:00 EAT" },
  ops: { phone: "+254 2-0202-345-678", tel: "+25420202345678", note: "24/7 · ACTIVE MISSIONS" },
  email: "hello@sky.lucene.co",
  press: "press@sky.lucene.co",
  opsEmail: "ops@sky.lucene.co",
};

function ContactPage() {
  const [intent, setIntent] = useState<Intent>("Commission a show");
  const [callback, setCallback] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const submitFn = useServerFn(submitContact);
  const mut = useMutation({
    mutationFn: (vars: any) => submitFn({ data: vars }),
  });

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    mut.mutate({
      name: String(fd.get("name") || ""),
      company: String(fd.get("company") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      city: String(fd.get("city") || ""),
      event_date: String(fd.get("date") || ""),
      intent,
      callback,
      message: String(fd.get("message") || ""),
    });
  };

  return (
    <main className="relative overflow-x-hidden">
      <Nav />

      {/* Fixed atmospheric background that scroll-morphs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <Starfield density={1.2} />
        <div
          className="absolute inset-0 opacity-60 transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at ${20 + scrollProgress * 60}% ${30 + scrollProgress * 40}%, oklch(0.22 0.12 ${220 + scrollProgress * 70}) 0%, transparent 55%)`,
          }}
        />
        <div className="absolute inset-0 grid-lines opacity-20 mask-fade-b" />
      </div>

      {/* Scroll telemetry strip */}
      <div className="fixed top-20 left-0 right-0 z-30 px-4 md:px-8 pointer-events-none">
        <div className="mx-auto max-w-7xl flex items-center justify-between font-mono text-[9px] md:text-[10px] tracking-[0.25em] md:tracking-[0.3em] uppercase text-muted-foreground">
          <span className="text-[color:var(--photonic-cyan)]/80">FLIGHT-OPS · DESCENT VECTOR</span>
          <span>SCROLL {String(Math.round(scrollProgress * 100)).padStart(3, "0")}%</span>
        </div>
        <div className="mx-auto max-w-7xl mt-2 h-px bg-white/10 overflow-hidden">
          <div
            className="h-full bg-[color:var(--photonic-cyan)] glow-cyan transition-[width] duration-150"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </div>

      {/* HERO */}
      <section className="relative pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6 grid lg:grid-cols-12 gap-8 md:gap-12 items-end">
          <div className="lg:col-span-7">
            <div className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[color:var(--photonic-cyan)]/80 mb-4 md:mb-6">
              Contact · Flight Control
            </div>
            <h1 className="text-[clamp(2.4rem,7vw,6rem)] font-light leading-[0.98] text-grad">
              Open a corridor<br />in the sky.
            </h1>
            <p className="mt-6 md:mt-8 max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed">
              From first brief to airspace clearance, our flight-ops team routes your program through every regulator,
              mission planner and rotor. Tell us where you want the atmosphere to land — we'll do the rest.
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-strong rounded-3xl p-2 ring-hairline">
              <div className="relative rounded-[20px] overflow-hidden aspect-[5/4] bg-[color:var(--deep-space)]">
                <SwarmCanvas
                  count={420}
                  secondsPerKey={12}
                  shapes={[{ kind: "ring" }, { kind: "constellation" }, { kind: "heart" }, { kind: "text", text: "HELLO" }]}
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-3 left-3 text-[10px] tracking-[0.3em] uppercase text-[color:var(--photonic-cyan)]/80">SWARM · INBOUND</div>
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between font-mono text-[9px] text-muted-foreground">
                    <span>HDG 045°</span><span>ALT 138m</span><span>WIND 06kt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CHANNELS */}
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <a href={`tel:${CONTACT.studio.tel}`} className="glass-strong rounded-2xl ring-hairline p-4 md:p-5 hover:bg-white/[0.03] transition-colors">
            <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Studio</div>
            <div className="mt-2 font-mono text-sm md:text-base text-[color:var(--photonic-cyan)] break-all">{CONTACT.studio.phone}</div>
            <div className="mt-2 text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-muted-foreground/80">{CONTACT.studio.note}</div>
          </a>
          <a href={`tel:${CONTACT.ops.tel}`} className="glass-strong rounded-2xl ring-hairline p-4 md:p-5 hover:bg-white/[0.03] transition-colors">
            <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Flight Ops</div>
            <div className="mt-2 font-mono text-sm md:text-base text-[color:var(--photonic-cyan)] break-all">{CONTACT.ops.phone}</div>
            <div className="mt-2 text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-muted-foreground/80">{CONTACT.ops.note}</div>
          </a>
          <a href={`mailto:${CONTACT.email}`} className="glass-strong rounded-2xl ring-hairline p-4 md:p-5 hover:bg-white/[0.03] transition-colors">
            <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Email</div>
            <div className="mt-2 font-mono text-sm md:text-base text-[color:var(--photonic-cyan)] break-all">{CONTACT.email}</div>
            <div className="mt-2 text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-muted-foreground/80">RESPONSE &lt; 12h</div>
          </a>
          <a href={`mailto:${CONTACT.press}`} className="glass-strong rounded-2xl ring-hairline p-4 md:p-5 hover:bg-white/[0.03] transition-colors">
            <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Press</div>
            <div className="mt-2 font-mono text-sm md:text-base text-[color:var(--photonic-cyan)] break-all">{CONTACT.press}</div>
            <div className="mt-2 text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-muted-foreground/80">MEDIA & PARTNERSHIPS</div>
          </a>
        </div>
      </section>

      {/* Scrollytelling media strip */}
      <section className="relative py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6 mb-6 md:mb-10">
          <div className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[color:var(--photonic-cyan)]/80 mb-3">Flight Log · Recent Sorties</div>
          <h2 className="text-2xl md:text-5xl font-light text-grad">Atmosphere we've recently flown.</h2>
        </div>
        <div className="mx-auto max-w-7xl px-4 md:px-6 grid grid-cols-12 gap-3 md:gap-4">
          <figure className="col-span-12 md:col-span-7 relative rounded-3xl overflow-hidden ring-hairline aspect-[16/10] group">
            <img src={src(gala)} loading="lazy" alt="Gala dinner sky formation with synchronized pyrotechnics" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5 md:right-5 text-[10px] md:text-xs tracking-[0.25em] uppercase text-[color:var(--photonic-cyan)]/90">Gala · 1,000 craft · Pyro-sync</figcaption>
          </figure>
          <figure className="col-span-6 md:col-span-5 relative rounded-3xl overflow-hidden ring-hairline aspect-[4/5] group">
            <img src={src(cat)} loading="lazy" alt="Drone formation of a cat above a city skyline" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5 md:right-5 text-[10px] md:text-xs tracking-[0.25em] uppercase text-[color:var(--photonic-cyan)]/90">Brand · Vector silhouette</figcaption>
          </figure>
          <figure className="col-span-6 md:col-span-5 relative rounded-3xl overflow-hidden ring-hairline aspect-[4/5] group">
            <img src={src(heartMedia)} loading="lazy" alt="Heart formation drone show above suburban skyline" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5 md:right-5 text-[10px] md:text-xs tracking-[0.25em] uppercase text-[color:var(--photonic-cyan)]/90">Civic · Holding pattern</figcaption>
          </figure>
          <figure className="col-span-12 md:col-span-7 relative rounded-3xl overflow-hidden ring-hairline aspect-[16/10] group">
            <img src={src(cocacola)} loading="lazy" alt="Festive crowd watching brand drone show with truck silhouette" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5 md:right-5 text-[10px] md:text-xs tracking-[0.25em] uppercase text-[color:var(--photonic-cyan)]/90">FMCG · Crowd-facing reveal</figcaption>
          </figure>
          <figure className="col-span-12 relative rounded-3xl overflow-hidden ring-hairline aspect-[21/9] group">
            <img src={src(cloudRain)} loading="lazy" alt="Cloud of light particles raining down over an audience" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <figcaption className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5 md:right-5 text-[10px] md:text-xs tracking-[0.25em] uppercase text-[color:var(--photonic-cyan)]/90">Immersive · Cloud-rain choreography</figcaption>
          </figure>
        </div>
      </section>

      {/* FORM */}
      <section ref={scrollRef} className="relative py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 md:px-6">
          <div className="glass-strong rounded-3xl ring-hairline p-5 md:p-10">
            <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[color:var(--photonic-cyan)]/80">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--photonic-cyan)] animate-pulse-glow" />
              Mission Brief · Pre-flight Form
            </div>
            <h3 className="mt-3 md:mt-4 text-xl md:text-4xl font-display font-light text-grad">File a flight plan.</h3>

            {mut.isSuccess ? (
              <div className="mt-8 md:mt-10 grid place-items-center text-center py-12 md:py-16">
                <div className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-[color:var(--photonic-cyan)]/80 mb-3 md:mb-4">ACK · 200 · CLEARANCE RECEIVED</div>
                <h4 className="text-xl md:text-2xl font-display font-light text-grad">We're rolling for taxi.</h4>
                <p className="mt-3 text-sm text-muted-foreground max-w-md px-4">A flight-ops producer will be in your inbox within 12 hours with a brief deck and next-step options.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="md:col-span-2 flex flex-wrap gap-2">
                  {(["Pilot program", "Commission a show", "Press & partnerships", "Careers"] as Intent[]).map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIntent(i)}
                      className={`px-3 md:px-4 py-2 rounded-full text-[11px] md:text-xs tracking-[0.15em] uppercase transition-colors ${
                        intent === i
                          ? "bg-[color:var(--photonic-cyan)] text-[color:var(--primary-foreground)] glow-cyan"
                          : "glass text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>

                <input required name="name" placeholder="Your name" className="glass rounded-2xl px-4 md:px-5 py-3 md:py-4 text-sm bg-transparent outline-none focus:ring-2 focus:ring-[color:var(--photonic-cyan)]/50" />
                <input name="company" placeholder="Company / Brand" className="glass rounded-2xl px-4 md:px-5 py-3 md:py-4 text-sm bg-transparent outline-none focus:ring-2 focus:ring-[color:var(--photonic-cyan)]/50" />
                <input required type="email" name="email" placeholder="Email" className="glass rounded-2xl px-4 md:px-5 py-3 md:py-4 text-sm bg-transparent outline-none focus:ring-2 focus:ring-[color:var(--photonic-cyan)]/50" />
                <input name="phone" inputMode="tel" placeholder="Phone (optional)" className="glass rounded-2xl px-4 md:px-5 py-3 md:py-4 text-sm bg-transparent outline-none focus:ring-2 focus:ring-[color:var(--photonic-cyan)]/50" />
                <input name="city" placeholder="City / Airspace" className="glass rounded-2xl px-4 md:px-5 py-3 md:py-4 text-sm bg-transparent outline-none focus:ring-2 focus:ring-[color:var(--photonic-cyan)]/50" />
                <input name="date" type="date" className="glass rounded-2xl px-4 md:px-5 py-3 md:py-4 text-sm bg-transparent outline-none focus:ring-2 focus:ring-[color:var(--photonic-cyan)]/50 text-muted-foreground" />

                <textarea
                  name="message"
                  placeholder="Tell us the moment you want the sky to hold — venue, audience, anchor beat, what success looks like."
                  rows={5}
                  className="md:col-span-2 glass rounded-2xl px-4 md:px-5 py-3 md:py-4 text-sm bg-transparent outline-none focus:ring-2 focus:ring-[color:var(--photonic-cyan)]/50 resize-none"
                />

                <label className="md:col-span-2 flex items-center gap-3 text-sm text-muted-foreground cursor-pointer select-none">
                  <input type="checkbox" checked={callback} onChange={(e) => setCallback(e.target.checked)} className="h-4 w-4 accent-[color:var(--photonic-cyan)]" />
                  Request a callback within 24h instead of email
                </label>

                {mut.isError && (
                  <div className="md:col-span-2 text-xs text-red-400">{(mut.error as any)?.message ?? "Submission failed. Try again."}</div>
                )}

                <div className="md:col-span-2 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                  <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/70">
                    Intent · {intent} {callback ? "· Callback" : ""}
                  </div>
                  <div className="flex gap-3">
                    <a href={`mailto:${CONTACT.email}?subject=Meeting%20request`} className="rounded-full glass px-5 md:px-6 py-3 text-xs md:text-sm hover:text-foreground transition-colors text-center">
                      Email instead →
                    </a>
                    <button
                      type="submit"
                      disabled={mut.isPending}
                      className="rounded-full bg-[color:var(--photonic-cyan)] px-5 md:px-7 py-3 text-xs md:text-sm text-[color:var(--primary-foreground)] glow-cyan hover:scale-[1.02] transition-transform disabled:opacity-60"
                    >
                      {mut.isPending ? "Transmitting…" : "Cleared for takeoff"}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* STATIONS */}
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 pb-24 md:pb-32">
        <div className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[color:var(--photonic-cyan)]/80 mb-6">Ground Stations</div>
        <div className="grid sm:grid-cols-3 gap-3 md:gap-4">
          {[
            { city: "Nairobi", coords: "1.2921° S · 36.8219° E", role: "HQ · Flight Ops" },
            { city: "Dubai", coords: "25.2048° N · 55.2708° E", role: "MEA Studio" },
            { city: "Singapore", coords: "1.3521° N · 103.8198° E", role: "APAC Operations" },
          ].map((o) => (
            <div key={o.city} className="glass-strong rounded-2xl ring-hairline p-5 md:p-6">
              <div className="font-display text-lg md:text-xl">{o.city}</div>
              <div className="mt-2 font-mono text-[11px] md:text-xs text-[color:var(--photonic-cyan)]">{o.coords}</div>
              <div className="mt-1 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{o.role}</div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/industries" className="text-xs tracking-[0.3em] uppercase text-[color:var(--photonic-cyan)]">
            ← Back to Industries
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
