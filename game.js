/**
 * @file Game.js
 */

import { WIDTH, HEIGHT, TILE, State, clamp, aabb } from "./helpers.js";
import { Farmer } from "./farmer.js";
import { Crop } from "./crop.js";
import { Scarecrow } from "./obstacle.js";

class Input {
    constructor(game) {
        this.game = game;
        this.keys = new Set();
        this._onKeyDown = this.onKeyDown.bind(this);
        this._onKeyUp = this.onKeyUp.bind(this);
        window.addEventListener("keydown", this._onKeyDown);
        window.addEventListener("keyup", this._onKeyUp);
    }
    onKeyDown(e) {
        if (e.key === "p") this.game.togglePause();
        this.keys.add(e.key);
    }
    onKeyUp(e) { this.keys.delete(e.key); }
    dispose() {
        window.removeEventListener("keydown", this._onKeyDown);
        window.removeEventListener("keyup", this._onKeyUp);
    }
}

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.state = State.MENU;

        this.player = new Farmer(WIDTH / 2 - 17, HEIGHT - 80);
        this.crops = [];
        this.obstacles = [];
        this.lastTime = 0;

        this.score = 0;
        this.timeLeft = 60;
        this.spawnEvery = 1;
        this._accumSpawn = 0;
        this.goal = 5;

        this.level = 1;
        this.maxLevels = 3;
        this.difficultyData = null;

        this.overlayText = "";
        this.overlayUntil = 0;
        this.minSpawnEvery = 0.2;

        this.input = new Input(this);

        const get = id => document.getElementById(id);
        this.ui = {
            score: get("score"),
            time: get("time"),
            goal: get("goal"),
            status: get("status"),
            start: get("btnStart"),
            reset: get("btnReset"),
        };

        this.ui.start.addEventListener("click", () => this.start());
        this.ui.reset.addEventListener("click", () => this.reset());

        this.tick = (ts) => {
            const dt = Math.min((ts - this.lastTime) / 1000, 0.033);
            this.lastTime = ts;
            this.update(dt);
            this.render();
            requestAnimationFrame(this.tick);
        };

        this.loadConfig();
    }

    async loadConfig() {
        const response = await fetch("./config.json");
        const data = await response.json();
        this.difficultyData = data.difficulty;
    }

    applyLevelConfig() {
        const cfg = this.difficultyData[this.level - 1];
        this.spawnEvery = cfg.spawnRate;
        this.timeLeft = cfg.timeLimit;
        this.goal = cfg.goal;

        this.crops = [];
        this.obstacles = [];
        for (let i = 0; i < this.level; i++) {
            this.obstacles.push(new Scarecrow(Math.random() * WIDTH, Math.random() * HEIGHT));
        }

        this.score = 0;
        this.syncUI();
    }

    start() {
        if (this.state === State.MENU || this.state === State.GAME_OVER || this.state === State.WIN) {
            this.level = 1;
            this.applyLevelConfig();
            this.state = State.PLAYING;
            requestAnimationFrame(this.tick);
        } else if (this.state === State.PAUSED) {
            this.state = State.PLAYING;
        }
    }

    nextLevel() {
        if (this.level < this.maxLevels) {
            this.level++;
            this.overlayText = `LEVEL ${this.level} STARTING…`;
            this.overlayUntil = performance.now() + 2000;
            this.state = State.PAUSED;

            setTimeout(() => {
                this.applyLevelConfig();
                this.state = State.PLAYING;
            }, 2000);
        } else {
            this.state = State.WIN;
            this.overlayText = "YOU BEAT ALL LEVELS!";
            this.overlayUntil = performance.now() + 5000;
        }
    }

    reset() {
        this.state = State.MENU;
        this.score = 0;
        this.overlayText = "";
    }

    togglePause() {
        if (this.state === State.PLAYING) {
            this.state = State.PAUSED;
        } else if (this.state === State.PAUSED) {
            this.state = State.PLAYING;
        }
    }

    syncUI() {
        this.ui.score.textContent = this.score;
        this.ui.time.textContent = Math.ceil(this.timeLeft);
        this.ui.goal.textContent = this.goal;
    }

    spawnCrop() {
        const types = [
            { type: "wheat", color: "#d9a441", points: 1 },
            { type: "pumpkin", color: "orange", points: 3 },
            { type: "golden_apple", color: "yellow", points: 5 }
        ];
        const t = types[Math.random() * types.length | 0];
        this.crops.push(new Crop(Math.random() * WIDTH, Math.random() * HEIGHT, t));
    }

    update(dt) {
        if (this.state !== State.PLAYING) return;

        this.timeLeft = clamp(this.timeLeft - dt, 0, Infinity);
        if (this.timeLeft <= 0) {
            this.state = State.GAME_OVER;
            return;
        }

        this._accumSpawn += dt;
        if (this._accumSpawn >= this.spawnEvery) {
            this.spawnCrop();
            this._accumSpawn = 0;
        }

        this.player.handleInput(this.input);
        this.player.update(dt, this);

        const collected = this.crops.filter(c => aabb(this.player, c));
        collected.forEach(c => c.dead = true);
        this.score += collected.reduce((s, c) => s + c.points, 0);
        this.crops = this.crops.filter(c => !c.dead);

        if (this.score >= this.goal) {
            this.nextLevel();
        }

        this.syncUI();
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, WIDTH, HEIGHT);

        ctx.fillStyle = "#dff0d5";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.strokeStyle = "#c7e0bd";
        for (let y = TILE; y < HEIGHT; y += TILE) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(WIDTH, y); ctx.stroke();
        }
        for (let x = TILE; x < WIDTH; x += TILE) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, HEIGHT); ctx.stroke();
        }

        this.crops.forEach(c => c.draw(ctx));
        this.obstacles.forEach(o => o.draw(ctx));
        this.player.draw(ctx);

        if (performance.now() < this.overlayUntil) {
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = "white";
            ctx.font = "32px Arial";
            ctx.fillText(this.overlayText, WIDTH / 2 - 150, HEIGHT / 2);
        }
    }
}
