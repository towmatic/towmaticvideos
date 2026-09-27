#!/usr/bin/env node
// Generates an image with kie.ai and saves it into a video project's assets/images/ folder.
//
// Usage:
//   npm run image -- <project> <name> "<prompt>" [--model=<alias>] [--aspect=16:9] [--set key=value ...]
//   e.g. npm run image -- towmatic-intro hero-truck "a flatbed tow truck at dusk" --model=imagen4
//   npm run image -- --list      # show the model aliases
//
// Auth: in cloud sessions the kie.ai key is stored as an environment API credential and
// attached by the agent proxy, so no key is needed here. Locally, set KIE_API_KEY.
import { mkdirSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const API = "https://api.kie.ai/api/v1/jobs";

// Text-to-image models (docs.kie.ai/market/...). `input` maps a prompt + aspect ratio onto each
// model's own field names; `aspects` is what the model accepts.
const COMMON = ["1:1", "16:9", "9:16", "4:3", "3:4"];
const MODELS = {
  "nano-banana": {
    model: "google/nano-banana",
    use: "Cheapest; quick drafts and variations",
    aspects: [...COMMON, "3:2", "2:3", "5:4", "4:5", "21:9"],
    input: (prompt, aspect_ratio) => ({ prompt, aspect_ratio, output_format: "png" }),
  },
  "nano-banana-2": {
    model: "nano-banana-2",
    use: "Stronger all-rounder, up to 4K",
    aspects: [...COMMON, "3:2", "2:3", "5:4", "4:5", "21:9"],
    input: (prompt, aspect_ratio) => ({ prompt, aspect_ratio, resolution: "2K", output_format: "png" }),
  },
  "nano-banana-pro": {
    model: "nano-banana-pro",
    use: "Highest-quality Nano Banana; detailed scenes, up to 4K",
    aspects: [...COMMON, "3:2", "2:3", "5:4", "4:5", "21:9"],
    input: (prompt, aspect_ratio) => ({ prompt, aspect_ratio, resolution: "2K", output_format: "png" }),
  },
  "imagen4-fast": {
    model: "google/imagen4-fast",
    use: "Photoreal, fast",
    aspects: COMMON,
    input: (prompt, aspect_ratio) => ({ prompt, aspect_ratio }),
  },
  imagen4: {
    model: "google/imagen4",
    use: "Photoreal scenes (trucks, roads, lots)",
    aspects: COMMON,
    input: (prompt, aspect_ratio) => ({ prompt, aspect_ratio }),
  },
  "imagen4-ultra": {
    model: "google/imagen4-ultra",
    use: "Best photoreal from Google; hero shots",
    aspects: COMMON,
    input: (prompt, aspect_ratio) => ({ prompt, aspect_ratio }),
  },
  "gpt-image-2": {
    model: "gpt-image-2-text-to-image",
    use: "Accurate text in images, UI/screen mockups; transparent backgrounds at 1K",
    aspects: [...COMMON, "3:2", "2:3", "21:9"],
    input: (prompt, aspect_ratio) => ({ prompt, aspect_ratio, resolution: "2K" }),
  },
  "ideogram-v3": {
    model: "ideogram/v3-text-to-image",
    use: "Typography, signs, posters, logo-style graphics",
    aspects: COMMON,
    input: (prompt, aspect) => ({
      prompt,
      rendering_speed: "QUALITY",
      image_size: {
        "1:1": "square_hd",
        "16:9": "landscape_16_9",
        "9:16": "portrait_16_9",
        "4:3": "landscape_4_3",
        "3:4": "portrait_4_3",
      }[aspect],
    }),
  },
  "seedream-5-pro": {
    model: "seedream/5-pro-text-to-image",
    use: "Photoreal with strong composition, 2K",
    aspects: [...COMMON, "3:2", "2:3", "21:9"],
    input: (prompt, aspect_ratio) => ({ prompt, aspect_ratio, quality: "high", output_format: "png" }),
  },
  "flux-2-pro": {
    model: "flux-2/pro-text-to-image",
    use: "Photoreal/stylized, good prompt adherence, 2K",
    aspects: [...COMMON, "3:2", "2:3"],
    input: (prompt, aspect_ratio) => ({ prompt, aspect_ratio, resolution: "2K" }),
  },
};

const args = process.argv.slice(2);
if (args.includes("--list")) {
  for (const [alias, m] of Object.entries(MODELS)) console.log(`${alias.padEnd(16)} ${m.use}`);
  process.exit(0);
}

const overrides = {};
const flags = {};
const positional = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--set") {
    const [k, v] = args[++i].split(/=(.*)/s);
    overrides[k] = v === "true" ? true : v === "false" ? false : v;
  } else if (args[i].startsWith("--")) {
    const [k, v] = args[i].slice(2).split(/=(.*)/s);
    flags[k] = v;
  } else positional.push(args[i]);
}
const [project, name, prompt] = positional;
if (!project || !name || !prompt) {
  console.error('Usage: npm run image -- <project> <name> "<prompt>" [--model=<alias>] [--aspect=16:9]');
  process.exit(1);
}
const entry = MODELS[flags.model ?? "nano-banana"];
if (!entry) throw new Error(`Unknown model "${flags.model}". Run: npm run image -- --list`);
const aspect = flags.aspect ?? "16:9";
if (!entry.aspects.includes(aspect)) {
  throw new Error(`${flags.model} does not support --aspect=${aspect}. Use one of: ${entry.aspects.join(", ")}`);
}

const headers = { "Content-Type": "application/json" };
if (process.env.KIE_API_KEY) headers.Authorization = `Bearer ${process.env.KIE_API_KEY}`;

async function call(url, init) {
  const res = await fetch(url, { headers, ...init });
  const body = await res.json();
  if (body.code !== 200) throw new Error(`kie.ai ${res.status}/${body.code}: ${body.msg}`);
  return body.data;
}

const input = { ...entry.input(prompt, aspect), ...overrides };
const { taskId } = await call(`${API}/createTask`, {
  method: "POST",
  body: JSON.stringify({ model: entry.model, input }),
});
console.log(`Task ${taskId} (${entry.model}) submitted, waiting...`);

let record;
for (let i = 0; i < 200; i++) {
  await new Promise((r) => setTimeout(r, 3000));
  record = await call(`${API}/recordInfo?taskId=${taskId}`);
  if (record.state === "success") break;
  if (record.state === "fail") throw new Error(`Generation failed: ${record.failMsg || record.failCode}`);
}
if (record?.state !== "success") throw new Error(`Timed out waiting for task ${taskId}`);

const [url] = JSON.parse(record.resultJson).resultUrls;
const img = await fetch(url);
if (!img.ok) throw new Error(`Download failed (${img.status}) from ${new URL(url).host}: ${url}`);

const root = join(import.meta.dirname, "..");
const dir = join(root, "videos", project, "assets", "images");
mkdirSync(dir, { recursive: true });
const file = join(dir, `${name}${extname(new URL(url).pathname) || ".png"}`);
writeFileSync(file, Buffer.from(await img.arrayBuffer()));
const credits = record.creditsConsumed != null ? ` (${record.creditsConsumed} credits)` : "";
console.log(`Saved ${relative(root, file)}${credits}`);
