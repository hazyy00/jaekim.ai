# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start Vite dev server with HMR
- `npm run build` - Production build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture

Single-page portfolio website built with React 18 + Vite. All UI lives in one component (`src/App.jsx`).

### App.jsx Structure

- **Theme system** (top of file): Three theme presets (`THEME_ORIGINAL`, `THEME_SWAPPED`, `THEME_DARK_SAND`). Currently using `THEME_SWAPPED` (dark bg, light text).
- **CONFIG object**: Centralized personal data — name, role, bio, projects (with optional `description` field), contact links. Edit this to update content.
- **Particle class**: Canvas-based particle animation that reacts to mouse cursor. Desktop-only (disabled on touch devices via `isTouchDevice` state).
- **Main component**: Manages panel open/close, magnetic cursor snap to nav dots, hover preview for experience items, keyboard accessibility.
- **Styles**: Inline style objects + embedded CSS for animations, responsive breakpoints (768px), and scrollbar hiding.

### Key Interactions

- **Nav dot** (top-right): Magnetically snaps cursor within 50px, opens side panel on click.
- **Side panel**: Slides in from right (28vw wide, full-width on mobile). Contains bio, experience, and contact sections with staggered fade-in animations.
- **Experience hover**: Hovering a project in the panel replaces the top-left name/role with the project title + description (opacity crossfade). Items are non-clickable divs.
- **Signature watermark**: Centered PNG (`public/signature.png`) that shifts left when panel opens to stay centered in remaining viewport.
- **Custom cursor**: Canvas-drawn circle that replaces system cursor on desktop. Grows when snapped to nav dots.

### Assets

- `public/signature.png` - Transparent PNG of signature, tinted beige (#F5F0EB)
- `public/signature.jpg` - Original source image
- Font: Inter (loaded from Google Fonts in `index.html`)
