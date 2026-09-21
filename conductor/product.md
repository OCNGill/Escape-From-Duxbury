# Product: Escape from Duxbury

Coastal apocalypse text-adventure (DOM/canvas) set in Duxbury, MA — the Commander's home
waters. Harbor → Downtown → Forest scene graph with LOOK / TAKE / USE / TALK verb actions,
inventory, save/load via localStorage.

Doctrine: Systems Should Serve Humans. Sovereign build — plain HTML/JS, no build tools,
no CDN dependencies. Runs by double-clicking index.html.

## Canonical files

- `index.html` — DOM shell (canvas + message bar + inventory + action buttons)
- `css/styles.css` — layout (fixed 800px card, scene canvas, overlay bar)
- `js/state.js` — game state (scene, action, inventory, day)
- `js/scenes.js` — scene definitions
- `js/renderer.js` — canvas scene painter + hotspot generation
- `js/game.js` — controller (input, clicks, save/load)
- `js/inventory.js`, `js/dialog.js` — inventory + NPC dialog

## Invariants

- Scene canvas is 640×400 buffer; hotspots live in canvas coordinates.
- The message bar overlays the bottom of the scene; nothing essential (exit signs,
  hotspot click zones) may live under it.
- Mouse coordinates must be scaled from client space to canvas buffer space.
