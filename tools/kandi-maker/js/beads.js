// js/beads.js

class Bead {
    constructor(id, name, shape, isLetter = false) {
        this.id = id;
        this.name = name;
        this.shape = shape;
        this.isLetter = isLetter;
    }
}

export class LetterBead extends Bead {
    constructor(id, name, shape) {
        super(id, name, shape, true);
    }
}

export const beadCatalog = [
    new Bead('classic-barrel', 'Classic Barrel', 'barrel'),
    new LetterBead('letter-cube', 'Letter Cube', 'cube'),
    new Bead('trans-heart', 'Trans Pride Heart', 'heart'),
    new Bead('trans-star', 'Trans Pride Star', 'star')
];

export function getBeadById(id) {
    // 1. Check explicit catalog first
    let bead = beadCatalog.find(b => b.id === id);
    if (bead) return bead;

    // 2. Fallback prefix matching for inventory/shop items so they never break
    if (id && typeof id === 'string') {
        if (id.startsWith('l_')) {
            return new LetterBead(id, 'Letter Bead', 'cube');
        }
        if (id.includes('heart') || id.startsWith('s_heart')) {
            return new Bead(id, 'Heart Charm', 'heart');
        }
        if (id.includes('star') || id.startsWith('s_star')) {
            return new Bead(id, 'Star Charm', 'star');
        }
        if (id.includes('flow') || id.startsWith('s_flow')) {
            return new Bead(id, 'Flower Charm', 'star'); // fallback shape
        }
        // Default fallback for standard pony beads (p_...)
        return new Bead(id, 'Pony Bead', 'barrel');
    }

    return null;
}

export function renderBeadHTML(beadId, color, text) {
    const bead = getBeadById(beadId);
    if (!bead) return '';

    let backgroundStyle = `background-color: ${color};`;
    
    if (beadId === 'trans-heart' || beadId === 'trans-star') {
        backgroundStyle = `background: linear-gradient(to bottom, #5BCEFA 20%, #F5A9B8 20% 40%, #FFFFFF 40% 60%, #F5A9B8 60% 80%, #5BCEFA 80%);`;
        color = 'transparent';
    }

    // Determine shape CSS
    let shapeCSS = '';
    if (bead.shape === 'barrel') shapeCSS = 'border-radius: 8px; width: 25px; height: 35px;';
    if (bead.shape === 'cube') shapeCSS = 'border-radius: 4px; width: 30px; height: 30px;';
    if (bead.shape === 'heart') shapeCSS = 'border-radius: 50% 50% 50% 50%; width: 35px; height: 32px; clip-path: polygon(50% 100%, 100% 38%, 100% 0, 50% 20%, 0 0, 0 38%);'; 
    if (bead.shape === 'star') shapeCSS = 'border-radius: 2px; width: 35px; height: 35px; clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);';

    let content = '';
    if (bead.isLetter) {
        content = `<span style="color: ${isColorDark(color) ? 'white' : 'black'}; font-weight: bold; font-family: monospace; font-size: 16px;">${text || ''}</span>`;
    }

    return `<div class="bead" style="
        ${backgroundStyle}
        ${shapeCSS}
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: inset -2px -2px 6px rgba(0,0,0,0.4), inset 2px 2px 6px rgba(255,255,255,0.3);
        flex-shrink: 0;
        margin: 0 1px;
    ">${content}</div>`;
}

function isColorDark(hex) {
    if (!hex || hex === 'transparent') return false;
    if (hex.startsWith('#') && hex.length === 4) {
        // Expand shorthand hex like #fff to #ffffff
        hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    if (!hex.startsWith('#') || hex.length < 7) return false;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
}
