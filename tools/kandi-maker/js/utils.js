// js/utils.js

/**
 * Generates a unique random alphanumeric identifier string
 * @returns {string} Unique ID
 */
export function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Converts a hex color string to an RGB array
 * @param {string} hex - e.g. '#ff007f'
 * @returns {Array<number>} [r, g, b]
 */
export function hexToRgb(hex) {
    let cleanedHex = hex.replace('#', '');
    if (cleanedHex.length === 3) {
        cleanedHex = cleanedHex.split('').map(char => char + char).join('');
    }
    const num = parseInt(cleanedHex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Determines whether black or white text has higher contrast against a background hex color
 * @param {string} hex - Background hex color
 * @returns {string} '#000000' or '#ffffff'
 */
export function getContrastColor(hex) {
    const [r, g, b] = hexToRgb(hex);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#000000' : '#ffffff';
}

/**
 * Clamps a number between a minimum and maximum value
 * @param {number} val 
 * @param {number} min 
 * @param {number} max 
 * @returns {number} Clamped value
 */
export function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}
