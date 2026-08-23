import { ArrowRight, BookOpen, CheckCircle2, Lightbulb, Sparkles } from "lucide-react";
import { Link, useLocation } from "wouter";

type Guide = {
  path: string;
  number: string;
  label: string;
  title: string;
  intro: string;
  takeaway: string;
  sections: { heading: string; body: string }[];
  steps: string[];
};

const guides: Guide[] = [
  {
    path: "/guides/prompt-engineering-basics",
    number: "01",
    label: "FOUNDATIONS",
    title: "Prompt engineering basics: how to write clearer AI instructions",
    intro: "A practical introduction to prompt engineering for beginners who want more reliable answers from ChatGPT, Gemini, Claude, and other AI assistants.",
    takeaway: "The goal is not to write the longest prompt. It is to make the desired outcome, useful context, and boundaries visible.",
    sections: [
      { heading: "Start with the result", body: "Describe what a successful answer should help you do. Replace a vague request such as ‘write something about marketing’ with a concrete deliverable, audience, channel, and purpose." },
      { heading: "Give the model a role and audience", body: "A role provides a useful point of view, while an audience helps shape language and depth. These details are most valuable when they change the decision the model should make." },
      { heading: "Add constraints that protect quality", body: "Specify length, format, tone, exclusions, required points, and evidence expectations. Constraints reduce unhelpful interpretation without forcing you to prescribe every sentence." },
    ],
    steps: ["Name the deliverable and the outcome it should support.", "Add the audience, channel, tone, and essential context.", "State the format and constraints, then ask for a useful first draft.", "Review the result and tighten the prompt around what was missing."],
  },
  {
    path: "/guides/prompt-engineering-for-marketing",
    number: "02",
    label: "MARKETING WORKFLOWS",
    title: "Prompt engineering for marketing: build briefs that produce usable content",
    intro: "Learn how marketers, creators, and freelancers can turn campaign goals into repeatable AI briefs for social media, email, SEO, ads, and customer engagement.",
    takeaway: "A marketing prompt works best when it connects the business goal to the audience action, the channel format, and the brand voice.",
    sections: [
      { heading: "Separate strategy from copy", body: "Tell the model whether it should develop a campaign angle, write the asset, or critique an existing draft. Separating these jobs makes the output easier to review and reuse." },
      { heading: "Make the channel specific", body: "A LinkedIn post, WhatsApp message, email sequence, and short-form video script need different structures. Name the channel and ask for native formatting rather than one generic piece of copy." },
      { heading: "Protect trust and compliance", body: "Ask the model to avoid unsupported claims, protect personal information, respect consent, and include a human review step for regulated or high-stakes customer communications." },
    ],
    steps: ["Define the campaign goal in one measurable sentence.", "Describe the audience, offer, customer stage, and desired action.", "Choose the channel, format, length, voice, and required message points.", "Request a primary draft, a rationale, and one testable variation."],
  },
  {
    path: "/guides/evaluate-and-improve-ai-prompts",
    number: "03",
    label: "QUALITY CONTROL",
    title: "How to evaluate and improve an AI prompt before you reuse it",
    intro: "A prompt is not finished when it produces one good answer. Use this review method to make prompts clearer, safer, and more consistent across projects and AI tools.",
    takeaway: "Treat prompts like working documents: test them against realistic inputs, inspect the failure modes, and revise only the instructions that improve the result.",
    sections: [
      { heading: "Check for observable success criteria", body: "You should be able to tell whether the answer met the brief. Look for requirements such as structure, audience fit, factual caution, actionability, and an appropriate level of detail." },
      { heading: "Test edge cases, not only ideal examples", body: "Try incomplete context, competing constraints, sensitive information, and a different audience. Strong prompts make the safe next step clear when the model cannot confidently complete the task." },
      { heading: "Keep a small evaluation set", body: "Save a few representative inputs and compare revisions against them. This makes prompt improvement less subjective and helps teams reuse a prompt without losing its original purpose." },
    ],
    steps: ["Collect three realistic examples of the work the prompt should support.", "Score each output against clarity, usefulness, format, and safety criteria.", "Fix the highest-impact ambiguity or missing constraint first.", "Retest, record the strongest version, and revisit it when the workflow changes."],
  },
];

export function getGuide(path: string) {
  return guides.find((guide) => guide.path === path);
}

export default function GuidePages() {
  const [location] = useLocation();
  const guide = getGuide(location) ?? guides[0];
  const related = guides.filter((item) => item.path !== guide.path);

  return <main className="simple-page guide-page">
    <section className="page-intro editorial-intro guide-hero">
      <div className="intro-side">FIELD GUIDE / {guide.number}<br/><span>{guide.label}</span></div>
      <div><div className="eyebrow"><BookOpen size={14}/> PROMPT ENGINEERING</div><h1>{guide.title}</h1><p>{guide.intro}</p><div className="guide-hero-actions"><Link href="/" className="forge-button"><Sparkles size={17}/> Try the Builder <ArrowRight size={15}/></Link><Link href="/library" className="text-link">Browse the Library <ArrowRight size={15}/></Link></div></div>
    </section>
    <section className="guide-body">
      <aside className="guide-aside"><div className="guide-stamp"><Lightbulb size={20}/><span>FIELD NOTE</span></div><p>{guide.takeaway}</p><Link href="/about" className="text-link">Why PromptForge exists <ArrowRight size={14}/></Link></aside>
      <article className="guide-article"><div className="section-kicker">THE WORKING METHOD <span>Clear inputs. Useful outputs.</span></div>{guide.sections.map((section, index) => <section className="guide-section" key={section.heading}><span className="guide-index">0{index + 1}</span><div><h2>{section.heading}</h2><p>{section.body}</p></div></section>)}<div className="guide-checklist"><div className="section-kicker">A QUICK CHECKLIST <span>Before you press send.</span></div>{guide.steps.map((step) => <div className="guide-check" key={step}><CheckCircle2 size={16}/><span>{step}</span></div>)}</div></article>
    </section>
    <section className="guide-next"><div><div className="eyebrow">KEEP BUILDING</div><h2>Turn the method into a reusable workflow.</h2><p>Use the Builder for a structured first draft, then save the version that earns its place in your personal shelf.</p></div><div className="guide-next-links"><Link href="/" className="forge-button">Forge a prompt <ArrowRight size={15}/></Link><Link href="/contact" className="text-link">Suggest a guide topic <ArrowRight size={14}/></Link></div></section>
    <section className="guide-related"><div className="section-kicker">MORE FROM THE FIELD GUIDE <span>Continue the workshop.</span></div><div className="guide-related-grid">{related.map((item) => <Link href={item.path} className="guide-related-card" key={item.path}><span>{item.number} / {item.label}</span><strong>{item.title}</strong><ArrowRight size={16}/></Link>)}</div></section>
  </main>;
}
