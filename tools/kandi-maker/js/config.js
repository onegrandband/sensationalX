// js/config.js

/**
 * ============================================================================
 * KANDI BRACELET MAKER - CONFIGURATION & CONSTANTS
 * Centralized configuration file for application settings, defaults, 
 * color palettes, and operational limits.
 * ============================================================================
 */

export const APP_CONFIG = {
    name: 'Kandi Bracelet Maker',
    version: '1.0.0',
    maxBeadsLimit: 150,     // Maximum number of beads allowed on a single string
    minBeadsLimit: 0
};

export const DEFAULT_SETTINGS = {
    beadId: 'p_op_red',     // Default bead template ID from catalog
    color: '#ff007f',       // Default hot pink color
    text: 'K'               // Default letter bead text
};

// Organized color swatches palettes for the UI
export const COLOR_PALETTES = {
    classic: [
        '#ff007f', '#00ffff', '#39ff14', '#ffff00', 
        '#9d00ff', '#ffffff', '#000000', '#ff5733', 
        '#33ff57', '#3357ff', '#ff33f3', '#ff8633'
    ],
    pastels: [
        '#ffb3ba', '#ffdfba', '#ffffba', '#baffc9', 
        '#bae1ff', '#e8baff', '#ffd1dc', '#c0c0c0'
    ],
    neons: [
        '#ff0055', '#00ffcc', '#ccff00', '#ff00ff', 
        '#00ffff', '#ffff00', '#ff3300', '#33ff00'
    ],
    metallics: [
        '#d4af37', '#c0c0c0', '#cd7f32', '#e5e4e2', 
        '#b87333', '#50c878', '#4682b4', '#708090'
    ]
};

// LocalStorage keys for upcoming persistence features
export const STORAGE_KEYS = {
    SAVED_BRACELET: 'kandi_maker_current_bracelet',
    USER_PREFERENCES: 'kandi_maker_preferences',
    SAVED_PATTERNS: 'kandi_maker_saved_patterns'
};

// Layout and rendering configurations
export const RENDER_CONFIG = {
    catalogThumbnailScale: 0.55,
    maxCatalogDisplayRows: 4
};
