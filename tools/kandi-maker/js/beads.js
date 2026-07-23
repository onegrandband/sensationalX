// js/beads.js

/**
 * ============================================================================
 * KANDI BEAD DATABASE & GENERATOR
 * This file handles the definitions, classes, and rendering logic for every 
 * type of bead available in the bracelet maker.
 * ============================================================================
 */

// --- 1. ENUMS AND CONSTANTS ---
export const BEAD_SHAPES = {
    BARREL: 'barrel',       // Standard pony bead
    CUBE: 'cube',           // Letter beads
    COIN: 'coin',           // Flat circular beads
    STAR: 'star',
    HEART: 'heart',
    BUTTERFLY: 'butterfly',
    SKULL: 'skull',
    FLOWER: 'flower',
    ANIMAL: 'animal'
};

export const BEAD_MATERIALS = {
    OPAQUE: 'opaque',
    TRANSLUCENT: 'translucent',
    NEON: 'neon',
    METALLIC: 'metallic',
    GLITTER: 'glitter',
    PEARL: 'pearl',
    MATTE: 'matte',
    GLOW_IN_DARK: 'glow'
};

// --- 2. BASE BEAD CLASS ---
class Bead {
    constructor(id, name, shape, material, baseWidth, baseHeight) {
        this.id = id;
        this.name = name;
        this.shape = shape;
        this.material = material;
        this.baseWidth = baseWidth;
        this.baseHeight = baseHeight;
    }

    // Default base styles applied to all beads
    getBaseStyles() {
        return {
            width: `${this.baseWidth}px`,
            height: `${this.baseHeight}px`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            boxSizing: 'border-box',
            transition: 'all 0.2s ease-in-out'
        };
    }

    // This will be overridden by subclasses
    generateHTML(color, content = '') {
        return `<div class="bead-element" style="background-color: ${color};"></div>`;
    }
}

// --- 3. SPECIFIC BEAD CLASSES ---

export class PonyBead extends Bead {
    constructor(id, name, material) {
        super(id, name, BEAD_SHAPES.BARREL, material, 25, 35);
    }

    generateHTML(color) {
        let materialStyles = '';
        
        // Apply different visual effects based on material
        switch(this.material) {
            case BEAD_MATERIALS.GLITTER:
                materialStyles = `
                    background-image: radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px);
                    background-size: 4px 4px;
                `;
                break;
            case BEAD_MATERIALS.METALLIC:
                materialStyles = `box-shadow: inset 0 0 10px rgba(0,0,0,0.5), inset 2px 2px 5px rgba(255,255,255,0.8);`;
                break;
            case BEAD_MATERIALS.GLOW_IN_DARK:
                materialStyles = `box-shadow: 0 0 15px rgba(150, 255, 150, 0.6);`;
                break;
            case BEAD_MATERIALS.TRANSLUCENT:
                materialStyles = `opacity: 0.7; backdrop-filter: blur(2px);`;
                break;
            default:
                materialStyles = `box-shadow: inset -2px -2px 6px rgba(0,0,0,0.4), inset 2px 2px 6px rgba(255,255,255,0.4);`;
        }

        return `
            <div class="bead pony-bead ${this.material}" style="
                width: ${this.baseWidth}px; 
                height: ${this.baseHeight}px;
                background-color: ${color};
                border-radius: 10px;
                border: 2px solid rgba(255,255,255,0.2);
                ${materialStyles}
            "></div>
        `;
    }
}

export class LetterBead extends Bead {
    constructor(id, name, shape, textColor = '#000000') {
        super(id, name, shape, BEAD_MATERIALS.OPAQUE, 30, 30);
        this.textColor = textColor;
    }

    generateHTML(bgColor, letter = 'A') {
        const borderRadius = this.shape === BEAD_SHAPES.COIN ? '50%' : '4px';
        const displayLetter = letter && letter.trim() !== '' ? letter : 'A';
        
        return `
            <div class="bead letter-bead" style="
                width: ${this.baseWidth}px; 
                height: ${this.baseHeight}px;
                background-color: ${bgColor};
                border-radius: ${borderRadius};
                color: ${this.textColor};
                font-family: 'Courier New', monospace;
                font-weight: bold;
                font-size: 18px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid rgba(0,0,0,0.2);
                box-shadow: inset -1px -1px 3px rgba(0,0,0,0.3), inset 1px 1px 3px rgba(255,255,255,0.8);
            ">
                ${displayLetter.toUpperCase()}
            </div>
        `;
    }
}

export class ShapeBead extends Bead {
    constructor(id, name, shape, material) {
        super(id, name, shape, material, 35, 35);
    }

    generateHTML(color) {
        // Using CSS clip-path to generate complex shapes without needing external images
        let clipPath = '';
        
        switch(this.shape) {
            case BEAD_SHAPES.STAR:
                clipPath = 'clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);';
                break;
            case BEAD_SHAPES.HEART:
                clipPath = 'clip-path: polygon(50% 15%, 61% 0, 83% 0, 100% 22%, 100% 45%, 50% 100%, 0 45%, 0 22%, 17% 0, 39% 0);';
                break;
            case BEAD_SHAPES.BUTTERFLY:
                clipPath = 'clip-path: polygon(0 0, 30% 20%, 50% 10%, 70% 20%, 100% 0, 90% 40%, 100% 60%, 70% 50%, 50% 80%, 30% 50%, 0 60%, 10% 40%);';
                break;
            case BEAD_SHAPES.FLOWER:
                clipPath = 'clip-path: polygon(50% 0, 65% 20%, 100% 20%, 80% 45%, 95% 80%, 50% 65%, 5% 80%, 20% 45%, 0 20%, 35% 20%);';
                break;
            default:
                clipPath = 'border-radius: 50%;'; // fallback to circle
        }

        return `
            <div class="bead shape-bead" style="
                width: ${this.baseWidth}px; 
                height: ${this.baseHeight}px;
                background-color: ${color};
                ${clipPath}
                box-shadow: inset -2px -2px 5px rgba(0,0,0,0.3);
            "></div>
        `;
    }
}


// --- 4. THE MASSIVE BEAD CATALOG ---
// This catalog holds all the predefined templates the user can choose from.

export const beadCatalog = [
    // --- OPAQUE PONY BEADS ---
    new PonyBead('p_op_red', 'Classic Red', BEAD_MATERIALS.OPAQUE),
    new PonyBead('p_op_orange', 'Classic Orange', BEAD_MATERIALS.OPAQUE),
    new PonyBead('p_op_yellow', 'Classic Yellow', BEAD_MATERIALS.OPAQUE),
    new PonyBead('p_op_green', 'Classic Green', BEAD_MATERIALS.OPAQUE),
    new PonyBead('p_op_blue', 'Classic Blue', BEAD_MATERIALS.OPAQUE),
    new PonyBead('p_op_purple', 'Classic Purple', BEAD_MATERIALS.OPAQUE),
    new PonyBead('p_op_black', 'Classic Black', BEAD_MATERIALS.OPAQUE),
    new PonyBead('p_op_white', 'Classic White', BEAD_MATERIALS.OPAQUE),

    // --- NEON PONY BEADS ---
    new PonyBead('p_ne_pink', 'Neon Hot Pink', BEAD_MATERIALS.NEON),
    new PonyBead('p_ne_green', 'Neon Lime', BEAD_MATERIALS.NEON),
    new PonyBead('p_ne_yellow', 'Neon Yellow', BEAD_MATERIALS.NEON),
    new PonyBead('p_ne_orange', 'Neon Orange', BEAD_MATERIALS.NEON),

    // --- TRANSLUCENT PONY BEADS ---
    new PonyBead('p_tr_clear', 'Clear Translucent', BEAD_MATERIALS.TRANSLUCENT),
    new PonyBead('p_tr_pink', 'Pink Translucent', BEAD_MATERIALS.TRANSLUCENT),
    new PonyBead('p_tr_blue', 'Blue Translucent', BEAD_MATERIALS.TRANSLUCENT),
    new PonyBead('p_tr_purple', 'Purple Translucent', BEAD_MATERIALS.TRANSLUCENT),

    // --- GLITTER & SPARKLE PONY BEADS ---
    new PonyBead('p_gl_silver', 'Silver Glitter', BEAD_MATERIALS.GLITTER),
    new PonyBead('p_gl_gold', 'Gold Glitter', BEAD_MATERIALS.GLITTER),
    new PonyBead('p_gl_pink', 'Pink Glitter', BEAD_MATERIALS.GLITTER),
    new PonyBead('p_gl_galaxy', 'Galaxy Black Glitter', BEAD_MATERIALS.GLITTER),

    // --- SPECIALTY PONY BEADS ---
    new PonyBead('p_sp_glow', 'Glow in the Dark Green', BEAD_MATERIALS.GLOW_IN_DARK),
    new PonyBead('p_sp_pearl', 'Pearlescent White', BEAD_MATERIALS.PEARL),
    new PonyBead('p_sp_gold', 'Metallic Gold', BEAD_MATERIALS.METALLIC),
    new PonyBead('p_sp_silver', 'Metallic Silver', BEAD_MATERIALS.METALLIC),

    // --- LETTER & NUMBER BEADS ---
    new LetterBead('l_cube_wb', 'White Cube Black Text', BEAD_SHAPES.CUBE, '#000000'),
    new LetterBead('l_cube_bw', 'Black Cube White Text', BEAD_SHAPES.CUBE, '#ffffff'),
    new LetterBead('l_cube_color', 'White Cube Neon Text', BEAD_SHAPES.CUBE, '#ff007f'),
    new LetterBead('l_coin_wb', 'White Coin Black Text', BEAD_SHAPES.COIN, '#000000'),
    new LetterBead('l_coin_bw', 'Black Coin White Text', BEAD_SHAPES.COIN, '#ffffff'),
    new LetterBead('l_coin_multi', 'Pastel Coin Multi Text', BEAD_SHAPES.COIN, '#333333'),
    new LetterBead('l_cube_glow', 'Glow Cube Black Text', BEAD_SHAPES.CUBE, '#000000'),
    new LetterBead('l_cube_clear', 'Clear Cube White Text', BEAD_SHAPES.CUBE, '#ffffff'),

    // --- SHAPE BEADS ---
    new ShapeBead('s_star_yel', 'Yellow Star', BEAD_SHAPES.STAR, BEAD_MATERIALS.OPAQUE),
    new ShapeBead('s_star_glow', 'Glow Star', BEAD_SHAPES.STAR, BEAD_MATERIALS.GLOW_IN_DARK),
    new ShapeBead('s_star_holo', 'Holographic Star', BEAD_SHAPES.STAR, BEAD_MATERIALS.METALLIC),
    
    new ShapeBead('s_heart_red', 'Red Heart', BEAD_SHAPES.HEART, BEAD_MATERIALS.OPAQUE),
    new ShapeBead('s_heart_pink', 'Pink Heart', BEAD_SHAPES.HEART, BEAD_MATERIALS.OPAQUE),
    new ShapeBead('s_heart_clear', 'Clear Heart', BEAD_SHAPES.HEART, BEAD_MATERIALS.TRANSLUCENT),
    
    new ShapeBead('s_butt_purp', 'Purple Butterfly', BEAD_SHAPES.BUTTERFLY, BEAD_MATERIALS.TRANSLUCENT),
    new ShapeBead('s_butt_blue', 'Blue Butterfly', BEAD_SHAPES.BUTTERFLY, BEAD_MATERIALS.OPAQUE),
    
    new ShapeBead('s_flow_pink', 'Pink Flower', BEAD_SHAPES.FLOWER, BEAD_MATERIALS.OPAQUE),
    new ShapeBead('s_flow_neon', 'Neon Flower', BEAD_SHAPES.FLOWER, BEAD_MATERIALS.NEON)
];


// --- 5. UTILITY & HELPER FUNCTIONS ---

/**
 * Searches the catalog and returns a bead object by its unique ID
 * @param {string} id - The ID of the bead to find
 * @returns {Bead} The bead object
 */
export function getBeadById(id) {
    return beadCatalog.find(bead => bead.id === id);
}

/**
 * Filters the bead catalog by a specific shape category
 * @param {string} shape - from BEAD_SHAPES
 * @returns {Array<Bead>} Array of matching beads
 */
export function getBeadsByShape(shape) {
    return beadCatalog.filter(bead => bead.shape === shape);
}

/**
 * Filters the bead catalog by a specific material
 * @param {string} material - from BEAD_MATERIALS
 * @returns {Array<Bead>} Array of matching beads
 */
export function getBeadsByMaterial(material) {
    return beadCatalog.filter(bead => bead.material === material);
}

/**
 * Returns all letter bead templates
 * @returns {Array<Bead>} Array of letter beads
 */
export function getLetterBeads() {
    return beadCatalog.filter(bead => bead instanceof LetterBead);
}

/**
 * Generates the raw HTML string for a specific bead instance to be injected into the DOM
 * @param {string} beadId - The template ID from the catalog
 * @param {string} color - Hex code or CSS color string (for dynamically colored beads)
 * @param {string} content - The letter/number for text beads
 * @returns {string} Raw HTML string
 */
export function renderBeadHTML(beadId, color = '#ffffff', content = '') {
    const beadTemplate = getBeadById(beadId);
    
    if (!beadTemplate) {
        console.error(`Bead with ID ${beadId} not found in catalog.`);
        return '';
    }

    // Pass the color and optional text content to the specific class's renderer
    return beadTemplate.generateHTML(color, content);
}
