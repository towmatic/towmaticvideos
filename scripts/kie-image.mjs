#!/usr/bin/env node
// Generates an image with kie.ai and saves it into a video project's assets/images/ folder.
//
// Usage:
//   npm run image -- <project> <name> "<prompt>" [--model=google/nano-banana] [--size=16:9]
//   e.g. npm run image -- towmatic-intro hero-truck "a flatbed tow truck at dusk, cinematic"
//
// Auth: in cloud sessions the kie.ai key is stored as an environment API credential and
// attached by the agent proxy, so no key is needed here. Locally, set KIE_API_KEY.
import { mkdirSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const API = "https://api.kie.ai/api/v1/jobs";
const args = process.argv.slice(2);
const flags = Object.fromEntries(
  args.filter((a) => a.startsWith("--")).map((a) => a.slice(2).split(/=(.*)/s).slice(0, 2)),
);
const [project, name, prompt] = args.filter((a) => !a.startsWith("--"));
if (!project || !name || !prompt) {
  console.error('Usage: npm run image -- <project> <name> "<prompt>" [--model=...] [--size=16:9]');
  process.exit(1);
}
const model = flags.model ?? "google/nano-banana";
const size = flags.size ?? "16:9";

const headers = { "Content-Type": "application/json" };
if (process.env.KIE_API_KEY) headers.Authorization = `Bearer ${process.env.KIE_API_KEY}`;

async function call(url, init) {
  const res = await fetch(url, { headers, ...init });
  const body = await res.json();
  if (body.code !== 200) throw new Error(`kie.ai ${res.status}/${body.code}: ${body.msg}`);
  return body.data;
}

const { taskId } = await call(`${API}/createTask`, {
  method: "POST",
  body: JSON.stringify({ model, input: { prompt, output_format: "png", image_size: size } }),
});
console.log(`Task ${taskId} (${model}) submitted, waiting...`);

let record;
for (let i = 0; i < 120; i++) {
  await new Promise((r) => setTimeout(r, 3000));
  record = await call(`${API}/recordInfo?taskId=${taskId}`);
  if (record.state === "success") break;
  if (record.state === "fail") throw new Error(`Generation failed: ${record.failMsg || record.failCode}`);
}
if (record?.state !== "success") throw new Error(`Timed out waiting for task ${taskId}`);

const [url] = JSON.parse(record.resultJson).resultUrls;
const img = await fetch(url);
if (!img.ok) throw new Error(`Download failed (${img.status}) from ${new URL(url).host}: ${url}`);

const dir = join(import.meta.dirname, "..", "videos", project, "assets", "images");
mkdirSync(dir, { recursive: true });
const file = join(dir, `${name}${extname(new URL(url).pathname) || ".png"}`);
writeFileSync(file, Buffer.from(await img.arrayBuffer()));
console.log(`Saved ${file.slice(file.indexOf("videos/"))}`);
