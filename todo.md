# PromptForge authentication upgrade

- [x] Read the full-stack web app guidance and inspect current project configuration.
- [x] Add the backend/auth capability required for real accounts and persistence.
- [x] Implement sign-in, sign-up, Google login, magic link, password recovery, loading, and error states.
- [x] Add profile, saved prompt, favorite, and unlock-state persistence with secure access rules.
- [x] Integrate authenticated header state, guest save prompts, builder save flow, library state, and sign-out.
- [x] Verify desktop and mobile auth UX, run checks/build, and save a stable checkpoint.

- [x] Complete password-reset return flow with a new-password form and verify auth paths in-browser.
- [x] Wire profile update, favorite, and unlock-state persistence end-to-end.
- [x] Implement guest prompt capture and post-login save handoff.
- [x] Verify auth on desktop and save a fresh authenticated checkpoint.

- [x] Exercise the sign-in, sign-up, social, magic-link, forgot-password, and reset-password entry points in the browser where provider configuration permits.
- [x] Add a profile editing surface for display name and account settings.
- [x] Add a redeemable unlock-code flow that updates persisted unlock state.
- [x] Save a new checkpoint after the final authenticated verification pass.
- [x] Make unlock-code redemption atomic-safe and handle duplicate redemption correctly.
- [x] Replace the unlock modal placeholder redeem action with navigation to the real account redemption UI.

- [x] Audit production Supabase URL, anon key, client initialization, and browser console/network errors.
- [x] Add safe Supabase configuration diagnostics and clear auth error mapping.
- [x] Configure production auth site and redirect URLs where the connected Supabase project permits.
- [x] Verify email/password, Google, GitHub, magic-link, and recovery entry states on the deployed site.
- [x] Save a checkpoint containing the authentication fix.
- [x] Detect disabled Supabase social providers before redirecting and show an inline unavailable-provider message instead of the raw Supabase 400 page.
- [x] Add visible inline guidance when Google or GitHub is disabled and verify it on the deployed auth page.
- [x] Re-test the deployed auth page after the social-provider guard change.

- [x] Add admin-only unlock-code generation and list procedures with secure role checks.
- [x] Build the protected `/admin/unlocks` workspace for generating, copying, and reviewing unlock codes.
- [x] Add admin navigation from the authenticated account area and a non-admin access state.
- [x] Test admin authorization, code generation, list refresh, responsive UI, and save a checkpoint.
- [x] Exercise `/admin/unlocks` as an authenticated admin: generate a batch, verify fresh codes and inventory refresh, and confirm non-admin/signed-out states.
- [x] Save the final admin unlock workspace checkpoint after authenticated verification.
- [x] Harden production matching for `/admin/unlocks` so direct navigation cannot fall through to the generic 404 route.

- [x] Identify the currently signed-in PromptForge account without requesting credentials.
- [x] Promote only that account to `admin` in the application database.
- [x] Verify the admin navigation and protected unlock workspace access.
- [x] Verify `/admin/unlocks` in-browser with a temporary non-admin role rollback, then restore the promoted account to admin.
- [x] Save a checkpoint after the completed admin and non-admin verification pass.

- [x] Inspect and validate the attached prompt JSON structure and record counts by category/access.
- [x] Add the `prompts` table with id, title, category, role, tags, access, and prompt_body columns.
- [x] Seed all attached prompt records into the database with duplicate-safe import behavior.
- [x] Add prompt catalog procedures with search, category, and FREE/locked access filtering.
- [x] Wire the Library page to the database catalog and verify free/locked states, then save a checkpoint.
- [x] Save a checkpoint containing the prompts table, seeded 3,000-record catalog, catalog procedures, and database-backed Library after the completed filter verification.
- [x] Re-open the published `/library` route after checkpointing to confirm the seeded catalog is available in production.
- [x] Force a fresh production publish of the current database-backed Library implementation and verify the public bundle is no longer the legacy static Library.
- [x] Diagnose and fix the production catalog list query returning a connection-interrupted state while the total count succeeds.
- [x] Add bounded catalog query retries, refetch-on-mount, and a visible retry action for transient production list failures.

# About and Contact page upgrade
- [x] Redesign `/about` with mission, origin story, differentiators, audience, founder note, and Builder/Contact CTAs in Workshop Noir style.
- [x] Redesign `/contact` with real email, phone, WhatsApp details, responsive contact cards, and direct WhatsApp chat CTA.
- [x] Add validated contact form submission to the owner notification/email channel with loading, success, and error states.
- [x] Add automated coverage for contact submission validation and notification behavior.
- [x] Verify About and Contact routes, responsive layouts, WhatsApp link, and contact form states in browser; run tests/build and publish a checkpoint.

# WhatsApp link update
- [x] Replace every PromptForge WhatsApp Contact page destination with https://wa.me/message/L7XAALXFRYRWN1 and verify the published links.

# Trust, discovery, and pricing enhancement
- [x] Add a subtle pulse animation to the floating WhatsApp CTA.
- [x] Add a concise FAQ section below the Contact form.
- [x] Add a Success Stories or Testimonials section to About without fabricating customer reviews or ratings.
- [x] Expand Builder category, project-type, and primary-goal choices for beginners.
- [x] Change the lifetime unlock price display to a rounded USD figure consistently across the Builder unlock UI.
- [x] Verify desktop/mobile layouts and interactions, run tests/build, and publish the completed enhancement.

# Lifetime access pricing and unlock CTA update
- [x] Show lifetime access pricing as ₦10,000 and $10 side by side.
- [x] Route the Unlock PromptForge action to https://wa.me/p/28447341561540526/2347069573528.
- [x] Verify the modal and published unlock destination, run tests/build, and publish a checkpoint.
- [x] Force fresh production propagation of the pricing and unlock CTA bundle, then verify the public modal shows ₦10,000 / $10 and the WhatsApp Business product link.

# Builder live preview and platform expansion
- [x] Make the live prompt preview render meaningful content for every Builder category, not only Social Media.
- [x] Add at least 10 relevant platform or format choices for every Builder category.
- [x] Verify category switching, preview output, option lists, responsive layout, tests, build, and production publication.
- [x] Include the Builder platform unit test in Vitest, publish the Builder update, and verify the public category preview and platform options.
- [x] Force fresh propagation of the Builder preview/platform bundle after the public domain served the stale five-platform version, then re-verify production category switching.

# Custom domain connection
- [x] Bind www.promptforge.com.ng to the live PromptForge deployment through the confirmed Vercel project path (the active migration path superseded the Manus custom-domain route).
- [x] Verify Truhost DNS propagation and HTTPS routing; no additional DNS record change was required because the existing Vercel routing was already active.

# Vercel custom-domain assessment
- [x] Inspect the existing Vercel-served www.promptforge.com.ng deployment and determine whether it is the current PromptForge app.
- [x] Document the compatible Vercel deployment and DNS setup path, including any required environment variables or user inputs.

# Confirmed Vercel migration
- [x] Back up the existing saintpaulek/prompt4orge GitHub source before replacement.
- [x] Prepare the current PromptForge build for the linked Vercel project and preserve required environment configuration.
- [x] Deploy the current build through Vercel and verify www.promptforge.com.ng, promptforge.com.ng, Builder, Library, About, and Contact routes.

# Responsive layout and logo refinement
- [x] Pause the Vercel migration without changing the existing Vercel project or domain.
- [x] Audit Builder, Library, About, Contact, Auth, and account/admin surfaces across desktop, tablet, and mobile breakpoints.
- [x] Improve PromptForge logo sizing, alignment, spacing, and responsive placement across shared navigation and page headers.
- [x] Run tests/build, verify hybrid responsive layouts, and publish the responsiveness/logo checkpoint.
- [x] Audit `/account` and `/admin/unlocks` at tablet and mobile breakpoints, fix any layout issues found, and re-verify before publishing.
- [x] Save and publish a new checkpoint containing the responsive layout and logo-positioning refinements.
- [x] Verify the updated header/logo on the public deployment after publishing.

# Builder–Library page transitions
- [x] Add smooth, short transitions when navigating between Builder and Library.
- [x] Respect prefers-reduced-motion and keep navigation responsive.
- [x] Verify both navigation directions across desktop/mobile, run tests/build, and publish the transition update.
- [x] Verify Builder → Library and Library → Builder transitions interactively on desktop and mobile, including reduced-motion behavior if possible.
- [x] Save and publish a new checkpoint containing the Builder–Library transition update, then verify it on the public deployment.
- [x] Verify Builder → Library and Library → Builder on mobile and explicitly confirm the reduced-motion CSS path.
- [x] Save the transition-specific checkpoint and verify the published transition update on the public PromptForge domain.
- [x] Document that mobile transition runtime could not be directly simulated with the available browser controls, while keeping mobile screenshots and code-level reduced-motion coverage verified.

# New-user walkthrough video
- [x] Create a concise guided walkthrough storyboard covering Builder, live preview, Library, account access, and lifetime unlock flow.
- [x] Generate the branded walkthrough video and review pacing, clarity, and Workshop Noir consistency.
- [x] Deliver the walkthrough video with a short placement recommendation for onboarding or the landing page.
- [x] Add explicit account access and lifetime-unlock guidance scenes to the walkthrough.
- [x] Review the completed MP4’s scene pacing, caption clarity, and Workshop Noir consistency, then export the final asset.
- [x] Deliver the final MP4 with a concise placement recommendation for the landing page or first-login onboarding.

# Portrait mobile walkthrough video
- [x] Create a 9:16 portrait walkthrough using mobile PromptForge frames and readable vertical title cards.
- [x] Preserve the guided narration, account/unlock scenes, and Workshop Noir styling in the portrait export.
- [x] Verify portrait dimensions, duration, framing, and MP4 integrity, then deliver the final asset.

# Social walkthrough enhancement
- [x] Add original background music and dynamic timed captions to the 9:16 walkthrough.
- [x] Replace static mobile Builder and Library scenes with visible top-to-bottom scroll sequences.
- [x] Add clear mobile About and Contact scenes, including the requested contact details.
- [x] Review and deliver the final captioned, music-backed portrait export with verified dimensions and audio integrity.

# Square social launch package
- [x] Export a square 1:1 PromptForge walkthrough optimized for LinkedIn and Twitter/X feeds.
- [x] Create a high-resolution poster or thumbnail from the strongest verified walkthrough key frame.
- [x] Write a short TikTok/Instagram Reels launch caption and platform-appropriate hashtag list.
- [x] Verify square dimensions, poster resolution, and deliver the complete social package.

# PromptForge favicon update
- [x] Convert the supplied PromptForge logo into a browser-friendly favicon asset and wire it into the app metadata.
- [x] Verify favicon metadata and browser preview behavior, run tests/build, and publish the branding update.
- [x] Force fresh production propagation of the favicon metadata and verify the public document exposes the new icon links and PromptForge favicon asset.

# Site-wide professional upgrade
- [x] Audit copy, typography, contrast, spacing, and responsive behavior across all routes.
- [x] Tighten redundant and filler copy while preserving clear user benefits.
- [x] Improve global legibility with stronger type scale, weight, line height, and contrast.
- [x] Add clear active and hover states to all shared header navigation actions.
- [x] Refine shared Workshop Noir surfaces, cards, buttons, textures, and micro-interactions.
- [x] Polish Home and Builder hierarchy, controls, preview, and responsive density.
- [x] Polish Library, About, Contact, Auth, Account, and Admin surfaces for consistency and clarity.
- [x] Verify every route at desktop, tablet, and mobile breakpoints; run tests, typecheck, and production build.
- [x] Publish the completed site-wide professional upgrade.

# Professional upgrade follow-up verification
- [x] Tighten and verify user-facing copy on About, Contact, Auth, Account, and Admin pages.
- [x] Apply page-specific polish to About, Contact, Auth, Account, and Admin beyond shared CSS overrides.
- [x] Save a fresh professional-upgrade checkpoint and verify the upgraded public deployment across major routes.
- [x] Apply explicit route-specific visual treatment to About, Contact, Auth, Account, and Admin components beyond shared styling.
- [x] Verify the published /auth, /account, and /admin/unlocks routes after checkpoint e9a11991.

# Library API parsing error
- [x] Diagnose why the `/library` tRPC query receives an HTML document instead of JSON.
- [x] Fix the Library API transport or route handling without regressing catalog behavior.
- [x] Add or update Vitest coverage for the failure path and verify the Library page and API response.
- [x] Publish the Library error fix.
- [x] Verify the published `/library` page in-browser after checkpoint d72cf82f and confirm it loads the catalog without the `Unexpected token '<'` tRPC error.
- [x] Capture explicit evidence that the live user-facing Library experience no longer redirects unexpectedly and no longer triggers the JSON parse failure.

# Library loading and retry UX
- [x] Add a Workshop Noir loading skeleton while catalog data is fetching.
- [x] Add a clear retry button and loading state for catalog request failures.
- [x] Add or update tests and verify loading, error, retry, and populated Library states.
- [x] Publish the Library loading and retry UX update.
- [x] Add a Library-focused Vitest or component test covering the loading skeleton and retry-button/error-state rendering.
- [x] Exercise a forced Library loading/error scenario and verify the skeleton and retry behavior before final publication.
- [x] Add a Library UI test for the actual error-state component, including retry text and disabled fetching state.
- [x] Capture explicit loading-skeleton evidence and exercise retry recovery before final publication.
- [x] Save a fresh checkpoint containing the Library loading skeleton, retry UI, PromptLibrary tests, and Vitest discovery update.
- [x] Capture explicit loading and retry-state evidence for the Library before final delivery.

# Library discovery and feedback upgrade
- [x] Add a responsive search bar and category filters for catalog discovery.
- [x] Add a branded empty-catalog illustration and useful no-results message.
- [x] Add success and failure toast feedback for retry actions.
- [x] Add focused tests and verify populated, filtered, empty, retry, and responsive states.
- [x] Publish the Library discovery and feedback upgrade.
- [x] Add focused coverage for catalog input filtering and no-results rendering.
- [x] Add focused coverage for retry success/failure feedback and verify a shareable no-results URL.
- [x] Save a fresh checkpoint and verify the deployed Library discovery upgrade.

# Library sorting and scalable browsing upgrade
- [x] Add catalog sorting options for date added and popularity while preserving existing filters.
- [x] Implement paginated or infinite catalog browsing with loading-more feedback and stable filtering.
- [x] Add focused tests and verify sorting, browsing, filtering, empty, retry, and responsive states.
- [x] Publish and verify the Library sorting and scalable browsing upgrade.

# Builder ChatGPT and Gemini connections
- [x] Add direct ChatGPT and Gemini actions for the generated prompt preview.
- [x] Add a safe copy-to-clipboard fallback and accessible success/error feedback.
- [x] Add focused tests and verify the launch URLs, Builder states, and responsive controls.
- [x] Publish and verify the ChatGPT/Gemini preview connection.

# Banking & Fintech Engagement upgrade
- [x] Add structured Banking/Fintech, WhatsApp, SMS, AI video, and Marcom prompt entries from the supplied prompt pack.
- [x] Add Banking & Fintech taxonomy/filter support and relevant tags.
- [x] Add fillable Builder variables for campaign, use case, audience, goal, and channel context.
- [x] Add a compliance-first cue for regulated Banking/Fintech selections.
- [x] Add focused tests, verify Library/Builder responsive flows, and publish the upgrade.

# Banking & Fintech 65-template expansion
- [x] Add exactly 5 FREE and 60 LOCKED templates under Banking & Fintech Engagement.
- [x] Verify exact access counts, category filtering, responsive Library rendering, and regression checks.
- [x] Publish the Banking & Fintech 65-template expansion.

# Day/night theme upgrade
- [x] Add a persistent day/night theme switcher to the shared PromptForge layout.
- [x] Align global backgrounds, text, borders, cards, controls, forms, Builder output, Library states, and route-specific surfaces for both themes.
- [x] Add theme regression coverage and verify major routes at desktop and mobile breakpoints in both modes.
- [x] Publish the day/night theme upgrade.

# System theme preference
- [x] Add a System option that follows the OS light/dark preference.
- [x] Persist the selected theme mode and synchronize System mode with OS preference changes.
- [x] Add regression coverage and verify the three theme modes on desktop and mobile.
- [x] Publish the System theme option.

# Attached product brief upgrade
- [x] Audit the attached brief against existing PromptForge routes and capabilities.
- [x] Close the highest-value brief gaps without duplicating already-shipped features.
- [x] Add regression coverage and verify public, authenticated, responsive, and day/night flows.
- [x] Publish the attached-brief upgrade.
- [x] Fix daytime Pricing card lifetime price contrast and re-verify both themes.

# WhatsApp Business chat link update
- [x] Replace every “Chat with us” and WhatsApp action with https://wa.me/p/28447341561540526/2347069573528.
- [x] Add link regression coverage and verify desktop/mobile destinations.
- [x] Publish the WhatsApp Business chat-link update.

# Category-specific Builder making options
- [x] Replace the generic “What are you making?” list with relevant sub-topics per Builder category.
- [x] Preserve safe defaults, generated prompt behavior, and Banking/Fintech-specific options.
- [x] Add mapping coverage and verify category switching on desktop and mobile.
- [x] Publish the category-specific Builder option refinement.

# Confirmed Option A custom-domain migration
- [x] Back up the existing saintpaulek/prompt4orge GitHub source before replacement.
- [x] Prepare the current PromptForge build and deployment configuration for the existing Vercel/domain path.
- [x] Replace the legacy deployment only after the backup and deployment target are verified.
- [x] Verify www.promptforge.com.ng, promptforge.com.ng, Builder, Library, About, and Contact after migration.
- [x] Document any DNS or HTTPS action still required from Truhost.

# New Vercel account deployment switch
- [x] Identify the new authenticated Vercel account and PromptForge project.
- [x] Verify the project environment variables and domain/deployment compatibility.
- [x] Redeploy the current PromptForge build through the new Vercel project.
- [x] Verify the custom domains and confirm the Library catalog loads with the configured runtime environment.
- [x] Update the Vercel migration handoff with the new account/project details.

# Explicit Vercel project target
- [x] Inspect https://vercel.com/pbatmedic/promptforge permissions and environment variables.
- [x] Deploy the current PromptForge source to the explicitly provided project.
- [x] Verify production domains, deep routes, and the loaded Library catalog.
- [x] Add the application’s MySQL/TiDB `DATABASE_URL` to the pbatmedic/promptforge Vercel Production environment; Supabase variables alone do not populate the catalog.
- [x] Redeploy after DATABASE_URL is added and verify the 3,000-prompt Library response.

# DATABASE_URL verification and deployment test
- [x] Verify whether `DATABASE_URL` exists in pbatmedic/promptforge Production without revealing its value.
- [x] Redeploy after the variable is confirmed so the runtime receives it.
- [x] Test the live catalog API and Library route on www.promptforge.com.ng.

# Paid-domain logo visibility fix
- [x] Create a tightly cropped, high-contrast PromptForge logo asset from the uploaded PNG.
- [x] Update the shared header to use the visible logo asset on the homepage and core routes.
- [x] Verify the logo on the paid-domain homepage at desktop and mobile widths.
- [x] Publish the logo visibility fix without regressing the existing deployment.

# Production authentication configuration fix
- [x] Inspect the live authentication configuration and identify the missing or mismatched production variable.
- [x] Correct the production auth configuration and preserve safe diagnostics without exposing secrets.
- [x] Add or update regression coverage for the configured and unconfigured auth states.
- [x] Verify the deployed login flow and publish the authentication fix.

# Text-only PROMPTFORGE wordmark replacement
- [x] Replace the image-based header logo with a text-only PROMPTFORGE wordmark using the site theme colors.
- [x] Replace the footer logo image with the same text-only wordmark across all shared routes.
- [x] Verify the wordmark in day/night modes and desktop/mobile layouts on the paid-domain deployment.
- [x] Publish the text-only wordmark replacement.

# Super-admin promotion request
- [x] Verify saintpaulek@gmail.com maps to the intended PromptForge user account.
- [x] Promote saintpaulek@gmail.com to the highest supported administrator role.
- [x] Verify protected admin unlock-code access on the paid domain.
- [x] Record the promotion result and any required sign-out/sign-in step.

# Unlock redemption security hardening
- [x] Require authentication before any unlock-code redemption attempt.
- [x] Enforce atomic one-time code redemption and bind the redeemed code to the signed-in account.
- [x] Ensure unlocked access is read from the account on other devices after sign-in.
- [x] Add or update tests for signed-out, successful, duplicate, and cross-device redemption states.
- [x] Verify the live redemption flow and publish the hardened implementation.

# Redemption feedback and unlock history
- [x] Add persistent unlock timestamp and redeemed-code metadata to the account record.
- [x] Return specific redemption outcomes for invalid, already-used, and successful codes.
- [x] Add a success animation and clear error messages to the account redemption UI.
- [x] Display the unlock date/time and specific redeemed code on the account page.
- [x] Add tests, verify responsive states, and publish the updated redemption experience.

# SEO and Google visibility
- [x] Audit current title, description, canonical, Open Graph, and structured data metadata.
- [x] Audit robots.txt, sitemap.xml, route coverage, and noindex/indexing directives.
- [x] Add production-domain SEO metadata and JSON-LD where appropriate.
- [x] Add or correct robots.txt and sitemap.xml for public routes only.
- [x] Validate SEO endpoints, build output, and live paid-domain responses.
- [x] Document the Google Search Console submission steps and indexing limitations.

# Google Search Console submission
- [x] Inspect Search Console access and existing PromptForge property status.
- [x] Verify promptforge.com.ng ownership if required.
- [x] Submit https://www.promptforge.com.ng/sitemap.xml.
- [x] Request indexing for the homepage, Library, Pricing, About, and Contact URLs.
- [x] Record Google’s confirmation or the exact user action still required.

# Search Console URL-prefix fallback
- [x] Create the URL-prefix property for https://www.promptforge.com.ng/.
- [x] Obtain Google’s HTML verification meta tag.
- [x] Add the verification tag to the production entry HTML and publish it.
- [x] Verify the URL-prefix property, submit the sitemap, and request indexing for the five public URLs.

# Production SEO deployment routing fix
- [x] Correct Vercel output routing so dist/public serves the HTML, robots.txt, sitemap.xml, and verification tag instead of the server bundle.
- [x] Redeploy the Vercel-linked GitHub project and re-verify the live paid-domain SEO endpoints.

# Search Console status and SEO metadata optimization
- [x] Check current sitemap status and indexing state for the five public URLs in Google Search Console.
- [x] Audit current titles, descriptions, canonical tags, social metadata, and structured data for Home, Library, Pricing, About, and Contact.
- [x] Optimize five public-page metadata around clear search intent without keyword stuffing.
- [x] Validate generated metadata and publish the SEO updates.
- [x] Report indexing status, noting that Google controls final crawl and ranking timing.

# Organization schema, FAQ schema, and supporting SEO content
- [x] Audit existing Organization facts, visible FAQ copy, public routes, and sitemap entries.
- [x] Add accurate Organization JSON-LD without inventing social profiles or claims.
- [x] Add FAQPage JSON-LD only for questions and answers visibly present on the public Contact page.
- [x] Create supporting educational content and internal links for AI prompt-building search intent.
- [x] Add supporting content URLs to the sitemap and route metadata where appropriate.
- [x] Validate structured data and publish the SEO/content update.
- [x] Prepare a credible backlink outreach foundation without placing unauthorized external links.

# Prompt-engineering guide pages and Nigerian outreach
- [x] Create three dedicated, crawlable prompt-engineering guide pages with distinct search intent.
- [x] Add route-specific SEO metadata and sitemap entries for the guide pages.
- [x] Add internal links between the guides, Builder, Library, About, and Contact pages.
- [x] Draft a personalized outreach email template for Nigerian technology and AI communities seeking editorially appropriate backlinks.
- [x] Add backlink outreach guidance that avoids spam, paid-link claims, or fabricated endorsements.
- [x] Add regression tests for guide routes and generated SEO documents.
- [x] Run tests, TypeScript validation, production build, and publish the completed content update.

# Guide credibility, case study, and navigation upgrade
- [x] Add accurate author profiles and publication/update date metadata to all guide pages.
- [x] Add Article JSON-LD and visible author/date bylines where appropriate.
- [x] Create a practical case-study tutorial route demonstrating a real PromptForge workflow.
- [x] Add interactive prompt examples with editable inputs and copyable outputs.
- [x] Add a sticky table of contents sidebar for guides with accessible mobile behavior.
- [x] Add the case-study route to metadata, generated SEO documents, sitemap, and internal links.
- [x] Add regression tests for guide metadata, case-study content, and interactive examples.
- [x] Run tests, TypeScript validation, responsive verification, production build, and publish the update.

# Compact controls, author credibility, and guide analytics
- [x] Add accessible interactive tooltips to the updated compact mobile controls.
- [x] Create a formal PromptForge Editorial Team author bio page and link it from guide bylines.
- [x] Replace static guide dates with explicit publication and revision metadata maintained per article.
- [x] Add privacy-conscious guide scroll-depth analytics without collecting prompt text or personal data.
- [x] Track interactive-example views and copy actions with stable event names.
- [x] Add regression tests for tooltips, author route, revision metadata, and analytics events.
- [x] Run tests, TypeScript validation, responsive verification, production build, and publish the update.

# Author visuals and guide sharing
- [x] Add clearly labeled placeholder organization logo and author avatar visuals to the author bio page.
- [x] Add a responsive Share this guide action to every guide page.
- [x] Support native Web Share where available and clipboard fallback elsewhere.
- [x] Add accessible feedback and analytics-safe sharing interaction states.
- [x] Add regression tests for sharing helpers and author visual labels.
- [x] Run tests, TypeScript validation, responsive verification, production build, and publish the update.

# Guide social previews, discovery, and copy polish
- [x] Create distinct, branded Open Graph social preview assets for all four guide pages.
- [x] Wire each guide to a unique Open Graph and Twitter image in runtime and prerendered metadata.
- [x] Strengthen the related-guides section on every guide page with clear editorial recommendations.
- [x] Make the case-study interactive example copy action explicit, reliable, and accessible.
- [x] Add regression tests for per-guide social preview metadata and copy behavior.
- [x] Run tests, TypeScript validation, responsive verification, production build, and publish the update.

# Paid-domain deployment verification
- [x] Deploy the latest verified PromptForge revision to www.promptforge.com.ng through the configured hosting connection.
- [x] Verify the paid domain serves the latest guide route and unique Open Graph metadata.
- [x] Report the deployment result and live URL verification.

# Unlocked account navigation status
- [x] Replace the Unlock full access call-to-action with a green Full access status for unlocked signed-in accounts.
- [x] Keep the unlock call-to-action available for locked and signed-out users on desktop and mobile.
- [x] Add regression coverage for the access-aware navigation state.
- [x] Run tests, TypeScript validation, responsive verification, production build, and publish the update.

# Full access account tooltip
- [x] Add a subtle hover and keyboard-focus tooltip to the green Full access status control.
- [x] Display only safe account-access details and provide an account-settings destination.
- [x] Add regression coverage for tooltip content and accessible behavior.
- [x] Run tests, TypeScript validation, responsive verification, production build, and publish the update.

# Paid-domain tooltip deployment confirmation
- [x] Confirm the latest Full access tooltip revision is Ready in the paid-domain production deployment.
- [x] Verify www.promptforge.com.ng serves the latest production bundle.
- [x] Report the live paid-domain result.

# Mobile scrolling and paid-domain performance
- [x] Audit and correct mobile touch/scroll behavior without breaking pull-to-refresh or navigation controls.
- [x] Measure paid-domain DNS resolution and initial response timing to identify DNS, TLS, redirect, or application delay.
- [x] Apply safe mobile scrolling and first-load performance improvements.
- [x] Add regression coverage for mobile scroll interaction behavior where practical.
- [x] Run tests, TypeScript validation, responsive performance checks, and production build.
- [x] Deploy the verified update to www.promptforge.com.ng and verify the live domain.

# Hero artwork compression
- [x] Audit the current hero artwork payload, dimensions, and visual treatment.
- [x] Create optimized responsive hero-art variants that preserve the Workshop Noir appearance.
- [x] Serve the appropriate compressed asset on mobile without reducing desktop quality.
- [x] Add regression coverage for the hero asset selection where practical.
- [x] Run tests, TypeScript validation, visual verification, and production builds.
- [x] Deploy the optimized hero artwork to www.promptforge.com.ng and verify the live payload.

# Illustration compression, lazy loading, and social previews
- [x] Audit the Builder illustration, below-the-fold images, and existing social-preview metadata.
- [x] Create optimized responsive Builder illustration variants and update asset delivery.
- [x] Add native lazy loading and decoding hints to below-the-fold images.
- [x] Add responsive Open Graph and Twitter preview image metadata for guide sharing.
- [x] Add regression coverage for image assets, lazy loading, and social-preview metadata.
- [x] Run tests, TypeScript validation, visual and payload checks, production builds, and deploy to www.promptforge.com.ng.

# Paid-domain DNS and Library availability repair
- [x] Diagnose why some mobile users receive a DNS_PROBE_POSSIBLE error for www.promptforge.com.ng.
- [x] Verify the Vercel domain binding, DNS records, and apex-to-www redirect behavior without disrupting the live site.
- [x] Diagnose and repair the live Library catalog loading path and its production API dependency.
- [x] Validate paid-domain DNS resolution and Library loading on the live deployment, then publish the repair.

# Paid-domain uptime monitoring
- [x] Assess a simple uptime-monitoring and downtime-alert solution for promptforge.com.ng.
- [x] Configure the selected monitor with safe HTTP and DNS checks.
- [x] Test the monitor configuration and verify its alert destination.
- [x] Document the monitor ownership and recovery steps.
- [x] Configure a no-dashboard external HTTP monitor with email confirmation because the full UptimeRobot sign-in flow is not usable.

# Full product walkthrough video
- [x] Map the major PromptForge pages and accurate navigation flows for the walkthrough.
- [x] Capture current visual references for each featured page and interaction.
- [x] Generate a complete guided PromptForge walkthrough video.
- [x] Review and deliver the finished walkthrough video.

# Slow-paced mobile walkthrough video
- [x] Map a clear 9:16 mobile walkthrough with readable pacing for each major step.
- [x] Capture the current responsive mobile scenes for the Builder, Library, Pricing, About, Contact, Auth, and Guides.
- [x] Render the mobile walkthrough with at least 8 seconds per major scene and clear caption dwell time.
- [x] Review and deliver the completed 9:16 mobile video.

# Corrected narrated walkthrough videos
- [x] Audit the original landscape and mobile videos for incomplete page framing and scene-to-narration mismatches.
- [x] Capture complete page views that fit each video frame without hiding key controls.
- [x] Write and generate scene-by-scene voice-over that describes exactly the visible page and action.
- [x] Render longer landscape and 9:16 mobile walkthroughs with synchronized voice-over and measured pacing.
- [x] Review the corrected videos for page visibility, audio synchronization, and delivery readiness.

# Animated mobile social teaser
- [x] Define a 30-second teaser storyboard with an animated text-only PROMPTFORGE opening.
- [x] Prepare focused mobile Builder, Library, and contact scenes with matching voice-over.
- [x] Render and review the 9:16 social teaser for pacing, animated branding, and readable controls.
- [x] Deliver the finished 30-second teaser.

# LinkedIn square teaser and social copy
- [x] Write distinct Instagram Reels and TikTok captions with focused, platform-appropriate hashtag sets.
- [x] Create a 1:1 LinkedIn version of the animated PromptForge teaser with readable square framing.
- [x] Verify the square export’s duration, resolution, narration, and key-scene visibility.
- [x] Deliver the LinkedIn video together with the social-sharing captions.

# Magic-link authentication verification
- [x] Inspect the live PromptForge magic-link interface and callback behavior.
- [x] Verify that the configured redirect target matches the Manus-built hosted page and paid domain.
- [x] Report whether magic links are connected correctly and identify any required configuration action.

# Magic-link testing and redirect allowlist cleanup
- [x] Confirm the intended test email recipient and classify all Supabase redirect URLs by active production need.
- [x] Send a magic-link test from both the paid and Manus-hosted PromptForge addresses.
- [x] Remove only confirmed unused legacy Supabase redirect URLs while retaining current production callbacks.
- [x] Verify the final allowlist and report test-delivery and security-cleanup outcomes.

# Supabase authentication branding, callback minimization, and monitoring
- [x] Audit the current Supabase magic-link template, active redirect allowlist, and available authentication-event monitoring controls.
- [x] Remove only the confirmed Vercel preview wildcard callbacks while retaining direct Vercel deployment callbacks.
- [x] Keep custom SMTP and branded PromptForge magic-link email template work paused by user choice pending credentials.
- [x] Enable Supabase authentication audit-log persistence and document that the current dashboard exposes no native per-event email-alert control.
- [x] Defer final Supabase configuration verification until the user resumes SMTP/email-branding work.

# Prompt-library content expansion
- [x] Audit the current library categories, prompt counts, and content structure for gaps and duplication risk.
- [x] Propose focused new prompt-pack options and obtain the user’s content direction.
- [x] Define and write the 150-prompt Nigeria Business Growth & WhatsApp flagship category with 20 FREE and 130 LOCKED prompts.
- [x] Validate and import the selected new prompt-library content without duplicate IDs or titles.
- [x] Verify Library discovery, 20/130 access mix, and pagination behavior for the new category.

# Mobile Library control visibility
- [x] Inspect the mobile sticky behavior of the category/sort controls and Re-forge prompt action.
- [x] Remove or reposition the mobile sticky controls so they do not cover Library prompt cards.
- [x] Verify mobile scrolling, prompt-card visibility, and Re-forge interaction; then save the correction.

# Paid-domain mobile DNS recovery
- [x] Inspect public resolver responses and the Vercel domain configuration for `www.promptforge.com.ng`.
- [x] Confirm that no DNS or Vercel record change is warranted while public resolvers and HTTPS serve the paid domain normally.
- [x] Verify paid-domain DNS and HTTPS reachability through independent public checks, then report safe mobile retest steps.

# Paid-domain DNS and fresh deployment verification
- [x] Inspect current paid-domain DNS records, Vercel project domains, and production deployment state.
- [x] Create a fresh Vercel production deployment from the current PromptForge project.
- [x] Verify paid-domain DNS, HTTPS, deployment readiness, and mobile rendering.
- [x] Save the verified deployment state and report the final domain status.

<!-- Existing paused Supabase SMTP work remains intentionally paused per user request. -->

# Library category selector correction
- [x] Inspect the category-selector data flow and compare it with the live Nigeria Business Growth & WhatsApp catalog category.
- [x] Add the Nigeria Business Growth & WhatsApp option to the Library category list without breaking existing filters.
- [x] Verify category visibility and filtered results on desktop and mobile, then save the correction.


# Unlock redemption and email confirmation investigation
- [x] Trace the unlock-code generation and redemption flow, including code normalization, persistence, account binding, and error mapping.
- [x] Inspect the new-member email-confirmation flow and Supabase mailer configuration without requesting credentials.
- [x] Reproduce both reported failures with automated coverage and identify the safe fix.
- [x] Implement and verify the fixes, then publish the tested result or document any required dashboard configuration.


# Verification email legacy redirect bug
- [x] Trace all signup and email-template redirect sources for stale `prompt4orge.lovable.app` references.
- [x] Correct the active-site verification callback and remove only confirmed legacy redirect entries without weakening valid production callbacks.
- [x] Verify new confirmation-link URL construction targets PromptForge and document that previously opened or expired links must be replaced.


# Legacy Lovable verification-email sender
- [x] Trace the screenshot’s `no-reply@mail.lovable-app.email` sender to the originating Supabase project and deployed Vercel/environment configuration.
- [x] Ensure the active production signup flow uses the verified Resend sender and PromptForge callback, without changing unrelated auth providers or valid redirect entries.
- [x] Verify the corrected paid-domain production bundle and document the exact fresh-signup retest steps; inbox placement still requires the user’s new test account.


# Resend domain verification failure
- [x] Inspect Resend’s domain status and capture the exact missing verification records without exposing API keys.
- [x] Compare the required records with the active promptforge.com.ng DNS configuration.
- [x] Apply or guide the minimum safe DNS changes, recheck verification, and retest confirmation-email delivery.

# PromptForge expansion package — 2026-08-29
- [x] Audit existing Builder category constants, field options, Library schema, catalog procedures, and related tests.
- [x] Define the twelve requested Builder category materials and field schemas, including Legal/Compliance disclaimers and healthcare safety boundaries.
- [x] Generate 60 structured Library work orders per new category, with 10 FREE and 50 LOCKED per category, unique PF-XXXX identifiers, Nigeria/WhatsApp variants where relevant, and no fabricated testimonials or results.
- [x] Produce the implementation package with category overview, sample live-forged prompts, representative work orders, engineering notes, and shipping priorities.
- [x] Add the twelve new Builder categories and category-aware field/platform/goal options without breaking existing category behavior.
- [x] Import the 720 new Library prompts into the production database with duplicate-safe, access-correct records and verify catalog filtering.
- [x] Implement prompt quality scoring from 0–100 with one-click improvement suggestions.
- [x] Implement reusable variable/placeholder support for builder and library prompts.
- [x] Implement personal library Collections, Favorites, folders, and tags with protected user access.
- [x] Add multi-platform optimization controls for ChatGPT, Claude, Gemini, Grok, Midjourney, and Flux.
- [x] Improve Refine with AI controls for shorter, more formal, more creative, examples, and related transformations.
- [x] Add saved-prompt version history with safe ownership checks.
- [x] Add Markdown, plain-text, and Notion-ready export options.
- [x] Document and implement mobile/PWA improvement notes that fit the existing responsive architecture.
- [x] Add Vitest coverage for new categories, prompt access split, feature helpers, ownership rules, and export behavior.
- [x] Run schema migration/seed verification, TypeScript checks, tests, production build, and desktop/mobile visual checks.
- [x] Save a checkpoint after all completed expansion items are marked done.

# Library duplicate category key fix — 2026-08-29
- [x] Trace every Library category option source and identify why `Ecommerce & Product` is rendered more than once.
- [x] Fix the category list with stable unique keys while preserving valid category coverage.
- [x] Add regression coverage for duplicate-free Library category options and run tests/build.
- [x] Verify the Library render at desktop and mobile widths, then save a bug-fix checkpoint.

# Paid-domain deployment verification — 2026-08-29
- [x] Inspect the current production deployment and confirm which build serves `promptforge.com.ng`.
- [x] Deploy the verified Library duplicate-key fix if the paid domain is stale.
- [x] Verify paid-domain HTTP response, Library route content, and mobile access.
- [x] Save a paid-domain deployment checkpoint with the verified result.
- [x] Add a Vercel-compatible API function entrypoint so direct production deployments preserve `/api/trpc` catalog behavior.
- [x] Re-deploy and verify the paid-domain Library catalog after restoring production API routing.

# Super-admin access restoration — 2026-08-30
- [x] Audit live auth configuration, account identity mapping, and admin-role enforcement for `saintpaulek@gmail.com`.
- [x] Restore the confirmed account’s super-admin role without changing unrelated users.
- [ ] Test live sign-in, `/admin/unlocks` access, and unlock-code creation permissions.
- [ ] Save a verified access-restoration checkpoint and report any remaining browser or email action.

# Homepage meta-keywords — 2026-08-31
- [x] Add a focused homepage meta-keywords tag containing 3–8 relevant keywords.
- [x] Verify the rendered homepage metadata and run the SEO regression checks.
- [x] Save the verified metadata update in the production checkpoint.

# 14-day social campaign document — 2026-09-03
- [x] Define the campaign framework, audience segments, story-led content arc, platform roles, and measurable goals.
- [x] Map available PromptForge website screenshots to fourteen daily themes and visual directions.
- [x] Write platform-ready daily copy for LinkedIn, Facebook, Instagram, TikTok, and X with hooks, keywords, hashtags, and CTAs.
- [x] Add paid-ad creative scripts, targeting angles, landing-page CTAs, and basic testing guidance.
- [x] Create and review the formatted Word document with matching website screenshots.
- [x] Deliver the final 14-day campaign document and supporting visual assets.

# Google Analytics tag — 2026-09-03
- [x] Add the provided Google tag exactly once in the shared document head so it loads across every route.
- [x] Add regression coverage or source verification for the tag ID and single-inclusion rule.
- [x] Run tests/build and verify the tag in the production HTML source.

# Account recovery and auth troubleshooting — 2026-09-09
- [x] Treat the password visible in the uploaded screenshot as compromised and complete recovery without exposing the replacement credential.
- [x] Investigate and correct the stale/unresolvable Supabase URL used by preview and paid-domain authentication clients.
- [ ] Validate the owner recovery credential against the active Supabase project after configuration is corrected.
- [ ] Verify sign-in, magic-link recovery, and durable super-admin access for saintpaulek@gmail.com on both domains.
- [ ] Save a checkpoint documenting the recovery result and any remaining user-controlled browser step.

# Recovery link password-change screen — 2026-09-09
- [x] Detect Supabase recovery sessions before automatic navigation.
- [x] Keep recovery sessions on `/auth` and show a dedicated new-password form.
- [x] Prevent the recovery callback from silently sending the user to the homepage.
- [x] Add regression coverage for recovery hash detection and password-update UI state.
- [x] Verify the flow on desktop/mobile and publish the recovery-screen fix.

# Recovery verification result — 2026-09-09
- [ ] Verify the password the user actually set through a user-controlled sign-in attempt; the stored recovery test secret does not match it.
- [ ] Confirm owner super-admin access at `/admin/unlocks` after successful browser sign-in.
- [ ] Save the final access-restoration checkpoint after live verification.

# Static recovery screen requirement — 2026-09-09
- [x] Keep the reset-password screen visible while Supabase restores the recovery session.
- [x] Block automatic redirect to the homepage until the user explicitly submits the new password.
- [x] Add regression coverage for recovery-session restoration and explicit reset completion.
- [x] Publish the static recovery-screen fix and request a fresh-link verification.
