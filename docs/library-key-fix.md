# Library duplicate-key fix — 2026-08-29

The warning was traced to a duplicate `Ecommerce & Product` value in `LIBRARY_CATEGORIES`, not to the catalog data or prompt-card IDs. The duplicate entry was removed while retaining the valid category once.

Verification completed:

- `PromptLibrary.test.ts`: 3 tests passed, including the new uniqueness assertion.
- Full Vitest suite: 86 tests passed.
- Production build: completed successfully.
- Desktop screenshot at 1280×720: Library selector renders normally.
- Mobile screenshot at 390×844: category and sort controls remain usable in the existing non-sticky mobile layout.
- Browser console after the HMR refresh contains no new duplicate-key error; the logged duplicate warnings precede the fix.
