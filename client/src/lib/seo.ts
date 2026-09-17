export type SeoRoute = {
  title: string;
  description: string;
  canonicalPath: string;
  indexable: boolean;
  ogType?: "website" | "article";
  ogImage?: string;
  twitterImage?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  author?: string;
  published?: string;
  updated?: string;
};

export const SITE_NAME = "PromptForge";
export const SITE_ORIGIN = "https://www.promptforge.com.ng";
export const DEFAULT_DESCRIPTION = "Create clear, structured AI prompts in under 60 seconds for content, marketing, code, business, and customer engagement.";
export const SHARE_IMAGE = `${SITE_ORIGIN}/manus-storage/promptforge-builder-illustration-desktop_1bdd6b30.webp`;

const routes: Record<string, SeoRoute> = {
  "/": {
    title: "AI Prompt Builder for Better Results | PromptForge",
    description: "Create clear, structured AI prompts in under 60 seconds for content, marketing, code, business, and customer engagement.",
    canonicalPath: "/",
    indexable: true,
  },
  "/library": {
    title: "AI Prompt Library: 3,000+ Ready-to-Use Prompts | PromptForge",
    description: "Search 3,000+ structured AI prompts for marketing, social media, SEO, finance, customer service, automation, and more.",
    canonicalPath: "/library",
    indexable: true,
  },
  "/pricing": {
    title: "PromptForge Lifetime Access | Unlock 3,000+ AI Prompts",
    description: "Get lifetime access to PromptForge's searchable prompt library and builder for ₦10,000 or $10, with access across devices.",
    canonicalPath: "/pricing",
    indexable: true,
  },
  "/about": {
    title: "About PromptForge | Practical AI Prompt Engineering for Everyone",
    description: "PromptForge helps creators, marketers, freelancers, developers, and teams turn ideas into reliable AI instructions.",
    canonicalPath: "/about",
    indexable: true,
  },
  "/contact": {
    title: "Contact PromptForge | Support, Partnerships & Feedback",
    description: "Contact PromptForge by email or WhatsApp for support, partnerships, product feedback, and questions about the AI prompt builder.",
    canonicalPath: "/contact",
    indexable: true,
  },
  "/blog": {
    title: "PromptForge Blog – Practical AI Prompt Guides",
    description: "Practical AI prompt guides, ready-to-copy frameworks, and responsible workflows for Nigerian and African creators, freelancers, and businesses.",
    canonicalPath: "/blog",
    indexable: true,
  },
  "/guides/prompt-engineering-basics": {
    title: "Prompt Engineering Basics: Write Clearer AI Prompts | PromptForge",
    author: "PromptForge Editorial Team",
    published: "2026-08-23",
    updated: "2026-08-23",
    description: "Learn prompt engineering basics with a practical framework for writing clearer AI instructions for ChatGPT, Gemini, Claude, and other assistants.",
    canonicalPath: "/guides/prompt-engineering-basics",
    indexable: true,
    ogType: "article",
    ogImage: `${SITE_ORIGIN}/manus-storage/promptforge-social-basics-1200_53b2e6c1.webp`,
    twitterImage: `${SITE_ORIGIN}/manus-storage/promptforge-social-basics-640_edea80c9.webp`,
    ogImageWidth: 1280,
    ogImageHeight: 720,
  },
  "/guides/prompt-engineering-for-marketing": {
    title: "Prompt Engineering for Marketing Workflows | PromptForge",
    author: "PromptForge Editorial Team",
    published: "2026-08-23",
    updated: "2026-08-23",
    description: "Build reusable AI marketing prompts for social media, email, SEO, ads, and customer engagement with a clearer campaign brief.",
    canonicalPath: "/guides/prompt-engineering-for-marketing",
    indexable: true,
    ogType: "article",
    ogImage: `${SITE_ORIGIN}/manus-storage/promptforge-social-marketing-1200_a0a0987b.webp`,
    twitterImage: `${SITE_ORIGIN}/manus-storage/promptforge-social-marketing-640_25bba206.webp`,
    ogImageWidth: 1280,
    ogImageHeight: 720,
  },
  "/guides/evaluate-and-improve-ai-prompts": {
    title: "How to Evaluate and Improve AI Prompts | PromptForge",
    author: "PromptForge Editorial Team",
    published: "2026-08-23",
    updated: "2026-08-23",
    description: "Use a practical testing and review method to improve AI prompts for clarity, consistency, usefulness, and safer reuse.",
    canonicalPath: "/guides/evaluate-and-improve-ai-prompts",
    indexable: true,
    ogType: "article",
    ogImage: `${SITE_ORIGIN}/manus-storage/promptforge-social-evaluation-1200_b9569cec.webp`,
    twitterImage: `${SITE_ORIGIN}/manus-storage/promptforge-social-evaluation-640_b197fd9d.webp`,
    ogImageWidth: 1280,
    ogImageHeight: 720,
  },
  "/guides/promptforge-workflow-case-study": {
    title: "PromptForge Workflow Case Study: From Idea to AI Brief",
    description: "Follow a practical PromptForge workflow that turns a rough campaign idea into a clear, reviewable, and reusable AI brief.",
    canonicalPath: "/guides/promptforge-workflow-case-study",
    indexable: true,
    ogType: "article",
    ogImage: `${SITE_ORIGIN}/manus-storage/promptforge-social-case-study-1200_b7433e9e.webp`,
    twitterImage: `${SITE_ORIGIN}/manus-storage/promptforge-social-case-study-640_7a5ce97d.webp`,
    ogImageWidth: 1280,
    ogImageHeight: 720,
    author: "PromptForge Editorial Team",
    published: "2026-08-23",
    updated: "2026-08-23",
  },
  "/author/promptforge-editorial-team": {
    title: "PromptForge Editorial Team | AI Prompt Engineering Guides",
    description: "Meet the PromptForge Editorial Team and read our practical, responsible guides to prompt engineering and AI-assisted workflows.",
    canonicalPath: "/author/promptforge-editorial-team",
    indexable: true,
  },
  "/auth": {
    title: "Sign in — PromptForge",
    description: "Sign in to your PromptForge account.",
    canonicalPath: "/auth",
    indexable: false,
  },
  "/account": {
    title: "Your account — PromptForge",
    description: "Manage your PromptForge account and lifetime access.",
    canonicalPath: "/account",
    indexable: false,
  },
  "/admin/unlocks": {
    title: "Admin unlocks — PromptForge",
    description: "Protected PromptForge administrator workspace.",
    canonicalPath: "/admin/unlocks",
    indexable: false,
  },
  "/404": {
    title: "Page not found — PromptForge",
    description: "The requested PromptForge page could not be found.",
    canonicalPath: "/404",
    indexable: false,
  },
};

const blogSeo: Record<string, { title: string; description: string }> = {
  "best-ai-prompts-for-whatsapp-business-nigeria": { title: "Best AI Prompts for WhatsApp Business in Nigeria (2026)", description: "Build clearer WhatsApp customer replies, campaigns, payment reminders, and follow-up workflows for Nigerian businesses." },
  "midjourney-image-prompts-that-look-african": { title: "How to Create Midjourney / Image Prompts That Actually Look African", description: "A practical guide to place, people, styling, light, and cultural detail for grounded African visual concepts." },
  "prompt-engineering-cheat-sheet-freelancers": { title: "Prompt Engineering Cheat Sheet for Freelancers", description: "A compact framework for turning client goals into reusable prompts for research, proposals, content, delivery, and review." },
  "ready-to-use-ai-prompts-nigerian-social-media-managers": { title: "15 Ready-to-Use AI Prompts for Nigerian Social Media Managers", description: "Practical prompts for content calendars, captions, community replies, campaign ideas, and performance reviews." },
  "write-better-client-proposals-with-ai": { title: "How to Write Better Client Proposals with AI (Freelancer Guide)", description: "Use AI to clarify scope, mirror client priorities, show your method, and reduce proposal ambiguity." },
  "chatgpt-prompts-selling-instagram-tiktok-nigeria": { title: "Best ChatGPT Prompts for Selling on Instagram & TikTok in Nigeria", description: "Create platform-native hooks, product explanations, objection replies, and short-form sales assets." },
  "ai-prompts-virtual-assistants-remote-workers-africa": { title: "AI Prompts for Virtual Assistants & Remote Workers in Africa", description: "Prompts for inbox triage, meeting notes, research, SOPs, handovers, and client communication." },
  "high-converting-sales-copy-ai-nigerian-examples": { title: "How to Generate High-Converting Sales Copy with AI (Nigerian Examples)", description: "A practical framework for offers, objections, proof, urgency, and calls to action without unsupported hype." },
  "free-vs-paid-ai-prompt-tools-creators": { title: "Free vs Paid AI Prompt Tools – Honest Comparison for Creators", description: "How to decide whether a prompt tool earns a place in your workflow based on repeat use and time saved." },
  "promptforge-build-production-ready-prompts-60-seconds": { title: "PromptForge Tutorial: How to Build Production-Ready Prompts in 60 Seconds", description: "A step-by-step tour of choosing a category, shaping the brief, reviewing output, and saving a reusable prompt." },
  "ai-image-prompt-formulas-african-brands-creators": { title: "10 AI Image Prompt Formulas That Work for African Brands & Creators", description: "Reusable visual formulas for product scenes, portraits, campaigns, editorial images, and social content." },
  "nigerian-businesses-ai-prompts-save-time-money": { title: "How Nigerian Businesses Are Using AI Prompts to Save Time & Make More Money", description: "Where structured prompts can improve customer service, sales follow-up, content operations, and internal documents." },
};

export function normalizeSeoPath(pathname: string) {
  const clean = pathname.split("?")[0].replace(/\/+$/, "");
  return clean || "/";
}

export function getSeoRoute(pathname: string): SeoRoute {
  const normalized = normalizeSeoPath(pathname);
  if (normalized.startsWith("/blog/")) {
    const article = blogSeo[normalized.replace("/blog/", "")];
    if (article) return {
      title: `${article.title} | PromptForge`,
      description: article.description,
      canonicalPath: normalized,
      indexable: true,
      ogType: "article",
      author: "PromptForge Editorial Team",
      published: "2026-09-17",
      updated: "2026-09-17",
    };
  }
  return routes[normalized] ?? {
    title: "Page not found — PromptForge",
    description: "The requested PromptForge page could not be found.",
    canonicalPath: "/404",
    indexable: false,
  };
}

export function absoluteCanonical(pathname: string) {
  return `${SITE_ORIGIN}${pathname === "/" ? "/" : pathname}`;
}

export function getSeoDocument(routePath: string) {
  const route = getSeoRoute(routePath);
  return {
    ...route,
    canonical: absoluteCanonical(route.canonicalPath),
    robots: route.indexable ? "index, follow" : "noindex, nofollow",
    ogType: route.ogType ?? "website",
    ogImage: route.ogImage ?? SHARE_IMAGE,
    twitterImage: route.twitterImage ?? route.ogImage ?? SHARE_IMAGE,
    ogImageWidth: route.ogImageWidth ?? 1440,
    ogImageHeight: route.ogImageHeight ?? 960,
  };
}

export function createOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_ORIGIN}/#organization`,
    name: SITE_NAME,
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/favicon-512.png`,
    description: "A practical AI prompt builder and searchable prompt library for creators, marketers, freelancers, developers, and teams.",
    email: "saintpaulek@gmail.com",
    telephone: "+2347069573528",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "saintpaulek@gmail.com",
      telephone: "+2347069573528",
      availableLanguage: "English",
    },
  };
}

export function createContactFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How quickly will I hear back?",
        acceptedAnswer: { "@type": "Answer", text: "Messages are read personally, and the usual response time is within 24 hours." },
      },
      {
        "@type": "Question",
        name: "Can I ask about partnerships or custom work?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Share the context, what you are trying to make, and the kind of collaboration you have in mind." },
      },
      {
        "@type": "Question",
        name: "Can I use WhatsApp instead?",
        acceptedAnswer: { "@type": "Answer", text: "Absolutely. Use the Chat on WhatsApp button for a direct conversation with PromptForge." },
      },
      {
        "@type": "Question",
        name: "What should I include in my message?",
        acceptedAnswer: { "@type": "Answer", text: "A little context, your goal, and any deadline or constraint will help us reply with a useful next step." },
      },
    ],
  };
}

export function createGuideArticleJsonLd(pathname: string) {
  const route = getSeoRoute(pathname);
  if (!route.author || !route.published) return null;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${SITE_ORIGIN}${route.canonicalPath}#article`,
    headline: route.title,
    description: route.description,
    datePublished: route.published,
    dateModified: route.updated ?? route.published,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteCanonical(route.canonicalPath) },
    author: { "@type": "Organization", name: route.author, url: `${SITE_ORIGIN}/author/promptforge-editorial-team` },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_ORIGIN, logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/favicon-512.png` } },
    image: SHARE_IMAGE,
  };
}

export function createWebApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "BusinessApplication",
    featureList: ["AI prompt builder", "Searchable prompt library", "Prompt export tools", "Cross-device lifetime access"],
    operatingSystem: "Web",
    url: SITE_ORIGIN,
    description: DEFAULT_DESCRIPTION,
    offers: {
      "@type": "Offer",
      price: "10",
      priceCurrency: "USD",
      category: "lifetime access",
      url: `${SITE_ORIGIN}/pricing`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_ORIGIN,
    },
  };
}
