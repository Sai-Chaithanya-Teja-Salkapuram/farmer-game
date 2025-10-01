/** @constant {number} Width of the game canvas */
export const WIDTH = 900;

/** @constant {number} Height of the game canvas */
export const HEIGHT = 540;

/** @constant {number} Tile/grid size used for background and positioning */
export const TILE = 30;

/** @constant {number} Total game duration in seconds */
export const GAME_LEN = 60;

/** @constant {number} Number of crops needed to win */
export const GOAL = 15;

/**
 * Enum representing the possible game states
 * @readonly
 * @enum {string}
 */
const _State = {
    MENU: "MENU",
    PLAYING: "PLAYING",
    PAUSED: "PAUSED",
    GAME_OVER: "GAME_OVER",
    WIN: "WIN"
};

export const State = Object.freeze(_State);

/**
 * Clamps a value between a minimum and maximum.
 * @param {number} v - Current value
 * @param {number} lo - Minimum allowed value
 * @param {number} hi - Maximum allowed value
 * @returns {number} Clamped value
 */
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * Axis-Aligned Bounding Box collision detection
 * @param {object} a - Object A with x, y, w, h
 * @param {object} b - Object B with x, y, w, h
 * @returns {boolean} True if objects overlap
 */
export const aabb = (a, b) =>
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y;
