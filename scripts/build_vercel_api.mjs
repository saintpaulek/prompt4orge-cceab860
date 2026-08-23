import { build } from "esbuild";

await build({
  entryPoints: ["server/vercelApi.ts"],
  outfile: "api/index.js",
  bundle: true,
  platform: "node",
  format: "esm",
  packages: "external",
  sourcemap: false,
});

console.log("Bundled api/index.js");
