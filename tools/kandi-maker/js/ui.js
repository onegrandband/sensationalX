// js/ui.js
import { braceletData, addBead, removeLastBead, clearBracelet, setColor } from './state.js';

const display = document.getElementById('bracelet-display');
const colorPalette = document.getElementById('color-palette');
const colors = ['#ff007f', '#00ffff', '#39ff14', '#ffff00', '#9d00ff', '#ffffff', '#000000'];

export function initializeUI() {
    setupPalette();
    setupControls();
    renderBracelet();
}

function setupPalette() {
    colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        
        swatch.addEventListener('click', () => {
            setColor(color);
            // Visual feedback for selection
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
            swatch.classList.add('selected');
        });

        colorPalette.appendChild(swatch);
    });
    
    // Select the first one by default
    colorPalette.firstChild.classList.add('selected');
}

function setupControls() {
    document.getElementById('add-bead-btn').addEventListener('click', () => {
        addBead();
        renderBracelet();
    });

    document.getElementById('remove-bead-btn').addEventListener('click', () => {
        removeLastBead();
        renderBracelet();
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        clearBracelet();
        renderBracelet();
    });
}

function renderBracelet() {
    display.innerHTML = ''; // Clear current display
    
    braceletData.beads.forEach(bead => {
        const beadEl = document.createElement('div');
        beadEl.className = 'bead';
        beadEl.style.backgroundColor = bead.color;
        display.appendChild(beadEl);
    });
}
