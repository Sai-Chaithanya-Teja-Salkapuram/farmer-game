# farmer-game
# Farmer Harvest Game – Advanced Features (AREADME)

This document summarizes the advanced features added to the game, explains how to run it, and identifies where **arrow functions**, **`this`**, and **`.bind`** were used.

---

##  New Features Added

| Feature | Description |
|---------|-------------|
| ✔ Multi-Level System (G1) | 3 Levels with increasing difficulty. After reaching the crop goal, the next level starts after a **2-second pause overlay**. |
| ✔ Configurable Difficulty via JSON (G3) | `config.json` controls **spawnRate**, **goal**, and **timeLimit** per level. No hardcoded values. |
| ✔ Game End Condition | After Level 3 is cleared, the game **stops** and displays: **"YOU BEAT ALL LEVELS!"** |
| ✔ Pause & Resume | Press **P** to pause and continue. |
| ✔ UI Updates | Shows current **score, goal, time, and level** on screen. |

---

## How to Run

You **must use a local server** because ES6 modules and `fetch()` need it.

### Option 1 — Using VS Code

1. Right-click `index.html` → **Open with Live Server**

### Option 2 — Using Python (works anywhere)

```bash
python -m http.server

##Then open
http://localhost:8000

