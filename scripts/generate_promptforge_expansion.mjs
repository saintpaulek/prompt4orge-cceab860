import fs from "node:fs/promises";

const startId = 3411;
const outputJson = new URL("../data/promptforge-expansion-2026-08-29.json", import.meta.url);
const outputMarkdown = new URL("../docs/promptforge-expansion-package.md", import.meta.url);

const lenses = [
  { name: "Discovery & planning", verb: "map the context, audience, inputs, constraints, and desired outcome" },
  { name: "Creation & drafting", verb: "draft the core asset with a clear structure, useful examples, and an appropriate voice" },
  { name: "Optimization & QA", verb: "audit the asset for clarity, completeness, accessibility, and fit with the stated channel" },
  { name: "Execution & operations", verb: "turn the work into a practical workflow with owners, timing, hand-offs, and reusable templates" },
  { name: "Measurement & improvement", verb: "define measurable signals, a review cadence, and a small improvement experiment" },
  { name: "Risk & handoff", verb: "surface assumptions, risks, approval points, escalation paths, and the next responsible action" },
];

const categories = [
  {
    name: "Email Marketing & Sequences",
    blurb: "Campaigns, lifecycle & inbox conversion",
    role: "an lifecycle email strategist and conversion copy editor",
    tags: ["Email Marketing", "Lifecycle", "Conversion"],
    fields: ["Campaign or lifecycle stage", "Offer or message", "Audience segment", "Email sequence length", "Primary CTA", "Tone", "Compliance and unsubscribe constraints", "Reference examples"],
    topics: ["welcome sequence", "lead-nurture sequence", "product-launch email", "abandoned-checkout recovery", "customer-onboarding series", "re-engagement campaign", "newsletter editorial plan", "post-purchase education flow", "event invitation sequence", "retention and renewal sequence"],
  },
  {
    name: "SEO & Content Optimization",
    blurb: "Search intent, briefs & measurable discoverability",
    role: "a search strategist and editorial optimization lead",
    tags: ["SEO", "Content Strategy", "Search Intent"],
    fields: ["Target query or topic", "Search intent", "Audience and location", "Existing URL or content", "Primary conversion", "Competitor or SERP notes", "Brand and factual constraints", "Internal-link targets"],
    topics: ["keyword-led article brief", "topic-cluster map", "on-page optimization audit", "local SEO landing page", "featured-snippet answer", "internal-linking plan", "content refresh roadmap", "product-led SEO page", "technical content outline", "search performance review"],
  },
  {
    name: "Finance, Accounting & Admin",
    blurb: "Clear records, controls & operating routines",
    role: "a finance operations analyst and administrative systems designer",
    tags: ["Finance", "Accounting", "Administration"],
    fields: ["Business or household context", "Reporting period", "Source records", "Currency", "Decision or report needed", "Materiality threshold", "Approval owner", "Privacy and access limits"],
    topics: ["monthly close checklist", "cash-flow forecast", "expense policy", "invoice follow-up sequence", "budget variance review", "management report", "vendor reconciliation", "admin SOP", "records-retention plan", "finance decision brief"],
  },
  {
    name: "Education & Learning",
    blurb: "Lessons, practice & learner progress",
    role: "an instructional designer and learner-experience specialist",
    tags: ["Education", "Instructional Design", "Learning"],
    fields: ["Learner age or level", "Learning objective", "Subject and misconceptions", "Delivery format", "Available time", "Assessment method", "Accessibility needs", "Materials or references"],
    topics: ["lesson plan", "course module", "guided practice activity", "diagnostic quiz", "study guide", "workshop outline", "rubric and feedback guide", "remedial learning plan", "teacher facilitation notes", "learner progress review"],
  },
  {
    name: "Personal Development & Productivity",
    blurb: "Focus, habits & reflective systems",
    role: "a practical productivity coach and behavior-change writing partner",
    tags: ["Productivity", "Personal Development", "Habits"],
    fields: ["Desired outcome", "Current routine", "Time and energy constraints", "Trigger or environment", "Preferred planning style", "Accountability method", "Boundaries", "Reflection questions"],
    topics: ["weekly planning system", "deep-work routine", "habit experiment", "decision framework", "meeting-to-action workflow", "personal review", "goal breakdown", "digital declutter plan", "burnout-aware workload reset", "accountability check-in"],
  },
  {
    name: "HR / Recruitment & People Ops",
    blurb: "Hiring, onboarding & healthy team systems",
    role: "an HR operations partner and inclusive recruitment specialist",
    tags: ["HR", "Recruitment", "People Ops"],
    fields: ["Role or people process", "Business context", "Candidate or employee audience", "Location and work model", "Competencies", "Decision makers", "Fairness and privacy constraints", "Timeline"],
    topics: ["job description", "structured interview kit", "candidate outreach sequence", "application screening rubric", "new-hire onboarding plan", "30-60-90 day plan", "performance conversation guide", "employee policy explainer", "team pulse survey", "people-ops process audit"],
  },
  {
    name: "Ecommerce & Product",
    blurb: "Offers, catalogues & product growth",
    role: "an ecommerce product marketer and customer-journey strategist",
    tags: ["Ecommerce", "Product", "Conversion"],
    fields: ["Product or collection", "Customer problem", "Audience segment", "Channel or storefront", "Price and fulfilment facts", "Desired action", "Proof available", "Claims and return-policy constraints"],
    topics: ["product-page brief", "catalogue description system", "launch campaign", "bundle and upsell plan", "abandoned-cart recovery", "post-purchase flow", "product-comparison guide", "customer FAQ", "merchandising calendar", "conversion-rate review"],
  },
  {
    name: "WhatsApp / Messaging Business",
    blurb: "Permission-first conversations that move business forward",
    role: "a WhatsApp Business growth strategist and customer-conversation designer",
    tags: ["WhatsApp", "Messaging", "Nigeria", "Customer Engagement"],
    fields: ["Business type and city", "Offer or service", "Consented audience", "Conversation trigger", "Channel mix", "Desired next step", "Human hand-off rule", "Privacy, opt-out, and frequency limits"],
    topics: ["business profile conversion audit", "new-enquiry welcome flow", "lead qualification conversation", "catalogue sales script", "appointment booking flow", "payment and fulfilment update", "broadcast opt-in campaign", "customer-care recovery flow", "social-to-WhatsApp funnel", "WhatsApp KPI review"],
  },
  {
    name: "Legal / Contracts & Compliance",
    blurb: "Plain-language review support with professional boundaries",
    role: "a legal-operations assistant focused on plain-language document workflows",
    tags: ["Legal", "Contracts", "Compliance"],
    fields: ["Document type", "Jurisdiction", "Parties and roles", "Business objective", "Key obligations", "Risk tolerance", "Review deadline", "Counsel escalation points"],
    topics: ["contract issue-spotting checklist", "plain-language policy summary", "clause comparison matrix", "vendor due-diligence checklist", "compliance evidence register", "legal intake questionnaire", "renewal and notice tracker", "negotiation preparation brief", "regulatory-change digest", "document approval workflow"],
  },
  {
    name: "Real Estate",
    blurb: "Listings, leads & property operations",
    role: "a real-estate marketing and property-operations strategist",
    tags: ["Real Estate", "Property", "Lead Generation"],
    fields: ["Property type and location", "Availability facts", "Ideal prospect", "Price or budget", "Viewing or enquiry action", "Channel", "Verification and disclosure constraints", "Follow-up cadence"],
    topics: ["property listing brief", "buyer qualification script", "rental enquiry flow", "viewing appointment sequence", "landlord update report", "property-comparison guide", "neighbourhood content plan", "agent follow-up system", "tenant onboarding checklist", "property lead-performance review"],
  },
  {
    name: "Agency / Client Management",
    blurb: "Scoping, communication & delivery confidence",
    role: "an agency operations lead and client-success strategist",
    tags: ["Agency", "Client Management", "Operations"],
    fields: ["Client type", "Service or deliverable", "Scope and exclusions", "Timeline", "Stakeholders", "Communication channel", "Approval process", "Success measures"],
    topics: ["discovery questionnaire", "statement-of-work outline", "proposal narrative", "client onboarding workflow", "weekly status report", "feedback consolidation brief", "scope-change request", "project risk register", "renewal conversation", "client-retrospective plan"],
  },
  {
    name: "Healthcare / Wellness",
    blurb: "Clear, safe education and service communication",
    role: "a healthcare-content and wellness-communications specialist",
    tags: ["Healthcare", "Wellness", "Patient Communication"],
    fields: ["General topic", "Audience and reading level", "Care setting", "Approved facts or source", "Desired action", "Tone", "Accessibility and language needs", "Safety and escalation boundaries"],
    topics: ["patient education handout", "wellness content plan", "appointment reminder flow", "symptom-information FAQ", "care-navigation script", "health-service landing page", "provider briefing", "community health campaign", "post-visit follow-up", "health-content safety review"],
  },
];

const safetyByCategory = {
  "Legal / Contracts & Compliance": "This is drafting and issue-spotting support, not legal advice. State jurisdictional assumptions, avoid presenting conclusions as legal opinions, and route material risks to a qualified lawyer.",
  "Healthcare / Wellness": "Keep content educational and non-diagnostic. Do not invent clinical facts, patient outcomes, dosages, or credentials; include urgent-care escalation when appropriate and defer to qualified clinicians.",
  "Finance, Accounting & Admin": "Do not invent balances, transactions, tax conclusions, or regulatory obligations. Label estimates, preserve confidentiality, and route regulated decisions to a qualified professional.",
  "WhatsApp / Messaging Business": "Use permission-based messaging only. Do not recommend scraping, unsolicited bulk outreach, or collection of unnecessary personal data; include opt-out, HELP, and human hand-off paths.",
};

const globalSafety = "Use only supplied facts; mark assumptions clearly; never fabricate testimonials, customer results, credentials, prices, availability, or guarantees; keep personally identifiable information to the minimum needed; and make every variable easy to replace.";

function makePrompt(category, topic, lens, index) {
  const special = safetyByCategory[category.name] ?? "Keep claims supportable, respect privacy, and make the next action clear for the intended audience.";
  return `ROLE: You are ${category.role}.\n\nCONTEXT: I need help with a ${topic} for [organisation_or_project] serving [audience] in [location_or_market]. The current situation is [current_state]. The desired action or outcome is [desired_outcome]. Use [channel_or_format], [tone], and [timeframe].\n\nTASK: ${lens.verb} for this ${topic}. Treat the category inputs as the source of truth and do not fill missing facts with guesses.\n\nREQUIREMENTS:\n- ${globalSafety}\n- ${special}\n- Prefer concise, mobile-readable language and label every replacement field in [square brackets].\n- Explain the reasoning behind important choices without padding the answer.\n\nOUTPUT:\n1. State the objective, audience, assumptions, and success signal.\n2. Produce the recommended ${topic} in a clearly labelled structure.\n3. Include a practical checklist, example, or reusable template where it improves execution.\n4. Identify risks, approval points, and the next action for the responsible owner.\n5. Add one focused improvement experiment and the evidence needed to review it.\n\nWORK ORDER: ${String(index).padStart(4, "0")} / ${lens.name}.`;
}

const rows = [];
let sequence = 0;
for (const category of categories) {
  for (const topic of category.topics) {
    for (const lens of lenses) {
      const id = String(startId + sequence++);
      rows.push({
        id,
        title: `${topic[0].toUpperCase()}${topic.slice(1)} — ${lens.name}`,
        category: category.name,
        role: category.role,
        tags: [...category.tags, lens.name].join(", "),
        access: rows.filter((row) => row.category === category.name).length < 10 ? "FREE" : "LOCKED",
        prompt: makePrompt(category, topic, lens, Number(id)),
      });
    }
  }
}

if (rows.length !== 720) throw new Error(`Expected 720 rows, received ${rows.length}`);
for (const category of categories) {
  const subset = rows.filter((row) => row.category === category.name);
  if (subset.length !== 60) throw new Error(`${category.name}: expected 60 rows`);
  if (subset.filter((row) => row.access === "FREE").length !== 10) throw new Error(`${category.name}: expected 10 FREE rows`);
}
if (new Set(rows.map((row) => row.id)).size !== rows.length) throw new Error("Duplicate IDs");
if (new Set(rows.map((row) => row.title.toLowerCase())).size !== rows.length) throw new Error("Duplicate titles");

const overview = categories.map((category) => `| ${category.name} | ${category.blurb} | 60 | 10 FREE / 50 LOCKED |`).join("\n");
const categorySections = categories.map((category) => {
  const subset = rows.filter((row) => row.category === category.name);
  const sample = subset[0];
  const representative = subset.slice(0, 20).map((row) => `### ${row.access}\n**${row.id} — ${row.title}**\n\n**Category:** ${row.category}\n\n**Tags:** ${row.tags}\n\n**Role:** ${row.role}\n\n${row.prompt}\n`).join("\n");
  return `## ${category.name}\n\n**Builder field schema:** ${category.fields.map((field) => `\`${field}\``).join(", ")}.\n\n**Sample live-forged prompt:**\n\n${sample.prompt}\n\n### Representative work orders\n\n${representative}`;
}).join("\n---\n\n");

const markdown = `# PromptForge Expansion Package\n\nGenerated: 2026-08-29\n\nThis package adds twelve Builder categories and 720 structured Library work orders. Each category contains 60 records: the first 10 are FREE and the remaining 50 are LOCKED. The records use IDs ${startId}–${startId + rows.length - 1} and follow the existing ROLE / CONTEXT / TASK / REQUIREMENTS / OUTPUT convention.\n\n## A. New Categories Overview\n\n| Category | Positioning | Work orders | Access split |\n|---|---|---:|---|\n${overview}\n\n## B. Category materials and work orders\n\n${categorySections}\n\n## C. Implementation notes for engineering\n\nThe Builder should export these category definitions from a shared module instead of duplicating labels in the page component. On category change, reset the dependent topic and platform fields to the first valid option for the selected category, preserve the user’s audience and constraints when safe, and show the relevant safety note for Legal, Healthcare, Finance, and WhatsApp workflows. Every field should have an explicit label, keyboard access, a mobile-friendly control, and a replaceable variable value.\n\nThe Library importer should insert the JSON file into the existing \`prompts\` table with \`ON DUPLICATE KEY UPDATE\`, preserving the existing ID convention and exact \`FREE\` / \`LOCKED\` values. The public catalog should continue returning locked metadata with an empty prompt body until the viewer has lifetime access or an admin role. Search must cover title, category, and tags; category filters must use the exact labels in this package.\n\nThe quality score can be computed from weighted checks: role specificity, concrete task, audience, channel, goal, constraints, deliverables, examples, and safety boundaries. Expose the score with a short explanation and one-click suggestions that append or revise only the missing dimension. Variables should use \`{{variable_name}}\` in saved prompts while preserving the existing square-bracket replacement convention in catalogue templates.\n\nCollections should be protected by the authenticated user ID. Add collections, collection memberships, prompt tags, and saved-prompt versions as separate tables or normalized relations; never accept a user ID from the client. Every mutation must derive ownership from \`ctx.user.id\`, and version snapshots should be immutable once written.\n\nMulti-platform optimization should be an explicit control with targets for ChatGPT, Claude, Gemini, Grok, Midjourney, and Flux. Text assistants should receive structured instruction, context, constraints, and output format; image tools should receive subject, composition, lighting, aspect ratio, negative prompt, and reference guidance. Refine controls should be typed actions such as shorter, more formal, more creative, add examples, simplify, and strengthen constraints.\n\nExports should support Markdown, plain text, JSON, and a Notion-ready Markdown variant with headings and checklists. Keep exports local unless the user explicitly saves a copy. Mobile/PWA work should prioritize normal document scrolling, large touch targets, safe-area padding, offline shell caching, install metadata, reduced-motion support, and no sticky controls that cover Library cards.\n\n## D. Suggested priority order\n\n1. Ship the twelve categories, shared Builder schemas, and the 720-record catalog import because these immediately expand discoverability and user value.\n2. Add variable insertion, quality scoring, and the improved Refine controls because they strengthen the core Forge loop without requiring a large data-model change.\n3. Add collections, favorites, tags, and immutable version history with ownership tests.\n4. Add multi-platform optimization and Notion-ready exports, then instrument usage to see which targets matter most.\n5. Finish PWA installability, offline shell behavior, mobile QA, and accessibility regression checks.\n\n## Safety boundaries\n\n${Object.entries(safetyByCategory).map(([name, note]) => `- **${name}:** ${note}`).join("\n")}\n`;

await fs.writeFile(outputJson, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
await fs.writeFile(outputMarkdown, markdown, "utf8");
console.log(`Generated ${rows.length} prompts at ${outputJson.pathname}`);
console.log(`Generated package at ${outputMarkdown.pathname}`);
