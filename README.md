# It Sees

A browser-based, atmospheric text adventure built for CS 5774 (User Interface Software, Spring 2026) by Team 04.

The player wakes up in front of a strange cabin door with no memory of how they got there. Armed with only a lantern, they must explore rooms, gather items, solve riddles, talk to unsettling characters, and find their way out of the Upsidedown.

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [How to Play](#how-to-play)
6. [Game Data](#game-data)
7. [Architecture Overview](#architecture-overview)
8. [Team](#team)
9. [License](#license)

## Features

- Room-based navigation with North / South / East / West exits
- Inventory system with examine, pick up, drop, and combine actions
- Lantern mechanic that depletes over time and gates dark rooms
- Quest progression system with a fixed-position quest log UI
- Modal dialog system for back-and-forth conversations with NPCs
- Locked doors tied to keys and other tool-style items
- Ambient soundtrack with a non-intrusive mute toggle
- Pure client-side, no build step required

## Tech Stack

- HTML5
- CSS3 (custom atmospheric stylesheet, no frameworks)
- Vanilla JavaScript (ES6+ classes, no external libraries)
- JSON for game world data

## Project Structure

```
UIGroup4Project/
├── index.html                      # App shell and DOM mount points
├── style.css                       # Atmospheric "cabin at dusk" styling
├── main.js                         # Core engine: world state, rendering, input
├── dialogSystem.js                 # Modal dialog UI and message engine
├── questSystem.js                  # Linear quest progression and quest log UI
├── game.json                       # Active game world (rooms, items, exits)
├── db.json                         # Legacy / reference world data
├── Deathcard Cabin (Reprise).mp3   # Ambient soundtrack
├── FALLEN DOWN.wav                 # Additional audio asset
├── .gitattributes
└── README.md
```

## Getting Started

### Prerequisites

The game uses `fetch()` to load `game.json`, so it must be served over HTTP. Opening `index.html` directly via the `file://` protocol will fail due to browser CORS restrictions.

You need one of the following:

- Python 3.x, or
- Node.js (with `npx`), or
- The VS Code "Live Server" extension (or any equivalent local web server)

### Clone the Repository

```bash
git clone https://github.com/Skydermoby/UIGroup4Project.git
cd UIGroup4Project
```

### Run a Local Server

Pick whichever option you have available.

Python:

```bash
python -m http.server 8000
```

Node.js:

```bash
npx http-server -p 8000
```

VS Code:

1. Install the "Live Server" extension.
2. Right-click `index.html` and choose "Open with Live Server".

### Open the Game

Navigate to `http://localhost:8000` in a modern browser (Chrome, Edge, or Firefox recommended).

## How to Play

1. Read the room name and description in the main panel.
2. Click `North`, `South`, `East`, or `West` to move between rooms. Disabled buttons indicate walls.
3. Click items in the room to inspect, pick up, or otherwise interact with them.
4. Manage your inventory in the right-hand side panel. Combine items where the action is offered.
5. Watch the lantern meter. Dark rooms become unviewable when the lantern runs out.
6. Talk to NPCs through the modal dialog overlay. Press `Esc` to close.
7. Track your current objective in the quest log panel.
8. Toggle the ambient soundtrack using the music icon in the top-left corner.

Goal: escape the Upsidedown.

## Game Data

The world is data-driven. To add or modify content, edit `game.json`.

- `rooms`: each room has an `id`, `name`, `description`, `exits` (direction to room id), `locks` (room id to required item), `contents` (item ids), `special-contents` (scripted entities), `quest`, and `trait` (for example `"Dark"`).
- `items`: each item has an `id`, `name`, `description`, `trait`, optional `Addendum`, and optional `Quest` linkage.

No code changes are required for purely content-level edits.

## Architecture Overview

- `GameObject`, `Container`, `Room`, `Item`, and `Player` classes (in `main.js`) form the OOP backbone of the world model.
- `init()` loads `game.json`, instantiates rooms and items, wires up exits and locks, and renders the starting room.
- `render()` is the single source of truth for repainting the room view, exits, contents, and lantern state after every player action.
- `DialogSystem` (in `dialogSystem.js`) builds its own modal overlay at runtime and exposes start, message, response, and end events.
- `QuestSystem` (in `questSystem.js`) tracks a linear list of stages per quest and renders a fixed-position quest log into the side panel.


## License

This project is developed for academic purposes as part of CS 5774 at Virginia Tech. All rights reserved by Team 04 unless otherwise noted.
