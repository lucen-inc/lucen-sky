# Deployment

Lucen Sky is a TanStack Start + Nitro app. The Lovable preview runs on
Cloudflare Workers, but the same source ships to **Vercel**, **DigitalOcean**,
**Fly.io**, **Render**, **Netlify**, or any **Node** / **static** host.

The active output adapter is chosen entirely by `NITRO_PRESET` at build time.
Nitro writes the artifacts to the directory the chosen host expects — you
should **not** hard-code `outputDirectory` anywhere in your host config.

## Vercel

`vercel.json` already sets `NITRO_PRESET=vercel`. Just import the repo into
Vercel. Nitro emits `.vercel/output/` which Vercel auto-detects — there's no
output directory to configure.

## DigitalOcean App Platform / Fly.io / Render / Railway / Docker

Build with the Node preset:

```bash
NITRO_PRESET=node-server bun run build
node .output/server/index.mjs       # listens on PORT (default 3000)
```

The included `Dockerfile` does this.

## Pure static export (any CDN)

```bash
NITRO_PRESET=static bun run build
# upload .output/public/* to S3 / R2 / Netlify / GH Pages / etc.
```

Static export drops server functions (the contact form / admin dashboard
won't work on a fully static host).

## Netlify

```bash
NITRO_PRESET=netlify bun run build
```

## Required env

| Var | Where | Why |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | client + server | Browser Supabase client |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | client + server | Browser Supabase client |
| `SUPABASE_URL` | server | Server functions (auth middleware) |
| `SUPABASE_PUBLISHABLE_KEY` | server | Server functions (auth middleware) |
| `SUPABASE_SERVICE_ROLE_KEY` | server | Admin tasks (contact-form insert) |
| `VITE_MEDIA_BASE_URL` | client | Optional: absolute origin for media if you don't want to use the default Lovable CDN |

## Media on self-hosted environments

Asset pointers (`src/assets/*.asset.json`) reference Lovable's CDN at
`/__l5e/assets-v1/...`. On Lovable deploys this is served automatically; on
self-hosted environments use `src/lib/media.ts` (`absUrl()` / `src()`) which
resolves to an absolute origin:

1. `VITE_MEDIA_BASE_URL` if set (e.g. your Supabase Storage / R2 origin)
2. Otherwise `https://lucen-sky.lovable.app` — the published Lovable origin,
   which is globally reachable and works fine as a CDN.

Set `VITE_MEDIA_BASE_URL` in your host's build env if you want to fully cut
the dependency on the Lovable origin.
