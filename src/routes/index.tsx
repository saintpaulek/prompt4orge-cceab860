import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Hammer, Library, Bookmark, Search, Copy, Check, Lock, Unlock,
  Sparkles, Image as ImageIcon, X, Star, ChevronDown, ChevronRight,
} from "lucide-react";
import logoAsset from "@/assets/promptforge-logo.png.asset.json";
import { LIBRARY, CATEGORIES, isFreePrompt, type Prompt } from "@/lib/prompts";

export const Route = createFileRoute("/")({
  component: PromptForgeApp,
});

// ---------- unlock code (checksum) ----------
function checksum(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return chars[h % 36] + chars[(h >>> 5) % 36];
}
function isValidUnlockCode(code: string) {
  const m = code.trim().toUpperCase().match(/^PF-([A-Z0-9]{6})-([A-Z0-9]{2})$/);
  if (!m) return false;
  return checksum(m[1]) === m[2];
}

// ---------- storage ----------
const K_UNLOCK = "pf.unlocked.v2";
const K_SAVED = "pf.saved.v2";
function useLocal<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) setV(JSON.parse(raw));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key, v]);
  return [v, setV] as const;
}

// ---------- types ----------
type Tab = "builder" | "library" | "saved";
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
const LENSES = [
  "24mm wide-angle", "35mm documentary", "50mm nifty-fifty", "85mm portrait",
  "100mm macro", "135mm telephoto", "16mm ultra-wide", "Anamorphic 40mm",
];
const APERTURES = ["f/1.2", "f/1.4", "f/1.8", "f/2.8", "f/4", "f/5.6", "f/8", "f/11"];
const ISOS = ["ISO 100", "ISO 200", "ISO 400", "ISO 800", "ISO 1600", "ISO 3200"];
const SHUTTERS = ["1/1000s", "1/500s", "1/250s", "1/125s", "1/60s", "1/30s", "1s long exposure"];
const CAMERAS = ["Sony A7 IV", "Canon EOS R5", "Fujifilm X-T5", "Hasselblad X2D", "Leica Q3", "Phase One XT", "iPhone 15 Pro"];

// ---------- app ----------
function PromptForgeApp() {
  const [tab, setTab] = useState<Tab>("builder");
  const [unlocked, setUnlocked] = useLocal<boolean>(K_UNLOCK, false);
  const [saved, setSaved] = useLocal<number[]>(K_SAVED, []);
  const [unlockOpen, setUnlockOpen] = useState(false);

  const toggleSave = (id: number) =>
    setSaved((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  return (
    <div className="min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-cream)]">
      <Header tab={tab} setTab={setTab} onUnlock={() => setUnlockOpen(true)} unlocked={unlocked} />
      <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">
        {tab === "builder" && <Builder />}
        {tab === "library" && (
          <LibraryView
            unlocked={unlocked}
            saved={saved}
            onToggleSave={toggleSave}
            onUnlock={() => setUnlockOpen(true)}
          />
        )}
        {tab === "saved" && (
          <SavedView
            unlocked={unlocked}
            saved={saved}
            onToggleSave={toggleSave}
            onUnlock={() => setUnlockOpen(true)}
          />
        )}
      </main>
      <Footer />
      {unlockOpen && (
        <UnlockModal
          onClose={() => setUnlockOpen(false)}
          onUnlock={() => { setUnlocked(true); setUnlockOpen(false); }}
          unlocked={unlocked}
        />
      )}
    </div>
  );
}

// ---------- header / footer ----------
function Header({
  tab, setTab, onUnlock, unlocked,
}: { tab: Tab; setTab: (t: Tab) => void; onUnlock: () => void; unlocked: boolean }) {
  const tabs: { id: Tab; label: string; icon: typeof Hammer }[] = [
    { id: "builder", label: "Builder", icon: Hammer },
    { id: "library", label: "Library", icon: Library },
    { id: "saved", label: "Saved", icon: Bookmark },
  ];
  return (
    <header className="sticky top-0 z-30 border-b border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)]/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img src={logoAsset.url} alt="PromptForge" className="h-11 w-11 rounded-lg object-cover" />
          <div className="leading-tight">
            <div className="font-display text-3xl md:text-4xl">
              <span className="text-[color:var(--color-cream)]">Prompt</span>
              <span className="wordmark-forge">Forge</span>
            </div>
            <div className="text-xs text-[color:var(--color-cream-dim)]">
              Build the perfect AI prompt in 60 seconds
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <nav className="flex items-center rounded-lg border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-[color:var(--color-ember)] text-[color:var(--color-bg-deep)]"
                      : "text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
                  }`}
                >
                  <Icon size={16} />
                  {t.label}
                </button>
              );
            })}
          </nav>
          <button
            onClick={onUnlock}
            className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition ${
              unlocked
                ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] text-[color:var(--color-gold)]"
                : "border-[color:var(--color-line)] bg-[color:var(--color-panel)] text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
            }`}
          >
            {unlocked ? <Unlock size={14} /> : <Lock size={14} />}
            {unlocked ? "Unlocked" : "Unlock full library"}
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-line)] mt-16">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-[color:var(--color-cream-dim)]">
        Built for social media managers, VAs, and creators learning to work with AI — one prompt at a time.
      </div>
    </footer>
  );
}

// ---------- builder ----------
function Builder() {
  const [contentType, setContentType] = useState<ContentType>("Social post");
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("");
  const [platform, setPlatform] = useState<string>("Instagram");
  const [tone, setTone] = useState<string>(TONES[0]);
  const [goal, setGoal] = useState<string>(GOALS[0]);
  const [extras, setExtras] = useState("");

  // image-mode extras
  const [imgStyle, setImgStyle] = useState<string>(IMG_STYLES[0]);
  const [ratio, setRatio] = useState<string>("1:1");
  const [light, setLight] = useState<string>(LIGHTS[0]);
  const [incNeg, setIncNeg] = useState(true);
  const [incCam, setIncCam] = useState(false);
  const [incMJ, setIncMJ] = useState(true);
  const [plainOnly, setPlainOnly] = useState(false);
  // advanced image controls
  const [advOpen, setAdvOpen] = useState(false);
  const [negOpen, setNegOpen] = useState(true);
  const [camOpen, setCamOpen] = useState(true);
  const [negText, setNegText] = useState(
    "blur, watermark, extra fingers, distorted text, low quality, cluttered background",
  );
  const [lens, setLens] = useState<string>(LENSES[2]);
  const [aperture, setAperture] = useState<string>(APERTURES[2]);
  const [iso, setIso] = useState<string>(ISOS[1]);
  const [shutter, setShutter] = useState<string>(SHUTTERS[3]);
  const [camera, setCamera] = useState<string>(CAMERAS[0]);
  const [camExtra, setCamExtra] = useState("shallow depth of field, natural bokeh");

  const isImage = contentType === "Image Prompt (AI Art)";

  const generated = useMemo(() => {
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
        incCam
          ? `CAMERA: ${camera}, ${lens}, ${aperture}, ${iso}, shutter ${shutter}${camExtra ? `, ${camExtra}` : ""}.`
          : "",
        extras ? `EXTRA CONTEXT: ${extras}` : "",
        "",
        "Write 2 complete prompt variants:",
        "1) Highly detailed, production-ready",
        "2) Simpler, cleaner alternative",
      ];
      if (incNeg) {
        const neg = negText.trim() || "blur, watermark, extra fingers, distorted text, low quality, cluttered background";
        lines.push("", `NEGATIVE PROMPT: ${neg}.`);
      }
      if (incMJ && !plainOnly) {
        lines.push("", `Midjourney flags: --ar ${ratio} --stylize 200 --v 6`);
      }
      if (plainOnly) {
        lines.push("", "Output as plain English only (for ChatGPT / DALL·E). No flags or slashes.");
      }
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
  }, [isImage, contentType, topic, audience, platform, tone, goal, extras, imgStyle, ratio, light, incNeg, incCam, incMJ, plainOnly]);

  const whyTags = isImage
    ? ["Subject clarity", "Style constraint", "Composition", "Negative prompt", "Parameter packing"]
    : ["Role framing", "Audience specificity", "Clear goal", "Structured deliverables", "Constraints"];

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <section className="md:col-span-2 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-5">
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
                className="w-full min-h-24 rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-3 py-2 text-sm outline-none focus:border-[color:var(--color-ember)]"
              />
            </Field>
            <Field label="Image style"><Select value={imgStyle} onChange={setImgStyle} options={IMG_STYLES} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Aspect ratio"><Select value={ratio} onChange={setRatio} options={RATIOS} /></Field>
              <Field label="Lighting / mood"><Select value={light} onChange={setLight} options={LIGHTS} /></Field>
            </div>
            <Field label="Aesthetic tone (optional)">
              <input
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                placeholder="cinematic, premium, playful"
                className="w-full rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-3 py-2 text-sm outline-none focus:border-[color:var(--color-ember)]"
              />
            </Field>
            <div className="flex flex-wrap gap-2 mt-1">
              <Toggle on={incNeg} onChange={setIncNeg}>Negative prompt</Toggle>
              <Toggle on={incCam} onChange={setIncCam}>Camera / lens</Toggle>
              <Toggle on={incMJ} onChange={setIncMJ}>Midjourney flags</Toggle>
              <Toggle on={plainOnly} onChange={setPlainOnly}>DALL·E / plain English</Toggle>
            </div>
          </>
        ) : (
          <>
            <Field label="What's this about?">
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. launching a skincare line for busy moms"
                className="w-full min-h-24 rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-3 py-2 text-sm outline-none focus:border-[color:var(--color-ember)]"
              />
            </Field>
            <Field label="Audience">
              <input
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="e.g. moms 28–40 tired of complex routines"
                className="w-full rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-3 py-2 text-sm outline-none focus:border-[color:var(--color-ember)]"
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Platform"><Select value={platform} onChange={setPlatform} options={PLATFORMS} /></Field>
              <Field label="Tone"><Select value={tone} onChange={setTone} options={TONES} /></Field>
            </div>
            <Field label="Goal"><Select value={goal} onChange={setGoal} options={GOALS} /></Field>
          </>
        )}

        <Field label="Anything else? (optional)">
          <input
            value={extras}
            onChange={(e) => setExtras(e.target.value)}
            placeholder="brand notes, links, deadlines, do-nots"
            className="w-full rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-3 py-2 text-sm outline-none focus:border-[color:var(--color-ember)]"
          />
        </Field>
      </section>

      <section className="md:col-span-3 rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-5 animate-forge-glow">
        <div className="flex items-center justify-between">
          <SectionTitle icon={<Sparkles size={16} />}>YOUR FORGED PROMPT</SectionTitle>
          <CopyButton text={generated} />
        </div>
        <pre className="mt-3 max-h-[520px] overflow-auto scrollbar-thin whitespace-pre-wrap break-words rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] p-4 text-sm leading-relaxed text-[color:var(--color-cream)]">
{generated}
        </pre>
        <div className="mt-4">
          <div className="text-xs uppercase tracking-wider text-[color:var(--color-cream-dim)] mb-2">Why this works</div>
          <div className="flex flex-wrap gap-2">
            {whyTags.map((t) => (
              <span key={t} className="text-xs rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-2.5 py-1 text-[color:var(--color-gold)]">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[color:var(--color-ember)]">{icon}</span>
      <h2 className="font-display text-xl md:text-2xl text-[color:var(--color-cream)]">{children}</h2>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block mb-3">
      <div className="text-xs uppercase tracking-wider text-[color:var(--color-gold)] mb-1.5">{label}</div>
      {children}
    </label>
  );
}
function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-3 py-2 text-sm outline-none focus:border-[color:var(--color-ember)]"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}
function SelectChips({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`text-xs rounded-full px-3 py-1.5 border transition ${
              active
                ? "bg-[color:var(--color-ember)] border-[color:var(--color-ember)] text-[color:var(--color-bg-deep)]"
                : "bg-[color:var(--color-bg-deep)] border-[color:var(--color-line)] text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}
function Toggle({ on, onChange, children }: { on: boolean; onChange: (b: boolean) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`text-xs rounded-full px-3 py-1.5 border transition ${
        on
          ? "bg-[color:var(--color-gold-soft)] border-[color:var(--color-gold)] text-[color:var(--color-gold)]"
          : "bg-[color:var(--color-bg-deep)] border-[color:var(--color-line)] text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
      }`}
    >
      {children}
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        } catch {}
      }}
      className="flex items-center gap-1.5 rounded-md bg-[color:var(--color-ember)] px-3 py-1.5 text-sm font-medium text-[color:var(--color-bg-deep)] hover:brightness-110 transition"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

// ---------- library ----------
function LibraryView({
  unlocked, saved, onToggleSave, onUnlock,
}: { unlocked: boolean; saved: number[]; onToggleSave: (id: number) => void; onUnlock: () => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const filtered = useMemo(() => {
    const qq = q.trim().toLowerCase();
    return LIBRARY.filter((p) => {
      if (cat !== "All" && p.cat !== cat) return false;
      if (!qq) return true;
      return (
        p.title.toLowerCase().includes(qq) ||
        p.prompt.toLowerCase().includes(qq) ||
        p.cat.toLowerCase().includes(qq)
      );
    });
  }, [q, cat]);

  return (
    <div>
      <UnlockBanner unlocked={unlocked} onUnlock={onUnlock} />
      <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative md:flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--color-cream-dim)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 500 prompts…"
            className="w-full rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-panel)] pl-9 pr-3 py-2 text-sm outline-none focus:border-[color:var(--color-ember)]"
          />
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((c) => {
          const active = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-xs rounded-full px-3 py-1.5 border transition ${
                active
                  ? "bg-[color:var(--color-ember)] border-[color:var(--color-ember)] text-[color:var(--color-bg-deep)]"
                  : "bg-[color:var(--color-panel)] border-[color:var(--color-line)] text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
      <div className="mt-3 text-xs text-[color:var(--color-cream-dim)]">
        Showing {filtered.length} of {LIBRARY.length} prompts
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <PromptCard
            key={p.id}
            p={p}
            locked={!unlocked && !isFreePrompt(p.id)}
            saved={saved.includes(p.id)}
            onToggleSave={() => onToggleSave(p.id)}
            onUnlock={onUnlock}
          />
        ))}
      </div>
    </div>
  );
}

function SavedView({
  unlocked, saved, onToggleSave, onUnlock,
}: { unlocked: boolean; saved: number[]; onToggleSave: (id: number) => void; onUnlock: () => void }) {
  const items = LIBRARY.filter((p) => saved.includes(p.id));
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-10 text-center">
        <Bookmark className="mx-auto text-[color:var(--color-gold)]" size={28} />
        <div className="mt-3 font-display text-2xl">NO SAVED PROMPTS YET</div>
        <div className="mt-1 text-sm text-[color:var(--color-cream-dim)]">
          Tap the bookmark on any library prompt to save it here.
        </div>
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <PromptCard
          key={p.id}
          p={p}
          locked={!unlocked && !isFreePrompt(p.id)}
          saved
          onToggleSave={() => onToggleSave(p.id)}
          onUnlock={onUnlock}
        />
      ))}
    </div>
  );
}

function PromptCard({
  p, locked, saved, onToggleSave, onUnlock,
}: { p: Prompt; locked: boolean; saved: boolean; onToggleSave: () => void; onUnlock: () => void }) {
  const isImg = p.cat === "Image Generation";
  return (
    <article className="relative rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-4 flex flex-col">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] uppercase tracking-wider rounded-full border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-2 py-0.5 text-[color:var(--color-gold)] flex items-center gap-1">
          {isImg && <ImageIcon size={10} />}
          {p.cat}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-[color:var(--color-cream-dim)]">
          #{p.id.toString().padStart(3, "0")}
          {isFreePrompt(p.id) && (
            <span className="ml-1 rounded-full bg-[color:var(--color-ember-soft)] px-1.5 py-0.5 text-[color:var(--color-ember)] font-medium">FREE</span>
          )}
        </div>
      </div>
      <h3 className="mt-2 font-semibold text-[color:var(--color-cream)]">{p.title}</h3>
      <div className="mt-1 flex flex-wrap gap-1">
        {p.tags.map((t) => (
          <span key={t} className="text-[10px] text-[color:var(--color-cream-dim)]">#{t}</span>
        ))}
      </div>
      <div className={`mt-3 flex-1 rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] p-3 text-xs leading-relaxed text-[color:var(--color-cream)] whitespace-pre-wrap ${locked ? "blur-sm select-none pointer-events-none max-h-40 overflow-hidden" : "max-h-56 overflow-auto scrollbar-thin"}`}>
        {p.prompt}
      </div>
      <div className="mt-3 flex items-center justify-between gap-2">
        {locked ? (
          <button
            onClick={onUnlock}
            className="flex items-center gap-1.5 rounded-md bg-[color:var(--color-gold)] px-3 py-1.5 text-sm font-medium text-[color:var(--color-bg-deep)] hover:brightness-110"
          >
            <Lock size={14} /> Unlock to view
          </button>
        ) : (
          <CopyButton text={p.prompt} />
        )}
        <button
          onClick={onToggleSave}
          aria-label={saved ? "Remove from saved" : "Save prompt"}
          className={`rounded-md border p-2 transition ${
            saved
              ? "border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] text-[color:var(--color-gold)]"
              : "border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]"
          }`}
        >
          <Bookmark size={14} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
    </article>
  );
}

function UnlockBanner({ unlocked, onUnlock }: { unlocked: boolean; onUnlock: () => void }) {
  if (unlocked) {
    return (
      <div className="rounded-xl border border-[color:var(--color-gold)] bg-[color:var(--color-gold-soft)] p-4 flex items-center gap-3">
        <Unlock className="text-[color:var(--color-gold)]" size={18} />
        <div className="text-sm text-[color:var(--color-cream)]">
          You've unlocked the full 500-prompt library. Thank you!
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
      <div className="flex items-center gap-3">
        <Star className="text-[color:var(--color-gold)]" size={18} />
        <div className="text-sm text-[color:var(--color-cream)]">
          <span className="font-display text-lg mr-1">50 PROMPTS ARE FREE</span>
          — unlock all 500 for <span className="text-[color:var(--color-gold)] font-semibold">₦5,000</span> one-time.
        </div>
      </div>
      <button
        onClick={onUnlock}
        className="md:ml-auto flex items-center justify-center gap-1.5 rounded-md bg-[color:var(--color-ember)] px-4 py-2 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110"
      >
        <Unlock size={14} /> Unlock full library
      </button>
    </div>
  );
}

function UnlockModal({
  onClose, onUnlock, unlocked,
}: { onClose: () => void; onUnlock: () => void; unlocked: boolean }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-[color:var(--color-line)] bg-[color:var(--color-panel)] p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="font-display text-2xl">UNLOCK FULL LIBRARY</div>
            <div className="text-xs text-[color:var(--color-cream-dim)] mt-1">
              {unlocked ? "You already have full access." : "50 free — unlock all 500 for ₦5,000 one-time."}
            </div>
          </div>
          <button onClick={onClose} className="text-[color:var(--color-cream-dim)] hover:text-[color:var(--color-cream)]">
            <X size={18} />
          </button>
        </div>
        {!unlocked && (
          <>
            <div className="mt-4 rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] p-3 text-xs leading-relaxed text-[color:var(--color-cream-dim)]">
              Pay ₦5,000 to the seller. You'll receive a code in the format
              <span className="text-[color:var(--color-gold)] font-mono"> PF-XXXXXX-CC</span>. Paste it below.
            </div>
            <input
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setErr(""); }}
              placeholder="PF-XXXXXX-CC"
              className="mt-3 w-full rounded-md border border-[color:var(--color-line)] bg-[color:var(--color-bg-deep)] px-3 py-2 text-sm font-mono outline-none focus:border-[color:var(--color-ember)]"
            />
            {err && <div className="mt-2 text-xs text-[color:var(--color-ember)]">{err}</div>}
            <button
              onClick={() => {
                if (isValidUnlockCode(code)) onUnlock();
                else setErr("Invalid code. Check the format PF-XXXXXX-CC.");
              }}
              className="mt-4 w-full rounded-md bg-[color:var(--color-ember)] px-4 py-2 text-sm font-semibold text-[color:var(--color-bg-deep)] hover:brightness-110"
            >
              Unlock
            </button>
          </>
        )}
      </div>
    </div>
  );
}
