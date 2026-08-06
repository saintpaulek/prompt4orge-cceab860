import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Hammer, Sparkles, RotateCcw, Bookmark, Wand2, ChevronDown, ChevronRight, Library as LibraryIcon, X, Users } from "lucide-react";
import { Field, Select, Toggle, CopyButton, SectionTitle, inputCls, GhostButton } from "@/components/pf/ui";
import { useLocal } from "@/lib/store";
import { LIBRARY } from "@/lib/prompts";
import { BUILDER_CATEGORIES, CATEGORY_CONFIG, type BuilderCategory } from "@/lib/categories";
import { SOCIAL_PROOF_TEXT, TESTIMONIALS } from "@/lib/copy";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { p?: number } =>
    search.p != null && Number.isFinite(Number(search.p)) ? { p: Number(search.p) } : {},

  head: () => ({
    meta: [
      { title: "PromptForge Builder — Craft an AI prompt in 60 seconds" },
      { name: "description", content: "Pick a category, platform, tone, and goal, then copy a production-ready AI prompt instantly." },
      { property: "og:title", content: "PromptForge Builder — Craft an AI prompt in 60 seconds" },
      { property: "og:description", content: "Pick a category, platform, tone, and goal, then copy a production-ready AI prompt instantly." },
      { property: "og:image", content: "https://prompt4orge.lovable.app/og-image.png" },
      { name: "twitter:image", content: "https://prompt4orge.lovable.app/og-image.png" },
    ],
  }),
  component: BuilderPage,
});

// maps a library category onto a builder category
const LIB_TO_CAT: Record<string, BuilderCategory> = {
  SMM: "Social Media",
  "VA Tasks": "Business & Strategy",
  "Customer Service": "Business & Strategy",
  "Automation Logic": "Code & Development",
  SEO: "Writing & Content",
  "Email Marketing": "Marketing",
  "Sales & Copywriting": "Marketing",
  "Content Strategy": "Writing & Content",
  "Image Generation": "Image Generation",
  "Video & Shorts": "Social Media",
  "Blogging & Articles": "Writing & Content",
  "Ecommerce & Product": "Marketing",
  "Freelancing & Clients": "Business & Strategy",
  "Branding & Identity": "Marketing",
  "Ads & Paid Media": "Marketing",
  "ChatGPT Productivity": "Writing & Content",
  "Business & Strategy": "Business & Strategy",
  "Education & Learning": "Writing & Content",
  "Personal Development": "Writing & Content",
  "Finance & Admin": "Business & Strategy",
};

const IMG_STYLES = [
  "Photorealistic product shot", "Lifestyle / editorial photography", "Cinematic / film still",
  "3D render / product CGI", "Flat illustration / vector", "Watercolor / painterly",
  "Anime / manga", "Minimalist graphic / poster", "UGC / phone snapshot style", "Brand identity / logo lockup scene",
];
const RATIOS = ["1:1", "4:5", "9:16", "16:9", "3:2", "2:3"];
const LIGHTS = [
  "Soft natural daylight", "Dramatic rim light", "Studio softbox", "Golden hour",
  "Neon / cyberpunk", "Moody low-key", "Bright high-key commercial",
];
const LENSES = ["24mm wide-angle", "35mm documentary", "50mm nifty-fifty", "85mm portrait", "100mm macro", "135mm telephoto", "16mm ultra-wide", "Anamorphic 40mm"];
const APERTURES = ["f/1.2", "f/1.4", "f/1.8", "f/2.8", "f/4", "f/5.6", "f/8", "f/11"];
const ISOS = ["ISO 100", "ISO 200", "ISO 400", "ISO 800", "ISO 1600", "ISO 3200"];
const SHUTTERS = ["1/1000s", "1/500s", "1/250s", "1/125s", "1/60s", "1/30s", "1s long exposure"];
const CAMERAS = ["Sony A7 IV", "Canon EOS R5", "Fujifilm X-T5", "Hasselblad X2D", "Leica Q3", "Phase One XT", "iPhone 15 Pro"];

const DEFAULT_NEG = "blur, watermark, extra fingers, distorted text, low quality, cluttered background";

const K_MY = "pf.myprompts.v1";
type MyPrompt = { id: string; title: string; text: string; at: number };

const DEFAULT_CATEGORY: BuilderCategory = "Social Media";

function BuilderPage() {
  const [category, setCategory] = useState<BuilderCategory>(DEFAULT_CATEGORY);
  const cfg = CATEGORY_CONFIG[category];

  const [role, setRole] = useState(CATEGORY_CONFIG[DEFAULT_CATEGORY].roles[0]);
  const [platform, setPlatform] = useState(CATEGORY_CONFIG[DEFAULT_CATEGORY].platforms[0]);
  const [tone, setTone] = useState(CATEGORY_CONFIG[DEFAULT_CATEGORY].tones[0]);
  const [goal, setGoal] = useState(CATEGORY_CONFIG[DEFAULT_CATEGORY].goals[0]);
  const [deliverables, setDeliverables] = useState<string[]>([...CATEGORY_CONFIG[DEFAULT_CATEGORY].deliverables]);
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [extras, setExtras] = useState("");

  const [imgStyle, setImgStyle] = useState(IMG_STYLES[0]);
  const [ratio, setRatio] = useState("1:1");
  const [light, setLight] = useState(LIGHTS[0]);
  const [incNeg, setIncNeg] = useState(true);
  const [incCam, setIncCam] = useState(false);
  const [incMJ, setIncMJ] = useState(true);
  const [plainOnly, setPlainOnly] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);
  const [negOpen, setNegOpen] = useState(true);
  const [camOpen, setCamOpen] = useState(true);
  const [negText, setNegText] = useState(DEFAULT_NEG);
  const [lens, setLens] = useState(LENSES[2]);
  const [aperture, setAperture] = useState(APERTURES[2]);
  const [iso, setIso] = useState(ISOS[1]);
  const [shutter, setShutter] = useState(SHUTTERS[3]);
  const [camera, setCamera] = useState(CAMERAS[0]);
  const [camExtra, setCamExtra] = useState("shallow depth of field, natural bokeh");

  const [refined, setRefined] = useState(false);
  const [note, setNote] = useState("");
  const [previewOpen, setPreviewOpen] = useState(true);
  const [, setMine] = useLocal<MyPrompt[]>(K_MY, []);

  // switching category re-scopes every dependent selector
  const applyCategory = (next: BuilderCategory) => {
    const c = CATEGORY_CONFIG[next];
    setCategory(next);
    setRole(c.roles[0]);
    setPlatform(c.platforms[0]);
    setTone(c.tones[0]);
    setGoal(c.goals[0]);
    setDeliverables([...c.deliverables]);
  };

  // "Use this prompt" from the Library: /?p=<id>
  const { p: importedId } = Route.useSearch();
  const [imported, setImported] = useState<{ id: number; title: string; cat: string; text: string } | null>(null);

  useEffect(() => {
    if (importedId == null) return;
    const found = LIBRARY.find((x) => x.id === importedId);
    if (!found) return;
    applyCategory(LIB_TO_CAT[found.cat] ?? DEFAULT_CATEGORY);
    setTopic(found.title);
    setAudience("");
    setImported({ id: found.id, title: found.title, cat: found.cat, text: found.prompt });
    setNote(`Loaded "${found.title}" from the library.`);
    setTimeout(() => setNote(""), 2500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importedId]);

  const isImage = category === "Image Generation";

  const base = useMemo(() => {
    const delivered = deliverables.length ? deliverables : cfg.deliverables;
    if (isImage) {
      const subject = topic.trim() || "[describe the main subject and scene]";
      const lines = [
        `ROLE: You are a ${role.toLowerCase()} writing prompts for ${platform}.`,
        "",
        `TASK: Create a detailed AI image generation prompt.`,
        `SUBJECT / SCENE: ${subject}`,
        audience.trim() ? `AUDIENCE: ${audience.trim()}` : "",
        `PLATFORM / MODEL: ${platform}`,
        `STYLE: ${imgStyle}`,
        `TONE: ${tone}`,
        `MOOD & LIGHTING: ${light}`,
        `PRIMARY GOAL: ${goal}`,
        `ASPECT RATIO: ${ratio} — compose for this frame.`,
        "COMPOSITION: clear focal point, balanced negative space, professional advertising quality.",
        incCam ? `CAMERA: ${camera}, ${lens}, ${aperture}, ${iso}, shutter ${shutter}${camExtra ? `, ${camExtra}` : ""}.` : "",
        extras ? `EXTRA CONTEXT: ${extras}` : "",
        "",
        "DELIVERABLES:",
        ...delivered.map((d) => `- ${d}`),
      ];
      if (incNeg) lines.push("", `NEGATIVE PROMPT: ${negText.trim() || DEFAULT_NEG}.`);
      if (incMJ && !plainOnly) lines.push("", `Midjourney flags: --ar ${ratio} --stylize 200 --v 6`);
      if (plainOnly) lines.push("", "CONSTRAINTS: output plain English only (for ChatGPT / DALL·E), no flags or slashes.");
      else lines.push("", "CONSTRAINTS: no text in the image unless specified, no watermarks, keep materials and colors consistent.");
      return lines.filter(Boolean).join("\n");
    }
    const t = topic.trim() || "[what's this about?]";
    const a = audience.trim() || "[target audience + pain points]";
    return [
      `ROLE: You are a ${role.toLowerCase()}.`,
      "",
      `TASK: Produce ${category.toLowerCase()} work about "${t}".`,
      `AUDIENCE: ${a}`,
      `PLATFORM / FORMAT: ${platform}`,
      `TONE / VOICE: ${tone}`,
      `PRIMARY GOAL: ${goal}`,
      extras ? `EXTRA CONTEXT: ${extras}` : "",
      "",
      "DELIVERABLES:",
      ...delivered.map((d) => `- ${d}`),
      "",
      `CONSTRAINTS: match ${platform} conventions and length, no fluff, plain clear language, ask before assuming missing facts.`,
    ].filter(Boolean).join("\n");
  }, [isImage, category, role, topic, audience, platform, tone, goal, deliverables, cfg.deliverables, extras, imgStyle, ratio, light, incNeg, incCam, incMJ, plainOnly, negText, lens, aperture, iso, shutter, camera, camExtra]);

  const source = imported
    ? [
        imported.text,
        "",
        "— YOUR SETTINGS —",
        `ROLE: ${role}`,
        `PLATFORM: ${platform}`,
        `TONE / VOICE: ${tone}`,
        `PRIMARY GOAL: ${goal}`,
        extras ? `EXTRA CONTEXT: ${extras}` : "",
      ].filter(Boolean).join("\n")
    : base;

  const generated = refined
    ? [
        source,
        "",
        "— REFINEMENTS —",
        "QUALITY BAR: write like a top 1% specialist; be concrete, use real numbers and examples over adjectives.",
        "PROCESS: think step by step before answering, then present only the polished result.",
        "SELF-CHECK: review your draft against the goal and constraints, then output the improved final version.",
        "CLARIFY: if anything essential is missing, ask up to 3 questions first.",
      ].join("\n")
    : source;

  const reset = () => {
    applyCategory(DEFAULT_CATEGORY);
    setTopic(""); setAudience(""); setExtras(""); setRefined(false);
    setImgStyle(IMG_STYLES[0]); setRatio("1:1"); setLight(LIGHTS[0]);
    setIncNeg(true); setIncCam(false); setIncMJ(true); setPlainOnly(false); setNegText(DEFAULT_NEG);
    setImported(null);
    setNote("Builder reset.");
    setTimeout(() => setNote(""), 1800);
  };

  const savePrompt = () => {
    const title = (topic.trim() || category) + (isImage ? " (image prompt)" : "");
    setMine((m) => [{ id: `my-${Date.now()}`, title, text: generated, at: Date.now() }, ...m]);
    setNote("Saved to your Saved page.");
    setTimeout(() => setNote(""), 2000);
  };

  const toggleDeliverable = (d: string) =>
    setDeliverables((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const whyTags = isImage
    ? ["Subject clarity", "Style constraint", "Composition", "Negative prompt", "Parameter packing"]
    : ["Role framing", "Audience specificity", "Clear goal", "Structured deliverables", "Constraints"];

  return (
    <div>
      <div className="mb-5">
        <h1 className="font-display text-3xl sm:text-4xl">FORGE YOUR PROMPT</h1>
        <p className="mt-1 text-sm text-[color:var(--color-cream-dim)]">
          Choose your materials, watch the prompt build live, then copy it into any AI tool.
        </p>
        <div className="mt-3 flex items-center gap-2 text-xs text-[color:var(--color-gold)]">
          <Users size={14} className="shrink-0" />
          <span>{SOCIAL_PROOF_TEXT}</span>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.role}
              className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)]/70 px-3 py-2"
            >
              <p className="text-xs leading-relaxed text-[color:var(--color-cream)]">“{t.quote}”</p>
              <p className="mt-1 text-[11px] text-[color:var(--color-cream-dim)]">{t.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* category selector */}
      <div className="mb-5 rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-4">
        <div className="mb-2 text-xs tracking-wider text-[color:var(--color-gold)] uppercase">Category</div>
        <div className="flex flex-wrap gap-2">
          {BUILDER_CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                type="button"
                onClick={() => applyCategory(c)}
                aria-pressed={active}
                className={`min-h-11 flex-1 rounded-xl border px-3 py-2 text-xs font-semibold transition sm:flex-none sm:text-sm ${
                  active
                    ? "border-[color:var(--color-ember)] bg-[color:var(--color-ember)] text-[color:var(--color-bg-deep)]"
                    : "border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <section className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-4 shadow-sm sm:p-5 md:col-span-2">
          <SectionTitle icon={<Hammer size={16} />}>CHOOSE YOUR MATERIALS</SectionTitle>

          <Field label="Role"><Select value={role} onChange={setRole} options={cfg.roles} /></Field>

          <Field label={isImage ? "Describe the image" : "What's this about?"}>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={cfg.topicPlaceholder}
              className={`${inputCls} min-h-24`}
            />
          </Field>
          <Field label="Audience">
            <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder={cfg.audiencePlaceholder} className={inputCls} />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label={isImage ? "Model / platform" : "Platform"}><Select value={platform} onChange={setPlatform} options={cfg.platforms} /></Field>
            <Field label="Tone"><Select value={tone} onChange={setTone} options={cfg.tones} /></Field>
          </div>
          <Field label="Goal"><Select value={goal} onChange={setGoal} options={cfg.goals} /></Field>

          <Field label="Deliverables">
            <div className="flex flex-wrap gap-2">
              {cfg.deliverables.map((d) => (
                <Toggle key={d} on={deliverables.includes(d)} onChange={() => toggleDeliverable(d)}>{d}</Toggle>
              ))}
            </div>
          </Field>

          {isImage && (
            <>
              <Field label="Image style"><Select value={imgStyle} onChange={setImgStyle} options={IMG_STYLES} /></Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Aspect ratio"><Select value={ratio} onChange={setRatio} options={RATIOS} /></Field>
                <Field label="Lighting / mood"><Select value={light} onChange={setLight} options={LIGHTS} /></Field>
              </div>

              <div className="mt-1 flex flex-wrap gap-2">
                <Toggle on={incNeg} onChange={setIncNeg}>Negative prompt</Toggle>
                <Toggle on={incCam} onChange={setIncCam}>Camera / lens</Toggle>
                <Toggle on={incMJ} onChange={setIncMJ}>Midjourney flags</Toggle>
                <Toggle on={plainOnly} onChange={setPlainOnly}>DALL·E / plain English</Toggle>
              </div>

              <div className="mt-4 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)]/40">
                <button
                  type="button"
                  onClick={() => setAdvOpen((o) => !o)}
                  aria-expanded={advOpen}
                  className="flex min-h-11 w-full items-center justify-between px-3 py-2 text-xs tracking-wider text-[color:var(--color-cream)]/80 uppercase hover:text-[color:var(--color-ember)]"
                >
                  <span className="flex items-center gap-2">
                    {advOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />} Advanced
                  </span>
                  <span className="text-[10px] opacity-60">{incNeg || incCam ? "negative + camera" : "optional"}</span>
                </button>

                {advOpen && (
                  <div className="space-y-3 border-t border-[color:var(--color-line)] p-3">
                    <div className="rounded-lg border border-[color:var(--color-line)]">
                      <button
                        type="button"
                        onClick={() => setNegOpen((o) => !o)}
                        aria-expanded={negOpen}
                        className="flex min-h-11 w-full items-center justify-between px-3 py-2 text-xs font-medium hover:text-[color:var(--color-ember)]"
                      >
                        <span className="flex items-center gap-2">
                          {negOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Negative prompt
                        </span>
                        <span className={`text-[10px] ${incNeg ? "text-[color:var(--color-ember)]" : "opacity-50"}`}>{incNeg ? "on" : "off"}</span>
                      </button>
                      {negOpen && (
                        <div className="space-y-2 px-3 pb-3">
                          <textarea
                            value={negText}
                            onChange={(e) => setNegText(e.target.value)}
                            disabled={!incNeg}
                            placeholder="things to avoid: blur, watermark, distorted text..."
                            className={`${inputCls} min-h-20`}
                          />
                          <div className="flex flex-wrap gap-1.5">
                            {["blur", "watermark", "extra fingers", "distorted text", "low quality", "cluttered background", "oversaturated", "plastic skin", "bad anatomy", "duplicate"].map((chip) => (
                              <button
                                key={chip}
                                type="button"
                                disabled={!incNeg}
                                onClick={() =>
                                  setNegText((prev) => {
                                    const parts = prev.split(",").map((p) => p.trim()).filter(Boolean);
                                    return parts.includes(chip)
                                      ? parts.filter((p) => p !== chip).join(", ")
                                      : [...parts, chip].join(", ");
                                  })
                                }
                                className="min-h-9 rounded-full border border-[color:var(--color-line)] px-2.5 py-1 text-[10px] hover:border-[color:var(--color-ember)] disabled:opacity-40"
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg border border-[color:var(--color-line)]">
                      <button
                        type="button"
                        onClick={() => setCamOpen((o) => !o)}
                        aria-expanded={camOpen}
                        className="flex min-h-11 w-full items-center justify-between px-3 py-2 text-xs font-medium hover:text-[color:var(--color-ember)]"
                      >
                        <span className="flex items-center gap-2">
                          {camOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />} Camera &amp; lens
                        </span>
                        <span className={`text-[10px] ${incCam ? "text-[color:var(--color-ember)]" : "opacity-50"}`}>{incCam ? "on" : "off"}</span>
                      </button>
                      {camOpen && (
                        <div className={`grid grid-cols-1 gap-2 px-3 pb-3 sm:grid-cols-2 ${!incCam ? "pointer-events-none opacity-50" : ""}`}>
                          <Field label="Camera body"><Select value={camera} onChange={setCamera} options={CAMERAS} /></Field>
                          <Field label="Lens"><Select value={lens} onChange={setLens} options={LENSES} /></Field>
                          <Field label="Aperture"><Select value={aperture} onChange={setAperture} options={APERTURES} /></Field>
                          <Field label="ISO"><Select value={iso} onChange={setIso} options={ISOS} /></Field>
                          <Field label="Shutter"><Select value={shutter} onChange={setShutter} options={SHUTTERS} /></Field>
                          <Field label="Extra notes">
                            <input value={camExtra} onChange={(e) => setCamExtra(e.target.value)} placeholder="shallow DOF, bokeh, tripod..." className={inputCls} />
                          </Field>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <Field label="Anything else? (optional)">
            <input value={extras} onChange={(e) => setExtras(e.target.value)} placeholder="brand notes, links, deadlines, do-nots" className={inputCls} />
          </Field>
        </section>

        <section className="animate-forge-glow rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-4 sm:p-5 md:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionTitle icon={<Sparkles size={16} />}>YOUR FORGED PROMPT</SectionTitle>
            <button
              type="button"
              onClick={() => setPreviewOpen((o) => !o)}
              className="mb-3 flex min-h-9 items-center gap-1 rounded-lg border border-[color:var(--color-line)] px-2.5 py-1.5 text-xs text-[color:var(--color-cream-dim)] md:hidden"
            >
              {previewOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              {previewOpen ? "Hide" : "Show"}
            </button>
          </div>

          {imported && (
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] px-3 py-2 text-xs text-[color:var(--color-gold)]">
              <span className="flex min-w-0 items-center gap-2">
                <LibraryIcon size={14} className="shrink-0" />
                <span className="truncate">
                  From library #{imported.id.toString().padStart(4, "0")} · {imported.cat} — {imported.title}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <Link to="/library" className="underline hover:no-underline">Library</Link>
                <button
                  type="button"
                  onClick={() => setImported(null)}
                  aria-label="Clear imported prompt"
                  className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-[color:var(--color-gold)]/20"
                >
                  <X size={13} />
                </button>
              </span>
            </div>
          )}

          <pre
            className={`scrollbar-thin max-h-[360px] overflow-auto rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] p-3 text-xs leading-relaxed break-words whitespace-pre-wrap text-[color:var(--color-cream)] sm:p-4 sm:text-sm md:block md:max-h-[520px] ${previewOpen ? "block" : "hidden"}`}
          >
{generated}
          </pre>

          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton text={generated} />
            <GhostButton onClick={savePrompt}><Bookmark size={15} /> Save</GhostButton>
            <GhostButton onClick={reset}><RotateCcw size={15} /> Reset</GhostButton>
            <button
              type="button"
              onClick={() => { setRefined((r) => !r); setNote(refined ? "Refinements removed." : "Refined with AI best practices."); setTimeout(() => setNote(""), 2000); }}
              className={`flex min-h-11 items-center gap-1.5 rounded-lg border px-3.5 py-2 text-sm font-semibold transition ${
                refined
                  ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] text-[color:var(--color-gold)]"
                  : "border-[color:var(--color-gold)] text-[color:var(--color-gold)] hover:bg-[color:var(--color-gold-soft)]"
              }`}
            >
              <Wand2 size={15} /> {refined ? "Refined" : "Refine with AI"}
            </button>
          </div>
          {note && <div className="mt-3 text-xs text-[color:var(--color-gold)]">{note}</div>}

          <div className="mt-5">
            <div className="mb-2 text-xs tracking-wider text-[color:var(--color-cream-dim)] uppercase">Why this works</div>
            <div className="flex flex-wrap gap-2">
              {whyTags.map((t) => (
                <span key={t} className="rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-2.5 py-1 text-xs text-[color:var(--color-gold)]">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
