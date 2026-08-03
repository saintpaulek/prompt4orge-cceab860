import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Hammer, Sparkles, RotateCcw, Bookmark, Wand2, ChevronDown, ChevronRight } from "lucide-react";
import { Field, Select, SelectChips, Toggle, CopyButton, SectionTitle, inputCls, GhostButton } from "@/components/pf/ui";
import { useLocal } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PromptForge Builder — Craft an AI prompt in 60 seconds" },
      { name: "description", content: "Pick a content type, platform, tone, and goal, then copy a production-ready AI prompt instantly." },
      { property: "og:title", content: "PromptForge Builder — Craft an AI prompt in 60 seconds" },
      { property: "og:description", content: "Pick a content type, platform, tone, and goal, then copy a production-ready AI prompt instantly." },
    ],
  }),
  component: BuilderPage,
});

type ContentType = "Social post" | "Email" | "Blog" | "Ad copy" | "Video script" | "Image Prompt (AI Art)";
const CONTENT_TYPES: ContentType[] = ["Social post", "Email", "Blog", "Ad copy", "Video script", "Image Prompt (AI Art)"];
const PLATFORMS = ["Instagram", "TikTok", "LinkedIn", "X (Twitter)", "Facebook", "YouTube", "Email", "Blog"];
const TONES = ["Friendly-expert", "Playful", "Premium / luxury", "Bold / edgy", "Warm / conversational", "Authoritative"];
const GOALS = ["Awareness", "Engagement", "Leads", "Sales", "Retention", "Education"];
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

function BuilderPage() {
  const [contentType, setContentType] = useState<ContentType>("Social post");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [tone, setTone] = useState(TONES[0]);
  const [goal, setGoal] = useState(GOALS[0]);
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
  const [, setMine] = useLocal<MyPrompt[]>(K_MY, []);

  const isImage = contentType === "Image Prompt (AI Art)";

  const base = useMemo(() => {
    if (isImage) {
      const subject = topic.trim() || "[describe the main subject and scene]";
      const lines = [
        "Create a detailed AI image generation prompt.",
        "",
        `SUBJECT: ${subject}`,
        `STYLE: ${imgStyle}`,
        `MOOD & LIGHTING: ${light}`,
        `ASPECT RATIO: ${ratio} — compose for this frame.`,
        tone ? `AESTHETIC / TONE: ${tone}` : "",
        "COMPOSITION: clear focal point, balanced negative space, professional advertising quality.",
        "DETAILS: materials, textures, color palette; no text unless specified.",
        incCam ? `CAMERA: ${camera}, ${lens}, ${aperture}, ${iso}, shutter ${shutter}${camExtra ? `, ${camExtra}` : ""}.` : "",
        extras ? `EXTRA CONTEXT: ${extras}` : "",
        "",
        "Write 2 complete prompt variants:",
        "1) Highly detailed, production-ready",
        "2) Simpler, cleaner alternative",
      ];
      if (incNeg) lines.push("", `NEGATIVE PROMPT: ${negText.trim() || DEFAULT_NEG}.`);
      if (incMJ && !plainOnly) lines.push("", `Midjourney flags: --ar ${ratio} --stylize 200 --v 6`);
      if (plainOnly) lines.push("", "Output as plain English only (for ChatGPT / DALL·E). No flags or slashes.");
      return lines.filter(Boolean).join("\n");
    }
    const t = topic.trim() || "[what's this about?]";
    const a = audience.trim() || "[target audience + pain points]";
    return [
      `You are a senior ${platform} ${contentType.toLowerCase()} strategist.`,
      "",
      `TASK: Write a ${contentType.toLowerCase()} about "${t}".`,
      `AUDIENCE: ${a}`,
      `PLATFORM: ${platform}`,
      `TONE / VOICE: ${tone}`,
      `PRIMARY GOAL: ${goal}`,
      extras ? `EXTRA CONTEXT: ${extras}` : "",
      "",
      "DELIVERABLES:",
      "- Final copy ready to publish",
      "- 3 hook / opening variants",
      "- Clear single CTA",
      "- 5 relevant hashtags (only if the platform uses them)",
      "",
      "CONSTRAINTS: match the platform's format and length, no fluff, 7th-grade reading level, no emojis unless brand-appropriate.",
    ].filter(Boolean).join("\n");
  }, [isImage, contentType, topic, audience, platform, tone, goal, extras, imgStyle, ratio, light, incNeg, incCam, incMJ, plainOnly, negText, lens, aperture, iso, shutter, camera, camExtra]);

  const generated = refined
    ? [
        base,
        "",
        "— REFINEMENTS —",
        "QUALITY BAR: write like a top 1% specialist; be concrete, use real numbers and examples over adjectives.",
        "PROCESS: think step by step before answering, then present only the polished result.",
        "SELF-CHECK: review your draft against the goal and constraints, then output the improved final version.",
        "CLARIFY: if anything essential is missing, ask up to 3 questions first.",
      ].join("\n")
    : base;

  const reset = () => {
    setContentType("Social post"); setTopic(""); setAudience(""); setPlatform("Instagram");
    setTone(TONES[0]); setGoal(GOALS[0]); setExtras(""); setRefined(false);
    setImgStyle(IMG_STYLES[0]); setRatio("1:1"); setLight(LIGHTS[0]);
    setIncNeg(true); setIncCam(false); setIncMJ(true); setPlainOnly(false); setNegText(DEFAULT_NEG);
    setNote("Builder reset.");
    setTimeout(() => setNote(""), 1800);
  };

  const savePrompt = () => {
    const title = (topic.trim() || contentType) + (isImage ? " (image prompt)" : "");
    setMine((m) => [{ id: `my-${Date.now()}`, title, text: generated, at: Date.now() }, ...m]);
    setNote("Saved to your Saved page.");
    setTimeout(() => setNote(""), 2000);
  };

  const whyTags = isImage
    ? ["Subject clarity", "Style constraint", "Composition", "Negative prompt", "Parameter packing"]
    : ["Role framing", "Audience specificity", "Clear goal", "Structured deliverables", "Constraints"];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl sm:text-4xl">FORGE YOUR PROMPT</h1>
        <p className="mt-1 text-sm text-[color:var(--color-cream-dim)]">
          Choose your materials, watch the prompt build live, then copy it into any AI tool.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        <section className="rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-5 shadow-sm md:col-span-2">
          <SectionTitle icon={<Hammer size={16} />}>CHOOSE YOUR MATERIALS</SectionTitle>

          <Field label="Content type">
            <SelectChips value={contentType} onChange={(v) => setContentType(v as ContentType)} options={CONTENT_TYPES} />
          </Field>

          {isImage ? (
            <>
              <Field label="Describe the image">
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="matte black skincare bottle on wet stone, water droplets, dark bathroom, luxury feel"
                  className={`${inputCls} min-h-24`}
                />
              </Field>
              <Field label="Image style"><Select value={imgStyle} onChange={setImgStyle} options={IMG_STYLES} /></Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Aspect ratio"><Select value={ratio} onChange={setRatio} options={RATIOS} /></Field>
                <Field label="Lighting / mood"><Select value={light} onChange={setLight} options={LIGHTS} /></Field>
              </div>
              <Field label="Aesthetic tone (optional)">
                <input value={tone} onChange={(e) => setTone(e.target.value)} placeholder="cinematic, premium, playful" className={inputCls} />
              </Field>

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
                                className="rounded-full border border-[color:var(--color-line)] px-2 py-1 text-[10px] hover:border-[color:var(--color-ember)] disabled:opacity-40"
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
          ) : (
            <>
              <Field label="What's this about?">
                <textarea
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. launching a skincare line for busy moms"
                  className={`${inputCls} min-h-24`}
                />
              </Field>
              <Field label="Audience">
                <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="e.g. moms 28–40 tired of complex routines" className={inputCls} />
              </Field>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Platform"><Select value={platform} onChange={setPlatform} options={PLATFORMS} /></Field>
                <Field label="Tone"><Select value={tone} onChange={setTone} options={TONES} /></Field>
              </div>
              <Field label="Goal"><Select value={goal} onChange={setGoal} options={GOALS} /></Field>
            </>
          )}

          <Field label="Anything else? (optional)">
            <input value={extras} onChange={(e) => setExtras(e.target.value)} placeholder="brand notes, links, deadlines, do-nots" className={inputCls} />
          </Field>
        </section>

        <section className="animate-forge-glow rounded-2xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-5 md:col-span-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <SectionTitle icon={<Sparkles size={16} />}>YOUR FORGED PROMPT</SectionTitle>
          </div>
          <pre className="scrollbar-thin max-h-[420px] overflow-auto rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] p-4 text-sm leading-relaxed break-words whitespace-pre-wrap text-[color:var(--color-cream)] md:max-h-[520px]">
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
