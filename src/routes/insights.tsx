import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Starfield } from "@/components/Starfield";
import { SwarmCanvas } from "@/components/SwarmCanvas";
import bust from "@/assets/media-bust.jpg.asset.json";
import cairo from "@/assets/media-cairo.png.asset.json";
import cloudSwarm from "@/assets/media-cloud-swarm.jpg.asset.json";
import redbull from "@/assets/media-redbull.png.asset.json";
import { src } from "@/lib/media";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — Drone Tech, Aerodynamics & Sky-OS" },
      {
        name: "description",
        content:
          "Field notes on swarm intelligence, drone aerodynamics, telemetry, and the Sky-OS operating system for autonomous and manual sky shows.",
      },
      { property: "og:title", content: "Insights — Lucen Sky" },
      { property: "og:description", content: "Field notes from the programmable sky." },
    ],
  }),
  component: InsightsPage,
});

const droneStats = [
  { k: "Max swarm size", v: "5,000", note: "single-mission record" },
  { k: "Mesh latency", v: "<200 ms", note: "input → all rotors" },
  { k: "Hold accuracy", v: "±2 cm", note: "RTK-GNSS" },
  { k: "Battery cycle", v: "21 min", note: "@ 14 m/s wind" },
  { k: "Failover budget", v: "0.8%", note: "auto-RTL pilots" },
  { k: "Light pixels / craft", v: "16M", note: "16-bit RGB+W" },
];

const aerodynamics = [
  {
    title: "Rotor wash & formation spacing",
    body:
      "Downwash from a quad-rotor extends ~3× rotor diameter. We compute a per-craft exclusion volume and inflate it dynamically in turbulent wind so swarm density stays below induced-shear thresholds.",
    metric: "min spacing 1.4 m @ 0–8 m/s",
  },
  {
    title: "Wind-shear holding patterns",
    body:
      "When gusts cross 12 m/s, Sky-OS rotates the entire formation to keep each craft's nose-into-wind component below 18°, trading a small bearing offset for a 4× reduction in attitude correction.",
    metric: "shear margin Δ18° / 4× stable",
  },
  {
    title: "Battery-aware choreography",
    body:
      "Each craft reports state-of-charge every 250 ms. The choreography compiler schedules high-energy moves (rapid climbs, fast translations) into the first 60% of the show, then drops into low-current hold-and-glow patterns.",
    metric: "energy curve 60/40 front-loaded",
  },
];

const skyosPillars = [
  {
    k: "Compiler",
    title: "Choreography → flight paths",
    body:
      "Sky-OS ingests After-Effects timelines, CAD silhouettes, and live MIDI/OSC input, then compiles them into per-craft trajectory bundles with collision-free margins solved over the entire airspace volume.",
  },
  {
    k: "Mesh",
    title: "Sub-200 ms swarm bus",
    body:
      "A custom UDP mesh with adaptive forward-error-correction keeps end-to-end latency under 200 ms across 5,000 craft, surviving 12% packet loss without visible glitches in formation.",
  },
  {
    k: "Pilot",
    title: "Onboard autonomy + RTL",
    body:
      "Every craft runs a local autopilot that holds station for 30 s on link loss, then executes a deterministic return-to-launch — independent of the swarm controller.",
  },
  {
    k: "Sim",
    title: "Hardware-in-the-loop sim",
    body:
      "Shows are rehearsed against a digital twin of the airspace — wind, no-fly zones, audience geometry — at 60 fps before a single rotor spins.",
  },
];

const telemetry = [
  { label: "ACTIVE CRAFT", value: "1,524 / 1,524" },
  { label: "MESH LATENCY", value: "112 ms" },
  { label: "AVG BATT", value: "78%" },
  { label: "WIND", value: "06 kt · 047°" },
  { label: "ALTITUDE", value: "138 m AGL" },
  { label: "DRIFT", value: "0.4 m RMS" },
  { label: "PACKET LOSS", value: "0.3%" },
  { label: "FORMATION", value: "MESH → MONOGRAM" },
];

const articles = [
  {
    cat: "Field Note",
    title: "Why the sky is the last untouched media surface",
    excerpt:
      "Every flat surface in the city has been monetised. The volumetric airspace above the audience is the only canvas still measured in tens of thousands of people per square kilometre.",
    img: cloudSwarm,
    read: "8 min",
  },
  {
    cat: "Engineering",
    title: "Sub-200 ms input → swarm latency, explained",
    excerpt:
      "How we route audience input through the show controller and into 1,500 simultaneous flight paths without breaking choreography.",
    img: redbull,
    read: "12 min",
  },
  {
    cat: "Case Diary",
    title: "Cairo, 4,800 drones, and the pyramid problem",
    excerpt:
      "Designing a multi-act spectacle against one of the most photographed skylines on earth — and the wind tunnel it creates after sunset.",
    img: cairo,
    read: "6 min",
  },
  {
    cat: "Research",
    title: "Volumetric brand recall vs traditional OOH",
    excerpt: "Six pilots, 180,000 surveyed attendees, and what the data says about three-dimensional advertising recall.",
    img: bust,
    read: "14 min",
  },
];

function InsightsPage() {
  return (
    <main className="relative overflow-x-hidden">
      <Nav />
      <div className="absolute inset-0 pointer-events-none">
        <Starfield density={1.0} />
      </div>

      {/* HERO */}
      <section className="relative pt-32 md:pt-40 pb-10 md:pb-16 px-4 md:px-6 mx-auto max-w-7xl">
        <div className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[color:var(--photonic-cyan)]/80 mb-4 md:mb-6">
          Insights · Drone Tech & Sky-OS
        </div>
        <h1 className="text-[clamp(2.2rem,6vw,5.4rem)] font-light leading-[1.02] text-grad max-w-4xl">
          Field notes from<br className="hidden md:block" /> the programmable sky.
        </h1>
        <p className="mt-6 md:mt-8 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
          Engineering reports on aerodynamics, swarm autonomy, and the operating system that runs the choreography.
        </p>
      </section>

      {/* DRONE STATS */}
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-8 md:py-16">
        <div className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[color:var(--photonic-cyan)]/80 mb-4">
          Drone Platform · Reference
        </div>
        <h2 className="font-display text-2xl md:text-4xl font-light text-grad max-w-3xl mb-8">
          The numbers behind every show.
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {droneStats.map((s) => (
            <div key={s.k} className="glass-strong rounded-2xl ring-hairline p-4 md:p-5">
              <div className="text-xl md:text-3xl font-display font-light text-[color:var(--photonic-cyan)]">{s.v}</div>
              <div className="mt-2 text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{s.k}</div>
              <div className="mt-1 text-[10px] text-muted-foreground/70">{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TELEMETRY SNAPSHOT + LIVE SWARM */}
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-20 grid lg:grid-cols-12 gap-5 md:gap-6">
        <div className="lg:col-span-7 glass-strong rounded-3xl ring-hairline overflow-hidden">
          <div className="h-[50vh] md:h-[60vh] relative">
            <SwarmCanvas
              count={520}
              secondsPerKey={12}
              shapes={[{ kind: "constellation" }, { kind: "wave" }, { kind: "starburst", rays: 12 }]}
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 left-4 text-[10px] tracking-[0.3em] uppercase text-[color:var(--photonic-cyan)]/80">
                LIVE TELEMETRY · SHOW #1147
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--photonic-cyan)] animate-pulse-glow" />
                STREAMING
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-5 glass-strong rounded-3xl ring-hairline p-5 md:p-6">
          <div className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[color:var(--photonic-cyan)]/80 mb-4">
            Telemetry Snapshot
          </div>
          <div className="grid grid-cols-2 gap-3">
            {telemetry.map((t) => (
              <div key={t.label} className="glass rounded-xl p-3">
                <div className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-muted-foreground">{t.label}</div>
                <div className="mt-1 font-mono text-sm md:text-base text-[color:var(--photonic-cyan)]">{t.value}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-[10px] tracking-[0.2em] uppercase text-muted-foreground/70">
            Refreshed 4×/sec · uplink redundant on 2.4 / 5 GHz mesh
          </div>
        </div>
      </section>

      {/* AERODYNAMICS */}
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
        <div className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[color:var(--photonic-cyan)]/80 mb-4">
          Aerodynamics
        </div>
        <h2 className="font-display text-2xl md:text-4xl font-light text-grad max-w-3xl mb-8 md:mb-10">
          The physics layer underneath every formation.
        </h2>
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">
          {aerodynamics.map((a) => (
            <article key={a.title} className="glass-strong rounded-3xl ring-hairline p-6">
              <div className="text-[10px] tracking-[0.25em] uppercase text-[color:var(--photonic-cyan)]/80">{a.metric}</div>
              <h3 className="mt-3 font-display text-xl text-grad font-light">{a.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{a.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* SKY-OS */}
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 py-12 md:py-20">
        <div className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[color:var(--photonic-cyan)]/80 mb-4">
          Sky-OS · Architecture
        </div>
        <h2 className="font-display text-2xl md:text-4xl font-light text-grad max-w-3xl mb-8 md:mb-10">
          A single operating system, four load-bearing pillars.
        </h2>
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {skyosPillars.map((p) => (
            <article key={p.k} className="glass-strong rounded-3xl ring-hairline p-6 md:p-8">
              <div className="flex items-baseline justify-between">
                <div className="text-[10px] tracking-[0.3em] uppercase text-[color:var(--photonic-cyan)]">{p.k}</div>
                <div className="font-mono text-[10px] text-muted-foreground">v3.1</div>
              </div>
              <h3 className="mt-3 font-display text-2xl text-grad font-light">{p.title}</h3>
              <p className="mt-3 text-sm md:text-base text-muted-foreground leading-relaxed">{p.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ARTICLES */}
      <section className="relative mx-auto max-w-7xl px-4 md:px-6 pb-24 md:pb-32 grid md:grid-cols-2 gap-4 md:gap-6">
        <div className="md:col-span-2 mb-2">
          <div className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-[color:var(--photonic-cyan)]/80 mb-4">
            Field Notes
          </div>
        </div>
        {articles.map((a, i) => (
          <article
            key={a.title}
            className={`group relative overflow-hidden rounded-3xl glass-strong ring-hairline ${i === 0 ? "md:col-span-2" : ""}`}
          >
            <div className={`grid ${i === 0 ? "md:grid-cols-2" : ""}`}>
              <div className={`relative ${i === 0 ? "aspect-[16/10] md:aspect-auto md:min-h-[420px]" : "aspect-[16/9]"}`}>
                <img
                  src={src(a.img)}
                  alt={a.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--obsidian)]/60 to-transparent" />
              </div>
              <div className="p-6 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-[10px] tracking-[0.3em] uppercase text-[color:var(--photonic-cyan)]">
                  <span>{a.cat}</span>
                  <span className="h-px w-6 bg-[color:var(--photonic-cyan)]/40" />
                  <span className="text-muted-foreground">{a.read}</span>
                </div>
                <h2 className="mt-4 font-display text-xl md:text-3xl font-light leading-tight">{a.title}</h2>
                <p className="mt-3 md:mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">{a.excerpt}</p>
                <Link to="/contact" className="mt-5 md:mt-6 text-sm text-[color:var(--photonic-cyan)]">
                  Read field note →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
      <Footer />
    </main>
  );
}
