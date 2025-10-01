/**
 * @file Farmer.js
 * @description Player-controlled character with sprite animation (4x4 sheet).
 */

import { Entity } from "./entity.js";
import { WIDTH, HEIGHT, clamp, aabb } from "./helpers.js";

/**
 * Represents the player (Farmer) with animated sprite.
 * @extends Entity
 */
export class Farmer extends Entity {
    constructor(x, y) {
        super(x, y, 34, 34);

        this.speed = 200;
        this.vx = 0;
        this.vy = 0;

        // Load sprite
        this.sprite = new Image();
        this.sprite.src = "./sprites/farmer.png"; // make sure path is correct

        // Sprite sheet settings (4 rows x 4 columns)
        this.frameX = 0;      // current column
        this.frameY = 0;      // current row (0=down,1=left,2=right,3=up)
        this.frameTimer = 0;
        this.frameInterval = 0.15; // seconds per frame
    }

    /**
     * Processes user input.
     */
    handleInput(input) {
        const L = input.keys.has("ArrowLeft"), R = input.keys.has("ArrowRight");
        const U = input.keys.has("ArrowUp"), D = input.keys.has("ArrowDown");
        this.vx = (R - L) * this.speed;
        this.vy = (D - U) * this.speed;
    }

    /**
     * Updates movement & animation frame.
     */
    update(dt, game) {
        const oldX = this.x, oldY = this.y;
        this.x = clamp(this.x + this.vx * dt, 0, WIDTH - this.w);
        this.y = clamp(this.y + this.vy * dt, 0, HEIGHT - this.h);

        if (game.obstacles.some(o => aabb(this, o))) {
            this.x = oldX;
            this.y = oldY;
        }

        // Set animation row based on movement
        if (this.vx !== 0 || this.vy !== 0) {
            if (this.vy > 0) this.frameY = 0;     // Down
            else if (this.vy < 0) this.frameY = 3; // Up
            else if (this.vx < 0) this.frameY = 1; // Left
            else if (this.vx > 0) this.frameY = 2; // Right

            // Animate walking
            this.frameTimer += dt;
            if (this.frameTimer >= this.frameInterval) {
                this.frameTimer = 0;
                this.frameX = (this.frameX + 1) % 4;
            }
        } else {
            this.frameX = 0; // Idle frame
        }
    }

    /**
     * Draws current animation frame.
     */
    draw(ctx) {
        const frameWidth = this.sprite.width / 4;
        const frameHeight = this.sprite.height / 4;

        ctx.drawImage(
            this.sprite,
            this.frameX * frameWidth,
            this.frameY * frameHeight,
            frameWidth,
            frameHeight,
            this.x,
            this.y,
            this.w,
            this.h
        );
    }
}
