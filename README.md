# Escape from Duxbury

A retro point-and-click adventure game built with vanilla JavaScript and Canvas.

## 🎮 Game Concept

Alex is the lone survivor in post-apocalyptic Duxbury, MA. The goal is to gather resources to build a boat and escape the mainland. Navigate static scenes by clicking hotspots, manage your inventory, and make dialog choices when encountering other survivors who may or may not be infected.

## 🚀 How to Play

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

## 🎨 Features

- **Canvas-based pixel art rendering** - King's Quest inspired visuals
- **Scene system** with clickable hotspots
- **Inventory management** for resources
- **Dialog trees** for survivor encounters
- **Save/Load** using localStorage
- **Infection system** - be careful around the infected!

## 🏗️ Project Structure

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

## 🔧 Technical Details

- **Pure JavaScript** - No frameworks or libraries
- **Canvas API** - Custom pixel art rendering
- **State Management** - Centralized immutable state with subscriptions
- **Separation of Concerns** - Each module handles one responsibility
- **localStorage** - Persistent save games

## 🗺️ Locations

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

## 📝 License

MIT License - Feel free to use and modify!

## 🎯 Future Enhancements

- [ ] Additional scenes (Downtown, Forest)
- [ ] More survivor encounters
- [ ] Random event system
- [ ] Boat building mini-game
- [ ] Sound effects and music
- [ ] Multiple endings
