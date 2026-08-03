export type Prompt = {
  id: number;
  cat: string;
  title: string;
  tags: string[];
  prompt: string;
};

export const CATEGORIES = [
  "SMM",
  "VA Tasks",
  "Customer Service",
  "Automation Logic",
  "SEO",
  "Email Marketing",
  "Sales & Copywriting",
  "Content Strategy",
  "Image Generation",
  "Video & Shorts",
  "Blogging & Articles",
  "Ecommerce & Product",
  "Freelancing & Clients",
  "Branding & Identity",
  "Ads & Paid Media",
  "ChatGPT Productivity",
  "Business & Strategy",
  "Education & Learning",
  "Personal Development",
  "Finance & Admin",
] as const;

export function isFreePrompt(id: number) {
  return (id - 1) % 50 < 5;
}

/** Short one-line description used on library cards. */
export function promptDesc(p: Prompt) {
  const line =
    p.prompt
      .split("\n")
      .map((l) => l.trim())
      .find((l) => l && !l.startsWith("-")) ?? p.title;
  const clean = line.replace(/^(TASK:|You are|Act as)\s*/i, "").replace(/\[|\]/g, "");
  return clean.length > 120 ? clean.slice(0, 117) + "…" : clean;
}


// Per-category title seeds (50 each) and prompt template builders.
type Block = {
  cat: string;
  titles: string[];
  build: (title: string, id: number) => { tags: string[]; prompt: string };
};

const smmTitles = [
  "Instagram carousel outline", "Viral hook generator", "Weekly content calendar", "Hashtag research pack",
  "Reels script (15s)", "TikTok trend adaptation", "LinkedIn thought-leader post", "X (Twitter) thread",
  "Competitor content audit", "Brand voice guidelines", "Story sequence (5 frames)", "Engagement question ideas",
  "UGC campaign brief", "Meme-style caption pack", "Instagram bio rewrite", "Facebook group post",
  "Pinterest pin descriptions", "Threads launch plan", "YouTube community post", "Content pillar map",
  "Monthly performance report", "Giveaway announcement", "Product launch teaser series", "Behind-the-scenes post",
  "Founder story caption", "Testimonial repurpose", "Poll/quiz idea bank", "Seasonal campaign brief",
  "Reels hook A/B variants", "Caption CTA rewrites", "Story sticker strategy", "Cross-posting adapter",
  "Influencer outreach DM", "Collab post proposal", "Trend-jack response", "Community FAQ post",
  "Milestone celebration post", "Educational carousel (10 slides)", "Case study caption", "Micro-influencer brief",
  "Content batching plan (30 posts)", "Hook + CTA library", "Instagram reset week plan", "Niche positioning post",
  "Story highlight covers plan", "Employee spotlight post", "Comparison carousel", "Myth-busting post",
  "Behavior-change campaign", "Year-in-review recap",
];

const vaTitles = [
  "Professional client email", "Meeting follow-up email", "SOP writer", "Weekly status report",
  "Inbox triage rules", "Calendar scheduling reply", "Onboarding welcome doc", "Client offboarding email",
  "Project kickoff agenda", "Zoom meeting summary", "Task delegation memo", "Vendor negotiation email",
  "Research brief summary", "Travel itinerary draft", "Expense report explainer", "Time-off request",
  "Polite decline email", "Refund request response", "Payment reminder email", "Contract review notes",
  "LinkedIn intro message", "Cold outreach email", "Recruitment screening questions", "Interview thank-you email",
  "Client feedback survey", "NDA cover email", "Data entry validation checklist", "Weekly newsletter draft",
  "Slack update template", "Notion doc structure", "Google Docs table of contents", "Standard reply library",
  "Meeting agenda (30 min)", "Executive brief (1 page)", "Task priority matrix", "Voicemail script",
  "Chase-up email chain", "Testimonial request email", "Case study interview questions", "Project status stoplight",
  "Team standup template", "KPI monthly dashboard", "Vendor comparison table", "Contractor invoice email",
  "Handover doc template", "Client birthday message", "Referral request email", "Follow-up drip",
  "Escalation memo", "Personal assistant morning brief",
];

const csTitles = [
  "Refund approval reply", "Refund denial (empathetic)", "Order status update", "Shipping delay apology",
  "Damaged item response", "Wrong item response", "Return instructions", "Cancellation reply",
  "VIP customer thank-you", "Angry customer de-escalation", "Negative review response", "Positive review reply",
  "Chargeback dispute reply", "Warranty claim reply", "Service outage announcement", "Downtime status update",
  "Bug acknowledgement reply", "Feature request thank-you", "FAQ article rewrite", "Help center article outline",
  "Live chat greeting scripts", "Escalation handoff note", "Refund policy explainer", "Subscription pause reply",
  "Subscription cancel save", "Upgrade upsell reply", "Renewal reminder message", "Payment failed reply",
  "Address change confirmation", "Password reset reply", "Account recovery script", "Fraud alert reply",
  "Ticket auto-response", "Follow-up satisfaction survey", "Complaint acknowledgement", "Product misuse guidance",
  "How-to reply with screenshots", "Multi-channel unified response", "Bilingual reply template", "Holiday support hours notice",
  "Support macro pack", "Root-cause explanation reply", "Recall notification email", "Beta program invite reply",
  "Feature deprecation notice", "Data privacy inquiry reply", "GDPR data export reply", "Compliment reply",
  "Chat closing script", "Post-resolution survey",
];

const autoTitles = [
  "Zapier flow spec", "Make.com scenario spec", "n8n workflow spec", "Airtable automation script",
  "CRM lead sync flow", "Slack alert automation", "Google Sheets → CRM sync", "Form → email → Trello",
  "Webhook payload validator", "Error-handling branch design", "Retry logic pattern", "Rate limit strategy",
  "Chatbot decision tree", "AI email triage flow", "Auto tag & assign tickets", "Duplicate lead filter",
  "Lead scoring formula", "Onboarding drip automation", "Abandoned-cart recovery flow", "Review request automation",
  "Calendar → invoice flow", "Stripe → accounting sync", "Shopify → Klaviyo flow", "New sale → team Slack",
  "SLA breach alert", "Backup + audit routine", "Data cleanup schedule", "Duplicate contact merger",
  "Weekly report generator", "AI meeting notes distributor", "Notion → Docs publisher", "Content approval flow",
  "Social post scheduler", "RSS → newsletter builder", "Support ticket auto-reply", "New review → CS macro",
  "Refund → finance flow", "Churn signal detector", "Renewal reminder automation", "Doc signing chase",
  "Payroll data pipeline", "Employee onboarding checklist", "Time-tracking to invoicing", "KPI daily digest",
  "Anomaly alert monitor", "Chat handoff to human", "Multi-step OTP verification", "GDPR data-deletion flow",
  "Bulk enrichment automation", "Automation health audit",
];

const seoTitles = [
  "Keyword cluster research", "Long-tail keyword list", "Meta title + description", "Blog post outline",
  "Pillar page structure", "Cluster interlinking plan", "On-page SEO audit", "Technical SEO checklist",
  "Schema markup blueprint", "Local SEO optimization", "GMB post scheduler", "Google Business Q&A",
  "Content gap analysis", "Competitor backlink review", "Broken link recovery outreach", "Guest post pitch",
  "HARO expert response", "Featured snippet rewrite", "People Also Ask targeting", "Zero-click SERP strategy",
  "Content refresh brief", "E-E-A-T upgrade plan", "Author bio optimization", "Site architecture map",
  "URL slug optimizer", "Image alt-text batch", "Core Web Vitals fixes", "Mobile UX audit",
  "International SEO plan", "Hreflang implementation", "Sitemap review", "Robots.txt review",
  "Canonical strategy", "SaaS SEO landing template", "Ecommerce category SEO", "Product page SEO rewrite",
  "FAQ schema rewrites", "Video SEO description", "YouTube tag research", "Podcast SEO show notes",
  "Programmatic SEO plan", "Link-worthy asset ideas", "Digital PR pitch", "Comparison post outline",
  "Alternatives-to post outline", "Best-of listicle outline", "Location page template", "Persona-driven content plan",
  "Topical authority roadmap", "90-day SEO plan",
];

const emailTitles = [
  "Welcome sequence (5 emails)", "Newsletter template", "Product launch email", "Waitlist launch email",
  "Cart abandonment email", "Browse abandonment email", "Post-purchase thank-you", "Review request email",
  "Referral program email", "Loyalty tier upgrade", "Re-engagement (win-back)", "Sunset (last chance)",
  "Subject line generator (10)", "Preheader rewrites", "A/B test hypothesis brief", "Segment brief",
  "Cold outreach sequence", "Follow-up sequence (4x)", "Event invite email", "Event reminder email",
  "Webinar promo sequence", "Post-webinar email", "Downgrade prevention email", "Upgrade pitch email",
  "Free trial start email", "Trial midpoint nudge", "Trial ending email", "Expired trial email",
  "Renewal email", "Failed payment email", "Milestone/anniversary email", "Birthday email",
  "Seasonal campaign kit", "Black Friday sequence", "Flash sale email", "Waitlist launch to open",
  "Onboarding day 0/1/3/7", "Case study spotlight email", "Founder personal note", "AMA invitation email",
  "New feature announcement", "Beta invite email", "Community roundup email", "Weekly digest email",
  "Curated resources email", "Survey / NPS email", "Ambassador program invite", "Podcast episode drop",
  "Referral thank-you email", "Deliverability warm-up plan",
];

const salesTitles = [
  "Landing page copy", "Long-form sales page", "Value proposition rewrite", "Hero section variants",
  "Offer stack builder", "Guarantee copy variants", "Objection handling script", "Cold email framework",
  "LinkedIn cold DM", "Discovery call script", "Demo script (SaaS)", "Follow-up after demo",
  "Proposal cover letter", "Pricing page rewrite", "Feature vs benefit rewrite", "Comparison table copy",
  "Case study rewrite", "Testimonial harvesting script", "Product description (ecom)", "Ad copy (Meta)",
  "Ad copy (Google search)", "Ad copy (TikTok)", "YouTube ad script (30s)", "Retargeting ad set",
  "Webinar registration page", "Tripwire offer copy", "Order bump copy", "One-time upsell copy",
  "Downsell offer copy", "Thank-you page copy", "About page rewrite", "Founder story sales page",
  "Cold call opener", "Objection: 'too expensive'", "Objection: 'not the right time'", "Objection: 'need to think'",
  "Reactivation offer", "Win-back call script", "Referral partner pitch", "Affiliate recruitment email",
  "White-label pitch", "Enterprise outreach", "Discovery questionnaire", "Onboarding call agenda",
  "Sales sequence (7 touches)", "Renewal negotiation script", "Contract close email", "Loss review interview",
  "Persona-based CTA pack", "Micro-copy for buttons",
];

const contentTitles = [
  "Content pillar map", "Editorial calendar (90 days)", "Batching plan (1 month)", "Repurposing matrix",
  "Brand voice guide", "Tone-of-voice examples", "Style guide (short)", "Hooks library (50)",
  "Content audit template", "Persona → topic map", "Funnel-stage content grid", "TOFU idea generator",
  "MOFU idea generator", "BOFU idea generator", "SEO + Social bridge plan", "One-to-many repurpose",
  "Long-form → 5 shorts", "Podcast → 10 assets", "Newsletter → 4 posts", "Blog → carousel + Reel",
  "Content moat plan", "Storytelling framework", "Signature framework builder", "Recurring series ideas",
  "Content sprint plan (7 days)", "Weekly theme rotator", "Founder POV essay outline", "Contrarian take generator",
  "Trend-report content plan", "Yearly content strategy", "Quarterly OKRs (content)", "Content KPI dashboard",
  "Voice/tone audit", "Community-led content plan", "UGC content plan", "Employee-generated content plan",
  "Educational vs promotional mix", "80/20 posting split", "Personal brand pillars", "Case study library plan",
  "Ambassador content brief", "Podcast content brief", "YouTube content brief", "Newsletter content brief",
  "Blog content brief", "Landing page content brief", "Sales enablement content brief", "Content localization brief",
  "Content sunset plan", "Content-to-lead journey map",
];

const imgTitles = [
  "Luxury product hero shot", "UGC-style testimonial photo", "Instagram carousel background", "YouTube thumbnail scene (no text)",
  "Brand color moodboard", "Flat-lay product arrangement", "Founder headshot portrait", "App UI mockup in device",
  "Seasonal campaign visual", "Before/after split scene", "Food photography scene", "Fashion lookbook pose",
  "Abstract brand pattern", "3D icon set (consistent)", "Meta ad creative", "TikTok ad creative",
  "Instagram story background", "Cinematic film still", "Product on wet stone (luxury)", "Skincare bathroom scene",
  "Studio softbox product shot", "Neon cyberpunk brand shot", "Golden hour lifestyle shot", "Minimalist poster design",
  "Vector flat illustration", "Watercolor brand illustration", "Anime-style character", "Retro 90s ad style",
  "Editorial magazine spread", "Ecommerce packshot (white)", "Ecommerce packshot (colored)", "Brand identity mockup",
  "Merchandise mockup (tee)", "Merchandise mockup (mug)", "Sticker sheet layout", "Podcast cover art",
  "Ebook cover design", "Course thumbnail", "Instagram reel cover", "YouTube channel banner",
  "LinkedIn banner", "Twitter/X header image", "Website hero background", "Blog post featured image",
  "Team photo composite", "Event backdrop banner", "Founder LinkedIn portrait", "Real estate listing photo",
  "Restaurant menu hero", "Holiday sale creative",
];

const videoTitles = [
  "YouTube long-form script (10 min)", "YouTube Shorts script (45s)", "Reels script with hook", "TikTok script (60s)",
  "Thumbnail concept + text", "Video hook (first 3s)", "Storyboard (6 shots)", "B-roll shot list",
  "Voice-over script", "Talking-head outline", "Explainer video script", "Tutorial script",
  "Product demo script", "Founder story script", "Testimonial edit script", "Case study video script",
  "Behind-the-scenes reel", "Trend-jack reel script", "Duet/stitch response script", "Live stream outline",
  "Podcast video intro", "YouTube channel trailer", "About-us video script", "Recruitment video script",
  "Ad script (skippable 30s)", "Ad script (non-skip 15s)", "TikTok ad hook variants", "Meta reel ad script",
  "Course lesson script", "Sales VSL script (5 min)", "Webinar teaser video", "Event recap reel",
  "Announcement video", "Launch day reel", "Countdown video series", "Q&A short script",
  "Myth-busting short", "Data/chart short", "Fast-cut listicle short", "Day-in-the-life vlog",
  "Client win recap video", "Employee spotlight video", "Culture reel outline", "How-it-works animation script",
  "Reel caption + on-screen text", "CTA card script", "End screen script", "Retention loop design",
  "Repurpose long → 5 shorts", "Weekly YouTube batch plan",
];

const blocks: Block[] = [
  {
    cat: "SMM", titles: smmTitles,
    build: (t) => ({
      tags: ["Social media", "Content"],
      prompt: `You are a senior social media strategist.
TASK: ${t} for [brand/creator name] in the [industry/niche] niche.
AUDIENCE: [target audience + pain points].
PLATFORM: [Instagram / TikTok / LinkedIn / X / Facebook].
GOAL: [awareness / engagement / conversion].
BRAND VOICE: [tone e.g. friendly-expert, playful, premium].
DELIVERABLES:
- Full copy ready to publish
- 3 hook variants
- Suggested hashtags (mix of niche + broad)
- Best time to post + posting notes
CONSTRAINTS: platform character limits, no emojis unless brand-appropriate, plain English.`,
    }),
  },
  {
    cat: "VA Tasks", titles: vaTitles,
    build: (t) => ({
      tags: ["VA", "Productivity"],
      prompt: `Act as an experienced virtual assistant.
TASK: ${t} for [client name / company].
CONTEXT: [background, relationship, prior messages if any].
TONE: professional, warm, concise.
DELIVERABLES:
- Final version ready to send or ship
- 2 alternate versions (shorter + more formal)
- Suggested subject line (if email)
- Next-step checklist for the client
CONSTRAINTS: no jargon, clear CTA, respect timezone [timezone].`,
    }),
  },
  {
    cat: "Customer Service", titles: csTitles,
    build: (t) => ({
      tags: ["Support", "CX"],
      prompt: `You are a senior customer support specialist.
TASK: Write a ${t.toLowerCase()}.
CUSTOMER CONTEXT: [name, order/ticket #, issue summary, sentiment].
POLICY: [refund / warranty / SLA policy notes].
TONE: empathetic, calm, solution-focused, on-brand for [brand].
DELIVERABLES:
- Full reply
- 1 shorter version for live chat
- Internal note for the team (what happened + how to prevent it)
CONSTRAINTS: acknowledge feelings, state the resolution clearly, avoid legal admissions.`,
    }),
  },
  {
    cat: "Automation Logic", titles: autoTitles,
    build: (t) => ({
      tags: ["Automation", "Ops"],
      prompt: `You are an automation architect (Zapier / Make / n8n).
TASK: Design a ${t.toLowerCase()} for [tool stack].
TRIGGER: [event, e.g. new form submission].
ACTIONS: step-by-step, with app names, modules, and fields.
DATA: sample input JSON and expected output JSON.
ERROR HANDLING: retries, fallbacks, alerts.
EDGE CASES: duplicates, empty fields, rate limits.
DELIVERABLES:
- Numbered scenario blueprint
- Notes on cost / task usage
- QA checklist before going live.`,
    }),
  },
  {
    cat: "SEO", titles: seoTitles,
    build: (t) => ({
      tags: ["SEO", "Content"],
      prompt: `Act as a senior SEO strategist.
TASK: ${t} for [website URL] targeting [primary keyword].
AUDIENCE / INTENT: [informational / commercial / transactional].
COMPETITORS: [top 3 ranking URLs].
DELIVERABLES:
- Recommended target keywords (primary + secondary + LSI)
- Optimized title (<60 chars) and meta description (<155 chars)
- H1–H3 outline with word counts
- Internal + external link suggestions
- Schema recommendations
CONSTRAINTS: match search intent, no keyword stuffing, E-E-A-T aware.`,
    }),
  },
  {
    cat: "Email Marketing", titles: emailTitles,
    build: (t) => ({
      tags: ["Email", "Lifecycle"],
      prompt: `You are an email marketing strategist.
TASK: Write ${t.toLowerCase()} for [brand] selling [product/service] to [audience].
GOAL: [open / click / conversion / retention].
BRAND VOICE: [tone].
DELIVERABLES:
- 5 subject line options (curiosity, benefit, urgency, personal, question)
- Preheader
- Full email body with clear CTA
- Plain-text version
- Send-time + segment recommendation
CONSTRAINTS: mobile-first, one primary CTA, avoid spam-trigger words.`,
    }),
  },
  {
    cat: "Sales & Copywriting", titles: salesTitles,
    build: (t) => ({
      tags: ["Copy", "Sales"],
      prompt: `You are a direct-response copywriter.
TASK: Write ${t.toLowerCase()} for [product/offer].
AUDIENCE: [dream customer + pain + desire].
OFFER: [what they get, price, bonuses, guarantee].
FRAMEWORK: use PAS or AIDA — pick what fits and say why.
DELIVERABLES:
- Full copy
- 3 headline variants
- Objection-handling section
- CTA variants (soft + hard)
CONSTRAINTS: specific, benefit-led, no fluffy adjectives, 7th-grade reading level.`,
    }),
  },
  {
    cat: "Content Strategy", titles: contentTitles,
    build: (t) => ({
      tags: ["Strategy", "Planning"],
      prompt: `Act as a fractional Head of Content.
TASK: Build a ${t.toLowerCase()} for [brand/creator].
CONTEXT: niche [niche], audience [audience], goals [goals], team size [team], cadence [cadence].
DELIVERABLES:
- Clear strategic thesis (1 paragraph)
- Structured plan (table or bullets)
- 90-day roadmap with owners
- KPI + measurement plan
- Risks and mitigations
CONSTRAINTS: realistic for team size, opinionated, tie every activity to a business goal.`,
    }),
  },
  {
    cat: "Image Generation", titles: imgTitles,
    build: (t) => ({
      tags: ["Image", "AI art"],
      prompt: `Create a detailed AI image generation prompt for a ${t.toLowerCase()}.
SUBJECT: [describe the main subject: product, person, scene, brand].
STYLE: [photorealistic / cinematic / 3D render / flat vector / editorial / UGC].
MOOD & LIGHTING: [e.g. soft daylight, studio softbox, golden hour, neon].
ASPECT RATIO: [1:1 / 4:5 / 9:16 / 16:9] — compose for this frame.
COMPOSITION: clear focal point, balanced negative space, advertising quality.
DETAILS: materials, textures, palette [brand colors], no text unless specified.

Write 2 complete prompt variants:
1) Highly detailed, production-ready
2) Simpler, cleaner alternative

NEGATIVE PROMPT: blur, watermark, extra fingers, distorted text, low quality, cluttered background.
Midjourney flags (optional): --ar [ratio] --stylize 200 --v 6`,
    }),
  },
  {
    cat: "Video & Shorts", titles: videoTitles,
    build: (t) => ({
      tags: ["Video", "Script"],
      prompt: `You are a short-form / long-form video scriptwriter.
TASK: Write a ${t.toLowerCase()} for [creator/brand] on [platform].
TOPIC: [topic].
AUDIENCE: [audience + what they care about].
GOAL: [views / saves / leads / sales].
DELIVERABLES:
- Hook (first 3 seconds, 3 variants)
- Body outline with beats and timings
- On-screen text suggestions
- B-roll / visual notes
- CTA + retention loop
CONSTRAINTS: match platform length, spoken-word rhythm, no filler.`,
    }),
  },
];

// ---------- expansion blocks: 10 more categories × 50 = 1000 prompts total ----------
const ANGLES = [
  "complete step-by-step guide",
  "ready-to-use template",
  "advanced expert framework",
  "beginner-friendly walkthrough",
  "checklist with examples",
];

type ExtraCat = {
  cat: string;
  tags: string[];
  role: string;
  topics: string[];
};

const extraCats: ExtraCat[] = [
  {
    cat: "Blogging & Articles",
    tags: ["Blog", "Writing"],
    role: "senior long-form content editor",
    topics: [
      "SEO blog post (1500 words)", "Listicle article", "How-to tutorial post", "Ultimate guide outline",
      "Opinion / POV essay", "Interview-style article", "Product roundup review", "Data-driven research post",
      "Beginner glossary post", "Article rewrite & upgrade",
    ],
  },
  {
    cat: "Ecommerce & Product",
    tags: ["Ecommerce", "Product"],
    role: "ecommerce merchandising strategist",
    topics: [
      "Product description", "Collection page copy", "Amazon listing copy", "Product bundle offer",
      "Shipping & returns page", "Product FAQ block", "Review response pack", "Post-purchase upsell",
      "Product naming ideas", "Packaging insert copy",
    ],
  },
  {
    cat: "Freelancing & Clients",
    tags: ["Freelance", "Clients"],
    role: "experienced freelance consultant",
    topics: [
      "Client proposal", "Project scope document", "Rate increase message", "Discovery questionnaire",
      "Late payment follow-up", "Portfolio case study", "Upwork / Fiverr gig copy", "Client onboarding pack",
      "Scope-creep pushback message", "Contract summary in plain English",
    ],
  },
  {
    cat: "Branding & Identity",
    tags: ["Brand", "Identity"],
    role: "brand strategist",
    topics: [
      "Brand positioning statement", "Brand voice guide", "Mission & values copy", "Tagline options",
      "Business name ideas", "Brand story narrative", "Competitor differentiation map", "Visual identity brief",
      "Brand messaging hierarchy", "Rebrand announcement",
    ],
  },
  {
    cat: "Ads & Paid Media",
    tags: ["Ads", "Paid"],
    role: "performance marketing specialist",
    topics: [
      "Meta ad copy set", "Google Search ad set", "TikTok ad script", "Retargeting ad angles",
      "Ad creative testing plan", "Landing page match brief", "Audience targeting plan", "Budget & bidding plan",
      "Ad account audit", "Ad hook variations (10)",
    ],
  },
  {
    cat: "ChatGPT Productivity",
    tags: ["Productivity", "AI"],
    role: "AI workflow coach",
    topics: [
      "Daily planning assistant", "Meeting notes summarizer", "Inbox zero workflow", "Research assistant brief",
      "Document summarizer", "Decision-making assistant", "Brainstorm partner setup", "Custom instructions writer",
      "Spreadsheet formula helper", "Weekly review assistant",
    ],
  },
  {
    cat: "Business & Strategy",
    tags: ["Business", "Strategy"],
    role: "management consultant",
    topics: [
      "Business model canvas", "Go-to-market plan", "Pricing strategy review", "Competitor analysis",
      "SWOT analysis", "Customer persona research", "OKR planning session", "Investor one-pager",
      "Partnership proposal", "Quarterly business review",
    ],
  },
  {
    cat: "Education & Learning",
    tags: ["Learning", "Teaching"],
    role: "instructional designer",
    topics: [
      "Lesson plan", "Course curriculum outline", "Study guide", "Quiz & answer key",
      "Concept explained simply", "Flashcard set", "Assignment rubric", "Workshop facilitation script",
      "Learning roadmap (90 days)", "Exam revision plan",
    ],
  },
  {
    cat: "Personal Development",
    tags: ["Growth", "Habits"],
    role: "performance coach",
    topics: [
      "Goal-setting framework", "Habit tracker plan", "Weekly review ritual", "Time-blocking schedule",
      "Career change roadmap", "Resume rewrite", "Interview preparation drill", "Personal brand plan",
      "Burnout recovery plan", "Reading & learning system",
    ],
  },
  {
    cat: "Finance & Admin",
    tags: ["Finance", "Admin"],
    role: "small-business finance manager",
    topics: [
      "Monthly budget template", "Cash-flow forecast", "Invoice & payment terms", "Expense policy",
      "Pricing & margin calculator brief", "Tax-season checklist", "Financial report summary", "Subscription audit",
      "Payment reminder sequence", "Bookkeeping SOP",
    ],
  },
];

const extraBlocks: Block[] = extraCats.map((c) => {
  const topics = c.topics;
  const role = c.role;

  return {
    cat: c.cat,
    titles: topics.flatMap((topic) => ANGLES.map((a) => `${topic} — ${a}`)),
    build: (t) => ({
      tags: c.tags,
      prompt: `You are a ${role}.
TASK: ${t.split(" — ")[0]} for [company / person / project].
FORMAT: ${t.split(" — ")[1]}.
CONTEXT: [industry, audience, current situation, constraints].
GOAL: [the specific outcome you want].
DELIVERABLES:
- A clear, structured result I can use immediately
- 2 alternative versions (one shorter, one more detailed)
- Key assumptions you made, listed separately
- Next steps checklist with owners and timing
CONSTRAINTS: plain English, no filler, be specific and practical, ask me up to 3 clarifying questions first if anything essential is missing.`,
    }),
  };
});

const allBlocks: Block[] = [...blocks, ...extraBlocks];

export const LIBRARY: Prompt[] = allBlocks.flatMap((b, bi) =>
  b.titles.map((title, ti) => {
    const id = bi * 50 + ti + 1;
    const { tags, prompt } = b.build(title, id);
    return { id, cat: b.cat, title, tags, prompt };
  }),
);

