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
    // 🌟 NEW: Premium Store Beads
    new Bead('trans-heart', 'Trans Pride Heart', 'heart'),
    new Bead('trans-star', 'Trans Pride Star', 'star')
];

export function getBeadById(id) {
    return beadCatalog.find(b => b.id === id);
}

export function renderBeadHTML(beadId, color, text) {
    const bead = getBeadById(beadId);
    if (!bead) return '';

    // 🌟 NEW: Special flag textures
    let backgroundStyle = `background-color: ${color};`;
    
    if (beadId === 'trans-heart' || beadId === 'trans-star') {
        backgroundStyle = `background: linear-gradient(to bottom, #5BCEFA 20%, #F5A9B8 20% 40%, #FFFFFF 40% 60%, #F5A9B8 60% 80%, #5BCEFA 80%);`;
        color = 'transparent'; // Override standard color
    }

    // Determine shape CSS
    let shapeCSS = '';
    if (bead.shape === 'barrel') shapeCSS = 'border-radius: 8px; width: 25px; height: 35px;';
    if (bead.shape === 'cube') shapeCSS = 'border-radius: 4px; width: 30px; height: 30px;';
    if (bead.shape === 'heart') shapeCSS = 'border-radius: 50% 50% 50% 50%; width: 35px; height: 32px; clip-path: polygon(50% 100%, 100% 38%, 100% 0, 50% 20%, 0 0, 0 38%);'; 
    if (bead.shape === 'star') shapeCSS = 'border-radius: 2px; width: 35px; height: 35px; clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);';

    let content = '';
    if (bead.isLetter) {
        content = `<span style="color: ${isColorDark(color) ? 'white' : 'black'}; font-weight: bold; font-family: monospace; font-size: 16px;">${text}</span>`;
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
    if (hex === 'transparent') return false;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (r * 0.299 + g * 0.587 + b * 0.114) < 128;
}
