import fs from "node:fs/promises";

const category = "Nigeria Business Growth & WhatsApp";
const startId = 3261;
const outputPath = new URL("../data/nigeria-business-growth-whatsapp.json", import.meta.url);

const modules = [
  {
    pillar: "WhatsApp Business foundations",
    role: "a Nigerian small-business growth strategist and WhatsApp Business setup specialist",
    tags: ["WhatsApp Business", "Business Foundations", "Nigeria"],
    prompts: [
      "WhatsApp Business profile conversion audit",
      "Clear service menu and catalog copy",
      "Trust-building business introduction message",
      "Seven-message new enquiry welcome flow",
      "Permission-first broadcast opt-in invitation",
      "Quick-reply library for common questions",
      "Customer label and segmentation plan",
      "FAQ decision tree for WhatsApp",
      "Business-hours and away-message system",
      "Contact-saving call-to-action campaign",
    ],
  },
  {
    pillar: "Conversion conversations",
    role: "a Nigerian WhatsApp sales strategist who writes clear, respectful conversion conversations",
    tags: ["WhatsApp Sales", "Conversion", "Nigeria"],
    prompts: [
      "First-reply sales conversation blueprint",
      "Needs-discovery question sequence",
      "Objection handling for price-sensitive buyers",
      "Value-based price explanation script",
      "Package comparison conversation flow",
      "Scarcity-without-pressure message sequence",
      "Follow-up cadence for warm leads",
      "Re-engagement message for silent prospects",
      "Deposit request conversation flow",
      "Closing message and next-step checklist",
    ],
  },
  {
    pillar: "Customer care and retention",
    role: "a customer-experience lead for Nigerian service and retail businesses using WhatsApp",
    tags: ["Customer Care", "Retention", "WhatsApp", "Nigeria"],
    prompts: [
      "First-order thank-you and onboarding flow",
      "Delivery update message journey",
      "Post-purchase satisfaction check-in",
      "Review request message pack",
      "Repeat-purchase reminder sequence",
      "Win-back offer for inactive customers",
      "Complaint acknowledgement and recovery script",
      "Refund or exchange explanation guide",
      "Referral request and reward flow",
      "VIP customer care routine",
    ],
  },
  {
    pillar: "Local offers and campaigns",
    role: "a local-market campaign planner for Nigerian businesses selling through WhatsApp",
    tags: ["WhatsApp Campaigns", "Local Marketing", "Nigeria"],
    prompts: [
      "Monthly WhatsApp campaign calendar",
      "Payday offer campaign sequence",
      "Weekend flash-sale plan",
      "Festive-season sales calendar",
      "New-product launch WhatsApp campaign",
      "Limited-stock campaign messaging",
      "Bundle and upsell offer planner",
      "Price-change communication plan",
      "Community group campaign rules",
      "Local partnership promotion script",
    ],
  },
  {
    pillar: "Social-to-WhatsApp funnels",
    role: "a social media funnel strategist who turns Nigerian audience attention into qualified WhatsApp conversations",
    tags: ["Social Media", "WhatsApp Funnel", "Nigeria"],
    prompts: [
      "Instagram-to-WhatsApp bio and CTA audit",
      "TikTok-to-WhatsApp lead capture plan",
      "Facebook click-to-WhatsApp ad copy brief",
      "Short-video WhatsApp conversion script",
      "Carousel-to-chat campaign plan",
      "Story poll-to-WhatsApp funnel",
      "Comment-to-DM-to-WhatsApp handoff",
      "Link-in-bio WhatsApp landing copy",
      "Influencer referral WhatsApp campaign",
      "Content-to-conversation weekly schedule",
    ],
  },
  {
    pillar: "Lead generation and qualification",
    role: "a lead-generation operator who designs ethical, permission-based WhatsApp qualification systems",
    tags: ["Lead Generation", "Qualification", "WhatsApp", "Nigeria"],
    prompts: [
      "Lead magnet delivery via WhatsApp",
      "Event registration and reminder flow",
      "Lead qualification scorecard",
      "Discovery-call booking conversation",
      "Quote-request intake form script",
      "Bulk enquiry triage workflow",
      "Wholesale buyer qualification flow",
      "Corporate lead handoff process",
      "Field-sales lead capture template",
      "Referral lead intake sequence",
    ],
  },
  {
    pillar: "Sales operations and team coaching",
    role: "a WhatsApp sales operations manager for a growing Nigerian business",
    tags: ["Sales Operations", "Team Coaching", "WhatsApp", "Nigeria"],
    prompts: [
      "Daily WhatsApp sales dashboard",
      "Team response-time SOP",
      "Sales rep chat quality scorecard",
      "Handoff from sales to operations workflow",
      "Inventory-aware sales response scripts",
      "Shift handover message template",
      "Sales stand-up agenda",
      "Team coaching feedback prompt",
      "Lead follow-up assignment tracker",
      "Escalation procedure for urgent enquiries",
    ],
  },
  {
    pillar: "Ecommerce and catalog sales",
    role: "an ecommerce conversion specialist for Nigerian merchants selling through WhatsApp",
    tags: ["Ecommerce", "WhatsApp Catalog", "Nigeria"],
    prompts: [
      "WhatsApp catalog product description framework",
      "Product recommendation quiz conversation",
      "Abandoned order recovery flow",
      "Cash-on-delivery confirmation sequence",
      "Order confirmation and receipt message",
      "Delivery zone qualification script",
      "Cross-sell at checkout message pack",
      "Size, colour, and variant selection flow",
      "Out-of-stock alternative offer flow",
      "Return-customer restock alert campaign",
    ],
  },
  {
    pillar: "Service-business acquisition",
    role: "a client-acquisition strategist for Nigerian service businesses using WhatsApp",
    tags: ["Service Business", "Client Acquisition", "WhatsApp", "Nigeria"],
    prompts: [
      "Service discovery call booking funnel",
      "Consultation package explanation script",
      "Before-and-after case-study message outline",
      "Service proposal follow-up flow",
      "Appointment reminder and rescheduling system",
      "No-show recovery message sequence",
      "Quote follow-up plan for service providers",
      "Client onboarding checklist via WhatsApp",
      "Renewal reminder for retainer clients",
      "Local service referral partnership script",
    ],
  },
  {
    pillar: "Creators, coaches, and digital products",
    role: "a Nigerian creator-business strategist who converts WhatsApp interest into ethical digital-product sales",
    tags: ["Creators", "Digital Products", "WhatsApp", "Nigeria"],
    prompts: [
      "Digital product pre-launch waitlist flow",
      "Cohort course enrolment chat flow",
      "Webinar registration and reminder sequence",
      "Coaching application screening flow",
      "Download delivery and activation message",
      "Community onboarding and rules message",
      "Early-bird offer sequence",
      "Student progress check-in flow",
      "Testimonial request with consent prompt",
      "Upsell from free guide to paid offer",
    ],
  },
  {
    pillar: "Local retail and lifestyle businesses",
    role: "a WhatsApp growth consultant for Nigerian local retail and lifestyle businesses",
    tags: ["Local Business", "Retail", "WhatsApp", "Nigeria"],
    prompts: [
      "Restaurant order and reservation flow",
      "Fashion size-guide and styling conversation",
      "Beauty appointment booking script",
      "Salon aftercare and rebooking sequence",
      "Pharmacy product-enquiry triage",
      "Grocery repeat-order reminder",
      "Event vendor enquiry workflow",
      "Laundry pickup and delivery flow",
      "Fitness class trial sign-up conversation",
      "Local retail WhatsApp storefront plan",
    ],
  },
  {
    pillar: "High-consideration local services",
    role: "a structured WhatsApp sales strategist for high-consideration Nigerian local services",
    tags: ["Local Services", "Lead Qualification", "WhatsApp", "Nigeria"],
    prompts: [
      "Property viewing lead-qualification flow",
      "Vehicle sales enquiry follow-up plan",
      "Travel package discovery chat",
      "Hotel booking enquiry workflow",
      "Logistics quote-request conversation",
      "School admission enquiry sequence",
      "Furniture custom-order consultation",
      "Home-service inspection booking flow",
      "Event ticket and RSVP communication plan",
      "Local agent referral partnership campaign",
    ],
  },
  {
    pillar: "B2B and professional services",
    role: "a B2B relationship manager who uses WhatsApp professionally for Nigerian business clients",
    tags: ["B2B", "Professional Services", "WhatsApp", "Nigeria"],
    prompts: [
      "B2B capability introduction message",
      "Proposal follow-up sequence for business clients",
      "Vendor onboarding checklist conversation",
      "Corporate service renewal reminder",
      "Procurement enquiry response template",
      "Networking follow-up message after an event",
      "Partnership pitch via WhatsApp",
      "Account-management quarterly check-in",
      "Invoice reminder with professional tone",
      "Meeting recap and action-plan message",
    ],
  },
  {
    pillar: "Payments, orders, and fulfilment",
    role: "a Nigerian commerce operations specialist who communicates payment and fulfilment steps clearly on WhatsApp",
    tags: ["Payments", "Fulfilment", "WhatsApp", "Nigeria"],
    prompts: [
      "Payment confirmation message system",
      "Transfer verification and receipt request script",
      "Preorder deposit and balance reminder flow",
      "Delivery payment reminder sequence",
      "Billing dispute acknowledgement script",
      "Order-status update workflow",
      "Fulfilment delay communication plan",
      "Cancellation and credit policy explainer",
      "Subscription renewal payment reminder",
      "Fraud-awareness customer notice",
    ],
  },
  {
    pillar: "Growth measurement and optimisation",
    role: "a growth analyst for Nigerian businesses building a measurable WhatsApp sales channel",
    tags: ["Analytics", "Growth Strategy", "WhatsApp", "Nigeria"],
    prompts: [
      "WhatsApp campaign KPI dashboard",
      "Conversation-to-sale funnel review",
      "Broadcast performance analysis",
      "Lead-source tracking framework",
      "A/B message test plan",
      "Customer-segment opportunity map",
      "Weekly growth experiment backlog",
      "Sales conversation insight report",
      "Campaign post-mortem facilitator guide",
      "90-day WhatsApp growth roadmap",
    ],
  },
];

const safetyNotes = [
  "Use permission-based messaging only; do not recommend unsolicited bulk outreach or data harvesting.",
  "Use clear Nigerian English and adapt examples to the stated city, audience, and business model without stereotyping.",
  "Do not invent customer results, testimonials, transaction records, delivery times, prices, availability, or guarantees.",
  "For health, finance, legal, or other regulated requests, keep the output informational and direct customers to qualified professionals where needed.",
];

let sequence = 0;
const rows = modules.flatMap((module) =>
  module.prompts.map((title) => {
    const index = sequence++;
    const isFree = index < 20;
    const tags = [...module.tags, module.pillar, isFree ? "Starter" : "Flagship"].join(", ");
    const promptBody = `ROLE: You are ${module.role}.

CONTEXT: I run a [business type] in [city or service area]. My main audience is [ideal customer]. I sell [offer, service, or product] at [price range or package structure]. My current WhatsApp setup is [current situation], and the action I want customers to take is [desired next step].

TASK: Create a practical ${title.toLowerCase()} for the ${module.pillar} stage of my business growth plan.

REQUIREMENTS:
- ${safetyNotes.join("\n- ")}
- Make assumptions explicit and label every input I should replace in [square brackets].
- Keep messages concise enough for mobile reading and give an alternative when a voice note, image, catalogue item, form, or human handoff would work better.

OUTPUT:
1. State the objective, audience, and trigger for this workflow.
2. Provide the recommended customer journey in numbered steps.
3. Draft the WhatsApp messages, quick replies, calls to action, and follow-up timing.
4. List the information a team member should capture and the label or owner to assign.
5. Give a lightweight KPI set and a one-week improvement experiment.
6. Add a short “Do not do this” checklist to protect trust and customer privacy.`;

    return {
      id: String(startId + index),
      title,
      category,
      role: module.role,
      tags,
      access: isFree ? "FREE" : "LOCKED",
      prompt: promptBody,
    };
  }),
);

if (rows.length !== 150) throw new Error(`Expected 150 prompts, received ${rows.length}`);
if (rows.filter((row) => row.access === "FREE").length !== 20) throw new Error("Expected exactly 20 FREE prompts");
if (new Set(rows.map((row) => row.id)).size !== rows.length) throw new Error("Duplicate prompt IDs detected");
if (new Set(rows.map((row) => row.title.toLowerCase())).size !== rows.length) throw new Error("Duplicate prompt titles detected");

await fs.mkdir(new URL("../data/", import.meta.url), { recursive: true });
await fs.writeFile(outputPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
console.log(`Generated ${rows.length} ${category} prompts at ${outputPath.pathname}`);
