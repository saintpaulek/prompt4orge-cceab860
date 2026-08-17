# PromptForge Design Direction

## Three possible stylistic approaches

### Theme Name: Workshop Noir
Very Brief Intro: A dark, tactile digital workshop inspired by forged metal, ember light, and precision tools. It makes prompt-building feel like a craft rather than a form.
Probability: 0.07

### Theme Name: Editorial Signal
Very Brief Intro: A high-contrast magazine-like interface with oversized typography, clean paper-like surfaces, and orange editorial marks. It positions PromptForge as a confident creative utility.
Probability: 0.03

### Theme Name: Control Room
Very Brief Intro: A dark operator dashboard with technical readouts, warm orange status lights, and modular panels. It emphasizes speed, control, and repeatable output.
Probability: 0.06

## Chosen Approach: Workshop Noir

### Design Movement
Industrial editorialism: the visual language of a premium maker’s workshop translated into a focused SaaS tool.

### Core Principles
1. **Craft over clutter** — every control should feel purposeful, with strong hierarchy and generous breathing room.
2. **Warm precision** — pair near-black surfaces and steel-gray dividers with ember orange for action and progress.
3. **Visible making** — show the prompt forming in real time so the interface feels alive and instructive.
4. **Useful drama** — use texture, glows, and motion as restrained accents around the work, never as decoration for its own sake.

### Color Philosophy
The base is a charcoal-black workshop floor, giving the prompt preview authority and reducing visual noise. Ember orange is the signature brand color: it signals energy, transformation, and the moment raw input becomes useful output. Steel, ash, and parchment neutrals separate content without making the UI feel sterile.

### Layout Paradigm
A split workbench rather than a centered landing page: a narrow contextual rail for the build steps and category, a broad materials area for inputs, and a sticky prompt output panel that remains the visual destination. Marketing pages use offset editorial sections and asymmetric orange rules.

### Signature Elements
- Orange forge-line rules that trace progress between builder steps.
- Brushed-metal panel headers with compact uppercase labels.
- A prompt preview treated like a finished work order, with structured sections and copy-ready output.

### Interaction Philosophy
Interactions should feel like tools being handled: immediate, tactile, and legible. Selecting a category changes the materials tray; generating a prompt produces a short forge pulse and updates the work order; copy and save actions confirm quietly with a compact toast.

### Animation
Use 150–240ms ease-out transitions for controls, 180ms button press scale feedback, and a restrained 700ms prompt-forge reveal when output changes. Stagger builder sections by 40ms on first entry. Never animate keyboard-driven interactions. Respect reduced-motion preferences.

### Typography System
Use **Space Grotesk** for display headings and **DM Sans** for interface copy. Headings should be tight, slightly oversized, and sentence case; labels use 11px uppercase with letter spacing; prompt output uses a readable 14–16px mono treatment only for code-like fragments, not the entire interface.

### Brand Essence
PromptForge is the practical prompt workshop for creators, marketers, and freelancers who want production-ready AI instructions without learning prompt theory. Personality: **capable, warm, exacting**.

### Brand Voice
Headlines are direct and energetic. CTAs describe the result, not the mechanism. Microcopy teaches without talking down.

Example lines:
- “Turn a rough idea into a prompt you can ship.”
- “Choose your materials. We’ll shape the instruction.”

### Wordmark & Logo
Use the supplied PromptForge logo as the primary wordmark, preserving the orange/white lockup and tool-forge symbol. In compact contexts, use the symbol-only mark inside a small dark square with an orange edge.

### Signature Brand Color
**Ember Orange — #F36B21.** It is the unmistakable action color for PromptForge: warm enough to feel human, vivid enough to guide the eye against charcoal.

## Product scope for this build

The first delivery will focus on a convincing static prototype with working client-side interactions: Builder with category-aware material fields for image and video generation, live structured prompt generation, copy/reset/refine affordances, Library with search/filter and locked states, About, Contact, Auth, and an Unlock flow. Backend-dependent auth, payments, email delivery, and admin persistence will be represented with clear UI states until a full-stack upgrade and service credentials are connected.

## Style Decisions

- Every non-builder page uses at least one Workshop Noir signature cue: an ember rule, uppercase workshop label, or work-order frame.
- Library items are catalogued prompt work orders with stamped readiness/lock states and structured metadata.
- Contact and utility pages use dark workbench surfaces, practical instructional microcopy, and ember-only primary actions.
