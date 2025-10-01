/**
 * @file Crop.js
 * @description Collectible crop object with sway animation and point values.
 */

import { Entity } from "./entity.js";

/**
 * Represents a crop that can be collected by the player.
 * @extends Entity
 */
export class Crop extends Entity {
    /**
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {{type: string, color: string, points: number}} data - Crop definition.
     */
    constructor(x, y, data) {
        super(x, y, 20, 26);
        this.type = data.type;
        this.color = data.color;
        this.points = data.points;
        this.sway = Math.random() * Math.PI * 2; // used for animation
    }

    /**
     * Slight bobbing motion to simulate wind swaying.
     * @param {number} dt - Delta time in seconds.
     * @param {Object} game - Game instance (unused but kept for consistency).
     */
    update(dt, game) {
        this.sway += dt * 2;
    }

    /**
     * Draws the crop on the canvas.
     * @param {CanvasRenderingContext2D} ctx - Rendering context.
     */
    draw(ctx) {
        const { x, y, w, h } = this;
        ctx.strokeStyle = "#2f7d32";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x + w / 2, y + h);
        ctx.quadraticCurveTo(x + w / 2 + Math.sin(this.sway) * 3, y + h / 2, x + w / 2, y);
        ctx.stroke();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y, 8, 6, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}
