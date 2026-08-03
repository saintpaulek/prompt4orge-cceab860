# Prompt Forge

Build a complete single-page React web app called **PromptForge** — an AI prompt builder and prompt library for social media managers, virtual assistants, and creators.

Tech: React (Vite or Next.js client-only is fine), Tailwind CSS, lucide-react icons. Persist user/unlock/saved data with localStorage (or a simple browser storage abstraction). No backend required for v1.

================================================

1. PRODUCT OVERVIEW

================================================

PromptForge helps users craft better AI prompts in under 60 seconds and browse a 125-prompt library.

Three main tabs in the header nav:

- **Builder** — interactive form that live-generates a structured AI prompt

- **Library** — searchable, categorized catalog of 125 ready-made prompts (freemium: 15 free, rest locked)

- **Saved** — user’s bookmarked prompts

Tagline under logo: “Build the perfect AI prompt in 60 seconds”

Footer: “Built for social media managers, VAs, and creators learning to work with AI — one prompt at a time.”

================================================

2. DESIGN SYSTEM (dark “forge” theme)

================================================

Colors (exact):

- bg: #1C1917

- bgDeep: #141210

- panel: #26221F

- panelLight: #332E2A

- line: #3D3733

- ember: #E8622C          (primary accent / active tab / copy button)

- emberSoft: rgba(232, 98, 44, 0.15)

- gold: #D4A24C           (secondary accent / unlock / labels)

- goldSoft: rgba(212, 162, 76, 0.15)

- steel: #98A3A8

- cream: #F5F1E8          (primary text)

- creamDim: #B7AFA0       (secondary text)

Typography:

- Display headings: “Bebas Neue” (Google Fonts), letter-spacing ~0.03em, used for “PromptForge”, section titles like “CHOOSE YOUR MATERIALS”, “YOUR FORGED PROMPT”, “UNLOCK FULL LIBRARY”

- Body/UI: Inter (400–800)

Logo: small square icon left of the wordmark. Wordmark: “Prompt” in cream + “Forge” in a linear gradient from gold → ember (text-clip).

Visual details:

- Sticky header with bgDeep and 1px line border

- Cards/panels: rounded-xl, panel background, 1px line border

- Subtle glow animation on the live prompt preview card (soft gold box-shadow pulse)

- Selection highlight: ember background, dark text

- Mobile-first responsive layout; header stacks on small screens; builder is 2-col on md+ (form 2/5, preview 3/5)

```

UPDATE PromptForge with these product changes:

================================================

A. SCALE LIBRARY TO 500 PROMPTS (50 FREE)

================================================

Total prompts: **500**

Free prompts: **50**

Paid / locked: **450**

Unlock price stays ₦12,000 one-time. Banner copy:

- Locked: “50 prompts are free to try — unlock all 500 for ₦5,000 one-time.”

- Unlocked: “You’ve unlocked the full 500-prompt library. Thank you!”

Freemium rule (replace the old % 25 logic):

```js

// First 5 prompts in every 50-id block are free → 10 blocks × 5 = 50 free

function isFreePrompt(id) {

  return ((id - 1) % 50) < 5;

}

```

Free IDs: 1–5, 51–55, 101–105, …, 451–455.

Structure the library as **10 categories × 50 prompts each** (ids 1–500 continuous):

1. **SMM** (1–50) — social media strategy, captions, carousels, calendars, hashtags, trends, competitor analysis, Reels/TikTok hooks, LinkedIn posts, X threads, etc.

2. **VA Tasks** (51–100) — emails, SOPs, research, inbox triage, reports, onboarding, client updates, scheduling, docs, etc.

3. **Customer Service** (101–150) — tickets, refunds, reviews, escalations, live chat, policies, VIP replies, outages, etc.

4. **Automation Logic** (151–200) — Zapier/Make/n8n flows, CRM sync, lead capture, error handling, webhooks, chatbots, audits, etc.

5. **SEO** (201–250) — keywords, titles, meta, outlines, internal links, schema, local SEO, content refresh, E-E-A-T, etc.

6. **Email Marketing** (251–300) — welcome sequences, newsletters, launches, re-engagement, subject lines, segmentation, A/B tests, etc.

7. **Sales & Copywriting** (301–350) — landing pages, sales pages, offers, objections, cold outreach, product descriptions, CTAs, etc.

8. **Content Strategy** (351–400) — content pillars, batching, repurposing, brand voice, editorial calendars, hooks libraries, etc.

9. **Image Generation** (401–450) — Midjourney / DALL·E / Flux / Stable Diffusion style prompts for product shots, ads, carousels, portraits, brand visuals, etc. (see section B)

10. **Video & Shorts** (451–500) — YouTube scripts, Shorts/Reels outlines, thumbnails text, storyboards, hooks, CTAs, etc.

Each item shape stays:

`{ id: number, cat: string, title: string, tags: string[], prompt: string }`

Generate **all 500** with unique titles and complete, copy-ready prompts using [bracket placeholders] for user inputs. Do not stop at samples.

Category filter chips must list all 10 categories + “All”.

================================================

B. ADD IMAGE PROMPT GENERATION (BUILDER + LIBRARY)

================================================

### B1. Builder — new Content Type + Image controls

Extend Content Type options with:

- **Image Prompt (AI Art)** — for Midjourney, DALL·E, Flux, Ideogram, etc.

When Content Type = Image Prompt, show extra fields (hide or de-emphasize Platform if not relevant, or keep Platform as “output destination” e.g. Instagram ad creative):

New selects / inputs:

1. **Image style** (required when image mode):

   - Photorealistic product shot

   - Lifestyle / editorial photography

   - Cinematic / film still

   - 3D render / product CGI

   - Flat illustration / vector

   - Watercolor / painterly

   - Anime / manga

   - Minimalist graphic / poster

   - UGC / phone snapshot style

   - Brand identity / logo lockup scene

2. **Aspect ratio**:

   - 1:1 (feed)

   - 4:5 (Instagram portrait)

   - 9:16 (Stories / Reels / TikTok)

   - 16:9 (YouTube / landscape)

   - 3:2 / 2:3

3. **Lighting / mood** (optional select):

   - Soft natural daylight

   - Dramatic rim light

   - Studio softbox

   - Golden hour

   - Neon / cyberpunk

   - Moody low-key

   - Bright high-key commercial

4. **Subject / scene** textarea (reuse “What’s this about?” or label it “Describe the image”):

   Placeholder: e.g. “matte black skincare bottle on wet stone, water droplets, dark bathroom, luxury feel”

5. Optional toggles / chips:

   - Include negative prompt section

   - Include camera / lens details

   - Midjourney parameters (--ar, --stylize, --v 6)

   - DALL·E / ChatGPT-friendly plain English only

### B2. Image-mode live prompt template

When content type is Image Prompt, generate something like:

```

Create a detailed AI image generation prompt.

SUBJECT: {user description or “[describe the main subject and scene]”}

STYLE: {selected style}

MOOD & LIGHTING: {lighting}

ASPECT RATIO: {ratio} — compose for this frame.

COMPOSITION: clear focal point, balanced negative space, professional advertising quality.

DETAILS: materials, textures, color palette, and any text-free unless specified.

Write 2 complete prompt variants:

1) Highly detailed, production-ready

2) Simpler, cleaner alternative

Also provide a short NEGATIVE PROMPT (blur, watermark, extra fingers, distorted text, low quality, cluttered background).

If useful, append Midjourney-style flags: --ar {ratio} --stylize 200 --v 6

```

“Why this works” tags for image mode should include: Subject clarity, Style constraint, Composition, Negative prompt, Parameter packing.

### B3. Library — Image Generation category (ids 401–450)

50 image-specific prompts, examples of titles:

- Luxury product hero shot

- UGC-style testimonial photo

- Instagram carousel slide background

- YouTube thumbnail scene (no text)

- Brand color palette moodboard image

- Flat-lay product arrangement

- Founder portrait / headshot prompt

- App UI mockup in device frame

- Seasonal campaign visual

- Before/after transformation split scene

- Food photography prompt

- Fashion lookbook pose

- Abstract brand pattern

- 3D icon set consistent style

- Ad creative for Meta/TikTok

…continue to 50 unique, practical prompts with [product], [brand colors], [setting] placeholders.

================================================

C. UI / UX ADJUSTMENTS

================================================

- Builder form: when Image Prompt is selected, swap the secondary fields to Style / Aspect / Lighting; keep Tone optional (e.g. “cinematic, premium, playful”) mapped into the image prompt.

- Copy button still copies the full generated text.

- Save works the same for image prompts.

- Library search must match titles, prompt body, and category “Image Generation”.

- Locked cards still blur + “Unlock to view”; free tier uses the new isFreePrompt rule so users get 5 free image prompts among the 50 free slots if those IDs fall free — or force at least a few image prompts free by ensuring some Image Generation ids sit in free slots (e.g. also treat ids 401–405 as free if you want guaranteed free image samples). Prefer the single rule above for simplicity.

================================================

D. IMPLEMENTATION NOTES

================================================

- Keep checksum unlock codes (PF-XXXXXX-CC) unchanged.

- Update any hard-coded “125” or “15 free” strings to **500** and **50 free**.

- CATEGORIES array = All + the 10 category names.

- Performance: library is static data; filter with useMemo on search + category.

- Do not invent a real payment backend; unlock remains code-based + localStorage.

After applying, regenerate or expand the LIBRARY array to the full 500 entries and verify free vs locked UI on a mix of categories including Image Generation.

```

---

### Quick logic summary

| Item | Old | New |

|------|-----|-----|

| Total prompts | 125 | **500** |

| Free | 15 | **50** |

| Free rule | first 3 of every 25 | **first 5 of every 50** |

| Categories | 5 × 25 | **10 × 50** |

| Image prompts | none | **Builder mode + 50 library prompts** |

If you want this as a **full standalone Lovable prompt** (previous brief + these changes merged into one paste), say so and I’ll output the combined version.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://prompt4orge.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4999fcf5-f313-4e4d-a6ca-473f4814c309).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
