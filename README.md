# M Umar — Portfolio (v3)

Next.js 15 (App Router) · React 19 · GSAP + ScrollTrigger · Lenis · self-hosted fonts.

## Run
```bash
npm install
npm run dev     # http://localhost:3000
npm run build
```

## Edit your content
Everything (copy, numbers, links, handles, YouTube IDs) lives in **`content.ts`**. Search for `TODO`.
Replace images in `public/images/`: `portrait.png` (hero, head & shoulders, ~900x1100) and `speaking.png` (wide stage/crowd photo).

## Structure
- `components/Portfolio.tsx` – all sections
- `components/useMotion.ts` – Lenis smooth scroll, GSAP reveals, hero intro
- `components/DitherPortrait.tsx`, `DotField.tsx`, `PixelImage.tsx` – canvas effects
- `app/globals.css` – design tokens and styles

The "Motion On/Off" button (bottom right) disables all animation; `prefers-reduced-motion` is respected.

## Vercel note
The folder must be named `components` (lowercase) in git:
`git mv Components components_tmp && git mv components_tmp components`
