#!/usr/bin/env node
// Scaffolds a new HyperFrames project under videos/<name> and vendors GSAP into it.
// Usage: npm run new -- <name> [extra hyperframes init flags, e.g. --resolution=portrait]
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const HF = "hyperframes@0.8.80";
const [name, ...flags] = process.argv.slice(2);
if (!name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) {
  console.error("Usage: npm run new -- <kebab-case-name> [init flags]");
  process.exit(1);
}

const videosDir = join(import.meta.dirname, "..", "videos");
const projectDir = join(videosDir, name);
execFileSync("npx", ["--yes", HF, "init", name, "--non-interactive", ...flags], {
  cwd: videosDir,
  stdio: "inherit",
  env: { ...process.env, HYPERFRAMES_SKIP_SKILLS: "1" },
});

// Load GSAP from a local copy instead of the CDN so renders work offline and behind proxies.
mkdirSync(join(projectDir, "assets"), { recursive: true });
copyFileSync(join(videosDir, "towmatic-intro", "assets", "gsap.min.js"), join(projectDir, "assets", "gsap.min.js"));
const indexPath = join(projectDir, "index.html");
const html = readFileSync(indexPath, "utf8").replace(
  /<script src="https:\/\/cdn\.jsdelivr\.net\/npm\/gsap@[^"]+"><\/script>/,
  '<script src="assets/gsap.min.js"></script>',
);
writeFileSync(indexPath, html);

console.log(`\nCreated videos/${name}. Next: cd videos/${name} && npm run check`);
