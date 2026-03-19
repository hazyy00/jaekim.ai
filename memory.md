# Session Memory

## What we worked on (2026-03-17)

### 1. Refactored experience hover behavior
- **Removed `<a>` links** from experience items in the panel — replaced with plain `<div>` elements. Items are no longer clickable; hover preview is the only interaction.
- **Moved hover preview** from a centered overlay into the **top-left corner**. When hovering a project in the panel, the name/role text fades out and the project title fades in at the same position (opacity crossfade, 0.3s ease). Both are stacked with absolute positioning inside the `topLeft` div.
- **Removed** the `.preview-overlay` CSS rules and the overlay DOM element entirely.

### 2. Hovered project title styling
- Title displays at `clamp(80px, 10vw, 140px)`, font-weight 700, letter-spacing -0.02em.
- Container has `width: calc(100vw - 28vw - 80px)` so description text doesn't wrap prematurely.

### 3. GenON description
- Added a `description` field to the GenON project in CONFIG:
  - Line 1: "financial documents summarization system w/ RAG"
  - Line 2: "LLM powered hotel recommendation assistant"
  - Line 3: "data augmentation, prompt engineering"
- Description renders below the hovered title at **21px**, font-weight 300, opacity 0.7, `white-space: pre-line`.

### 4. Signature watermark
- User's signature image (`/Users/jaekim/Downloads/IMG_1562.jpg`) was processed with Python/Pillow to:
  - Remove white background (made transparent)
  - Tint signature lines to beige (#F5F0EB)
  - Saved as `public/signature.png`
- Displayed centered on screen at 40% opacity, `clamp(300px, 50vw, 700px)` width, z-index 1, pointer-events none.
- **Shifts left when panel opens**: `left` transitions from `50%` to `36vw` (centering in remaining 72vw) using the same 450ms cubic-bezier as the panel.

### 5. CLAUDE.md
- Created project documentation for future Claude Code sessions.

### 6. Code review & efficiency cleanup
- **Static styles extracted** — moved ~20 style objects out of the component into a module-level `STYLES` constant. Only 4 dynamic styles (`containerStyle`, `backdropStyle`, `panelStyle`, `closeDotStyle`) remain inside the component.
- **Ref mutations** — `mouseRef` and `prevMouseRef` now mutate `.x`/`.y` in place instead of allocating new `{x, y}` objects every frame/mousemove (reduces GC pressure at 60fps).
- **Snap hysteresis** — fixed identical ternary (`d < SNAP_DIST` on both branches). Now snaps at 50px, unsnaps at 60px (`SNAP_DIST * 1.2`) to prevent edge flickering.
- **Removed dead code** — `monogram`, `currentCompany` from CONFIG; `url` field from all projects (no longer links); `panelRole` style (unused).
- **Consolidated duplicate CSS** — `.nav-dot-label` and `.close-dot-label` had identical rules, merged into shared selectors.
- **Removed redundancies** — `animationFillMode: 'forwards'` (already in shorthand), `text-decoration: none` on `.project-link` (it's a div), redundant `position: 'absolute'` spread on topLeft, always-true `key` prop.
- Build passes clean.

## Current state of the project
- **Theme**: THEME_SWAPPED (dark bg `#1A1A1A`, beige text `#F5F0EB`)
- **GenON config**: tags are `['Python', 'AIML', 'Prompt Engineering']`, year `2023`
- Other projects (Project Two/Three/Four) still have placeholder data — no descriptions yet.
- Everything is in `src/App.jsx` — single-component architecture.

## What might come next
- Adding descriptions to the other projects
- Replacing placeholder project names/data with real ones
- Further styling refinements
- Potentially deploying the site
