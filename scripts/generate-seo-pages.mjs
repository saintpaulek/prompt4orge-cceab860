import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const origin = "https://www.promptforge.com.ng";
const root = path.resolve("dist/public");

const pages = [
  {
    path: "library",
    title: "Prompt Library — PromptForge",
    description: "Browse searchable prompt work orders for social media, marketing, code, finance, customer service, and more.",
    heading: "Browse the PromptForge library",
    summary: "Search production-ready prompt work orders across content, marketing, code, finance, customer service, and more.",
    indexable: true,
  },
  {
    path: "pricing",
    title: "Lifetime Access — PromptForge",
    description: "Unlock the complete PromptForge work-order library and keep your production-ready prompts ready across devices.",
    heading: "Unlock the full workshop",
    summary: "Get lifetime access to the complete PromptForge library and keep your production-ready prompts ready across devices.",
    indexable: true,
  },
  {
    path: "about",
    title: "About PromptForge — Prompt engineering made human",
    description: "Learn how PromptForge helps creators, marketers, freelancers, developers, and teams turn ideas into useful AI instructions.",
    heading: "Professional prompt engineering, made human",
    summary: "PromptForge helps creators, marketers, freelancers, developers, and teams turn rough ideas into useful AI instructions.",
    indexable: true,
  },
  {
    path: "contact",
    title: "Contact PromptForge",
    description: "Questions, ideas, or partnerships? Contact the PromptForge team by email or WhatsApp.",
    heading: "Questions, ideas, partnerships?",
    summary: "Contact the PromptForge team by email or WhatsApp. Messages are read personally.",
    indexable: true,
  },
  {
    path: "auth",
    title: "Sign in — PromptForge",
    description: "Sign in to your PromptForge account.",
    heading: "Sign in to PromptForge",
    summary: "Sign in to access your PromptForge account.",
    indexable: false,
  },
  {
    path: "account",
    title: "Your account — PromptForge",
    description: "Manage your PromptForge account and lifetime access.",
    heading: "Your PromptForge account",
    summary: "Manage your account and lifetime access after signing in.",
    indexable: false,
  },
  {
    path: "admin/unlocks",
    title: "Admin unlocks — PromptForge",
    description: "Protected PromptForge administrator workspace.",
    heading: "PromptForge administrator workspace",
    summary: "This protected workspace is available to authorized administrators after sign-in.",
    indexable: false,
  },
];

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function replaceTag(html, pattern, replacement) {
  return html.replace(pattern, replacement);
}

const template = await readFile(path.join(root, "index.html"), "utf8");

for (const page of pages) {
  const canonical = `${origin}/${page.path}`;
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const canonicalEscaped = escapeHtml(canonical);
  const robots = page.indexable ? "index, follow" : "noindex, nofollow";
  const fallback = `<noscript><main><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.summary)}</p><p><a href="${canonicalEscaped}">Open PromptForge</a></p></main></noscript>`;
  let html = template;
  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = replaceTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`);
  html = replaceTag(html, /<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${robots}" />`);
  html = replaceTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonicalEscaped}" />`);
  html = replaceTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`);
  html = replaceTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`);
  html = replaceTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonicalEscaped}" />`);
  html = replaceTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`);
  html = replaceTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`);
  html = html.replace("    <div id=\"root\"></div>", `    <div id="root"></div>\n    ${fallback}`);
  const destination = path.join(root, page.path, "index.html");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
}

console.log(`Generated ${pages.length} route documents with SEO metadata in ${root}.`);
