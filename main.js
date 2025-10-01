/**
 * @file Game.js
 * @description Main game logic with dynamic difficulty loaded from config.json.
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
    onKeyDown(e) { if (e.key.toLowerCase() === "p") this.game.togglePause(); this.keys.add(e.key); }
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

        this.level = 1;
        this.maxLevels = 3;
        this.difficulty = [];

        this.defaultDifficulty = [
            { level: 1, spawnRate: 0.8, timeLimit: 60, goal: 10 },
            { level: 2, spawnRate: 0.6, timeLimit: 50, goal: 15 },
            { level: 3, spawnRate: 0.4, timeLimit: 40, goal: 20 }
        ];

        this.player = new Farmer(WIDTH / 2 - 17, HEIGHT - 80);
        this.crops = [];
        this.obstacles = [];
        this.score = 0;

        this.spawnEvery = 0.8;
        this.timeLeft = 60;
        this.goal = 10;
        this._accumSpawn = 0;

        this.input = new Input(this);
        this.loadConfig().then(() => this.configureLevel(1));

        const get = id => document.getElementById(id);
        this.ui = {
            score: get("score"),
            time: get("time"),
            goal: get("goal"),
            status: get("status"),
            start: get("btnStart"),
            reset: get("btnReset")
        };

        if (this.ui.start) this.ui.start.addEventListener("click", () => this.start());
        if (this.ui.reset) this.ui.reset.addEventListener("click", () => this.reset());

        this.tick = (ts) => {
            const dt = Math.min((ts - this.lastTime) / 1000, 0.033);
            this.lastTime = ts;
            this.update(dt);
            this.render();
            requestAnimationFrame(this.tick);
        };
    }

    async loadConfig() {
        try {
            const res = await fetch("./config.json");
            if (!res.ok) throw new Error("Failed to load config.json");
            const data = await res.json();
            this.difficulty = data.difficulty;
            console.log("Loaded difficulty from config.json");
        } catch (e) {
            console.warn("Using default difficulty settings.", e);
            this.difficulty = this.defaultDifficulty;
        }
    }

    configureLevel(level) {
        const cfg = this.difficulty.find(d => d.level === level) || this.defaultDifficulty[level - 1];

        this.spawnEvery = cfg.spawnRate;
        this.timeLeft = cfg.timeLimit;
        this.goal = cfg.goal;
        this.score = 0;
        this._accumSpawn = 0;

        this.player = new Farmer(WIDTH / 2 - 17, HEIGHT - 80);
        this.crops = [];
        this.obstacles = [];
        for (let i = 0; i < 2 + level; i++) {
            this.obstacles.push(new Scarecrow(Math.random() * 800, Math.random() * 400));
        }

        if (this.ui.goal) this.ui.goal.textContent = this.goal;
        if (this.ui.status) this.ui.status.textContent = `Level ${this.level}`;
    }

    start() {
        if (this.state !== State.PLAYING) {
            this.state = State.PLAYING;
            requestAnimationFrame(this.tick);
        }
    }

    reset() {
        this.level = 1;
        this.configureLevel(1);
        this.state = State.MENU;
        if (this.ui.status) this.ui.status.textContent = "Menu";
    }

    togglePause() {
        this.state = this.state === State.PAUSED ? State.PLAYING : State.PAUSED;
        if (this.ui.status) this.ui.status.textContent = this.state === State.PAUSED ? "Paused" : `Level ${this.level}`;
    }

    update(dt) {
        if (this.state !== State.PLAYING) return;

        this.timeLeft = clamp(this.timeLeft - dt, 0, 999);
        if (this.ui.time) this.ui.time.textContent = Math.ceil(this.timeLeft);
        if (this.timeLeft <= 0) this.state = State.GAME_OVER;

        this.player.handleInput(this.input);
        this.player.update(dt, this);

        this._accumSpawn += dt;
        while (this._accumSpawn >= this.spawnEvery) {
            this._accumSpawn -= this.spawnEvery;
            this.spawnCrop();
        }

        const collected = this.crops.filter(c => aabb(this.player, c));
        if (collected.length) {
            collected.forEach(c => c.dead = true);
            this.score += collected.length;
            if (this.ui.score) this.ui.score.textContent = this.score;
        }
        this.crops = this.crops.filter(c => !c.dead);
    }

    spawnCrop() {
        const types = [ "#d9a441", "orange", "yellow" ];
        const color = types[Math.floor(Math.random() * types.length)];
        this.crops.push(new Crop(Math.random() * WIDTH, Math.random() * HEIGHT, { color, points: 1 }));
    }

    render() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        this.crops.forEach(c => c.draw(ctx));
        this.obstacles.forEach(o => o.draw(ctx));
        this.player.draw(ctx);
    }
}
