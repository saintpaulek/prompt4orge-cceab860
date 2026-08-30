import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const trackedFiles = execFileSync("git", ["ls-files", "-z"], { cwd: root }).toString().split("\0").filter(Boolean);
const rootRuntimeFiles = new Set(["package.json", "pnpm-lock.yaml", "tsconfig.json", "tsconfig.node.json", "vite.config.ts", "vercel.json", "components.json", "template.json", "client/index.html"]);
const files = trackedFiles.filter((relativePath) => {
  if (rootRuntimeFiles.has(relativePath)) return true;
  if (relativePath.startsWith("client/src/") || relativePath.startsWith("server/") || relativePath.startsWith("shared/") || relativePath.startsWith("drizzle/") || relativePath.startsWith("api/")) return true;
  if (relativePath.startsWith("client/public/")) return true;
  return relativePath === "scripts/generate-seo-pages.mjs";
});
const binaryExtensions = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".ico", ".woff", ".woff2", ".ttf", ".pdf", ".mp4", ".webm"]);

const entries = files.map((relativePath) => {
  const absolutePath = path.join(root, relativePath);
  const extension = path.extname(relativePath).toLowerCase();
  if (binaryExtensions.has(extension)) {
    return { file: relativePath, encoding: "base64", data: fs.readFileSync(absolutePath).toString("base64") };
  }
  return { file: relativePath, encoding: "utf-8", data: fs.readFileSync(absolutePath, "utf8") };
});

const payload = {
  name: "promptforge",
  target: "production",
  teamId: "team_Rsouh99PDwyoLQ1NSaVEmiVF",
  projectSettings: {
    framework: "vite",
    buildCommand: "pnpm build",
  },
  files: entries,
};

fs.writeFileSync("/tmp/promptforge-vercel-deploy.json", JSON.stringify(payload));
console.log(JSON.stringify({ fileCount: entries.length, payloadPath: "/tmp/promptforge-vercel-deploy.json" }));
