export type SeoRoute = {
  title: string;
  description: string;
  canonicalPath: string;
  indexable: boolean;
  ogType?: "website" | "article";
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
    ogImage: SHARE_IMAGE,
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
