import jack from "@/assets/case-jack.jpg.asset.json";
import deadpool from "@/assets/case-deadpool.jpg.asset.json";
import rider from "@/assets/case-rider.png.asset.json";
import shanghai from "@/assets/case-shanghai.jpg.asset.json";
import tiger from "@/assets/case-tiger.jpg.asset.json";
import cloud from "@/assets/case-cloud.jpg.asset.json";

const items = [
  { title: "Jack Daniel's", tag: "Brand Launch · Nashville", drones: 800, img: jack.url },
  { title: "Deadpool & Wolverine", tag: "Premiere · San Diego", drones: 1200, img: deadpool.url },
  { title: "Imperial Rider", tag: "Cultural Anthem · Xi'an", drones: 3200, img: rider.url },
  { title: "Bund Spectacle", tag: "Civic Show · Shanghai", drones: 2400, img: shanghai.url },
  { title: "Tiger Awakens", tag: "Festival · Seoul", drones: 1800, img: tiger.url },
  { title: "Aurora Cloud", tag: "Architectural · Riyadh", drones: 1600, img: cloud.url },
];

export function Gallery() {
  return (
    <section id="gallery" className="relative py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 mb-12">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="text-xs tracking-[0.4em] uppercase text-[color:var(--photonic-cyan)]/80 mb-4">
              Experience Gallery · 03
            </div>
            <h2 className="text-[clamp(2rem,4vw,3.6rem)] font-light leading-[1.05] text-grad max-w-2xl">
              Moments engineered into memory.
            </h2>
          </div>
          <div className="text-xs tracking-[0.3em] uppercase text-muted-foreground">
            ← Drag · Scroll →
          </div>
        </div>
      </div>

      <div className="no-scrollbar overflow-x-auto px-6">
        <div className="flex gap-6 pb-8 mx-auto max-w-[1800px]">
          {items.map((it, i) => (
            <article
              key={it.title}
              className="group relative shrink-0 w-[78vw] sm:w-[58vw] md:w-[42vw] lg:w-[32vw] xl:w-[420px] aspect-[3/4] rounded-3xl overflow-hidden glass-strong ring-hairline"
            >
              <img
                src={it.img}
                alt={it.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--obsidian)] via-[color:var(--obsidian)]/30 to-transparent" />

              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[color:var(--photonic-cyan)]">
                  Case · 0{i + 1}
                </span>
                <span className="glass rounded-full px-3 py-1 font-mono text-[10px] text-foreground/80">
                  {it.drones.toLocaleString()} drones
                </span>
              </div>

              <div className="absolute bottom-0 inset-x-0 p-6">
                <div className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{it.tag}</div>
                <h3 className="mt-2 text-2xl font-display font-light">{it.title}</h3>
                <div className="mt-4 flex items-center gap-2 text-xs text-[color:var(--photonic-cyan)] opacity-0 -translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                  Open case study
                  <span aria-hidden>→</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
