import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const origin = "https://www.promptforge.com.ng";
const root = path.resolve("dist/public");

const pages = [
  {
    path: "library",
    title: "AI Prompt Library: 3,000+ Ready-to-Use Prompts | PromptForge",
    description: "Search 3,000+ structured AI prompts for marketing, social media, SEO, finance, customer service, automation, and more.",
    heading: "Browse the PromptForge library",
    summary: "Search production-ready prompt work orders across content, marketing, code, finance, customer service, and more.",
    indexable: true,
  },
  {
    path: "pricing",
    title: "PromptForge Lifetime Access | Unlock 3,000+ AI Prompts",
    description: "Get lifetime access to PromptForge's searchable prompt library and builder for ₦10,000 or $10, with access across devices.",
    heading: "Unlock the full workshop",
    summary: "Get lifetime access to the complete PromptForge library and keep your production-ready prompts ready across devices.",
    indexable: true,
  },
  {
    path: "about",
    title: "About PromptForge | Practical AI Prompt Engineering for Everyone",
    description: "PromptForge helps creators, marketers, freelancers, developers, and teams turn ideas into reliable AI instructions.",
    heading: "Professional prompt engineering, made human",
    summary: "PromptForge helps creators, marketers, freelancers, developers, and teams turn rough ideas into useful AI instructions.",
    indexable: true,
  },
  {
    path: "contact",
    title: "Contact PromptForge | Support, Partnerships & Feedback",
    description: "Contact PromptForge by email or WhatsApp for support, partnerships, product feedback, and questions about the AI prompt builder.",
    heading: "Questions, ideas, partnerships?",
    summary: "Contact the PromptForge team by email or WhatsApp. Messages are read personally.",
    indexable: true,
  },
  {
    path: "guides/prompt-engineering-basics",
    title: "Prompt Engineering Basics: Write Clearer AI Prompts | PromptForge",
    description: "Learn prompt engineering basics with a practical framework for writing clearer AI instructions for ChatGPT, Gemini, Claude, and other assistants.",
    heading: "Prompt engineering basics",
    summary: "Learn a practical framework for writing clearer AI instructions with useful context, format, tone, and constraints.",
    author: "PromptForge Editorial Team",
    published: "2026-08-23",
    updated: "2026-08-23",
    ogImage: `${origin}/manus-storage/promptforge-social-basics-1200_53b2e6c1.webp`,
    twitterImage: `${origin}/manus-storage/promptforge-social-basics-640_edea80c9.webp`,
    ogImageWidth: 1280,
    ogImageHeight: 720,
    content: ["Start with the result you need, then add the audience, format, tone, context, and constraints that change the quality of the answer.", "A good prompt is not the longest prompt. It is a clear brief that gives an AI assistant enough direction to make a useful first draft.", "Use the PromptForge Builder to turn a rough idea into a structured prompt, then browse the Library for ready-to-adapt work orders."],
    indexable: true,
  },
  {
    path: "guides/prompt-engineering-for-marketing",
    title: "Prompt Engineering for Marketing Workflows | PromptForge",
    description: "Build reusable AI marketing prompts for social media, email, SEO, ads, and customer engagement with a clearer campaign brief.",
    heading: "Prompt engineering for marketing",
    summary: "Build reusable AI marketing prompts by connecting campaign goals, audience action, channel format, and brand voice.",
    author: "PromptForge Editorial Team",
    published: "2026-08-23",
    updated: "2026-08-23",
    ogImage: `${origin}/manus-storage/promptforge-social-marketing-1200_a0a0987b.webp`,
    twitterImage: `${origin}/manus-storage/promptforge-social-marketing-640_25bba206.webp`,
    ogImageWidth: 1280,
    ogImageHeight: 720,
    content: ["Connect the campaign goal to the audience action, channel format, and brand voice so the model understands what the work needs to achieve.", "Separate strategy from copy, name the channel, and request a primary draft, rationale, and testable variation.", "For customer engagement, include consent, privacy, claims, opt-out, and human-review requirements in the brief."],
    indexable: true,
  },
  {
    path: "guides/evaluate-and-improve-ai-prompts",
    title: "How to Evaluate and Improve AI Prompts | PromptForge",
    description: "Use a practical testing and review method to improve AI prompts for clarity, consistency, usefulness, and safer reuse.",
    heading: "Evaluate and improve AI prompts",
    summary: "Test prompts against realistic inputs, inspect failure modes, and keep the revisions that improve the work.",
    author: "PromptForge Editorial Team",
    published: "2026-08-23",
    updated: "2026-08-23",
    ogImage: `${origin}/manus-storage/promptforge-social-evaluation-1200_b9569cec.webp`,
    twitterImage: `${origin}/manus-storage/promptforge-social-evaluation-640_b197fd9d.webp`,
    ogImageWidth: 1280,
    ogImageHeight: 720,
    content: ["A prompt is not finished when it produces one good answer. Test it against realistic inputs and define observable success criteria.", "Try incomplete context, competing constraints, sensitive information, and different audiences to expose failure modes before reuse.", "Keep a small evaluation set, fix the highest-impact ambiguity first, and record the strongest version for the next workflow."],
    indexable: true,
  },
  {
    path: "guides/promptforge-workflow-case-study",
    title: "PromptForge Workflow Case Study: From Idea to AI Brief",
    description: "Follow a practical PromptForge workflow that turns a rough campaign idea into a clear, reviewable, and reusable AI brief.",
    heading: "PromptForge workflow case study",
    summary: "Follow a realistic small-business campaign workflow from a rough idea to a reviewable and reusable AI brief.",
    author: "PromptForge Editorial Team",
    published: "2026-08-23",
    updated: "2026-08-23",
    ogImage: `${origin}/manus-storage/promptforge-social-case-study-1200_b7433e9e.webp`,
    twitterImage: `${origin}/manus-storage/promptforge-social-case-study-640_7a5ce97d.webp`,
    ogImageWidth: 1280,
    ogImageHeight: 720,
    content: ["Imagine a small Nigerian skincare business preparing to announce an affordable product bundle.", "PromptForge turns the rough request into a channel-specific brief with audience, voice, constraints, and a clear call to action.", "Review the result for supportable claims and audience fit before publishing, then save the strongest version for reuse."],
    indexable: true,
  },
  {
    path: "author/promptforge-editorial-team",
    title: "PromptForge Editorial Team | AI Prompt Engineering Guides",
    description: "Meet the PromptForge Editorial Team and read our practical, responsible guides to prompt engineering and AI-assisted workflows.",
    heading: "PromptForge Editorial Team",
    summary: "Practical, workflow-led education about prompt engineering, AI-assisted content, and responsible reuse.",
    content: ["The PromptForge Editorial Team creates clear guidance for creators, marketers, freelancers, developers, and small teams.", "Our approach starts with real workflows, labels demonstrations honestly, and encourages human review for high-stakes work."],
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
  const ogImage = page.ogImage ?? `${origin}/manus-storage/promptforge-builder-illustration-desktop_1bdd6b30.webp`;
  const twitterImage = page.twitterImage ?? ogImage;
  const ogImageWidth = page.ogImageWidth ?? 1440;
  const ogImageHeight = page.ogImageHeight ?? 960;
  const ogType = page.author ? "article" : "website";
  const content = (page.content ?? []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
  const article = page.author ? { "@context": "https://schema.org", "@type": "Article", "@id": `${canonical}#article`, headline: page.title, description: page.description, datePublished: page.published, dateModified: page.updated ?? page.published, mainEntityOfPage: { "@type": "WebPage", "@id": canonical }, author: { "@type": "Organization", name: page.author, url: `${origin}/author/promptforge-editorial-team` }, publisher: { "@type": "Organization", name: "PromptForge", url: origin } } : null;
  const fallback = `<noscript><main><h1>${escapeHtml(page.heading)}</h1><p>${escapeHtml(page.summary)}</p>${content}<p><a href="${canonicalEscaped}">Open PromptForge</a></p></main></noscript>`;
  let html = template;
  html = replaceTag(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = replaceTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`);
  html = replaceTag(html, /<meta name="robots" content="[^"]*" \/>/, `<meta name="robots" content="${robots}" />`);
  html = replaceTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonicalEscaped}" />`);
  html = replaceTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`);
  html = replaceTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`);
  html = replaceTag(html, /<meta property="og:type" content="[^"]*" \/>/, `<meta property="og:type" content="${ogType}" />`);
  html = replaceTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonicalEscaped}" />`);
  html = replaceTag(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${escapeHtml(ogImage)}" />`);
  html = replaceTag(html, /<meta property="og:image:width" content="[^"]*" \/>/, `<meta property="og:image:width" content="${ogImageWidth}" />`);
  html = replaceTag(html, /<meta property="og:image:height" content="[^"]*" \/>/, `<meta property="og:image:height" content="${ogImageHeight}" />`);
  html = replaceTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`);
  html = replaceTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`);
  html = replaceTag(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${escapeHtml(twitterImage)}" />`);
  html = replaceTag(html, /<meta name="twitter:image:src" content="[^"]*" \/>/, `<meta name="twitter:image:src" content="${escapeHtml(twitterImage)}" />`);
  const organization = { "@context": "https://schema.org", "@type": "Organization", "@id": `${origin}/#organization`, name: "PromptForge", url: origin, logo: `${origin}/favicon-512.png`, description: "A practical AI prompt builder and searchable prompt library for creators, marketers, freelancers, developers, and teams.", email: "saintpaulek@gmail.com", telephone: "+2347069573528", contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: "saintpaulek@gmail.com", telephone: "+2347069573528", availableLanguage: "English" } };
  const faq = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
    { "@type": "Question", name: "How quickly will I hear back?", acceptedAnswer: { "@type": "Answer", text: "Messages are read personally, and the usual response time is within 24 hours." } },
    { "@type": "Question", name: "Can I ask about partnerships or custom work?", acceptedAnswer: { "@type": "Answer", text: "Yes. Share the context, what you are trying to make, and the kind of collaboration you have in mind." } },
    { "@type": "Question", name: "Can I use WhatsApp instead?", acceptedAnswer: { "@type": "Answer", text: "Absolutely. Use the Chat on WhatsApp button for a direct conversation with PromptForge." } },
    { "@type": "Question", name: "What should I include in my message?", acceptedAnswer: { "@type": "Answer", text: "A little context, your goal, and any deadline or constraint will help us reply with a useful next step." } },
  ] };
  const schema = page.path === "contact" ? faq : page.path === "about" ? organization : null;
  if (schema) html = html.replace("</head>", `<script type="application/ld+json" data-promptforge-jsonld="${page.path === "contact" ? "faq" : "organization"}">${JSON.stringify(schema)}</script>\n  </head>`);
  if (article) html = html.replace("</head>", `<script type="application/ld+json" data-promptforge-jsonld="article">${JSON.stringify(article)}</script>\n  </head>`);
  html = html.replace("    <div id=\"root\"></div>", `    <div id="root"></div>\n    ${fallback}`);
  const destination = path.join(root, page.path, "index.html");
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
}

console.log(`Generated ${pages.length} route documents with SEO metadata in ${root}.`);
