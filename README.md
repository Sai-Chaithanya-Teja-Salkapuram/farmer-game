# farmer-game
# Farmer Harvest Game – Advanced Features 

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
## 📌 Where Arrow Functions, `this`, and `.bind()` Are Used

| Concept | Example from Code | Why It’s Used |
|---------|-------------------|---------------|
| **Arrow Function** | ```js\nthis.tick = (ts) => { ... }\n``` (in `Game.js`) | Arrow functions **preserve the `this` context**, so the game loop always refers to the correct instance. |
| **`this` keyword** | ```js\nthis.state = State.PLAYING;\nthis.player.update(dt, this);\n``` | `this` is used inside class methods to **access current object properties**. |
| **`.bind()`** | ```js\nthis._onKeyDown = this.onKeyDown.bind(this);\n``` (in `Input.js`) | `.bind(this)` ensures that **the method keeps referring to the class instance**, even when passed as an event listener. |


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

