import { readFileSync, statSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = "/home/ubuntu/promptforge";
const includedRoots = ["api", "client", "server", "shared", "drizzle", "scripts"];
const includedFiles = ["package.json", "tsconfig.json", "tsconfig.node.json", "vite.config.ts", "vitest.config.ts", "drizzle.config.ts", "components.json", ".prettierrc", ".prettierignore", "vercel.json"];
const excluded = /(^|\/)(node_modules|dist|\.git|\.manus-logs|screenshots|walkthrough_frames|walkthrough_segments|portrait_segments|social_scroll_segments|upload|\.env|.*\.(mp4|webm|mov|wav|mp3|png|jpg|jpeg|webp|gif|tar|gz))$/i;
const files = [];

function visit(path) {
  const rel = relative(root, path).replaceAll("\\", "/");
  if (excluded.test(rel)) return;
  const info = statSync(path);
  if (info.isDirectory()) {
    for (const entry of readdirSync(path)) visit(join(path, entry));
    return;
  }
  if (info.size > 300_000) return;
  files.push({ file: rel, data: readFileSync(path).toString("base64"), encoding: "base64" });
}

for (const dir of includedRoots) visit(join(root, dir));
for (const file of includedFiles) visit(join(root, file));
writeFileSync("/tmp/promptforge-vercel-files.json", JSON.stringify(files));
console.log(`Prepared ${files.length} source files`);
