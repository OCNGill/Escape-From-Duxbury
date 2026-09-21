# Changelog — Escape from Duxbury

## 2026-09-21 — Layout & Interaction Fix (uncommitted, verified)

Fixed by Hermes kanban task t_fb675669 (games QA pass). All verified in headless Chrome.

- **Scene canvas dead zone**: canvas (640×400) now fills the 800px game container
  (`#game-canvas { width:100%; height:auto }`). The 160px black column at the right of
  the scene, and the message-bar overlap it caused, are gone. (`css/styles.css`)
- **Exit signs were invisible**: '← Downtown' / 'Forest →' were drawn at canvas y=390,
  permanently under the semi-opaque message bar, and their hotspot zones (y 350–400)
  were click-blocked by the bar overlay. Signs + hotspots moved to the band above the
  bar (text y=330, hotspots y=290–340). (`js/renderer.js`)
- **Message bar blocked scene clicks**: `#message-box { pointer-events: none }`. The bar
  still reads messages; clicks pass through to canvas hotspots. (`css/styles.css`)
- **Mouse coordinates now scaled**: `handleMouseMove` maps client space → canvas buffer
  space via `canvas.width/rect.width`, so hotspot detection stays correct under the new
  CSS scaling and on high-DPI displays. (`js/game.js`)

Verified: hover → pointer cursor over exit hotspot; exit click transitions harbor→
downtown ("A cracked asphalt road leads toward the center of town…"); Save/Load green;
zero console/page errors.

EVANGELIUM: "Whatever you do, work at it with all your heart, as working for the Lord."
— Colossians 3:23 (chosen: the fix is in the unglamorous details players never see
until they're broken).
