// Migrate all src/assets/*.asset.json binaries from Lovable CDN
// into the lucen-sky-media Supabase bucket, then rewrite the pointer
// to a long-lived signed URL (10y).
import { readdir, readFile, writeFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const SUPA_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "lucen-sky-media";
const EXPIRES = 60 * 60 * 24 * 365 * 10; // 10y

if (!SUPA_URL || !SERVICE_KEY) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supa = createClient(SUPA_URL, SERVICE_KEY, { auth: { persistSession: false } });

const ASSET_DIR = "src/assets";
const files = (await readdir(ASSET_DIR)).filter((f) => f.endsWith(".asset.json"));
console.log(`Found ${files.length} asset pointers`);

for (const file of files) {
  const path = `${ASSET_DIR}/${file}`;
  const json = JSON.parse(await readFile(path, "utf8"));
  const original = json.original_filename || file.replace(".asset.json", "");
  const objectPath = `assets/${json.asset_id}/${original}`;

  // Skip if already migrated to a supabase URL
  if (typeof json.url === "string" && json.url.includes(SUPA_URL)) {
    console.log(`✓ already migrated: ${file}`);
    continue;
  }

  // Source URL — absolutize via lovable CDN
  const sourceUrl = json.url.startsWith("http")
    ? json.url
    : `https://lucen-sky.lovable.app${json.url}`;

  console.log(`↓ fetching ${original} (${(json.size / 1024).toFixed(0)} KB)`);
  const res = await fetch(sourceUrl);
  if (!res.ok) {
    console.error(`  ✗ fetch failed ${res.status} for ${sourceUrl}`);
    continue;
  }
  const buf = Buffer.from(await res.arrayBuffer());

  console.log(`↑ uploading ${objectPath}`);
  const { error: upErr } = await supa.storage.from(BUCKET).upload(objectPath, buf, {
    contentType: json.content_type,
    upsert: true,
  });
  if (upErr) {
    console.error(`  ✗ upload failed: ${upErr.message}`);
    continue;
  }

  const { data: signed, error: sErr } = await supa.storage
    .from(BUCKET)
    .createSignedUrl(objectPath, EXPIRES);
  if (sErr || !signed) {
    console.error(`  ✗ sign failed: ${sErr?.message}`);
    continue;
  }

  const updated = {
    ...json,
    url: signed.signedUrl,
    storage_bucket: BUCKET,
    storage_path: objectPath,
    migrated_at: new Date().toISOString(),
  };
  await writeFile(path, JSON.stringify(updated, null, 2) + "\n");
  console.log(`  ✓ rewrote ${file}`);
}

console.log("done");
