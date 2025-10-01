/**
 * @file obstacle.js
 * @description Static obstacle (Scarecrow) that blocks movement.
 */

import { Entity } from "./entity.js";

/**
 * Represents a scarecrow obstacle.
 * @extends Entity
 */
export class Scarecrow extends Entity {
    /**
     * @param {number} x - X position.
     * @param {number} y - Y position.
     */
    constructor(x, y) {
        super(x, y, 26, 46);
    }

    /**
     * Draws the scarecrow to block the player.
     * @param {CanvasRenderingContext2D} ctx - Rendering context.
     */
    draw(ctx) {
        const { x, y, w, h } = this;
        ctx.fillStyle = "#9b7653";
        ctx.fillRect(x + w / 2 - 3, y, 6, h); // pole

        ctx.fillStyle = "#c28e0e";
        ctx.beginPath();
        ctx.arc(x + w / 2, y + 10, 10, 0, Math.PI * 2);
        ctx.fill(); // head

        ctx.strokeStyle = "#6b4f2a";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, y + 18);
        ctx.lineTo(x + w, y + 18);
        ctx.stroke(); // arms
    }
}
