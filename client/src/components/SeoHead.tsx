import { useEffect } from "react";
import { useLocation } from "wouter";
import { createContactFaqJsonLd, createGuideArticleJsonLd, createOrganizationJsonLd, createWebApplicationJsonLd, getSeoDocument } from "@/lib/seo";

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement("meta");
    if (property) meta.setAttribute("property", name);
    else meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let link = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

export default function SeoHead() {
  const [location] = useLocation();

  useEffect(() => {
    const seo = getSeoDocument(location);
    document.title = seo.title;
    setMeta("description", seo.description);
    setMeta("robots", seo.robots);
    setMeta("og:title", seo.title, true);
    setMeta("og:description", seo.description, true);
    setMeta("og:type", seo.ogType, true);
    setMeta("og:url", seo.canonical, true);
    setMeta("og:site_name", "PromptForge", true);
    setMeta("og:image", seo.ogImage, true);
    setMeta("og:image:width", String(seo.ogImageWidth), true);
    setMeta("og:image:height", String(seo.ogImageHeight), true);
    setMeta("og:image:alt", "PromptForge AI prompt-building workbench", true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", seo.title);
    setMeta("twitter:description", seo.description);
    setMeta("twitter:image", seo.twitterImage);
    setMeta("twitter:image:src", seo.twitterImage);
    setMeta("twitter:image:alt", "PromptForge AI prompt-building workbench");
    setLink("canonical", seo.canonical);

    const setJsonLd = (kind: string, value: object | null) => {
      const selector = `script[data-promptforge-jsonld="${kind}"]`;
      const existing = document.head.querySelector<HTMLScriptElement>(selector);
      if (!value) { existing?.remove(); return; }
      const script = existing ?? document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.promptforgeJsonld = kind;
      script.textContent = JSON.stringify(value);
      if (!existing) document.head.appendChild(script);
    };
    setJsonLd("application", createWebApplicationJsonLd());
    setJsonLd("organization", location === "/" || location === "/about" ? createOrganizationJsonLd() : null);
    setJsonLd("faq", location === "/contact" ? createContactFaqJsonLd() : null);
    setJsonLd("article", createGuideArticleJsonLd(location));
  }, [location]);

  return null;
}
