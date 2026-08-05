export type BuilderCategory =
  | "Social Media"
  | "Writing & Content"
  | "Marketing"
  | "Code & Development"
  | "Image Generation"
  | "Business & Strategy";

export const BUILDER_CATEGORIES: BuilderCategory[] = [
  "Social Media",
  "Writing & Content",
  "Marketing",
  "Code & Development",
  "Image Generation",
  "Business & Strategy",
];

export type CategoryConfig = {
  roles: string[];
  platforms: string[];
  tones: string[];
  goals: string[];
  deliverables: string[];
  topicPlaceholder: string;
  audiencePlaceholder: string;
};

export const CATEGORY_CONFIG: Record<BuilderCategory, CategoryConfig> = {
  "Social Media": {
    roles: ["Senior social media strategist", "Short-form video scriptwriter", "Community manager", "Influencer copywriter"],
    platforms: ["Instagram", "TikTok", "LinkedIn", "X (Twitter)", "Facebook", "YouTube Shorts", "Threads", "Pinterest"],
    tones: ["Friendly-expert", "Playful", "Bold / edgy", "Warm / conversational", "Premium / luxury"],
    goals: ["Engagement", "Awareness", "Followers", "Leads", "Sales"],
    deliverables: ["Final caption ready to publish", "3 hook variants", "One clear CTA", "5 relevant hashtags", "Suggested posting time"],
    topicPlaceholder: "launching a skincare line for busy moms",
    audiencePlaceholder: "moms 28–40 tired of complex routines",
  },
  "Writing & Content": {
    roles: ["Senior content writer", "SEO editor", "Ghostwriter", "Newsletter writer", "Technical writer"],
    platforms: ["Blog", "Newsletter", "Medium", "Documentation", "Ebook", "Script"],
    tones: ["Authoritative", "Friendly-expert", "Conversational", "Journalistic", "Academic"],
    goals: ["Education", "Organic traffic", "Thought leadership", "Newsletter signups", "Retention"],
    deliverables: ["Full draft with H2/H3 structure", "3 headline options", "Meta title + description", "Key takeaways summary", "Internal link suggestions"],
    topicPlaceholder: "how small brands can use AI without losing their voice",
    audiencePlaceholder: "solo founders new to content marketing",
  },
  Marketing: {
    roles: ["Direct-response copywriter", "Performance marketer", "Email marketing strategist", "Brand marketer"],
    platforms: ["Meta Ads", "Google Ads", "Email", "Landing page", "TikTok Ads", "SMS"],
    tones: ["Persuasive", "Bold / edgy", "Premium / luxury", "Urgent", "Friendly-expert"],
    goals: ["Sales", "Leads", "Click-through rate", "Cart recovery", "Launch buzz"],
    deliverables: ["Primary copy variant", "3 headline + hook variants", "One clear CTA", "Objection-handling lines", "A/B test angle notes"],
    topicPlaceholder: "Black Friday offer for a coaching program",
    audiencePlaceholder: "freelancers earning under $2k/month",
  },
  "Code & Development": {
    roles: ["Senior software engineer", "Code reviewer", "DevOps engineer", "QA / test engineer", "Technical architect"],
    platforms: ["React / TypeScript", "Python", "Node.js", "SQL / Postgres", "React Native", "Shell / CLI"],
    tones: ["Precise & technical", "Teaching / explanatory", "Concise", "Review-critical"],
    goals: ["Ship a feature", "Fix a bug", "Refactor safely", "Improve performance", "Learn the concept"],
    deliverables: ["Complete, runnable code", "Step-by-step explanation", "Edge cases & error handling", "Tests for the main paths", "Follow-up improvements"],
    topicPlaceholder: "add pagination to a product list with caching",
    audiencePlaceholder: "mid-level developer on a small team",
  },
  "Image Generation": {
    roles: ["Art director", "Product photographer", "Concept artist", "Brand visual designer"],
    platforms: ["Midjourney", "DALL·E", "Flux", "Ideogram", "Stable Diffusion"],
    tones: ["Cinematic", "Premium / luxury", "Playful", "Minimal", "Editorial"],
    goals: ["Product shot", "Social visual", "Brand campaign", "Concept exploration", "Thumbnail"],
    deliverables: ["Detailed production-ready prompt", "Simpler alternative variant", "Negative prompt", "Composition notes"],
    topicPlaceholder: "matte black skincare bottle on wet stone, dark bathroom, luxury feel",
    audiencePlaceholder: "premium skincare shoppers",
  },
  "Business & Strategy": {
    roles: ["Management consultant", "Startup advisor", "Operations lead", "Financial analyst", "Product manager"],
    platforms: ["Internal doc", "Slide deck", "Investor update", "Client proposal", "Notion / wiki"],
    tones: ["Authoritative", "Executive-brief", "Analytical", "Diplomatic"],
    goals: ["Decision support", "Fundraising", "Client win", "Cost reduction", "Growth plan"],
    deliverables: ["Executive summary", "Structured recommendation with rationale", "Risks & assumptions", "Next 30-day action plan", "Metrics to track"],
    topicPlaceholder: "pricing strategy for a new social media retainer",
    audiencePlaceholder: "agency owner with 6 clients",
  },
};
