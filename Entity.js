/**
 * @file entity.js
 * @description Base class for all movable and drawable game objects.
 */

/**
 * Base class for all in-game entities.
 */
export class Entity {
    /**
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} w - Width of the entity.
     * @param {number} h - Height of the entity.
     */
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.dead = false;
    }

    /**
     * Updates the entity.
     * @param {number} dt - Delta time.
     * @param {object} game - Reference to the game instance.
     */
    update(dt, game) { }

    /**
     * Draws the entity.
     * @param {CanvasRenderingContext2D} ctx - Rendering context.
     */
    draw(ctx) { }
}
