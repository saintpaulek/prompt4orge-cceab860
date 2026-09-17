import fs from "node:fs";

for (const route of ["home", "library", "auth"]) {
  const report = JSON.parse(fs.readFileSync(`audit-results/${route}.json`, "utf8"));
  const categories = Object.fromEntries(Object.entries(report.categories).map(([key, value]) => [key, Math.round((value.score ?? 0) * 100)]));
  const metrics = Object.fromEntries(["first-contentful-paint", "largest-contentful-paint", "speed-index", "total-blocking-time", "cumulative-layout-shift", "interactive"].map(id => [id, report.audits[id]?.displayValue ?? "n/a"]));
  const failed = Object.values(report.audits).filter(a => a.score !== null && a.score < 1 && a.scoreDisplayMode !== "notApplicable").sort((a, b) => (a.score ?? 1) - (b.score ?? 1)).slice(0, 12).map(a => ({ id: a.id, title: a.title, score: a.score, displayValue: a.displayValue, details: a.details?.items?.slice?.(0, 3) ?? [] }));
  console.log(JSON.stringify({ route, categories, metrics, failed }, null, 2));
}
