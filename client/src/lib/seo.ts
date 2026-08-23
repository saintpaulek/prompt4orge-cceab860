export type SeoRoute = {
  title: string;
  description: string;
  canonicalPath: string;
  indexable: boolean;
  ogType?: "website" | "article";
  ogImage?: string;
  author?: string;
  published?: string;
  updated?: string;
};

export const SITE_NAME = "PromptForge";
export const SITE_ORIGIN = "https://www.promptforge.com.ng";
export const DEFAULT_DESCRIPTION = "Create clear, structured AI prompts in under 60 seconds for content, marketing, code, business, and customer engagement.";
export const SHARE_IMAGE = `${SITE_ORIGIN}/manus-storage/promptforge-builder-illustration_6de8044a.png`;

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
  "/guides/prompt-engineering-basics": {
    title: "Prompt Engineering Basics: Write Clearer AI Prompts | PromptForge",
    author: "PromptForge Editorial Team",
    published: "2026-08-23",
    updated: "2026-08-23",
    description: "Learn prompt engineering basics with a practical framework for writing clearer AI instructions for ChatGPT, Gemini, Claude, and other assistants.",
    canonicalPath: "/guides/prompt-engineering-basics",
    indexable: true,
    ogType: "article",
    ogImage: `${SITE_ORIGIN}/manus-storage/promptforge-og-basics_7e652282.png`,
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
    ogImage: `${SITE_ORIGIN}/manus-storage/promptforge-og-marketing_ba2f2edd.png`,
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
    ogImage: `${SITE_ORIGIN}/manus-storage/promptforge-og-evaluation_23415810.png`,
  },
  "/guides/promptforge-workflow-case-study": {
    title: "PromptForge Workflow Case Study: From Idea to AI Brief",
    description: "Follow a practical PromptForge workflow that turns a rough campaign idea into a clear, reviewable, and reusable AI brief.",
    canonicalPath: "/guides/promptforge-workflow-case-study",
    indexable: true,
    ogType: "article",
    ogImage: `${SITE_ORIGIN}/manus-storage/promptforge-og-case-study_7c12e77a.png`,
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

export function normalizeSeoPath(pathname: string) {
  const clean = pathname.split("?")[0].replace(/\/+$/, "");
  return clean || "/";
}

export function getSeoRoute(pathname: string): SeoRoute {
  const normalized = normalizeSeoPath(pathname);
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
