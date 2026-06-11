// Centralized media library — every asset.json reference goes through here.
//
// Lovable's CDN serves assets at /__l5e/assets-v1/... which works on every
// Lovable deploy. On self-hosted Vercel / Node / static exports the relative
// path has no handler, so we resolve to an absolute URL pointing at the
// Lovable origin (or a custom mirror via VITE_MEDIA_BASE_URL).
//
// Set VITE_MEDIA_BASE_URL at build time to point at a Supabase Storage
// bucket / Cloudflare R2 / S3 if you want to fully decouple from Lovable.

type AssetPointer = { url: string; original_filename?: string; content_type?: string };

const FALLBACK_ORIGIN = "https://lucen-sky.lovable.app";

function resolveBase(): string {
  // Browser: prefer current origin when it can serve /__l5e/* (lovable domains)
  if (typeof window !== "undefined") {
    const host = window.location.host;
    if (host.includes("lovable")) return window.location.origin;
  }
  const envBase = (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_MEDIA_BASE_URL) as
    | string
    | undefined;
  return envBase || FALLBACK_ORIGIN;
}

export function absUrl(asset: AssetPointer | string): string {
  const raw = typeof asset === "string" ? asset : asset.url;
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const base = resolveBase().replace(/\/$/, "");
  const path = raw.startsWith("/") ? raw : `/${raw}`;
  return `${base}${path}`;
}

// Convenience: an <img>-friendly src that always works
export function src(asset: AssetPointer | string): string {
  return absUrl(asset);
}
