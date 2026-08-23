import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Clipboard, Lightbulb, Share2, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";
import { createScrollDepthTracker, trackGuideEvent } from "@/lib/guideAnalytics";
import { shareGuide } from "@/lib/shareGuide";
import { copyText } from "@/lib/copyText";

type GuideSection = { id: string; heading: string; body: string };
type Guide = {
  path: string; number: string; label: string; title: string; intro: string; takeaway: string;
  author: string; authorRole: string; published: string; updated: string;
  sections: GuideSection[]; steps: string[];
};

const guides: Guide[] = [
  { path: "/guides/prompt-engineering-basics", number: "01", label: "FOUNDATIONS", title: "Prompt engineering basics: how to write clearer AI instructions", intro: "A practical introduction to prompt engineering for beginners who want more reliable answers from ChatGPT, Gemini, Claude, and other AI assistants.", takeaway: "The goal is not to write the longest prompt. It is to make the desired outcome, useful context, and boundaries visible.", author: "PromptForge Editorial Team", authorRole: "Prompt-engineering education", published: "2026-08-23", updated: "2026-08-23", sections: [
    { id: "start-with-result", heading: "Start with the result", body: "Describe what a successful answer should help you do. Replace a vague request such as ‘write something about marketing’ with a concrete deliverable, audience, channel, and purpose." },
    { id: "role-and-audience", heading: "Give the model a role and audience", body: "A role provides a useful point of view, while an audience helps shape language and depth. These details are most valuable when they change the decision the model should make." },
    { id: "quality-constraints", heading: "Add constraints that protect quality", body: "Specify length, format, tone, exclusions, required points, and evidence expectations. Constraints reduce unhelpful interpretation without forcing you to prescribe every sentence." },
  ], steps: ["Name the deliverable and the outcome it should support.", "Add the audience, channel, tone, and essential context.", "State the format and constraints, then ask for a useful first draft.", "Review the result and tighten the prompt around what was missing."] },
  { path: "/guides/prompt-engineering-for-marketing", number: "02", label: "MARKETING WORKFLOWS", title: "Prompt engineering for marketing: build briefs that produce usable content", intro: "Learn how marketers, creators, and freelancers can turn campaign goals into repeatable AI briefs for social media, email, SEO, ads, and customer engagement.", takeaway: "A marketing prompt works best when it connects the business goal to the audience action, the channel format, and the brand voice.", author: "PromptForge Editorial Team", authorRole: "Marketing workflow education", published: "2026-08-23", updated: "2026-08-23", sections: [
    { id: "separate-strategy-copy", heading: "Separate strategy from copy", body: "Tell the model whether it should develop a campaign angle, write the asset, or critique an existing draft. Separating these jobs makes the output easier to review and reuse." },
    { id: "make-channel-specific", heading: "Make the channel specific", body: "A LinkedIn post, WhatsApp message, email sequence, and short-form video script need different structures. Name the channel and ask for native formatting rather than one generic piece of copy." },
    { id: "protect-trust", heading: "Protect trust and compliance", body: "Ask the model to avoid unsupported claims, protect personal information, respect consent, and include a human review step for regulated or high-stakes customer communications." },
  ], steps: ["Define the campaign goal in one measurable sentence.", "Describe the audience, offer, customer stage, and desired action.", "Choose the channel, format, length, voice, and required message points.", "Request a primary draft, a rationale, and one testable variation."] },
  { path: "/guides/evaluate-and-improve-ai-prompts", number: "03", label: "QUALITY CONTROL", title: "How to evaluate and improve an AI prompt before you reuse it", intro: "A prompt is not finished when it produces one good answer. Use this review method to make prompts clearer, safer, and more consistent across projects and AI tools.", takeaway: "Treat prompts like working documents: test them against realistic inputs, inspect the failure modes, and revise only the instructions that improve the result.", author: "PromptForge Editorial Team", authorRole: "Prompt quality education", published: "2026-08-23", updated: "2026-08-23", sections: [
    { id: "success-criteria", heading: "Check for observable success criteria", body: "You should be able to tell whether the answer met the brief. Look for requirements such as structure, audience fit, factual caution, actionability, and an appropriate level of detail." },
    { id: "test-edge-cases", heading: "Test edge cases, not only ideal examples", body: "Try incomplete context, competing constraints, sensitive information, and a different audience. Strong prompts make the safe next step clear when the model cannot confidently complete the task." },
    { id: "keep-evaluation-set", heading: "Keep a small evaluation set", body: "Save a few representative inputs and compare revisions against them. This makes prompt improvement less subjective and helps teams reuse a prompt without losing its original purpose." },
  ], steps: ["Collect three realistic examples of the work the prompt should support.", "Score each output against clarity, usefulness, format, and safety criteria.", "Fix the highest-impact ambiguity or missing constraint first.", "Retest, record the strongest version, and revisit it when the workflow changes."] },
];

const caseStudy = { path: "/guides/promptforge-workflow-case-study", number: "04", label: "PRACTICAL CASE STUDY", title: "From rough campaign idea to a usable AI brief: a PromptForge workflow", intro: "Follow a realistic small-business workflow from an unfinished idea to a structured campaign prompt you can review, adapt, and reuse.", takeaway: "The workflow is simple: clarify the outcome, choose the channel, add guardrails, inspect the draft, and save the reusable brief.", author: "PromptForge Editorial Team", authorRole: "Practical AI workflow education", published: "2026-08-23", updated: "2026-08-23", sections: [{ id: "the-rough-brief", heading: "1. Start with a rough brief", body: "Imagine a small Nigerian skincare business wants to announce a new affordable product bundle. The starting note is: ‘Create a post for our new bundle.’ It contains a topic, but not enough direction about audience, channel, voice, or action." }, { id: "shape-the-materials", heading: "2. Shape the materials", body: "In PromptForge, choose Social Media, select a launch post, name the audience, choose Instagram, and set the goal to get a clear first draft. Add a constraint to avoid medical claims and keep the call to action specific." }, { id: "review-and-reuse", heading: "3. Review and reuse", body: "The generated brief should produce a primary concept, a rationale, and a variation. Review whether the claims are supportable, the language fits the audience, and the next action is clear. Save the strongest version as a reusable starting point." }], steps: ["Begin with the real business outcome, not a generic request.", "Choose the channel and format before asking for copy.", "Add audience, voice, constraints, and a specific action.", "Review the result before publishing and save what works."] } as Guide;

const relatedGuideNotes: Record<string, string> = {
  "/guides/prompt-engineering-basics": "Build the clear-brief habits that make every later prompt more useful.",
  "/guides/prompt-engineering-for-marketing": "Apply prompt structure to campaigns, content, and customer-facing work.",
  "/guides/evaluate-and-improve-ai-prompts": "Test, inspect, and refine prompts before you rely on them repeatedly.",
  "/guides/promptforge-workflow-case-study": "See a real brief move from a rough idea to a reusable AI workflow.",
};

export function getGuide(path: string) { return [...guides, caseStudy].find((guide) => guide.path === path); }

function AuthorMeta({ guide }: { guide: Guide }) { return <div className="guide-byline"><div className="guide-author-mark">PF</div><div><Link href="/author/promptforge-editorial-team"><strong>{guide.author}</strong></Link><span>{guide.authorRole}</span></div><time dateTime={guide.published}>Published {new Date(`${guide.published}T00:00:00Z`).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })}</time>{guide.updated !== guide.published && <time dateTime={guide.updated}>Updated {new Date(`${guide.updated}T00:00:00Z`).toLocaleDateString("en-NG", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" })}</time>}</div>; }

function GuideShareButton({ guide }: { guide: Guide }) {
  const [status, setStatus] = useState<"idle" | "shared" | "copied" | "unavailable">("idle");
  const share = async () => {
    const result = await shareGuide(guide.title, guide.path);
    setStatus(result);
    if (result !== "unavailable") trackGuideEvent("guide_share", { guide_path: guide.path, method: result });
    window.setTimeout(() => setStatus("idle"), 2200);
  };
  return <button type="button" className="guide-share-button" onClick={() => void share()} aria-live="polite"><Share2 size={15}/>{status === "shared" ? "Shared" : status === "copied" ? "Link copied" : status === "unavailable" ? "Copy unavailable" : "Share this guide"}</button>;
}

function InteractiveCaseStudy() {
  const [audience, setAudience] = useState("Women aged 25–40 comparing affordable skincare options");
  const [offer, setOffer] = useState("A cleanser + moisturizer bundle with free delivery this week");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "unavailable">("idle");
  const output = useMemo(() => `ROLE\nYou are a thoughtful social media strategist for a Nigerian skincare business.\n\nTASK\nCreate an Instagram launch post for: ${offer}.\n\nAUDIENCE\n${audience}.\n\nTONE / VOICE\nWarm, clear, practical, and trustworthy.\n\nCONSTRAINTS\nAvoid medical promises or unsupported results. Keep the copy skimmable, include one clear CTA, and suggest a visual direction.\n\nDELIVERABLES\nGive one primary caption, a short rationale, and one alternate hook.`, [audience, offer]);
  useEffect(() => { trackGuideEvent("guide_interactive_view", { guide_path: "/guides/promptforge-workflow-case-study" }); }, []);
  const copy = async () => {
    const result = await copyText(output);
    setCopyStatus(result);
    if (result === "copied") trackGuideEvent("guide_interactive_copy", { guide_path: "/guides/promptforge-workflow-case-study" });
    window.setTimeout(() => setCopyStatus("idle"), 2200);
  };
  return <section className="case-study-interactive" id="interactive-example"><div className="section-kicker">INTERACTIVE EXAMPLE <span>Edit the brief, then copy the output.</span></div><div className="case-study-grid"><div className="case-inputs"><label className="field"><span>Audience</span><textarea value={audience} onChange={(event) => setAudience(event.target.value)} rows={3}/></label><label className="field"><span>Offer or campaign detail</span><textarea value={offer} onChange={(event) => setOffer(event.target.value)} rows={3}/></label><p className="case-hint">These fields mirror the inputs you would shape in the Builder before asking an AI assistant for a draft.</p></div><div className="case-output"><div className="case-output-head"><span>LIVE PROMPT</span><button onClick={() => void copy()} aria-live="polite" aria-label="Copy prompt to clipboard"><Clipboard size={14}/>{copyStatus === "copied" ? "Prompt copied" : copyStatus === "unavailable" ? "Copy unavailable" : "Copy prompt"}</button></div><pre>{output}</pre></div></div></section>;
}

export default function GuidePages() {
  const [location] = useLocation();
  const guide = getGuide(location) ?? guides[0];
  const related = [...guides, caseStudy].filter((item) => item.path !== guide.path);
  useEffect(() => {
    const onScroll = createScrollDepthTracker(guide.path);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [guide.path]);
  return <main className="simple-page guide-page"><section className="page-intro editorial-intro guide-hero"><div className="intro-side">FIELD GUIDE / {guide.number}<br/><span>{guide.label}</span></div><div><div className="eyebrow"><BookOpen size={14}/> PROMPT ENGINEERING</div><h1>{guide.title}</h1><p>{guide.intro}</p><AuthorMeta guide={guide}/><div className="guide-hero-actions"><Link href="/" className="forge-button"><Sparkles size={17}/> Try the Builder <ArrowRight size={15}/></Link><Link href="/library" className="text-link">Browse the Library <ArrowRight size={15}/></Link><GuideShareButton guide={guide}/></div></div></section><section className="guide-body"><aside className="guide-aside"><div className="guide-toc"><div className="guide-toc-title">ON THIS PAGE</div><a href="#top">Overview</a>{guide.sections.map((section) => <a href={`#${section.id}`} key={section.id}>{section.heading}</a>)}{guide.path === caseStudy.path && <a href="#interactive-example">Interactive example</a>}<a href="#checklist">Checklist</a></div><div className="guide-note"><div className="guide-stamp"><Lightbulb size={20}/><span>FIELD NOTE</span></div><p>{guide.takeaway}</p><Link href="/about" className="text-link">Why PromptForge exists <ArrowRight size={14}/></Link></div></aside><article className="guide-article" id="top"><div className="section-kicker">THE WORKING METHOD <span>Clear inputs. Useful outputs.</span></div>{guide.sections.map((section, index) => <section className="guide-section" id={section.id} key={section.id}><span className="guide-index">{guide.path === caseStudy.path ? "" : `0${index + 1}`}</span><div><h2>{section.heading}</h2><p>{section.body}</p></div></section>)}{guide.path === caseStudy.path && <InteractiveCaseStudy/>}<div className="guide-checklist" id="checklist"><div className="section-kicker">A QUICK CHECKLIST <span>Before you press send.</span></div>{guide.steps.map((step) => <div className="guide-check" key={step}><CheckCircle2 size={16}/><span>{step}</span></div>)}</div></article></section><section className="guide-next"><div><div className="eyebrow">KEEP BUILDING</div><h2>Turn the method into a reusable workflow.</h2><p>Use the Builder for a structured first draft, then save the version that earns its place in your personal shelf.</p></div><div className="guide-next-links"><Link href="/" className="forge-button">Forge a prompt <ArrowRight size={15}/></Link><Link href="/contact" className="text-link">Suggest a guide topic <ArrowRight size={14}/></Link></div></section><section className="guide-related" aria-label="Related Guides"><div className="section-kicker">RELATED GUIDES <span>Keep the work moving.</span></div><p className="guide-related-intro">Continue with the next most useful workshop note for building, applying, and reviewing stronger AI prompts.</p><div className="guide-related-grid">{related.map((item) => <Link href={item.path} className="guide-related-card" key={item.path}><span>{item.number} / {item.label}</span><strong>{item.title}</strong><small>{relatedGuideNotes[item.path]}</small><ArrowRight size={16}/></Link>)}</div></section></main>;
}
