# Rao’s Wandering Log — implementation architecture and visual asset plan

## Latest direction — 28 September 2026

Implementation now follows the user's correction: remove images and mascot; use one continuous animated pixel-art background with transparent to semi-transparent foreground content. This amendment supersedes the separate scene illustrations, mascot, sprite-sheet production and static-world asset batches below. The remainder is retained as the original planning record.

HTML/CSS owns all readable copy, headings, links, project cards, reading panels, responsive layout and map dialog. A fixed low-resolution canvas draws the entire pixel world procedurally: terrain, river, path, trees, settlement, sky and camp. JavaScript maps normal scroll progress to parallax and lighting, animates clouds/water/fireflies/fire, and controls map navigation and motion preferences. No raster scenery or character assets are used. The world shifts from daylight through woodland and sunset to the night camp without section background boundaries.

The implementation is documented in README.md and tracked in todo.md. The source review below records the original pre-scaffold state; generated AGENTS.md and the installed Next.js guides have since been read.

Original status: planning only, 27 September 2026.

## Source review and confidence

- Reviewed the available Portfolio Website Design conversation, including the final concept and the proposed Portfolio Project instructions quoted there.
- Read the attached Ustad-e-Karigar.md and Meadow & Wood README.md. The other README attachment is byte-identical to Ustad-e-Karigar.md.
- Visually inspected the attached 1.jpg face reference.
- Inspected D:/Repos/Portfolio, which is empty before these planning documents; there are no local project instructions, READMEs, application files, or existing task plans. No AGENTS.md was found at the workspace or its parent directories.
- Limitation: the tools expose the cloud Project identity and its conversation, but not its saved instructions field. The available browser is signed out. The quoted instructions are recovered guidance, not verification of the separate saved field. Any additional instructions there remain to be reconciled before implementation.
- README features are documented claims, not independently tested application behavior. Personal contribution, release status, project repository URLs, demo URLs, and screenshots still need source confirmation.

## Agreed direction

Muhammad Aamir Saifi (Rao), a CS student exploring multiple ventures, is a curious fantasy traveller who keeps finding side quests while unsure whether a main quest exists. Use the latest conversation title, Rao’s Wandering Log, as the working site identity.

The site is a continuous, cozy, whimsical pixel-art world with normal scrolling and readable modern content. Broad handheld-era inspiration is appropriate; recognizable game assets or copied characters are not. Daylight gradually becomes evening along the page. Animation is ambient. The site must remain useful without decoration or JavaScript.

Journey: Spawn Point → Traveller’s Journal → Quest Board → Training Grounds → Milestone → Side Paths → Unexplored Territory → Campfire.

Two substantial featured projects, one actual achievement, and an honest small-work section are enough. Email stays absent. GitHub and LinkedIn are the contact destinations. Game Development, Quantum Computing, and Civic Tech are future interests, not claimed competencies.

## Architecture decisions

Retain the conversation’s Next.js + TypeScript direction. Use the App Router, static generation for portfolio content, and CSS Modules plus shared CSS design tokens as the proposed styling choice within the agreed CSS/Tailwind options. Reserve Motion/Framer Motion for the few coordinated transitions that benefit from it; confirm package APIs and versions at implementation time. CSS handles ordinary styling and loops.

Routes:

- `/`: complete scrolling portfolio with stable section anchors.
- `/quests/ustad-e-karigar`: first project record.
- `/quests/meadow-and-wood`: second project record.
- `/quests/[slug]`: reusable template and generated routes for later entries; unknown slugs receive a real not-found page.

Default components render on the server. Small client components own the map dialog, motion preference, section tracking, optional gallery dialog, and character animation. The page itself does not become one large client component. No database, portfolio API, authentication, CMS, or game engine is needed for this content scope.

Proposed organization (these application directories are not created yet):

| Area | Responsibility |
|---|---|
| app | Home composition, shared layout, project routes, metadata, not-found behavior |
| components/sections | Eight content sections in their semantic reading order |
| components/quests | Featured card, reusable Quest Record, feature list, gallery |
| components/ui | Navigation, links/buttons, tags, headings, accessible dialog, motion control |
| components/world | Scene shell, layered scenery, path pieces, section transitions |
| components/character | Rao sprite display and small character-state controller |
| content | Profile, projects, skills, achievements, side quests, future interests |
| lib | Content validation and lookup; no speculative service layer |
| styles | Palette, spacing, typography, responsive and motion tokens |
| public/pixel-art | Approved environment layers, props and sprite sheets |
| public/projects | Authentic screenshots, video posters, and supplied project logos |

Content drives cards, routes, metadata, and links. A project record contains slug, title, summary, featured order, documented status, audience/problem, role and collaborators, stack, feature descriptions, implementation notes, lessons, media with alt text/captions/dimensions, and optional source/demo URLs. Track source notes internally so claims can be checked. Unknown fields stay omitted or unpublished, never invented.

Keep scenery mappings separate from project content. New projects must render without commissioning a new world scene. Skills use categories and labels, without arbitrary percentages. Achievements use title, result, context and optional verified date/evidence. Side quests use title, medium, summary, thumbnail and optional destination. One shared section registry supplies IDs, plain-language labels, fantasy labels, map positions, and scene keys.

## Exact division of HTML/CSS, art, and behavior

| Section | HTML/CSS/UI | Pixel-art assets | JavaScript / animation |
|---|---|---|---|
| Spawn Point | Name, Rao alias, role, hook, Class/Status/Main Quest labels, Begin Journey anchor, social links | Mountains, clouds, meadow edge, path entrance, blank signpost, standing Rao | Slow cloud CSS loop; optional idle sprite. Begin Journey is a normal anchor with CSS smooth scrolling when motion is allowed |
| Traveller’s Journal | About prose, current-path tags, future-interest references; flexible cream reading panel | Open journal prop, forest canopy/edges, roots and small plants | Optional leaf loop; journal remains readable and does not require page-turn interaction |
| Quest Board | Two real linked article cards, Ustad larger on desktop; summaries, stacks, feature lists and authentic screenshots | Board posts/header trim, corners, small pins; guild/settlement edge props | CSS hover/focus emphasis; route navigation needs no custom animation or card-flip mechanic |
| Training Grounds | Three grouped skill lists, labels, single Microsoft Office “Trust.” joke | Training tree, roots, small tools or token ornaments | Optional subtle foliage loop. Joke available to keyboard and touch, preferably an inline note or native disclosure rather than hover-only tooltip |
| Milestone | MasterCode IST, Runner-up, Competitive C++; flexible list for later achievements | Blank milestone stone and trophy ornament | Optional one-time highlight; no essential reveal or animated count |
| Side Paths | Section heading, sign labels as text, data-driven small-work grid; honest empty state when no entries exist | Forked path, blank direction signs, unused trail markers | Rao can briefly face the side path; no gallery filter until enough real content warrants one |
| Unexplored Territory | Explicit future-interest labels and explanatory sentence | Distant hills, sparse markers, mist tiles | Very slow optional mist movement; no locked clickable controls or skill unlocks |
| Campfire | Closing copy, GitHub and LinkedIn anchors, copyright, final joke | Sitting Rao with journal, tent/log, night silhouette, campfire sheet | Stepped flame animation and restrained glow; no autoplay audio |
| World map | Accessible dialog, section links, readable location labels and close button | Original map background and landmark icons | Open/close, Escape, focus containment/restoration, current-location indicator; links retain ordinary anchor destinations |
| Quest Records | Headings, prose, stack, feature lists, contribution, captions, gallery, source/demo links | Restrained journal corner ornaments and small quest emblem | Optional image enlargement dialog; content and images remain available without it |

All names, sign lettering, board notices, stone inscriptions, buttons, tags, project descriptions, and captions remain real text. Borders, panel fills, focus indicators, layout, shadows, and spacing are CSS. Any wood/parchment texture is subtle decoration behind a solid readable surface. Do not generate whole screenshots of portfolio sections and use them as the UI.

Project screenshots are a third asset category: authentic product evidence, not pixel art. Preserve their original design and readable text. The Ustad mint/orange workshop interface and Meadow’s forest-green/cream identity should remain recognizable inside the shared portfolio frame.

## World composition and responsive behavior

Each section has three layers: background scenery, normal-flow content, and non-interactive foreground decoration. Decoration never intercepts input or covers text. Section heights follow content; the landscape stretches through repeatable terrain and movable props rather than fixed full-screen pictures.

Use a shared path motif and overlapping vegetation/terrain edges to connect scenes. Distribute eight story locations over four reusable environment kits: meadow, woodland/guild, dusk trail, and campsite. Day-to-night is primarily a sequence of authored section palettes, not a global scroll-driven darkening filter over text.

Desktop: constrained reading width, scenery in the gutters and below content, asymmetrical but ordered project layout. Mobile: single-column reading order, Rao above or beside a heading, compact scenery bands, reduced prop density. Use alternate scene composition rather than shrinking an entire desktop panorama. Map becomes a small vertical illustrated navigation list with the same destinations.

## Mascot and asset production specification

The inspected photo provides a side-swept dark hairstyle with volume, strong brows, a tapered/oval face, and light moustache and short beard cues. Carry those cues into a readable stylized face. Do not copy the navy jacket, white clothing, event setting, or standing pose.

Original outfit: muted moss travel cloak, cream layered tunic, brown boots, satchel and belt pouches, with a journal/map as the recurring prop. Curious and approachable posture. No giant weapon, heroic armor, or glowing chosen-one styling.

Proposed asset grid: 16-pixel terrain unit; 64 × 80 native-pixel Rao frames; 96 × 96 portrait; props in multiples of 16. Start with a 32-color shared palette covering moss, sage, cream, warm brown, dusty blue, clay and gold, plus evening shades. These are production starting points to validate with a style sample, not previously approved dimensions.

| Asset batch | Deliverables | Use / constraints |
|---|---|---|
| Style sample | One front/three-quarter Rao pose, one portrait, one terrain tile and one tree/prop | Establish facial likeness, pixel density, palette and outline treatment before producing the world |
| Rao sheet | Idle 4 frames; walking right 6; walking left 6; journal-reading 4; seated campfire idle 4 | 24 equal 64 × 80 cells; fixed foot anchor and transparent background. Separate left/right avoids reversing asymmetrical satchel/journal details |
| Meadow kit | Distant mountain strip, 3 cloud shapes, grass edging, straight/curved path tiles, signpost | Background reference canvas about 640 × 240 native pixels; compose/crop responsively rather than stretch |
| Woodland/guild kit | Two tree silhouettes, canopy strip, plants/roots, journal prop, modular board trim/posts, modest guild silhouette | Board interior is elastic CSS/HTML; art cannot define card height |
| Landmark kit | Training-tree hero prop, blank milestone, trophy, forked sign, distant markers | Reuse woodland assets; keep all lettering in HTML |
| Dusk/camp kit | Dusk hill strip, transparent mist tile, tent/log, fire sheet of 6 frames at 32 × 48 | Day-to-night palette belongs to scenery; reading panels retain contrast |
| Map kit | One simplified original map background and 8 small landmark icons | HTML labels and links overlay it; mobile uses an ordered list layout |
| Optional ambient kit | Bird 4-frame sheet, leaf variants, water/ripple tile only if a composition needs water | Deferred polish; does not expand the narrative or require new interactions |

Use transparent lossless PNG for sprites and crisp props; keep source files, palettes and export notes. Evaluate lossless WebP only if it preserves the pixel edges and materially helps size. Export native resolution, not artificially enlarged artwork. Render at integer scale where possible with pixelated sampling; prevent stretching, smoothing, and subpixel sprite positioning. Large layouts adapt through arrangement, repetition and cropping.

Each asset manifest entry records file, native dimensions, frame dimensions/count, frame rate, anchor, palette variant, static fallback and mobile treatment. Art has empty alt text when decorative; meaningful project media has descriptive alt text. The photo stays a private reference outside public assets and the shipped repository.

## Motion and interaction architecture

Normal scrolling, section anchors, social links and project navigation are the base interaction model. No scroll hijacking, mandatory loading scene, keyboard movement, XP, inventory, or gated content.

- CSS only: focus/hover treatments, allowed smooth anchor scrolling, cloud drift, foliage motion, sprite-sheet stepping and flame loops. Use stepped animation for sprite frames; position changes should respect the pixel grid.
- Small JavaScript layer: track the visible section using IntersectionObserver, manage map/dialog behavior, persist a Pause animation preference, and start/stop animation when scenes enter/leave view or the document is hidden.
- Rao: section-local character placements share the same sprite system. On desktop, an active scene may run a short walking loop toward its resting position; on mobile use the resting pose. Do not build a continuous screen-coordinate path across variable-height paragraphs. The repeated path and matching mascot establish the journey without fragile global choreography.
- Motion/Framer Motion: only bounded scene/pose transitions where coordinated timing earns the dependency. No per-scroll React state updates. Text is visible before hydration and stays visible if animation fails.
- Reduced motion: static cloud/mist/fire frame, resting Rao, immediate anchor navigation and no parallax or walk transitions. A visible pause control also stops persistent ambient loops. Defaults respect the system preference.
- Optional gallery dialog: keyboard-operable close, focus restoration and caption; inline figures remain the fallback. No carousel is required.

## Project storytelling from the READMEs

Both use one Quest Record structure: Quest Brief / overview, Problem, My Journey / contribution, Tools Equipped / stack, Quest Mechanics / features, Field Notes / engineering decisions, Gallery, Loot Acquired / lessons, Source / Demo. Plain-language subtitles keep the fantasy names understandable.

Ustad-e-Karigar is the main featured quest. Explain the Pakistani repair-worker and household audiences; Kotlin/Compose interface; Gemini diagnosis via text, photos and voice; Room/DataStore persistence; Seekho lessons; three languages including Urdu RTL; and the independent warning layer. A compact HTML/SVG flow diagram can explain input → memory/knowledge → AI response → safety checks → saved session. Clarify that live AI needs connectivity and a key, while offline Demo Mode uses scripted responses. Jobs are local listings; do not imply a live marketplace or deployed backend. Planned media: Diagnose, Seekho, Urdu view and Ghar/Karigar comparison from genuine captures.

Meadow & Wood is a furniture storefront with sales and inventory management. Explain PHP/MySQL, admin/customer permissions, inventory CRUD, recorded sales and stock updates, dynamic listings and password-reset tokens. A small HTML/SVG relational diagram may show users/products/sales. Preserve team attribution: the README credits Rao, Fatima Asad and Abdullah Khan Niazi; its Director/CEO/Artisan labels do not establish who implemented each feature. Do not imply sole authorship. Cart, payments, reset-email notifications and customer order history are future enhancements. Planned media: storefront, collection, inventory and sales screens from genuine captures. Do not present README security claims as an independent security audit.

No invented metrics, dates, user counts, personal lessons, or demo URLs. Missing screenshots can use neutral labeled layout placeholders during development, never fabricated product UI presented as real work.

## Delivery sequence and verification

Detailed task checklist: tasks/todo.md. Start with content truth and one responsive plain-HTML project journey. Produce the mascot/style sample before commissioning the environment kit. Validate one illustrated hero on mobile and desktop before expanding it to the whole page. Add interaction only after the full content is navigable.

Quality gates:

- Content: all eight sections, two project records, one real milestone, accurate future-interest and side-quest states; email absent from rendered content and published data.
- Accessibility: logical landmarks/headings, visible keyboard focus, sufficiently large touch controls, readable text contrast, 200% zoom, map/gallery Escape and focus behavior. Decoration is ignored by assistive technology.
- Resilience: usable homepage/project links with JavaScript disabled; art hidden; reduced motion enabled; image failures; direct project URL loads; browser Back; invalid slugs.
- Responsive: inspect at approximately 360, 768 and 1440 pixels, plus content growth. No text clipped into sign/board art, no horizontal overflow, no scenery covering controls.
- Performance: eager-load only above-fold essentials, lazy-load lower scenery/gallery media, reserve image dimensions, suspend off-screen loops. Proposed initial target: no more than 500 KB compressed decorative art in the initial viewport and no more than 2 MB for the complete decorative set, measured on final exports. Authentic project media is budgeted separately and loaded on demand. These are targets, not measurements.
- Growth: add a temporary third project record and confirm a card and route appear without modifying section layout or scenery code; remove fixture after checking.

## Remaining inputs and decisions

The architecture can proceed from the recovered agreement. Before implementation, reconcile any additional saved cloud Project instructions. Before publishing project claims, establish personal contribution, current status, exact project repository/demo links and genuine screenshots. Before production sprites, review one mascot/style sample against the face reference. The mascot's dimensions, frame counts, palette count, CSS Modules choice and section-local movement are proposals from this architecture pass, not claims of earlier agreement.
