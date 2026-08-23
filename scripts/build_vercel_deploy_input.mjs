import { readFileSync, writeFileSync } from "node:fs";
const files = JSON.parse(readFileSync("/tmp/promptforge-vercel-files.json", "utf8"));
const payload = {
  name: "promptforge",
  teamId: "team_Rsouh99PDwyoLQ1NSaVEmiVF",
  target: "production",
  files,
  projectSettings: {
    framework: "vite",
    installCommand: "npm install --legacy-peer-deps --no-audit --no-fund",
    buildCommand: "npm run build",
    outputDirectory: "dist/public"
  }
};
writeFileSync("/tmp/promptforge-vercel-deploy-input.json", JSON.stringify(payload));
console.log(`Prepared deployment request with ${files.length} files`);
