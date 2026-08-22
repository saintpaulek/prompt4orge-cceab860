export type SeoRoute = {
  title: string;
  description: string;
  canonicalPath: string;
  indexable: boolean;
  ogType?: "website" | "article";
};

export const SITE_NAME = "PromptForge";
export const SITE_ORIGIN = "https://www.promptforge.com.ng";
export const DEFAULT_DESCRIPTION = "Forge clear, production-ready AI prompts for content, marketing, code, business, and customer engagement.";
export const SHARE_IMAGE = `${SITE_ORIGIN}/manus-storage/promptforge-builder-illustration_6de8044a.png`;

const routes: Record<string, SeoRoute> = {
  "/": {
    title: "PromptForge — Production-ready AI prompts",
    description: "Turn a rough idea into a clear, production-ready AI prompt in under 60 seconds.",
    canonicalPath: "/",
    indexable: true,
  },
  "/library": {
    title: "Prompt Library — PromptForge",
    description: "Browse searchable prompt work orders for social media, marketing, code, finance, customer service, and more.",
    canonicalPath: "/library",
    indexable: true,
  },
  "/pricing": {
    title: "Lifetime Access — PromptForge",
    description: "Unlock the complete PromptForge work-order library and keep your production-ready prompts ready across devices.",
    canonicalPath: "/pricing",
    indexable: true,
  },
  "/about": {
    title: "About PromptForge — Prompt engineering made human",
    description: "Learn how PromptForge helps creators, marketers, freelancers, developers, and teams turn ideas into useful AI instructions.",
    canonicalPath: "/about",
    indexable: true,
  },
  "/contact": {
    title: "Contact PromptForge",
    description: "Questions, ideas, or partnerships? Contact the PromptForge team by email or WhatsApp.",
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
