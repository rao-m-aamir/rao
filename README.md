# Rao’s Wandering Log

A Next.js portfolio with eight readable HTML chapters over a continuous animated pixel-art landscape.

## Run

Run `npm ci`, then `npm run dev`. Open http://127.0.0.1:3000.
Production: `npm run build`, then `npm start`.

## Architecture

- `components/world/PixelWorld.tsx` owns one fixed low-resolution canvas, rendering at up to 24 frames per second. Scroll progress moves terrain and blends daylight into sunset and night.
- `draw-world.ts`, `pixel-sprites.ts` and `world-model.ts` draw mountains, clouds, trees, river, path, mossy rocks, wildlife, mist and stars as procedural pixels. The rejected bitmap scenery and mascot files are removed.
- `components/sections` uses semantic HTML over the world. Transparent sections and translucent reading panels preserve the continuous landscape.
- `components/ui/Navigation.tsx` provides anchors, a native map dialog, location and persistent pause. Reduced motion pauses ambient animation by default; explicit Resume enables it. Hidden tabs pause rendering. Scrolling updates the static scene while paused.
- Without JavaScript, all content and project links remain readable over a dark fallback.
- `content/projects.ts` supplies both project cards and static detail routes. `content/world.ts` holds navigation, skills, achievements, interests and contact links.

No mascot, generated bitmap scenery, backend, analytics or deployment is included. Authentic project media, source/demo URLs and individual contribution details remain optional content follow-ups. Unknown claims are omitted and future features are distinguished from implemented features.

## Verify

Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run test:e2e` and `npm run build`.
Browser checks use installed Microsoft Edge by default. Set `PLAYWRIGHT_CHANNEL` for another installed supported channel. Checks cover keyboard/dialog behavior, motion, routes, JavaScript-free content, automated accessibility, viewport overflow and canvas scrolling/pause.

The original plan remains in `tasks/plan.md`; its latest-direction amendment takes precedence.

Background polish: scenery uses integer-aligned pixel marks, a seven-band dithered sky, clustered tree shading, rooted wind-blown grass, riverbank reeds, independent ambient rhythms and smoothly appearing landmarks. The renderer is split into atmosphere, terrain, sprites and pixel-drawing helpers. Pixel scaling uses whole multiples with edge cropping to prevent fractional stretching.

Landscape placement uses shared river/trail geometry in components/world/landscape-layout.ts. Cached scenery layouts reserve full silhouettes, shadows and tree sway across the scroll range, then render in depth order. Grass, reeds and ripples use the same route boundaries. Geometry tests cover narrow, wide and tall viewports. Buildings, campfires and the rune stone are absent from the scene.

The foreground follows a centered chapter layout: consistent reading widths, equal project columns, aligned card actions and responsive centered skill groups. Body text uses readable sans-serif sizes; pixel headings use balanced line breaks. Tree shading is simplified and rocks use stepped facets for clearer silhouettes.
