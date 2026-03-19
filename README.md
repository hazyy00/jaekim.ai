# jaekim.ai

Personal portfolio website for Jae Kim — live at [jaekim.ai](https://jaekim.ai).

## Features

- **Canvas particle system** — reactive particles that follow and scatter from the mouse cursor (desktop only)
- **Custom cursor** — canvas-drawn circle replacing the system cursor, with magnetic snap to interactive elements
- **Magnetic navigation dot** — cursor snaps within 50px radius; click to open the side panel
- **Sliding side panel** — slides in from the right with staggered fade-in animations for bio, background, and contact sections
- **Interactive experience timeline** — horizontal dot timeline with arrow key navigation; click a dot to view role details
- **Flippable card deck** — "Fun little facts" displayed as a fanned deck of playing cards with nacre/mother-of-pearl animated borders; click to flip and reveal
- **Liquid glass UI** — frosted glass detail popups with backdrop blur
- **Signature watermark** — centered signature that shifts to stay visually centered when the panel opens
- **Email reveal** — click "Email" in contact to toggle showing the address (no mailto link by default)
- **Theme system** — three switchable theme presets (dark, light, dark sand)
- **Responsive design** — full-width panel and touch-friendly interactions on mobile; particles and custom cursor disabled on touch devices
- **Smooth loading** — waits for fonts and images before fading in the page

## Tech Stack

- React 18
- Vite
- Cloudflare Pages
- Inter (Google Fonts)

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
