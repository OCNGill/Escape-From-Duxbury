# Tracks — Escape from Duxbury

## Active
- (none in flight; 2026-09-21 fix verified, uncommitted in working tree pending Commander review)

## Next
- Implement Downtown Duxbury scene (renderer.js TODO: 'Coming Soon')
- Implement Duxbury Forest scene (renderer.js TODO: 'Coming Soon')
- Player movement between scenes via exits (exit click transitions scene — verified)

## Future
- Enemies/NPC dialog expansion (dialog.js framework exists)
- Win condition: escape route completion
- Consider pause/quit affordance per Commander app conventions

## Done
- [x] 2026-09-21 — Fix: scene canvas fills 800px container (was 640px + black dead zone);
      exit signs/hotspots moved above message-bar overlay; pointer-events:none on bar;
      mouse coords scaled client->canvas. Verified headless Chrome: hover, exit
      transition, save/load all green.
- [x] Initial playable build (git b9868b3)
