<p align="center">
  <img src="https://raw.githubusercontent.com/OCNGill/Gillsystems-AMD-Radeon-llama-cpp-Update-AI-Stack/main/Gillsystems_logo_stuff/Gill%20Systems%20Logo.png" alt="Gill Systems Logo" width="800">
</p>

# Escape from Duxbury

> *"The apocalypse has come and gone. Time to escape."*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Engine](https://img.shields.io/badge/Engine-Canvas%202D%20%7C%20vanilla%20JS-blue)](#technical-details)
[![Frameworks](https://img.shields.io/badge/Frameworks-none-success)](#technical-details)
[![Live](https://img.shields.io/badge/Live-gillsystems.net-brightgreen)](https://gillsystems.net)
[![Saves](https://img.shields.io/badge/Saves-localStorage-informational)](#features)
[![Docs](https://img.shields.io/badge/7D-Documented-lightgrey)](CHANGELOG.md)

**Escape from Duxbury** is a retro point-and-click adventure game built with vanilla JavaScript and Canvas. No frameworks, no build step, no CDN - double-click `index.html` and play.

## Contents

- [Game Concept](#game-concept)
- [How to Play](#how-to-play)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technical Details](#technical-details)
- [Locations](#locations)
- [License](#license)
- [Support / Donate](#support--donate)
- [Future Enhancements](#future-enhancements)

---

## Game Concept

Alex is the lone survivor in post-apocalyptic Duxbury, MA. The goal is to gather resources to build a boat and escape the mainland. Navigate static scenes by clicking hotspots, manage your inventory, and make dialog choices when encountering other survivors who may or may not be infected.

## How to Play

1. Open `index.html` in a web browser
2. Use the action buttons (Look, Take, Use, Talk) to interact with the environment
3. Click on highlighted areas to examine objects and collect items
4. Manage your inventory to gather boat-building supplies
5. Talk to survivors - but be careful who you trust!

### Controls

- **Mouse**: Click hotspots to interact
- **L**: Set action to Look
- **T**: Set action to Take
- **U**: Set action to Use
- **K**: Set action to Talk
- **Ctrl+S**: Save game
- **Escape**: Close dialogs / Deselect items

### Goal

Collect the following to build your escape boat:
- **Hull**: 3x Wood Planks
- **Sail**: 2x Rope + 1x Cloth
- **Supplies**: 5x Food + 2x Medicine

## Features

- **Canvas-based pixel art rendering** - King's Quest inspired visuals
- **Scene system** with clickable hotspots
- **Inventory management** for resources
- **Dialog trees** for survivor encounters
- **Save/Load** using localStorage
- **Infection system** - be careful around the infected!

## Project Structure

```
escape-from-duxbury/
├── index.html          # Main HTML file
├── css/
│   └── styles.css      # Game styling
├── js/
│   ├── state.js        # Pure state management
│   ├── renderer.js     # Canvas rendering engine
│   ├── scenes.js       # Scene definitions & interactions
│   ├── inventory.js    # Inventory system
│   ├── dialog.js       # Dialog tree system
│   └── game.js         # Main game controller
└── README.md
```

## Technical Details

- **Pure JavaScript** - No frameworks or libraries
- **Canvas API** - Custom pixel art rendering
- **State Management** - Centralized immutable state with subscriptions
- **Separation of Concerns** - Each module handles one responsibility
- **localStorage** - Persistent save games

Screen invariants (from `conductor/product.md`): the scene canvas is a 640x400 buffer, the
message bar overlays the bottom of the scene (so exit signs and hotspot click zones live
above it), and mouse coordinates are scaled from client space into canvas buffer space, so
hotspot detection stays correct under CSS scaling and on high-DPI displays.

## Locations

1. **Duxbury Harbor** (Starting area)
   - Dock - Can be used for fishing
   - Wrecked Boat - Contains rope and tools
   - Storage Shed - Locked, contains vital supplies

2. **Downtown Duxbury** (Coming soon)
   - Abandoned shops
   - St. John's Church
   - Survivor encounters

3. **Duxbury Forest** (Coming soon)
   - Wood gathering
   - Mysterious dangers
   - Hidden supplies

## License

MIT License - Feel free to use and modify! See [`LICENSE`](LICENSE).

## Support / Donate

If the harbor kept you busy, restock the escape fund:

**[paypal.me/gillsystems](https://paypal.me/gillsystems)**

## Future Enhancements

- [ ] Additional scenes (Downtown, Forest)
- [ ] More survivor encounters
- [ ] Random event system
- [ ] Boat building mini-game
- [ ] Sound effects and music
- [ ] Multiple endings