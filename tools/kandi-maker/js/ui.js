// js/ui.js
import { braceletData, addBead, removeLastBead, clearBracelet, setSelectedBead, setSelectedColor, setSelectedText } from './state.js';
import { beadCatalog, renderBeadHTML, LetterBead, getBeadById } from './beads.js';

const defaultColors = [
    '#ff007f', '#00ffff', '#39ff14', '#ffff00', 
    '#9d00ff', '#ffffff', '#000000', '#ff5733', 
    '#33ff57', '#3357ff', '#ff33f3', '#ff8633'
];

export function initializeUI() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildUI);
    } else {
        buildUI();
    }
}

function buildUI() {
    try {
        // 1. Find your existing buttons from the HTML to attach events
        const buttons = Array.from(document.querySelectorAll('button'));
        const addBtn = buttons.find(b => b.textContent.includes('Add Bead'));
        const removeBtn = buttons.find(b => b.textContent.includes('Remove Last'));
        const clearBtn = buttons.find(b => b.textContent.includes('Clear String'));

        if (addBtn) addBtn.addEventListener('click', () => { addBead(); renderBracelet(); });
        if (removeBtn) removeBtn.addEventListener('click', () => { removeLastBead(); renderBracelet(); });
        if (clearBtn) clearBtn.addEventListener('click', () => { clearBracelet(); renderBracelet(); });

        // 2. Find the container holding your buttons so we can inject the new UI above it
        const buttonContainer = addBtn ? addBtn.parentElement : null;
        const mainCard = buttonContainer ? buttonContainer.parentElement : document.body;

        // 3. Inject Bead Catalog Picker
        const catalogWrapper = document.createElement('div');
        catalogWrapper.style.cssText = 'margin-bottom: 1.5rem; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; text-align: left;';
        catalogWrapper.innerHTML = `
            <h3 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 10px; color: #ccc;">Select Bead Type</h3>
            <select id="bead-template-select" style="width: 100%; padding: 10px; background: #111; color: white; border: 1px solid #444; border-radius: 6px; font-size: 0.95rem; margin-bottom: 8px;">
                ${beadCatalog.map(b => `<option value="${b.id}" ${b.id === braceletData.selectedBeadId ? 'selected' : ''}>${b.name} (${b.shape})</option>`).join('')}
            </select>
            <div id="text-input-container" style="display: none; margin-top: 10px;">
                <label style="font-size: 0.8rem; color: #aaa; display: block; margin-bottom: 6px;">Letter (1 Char):</label>
                <input type="text" id="bead-text-input" maxlength="1" value="${braceletData.selectedText}" style="width: 100%; padding: 10px; background: #111; color: white; border: 1px solid #444; border-radius: 6px; text-align: center; font-weight: bold; font-size: 1.1rem;">
            </div>
        `;
        
        if (buttonContainer) mainCard.insertBefore(catalogWrapper, buttonContainer);

        // 4. Inject Hex Color Picker
        const colorWrapper = document.createElement('div');
        colorWrapper.style.cssText = 'margin-bottom: 1.5rem; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 8px; text-align: left;';
        colorWrapper.innerHTML = `
            <h3 style="font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 10px; color: #ccc;">Bead Color & Custom Hex</h3>
            <div id="color-palette" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 15px;"></div>
            
            <div style="display: flex; gap: 8px; align-items: center; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
                <input type="color" id="native-color-picker" value="${braceletData.selectedColor}" style="width: 38px; height: 34px; border: none; background: none; cursor: pointer; padding: 0;">
                <input type="text" id="custom-hex-input" value="${braceletData.selectedColor}" placeholder="#ff007f" maxlength="7" style="
                    flex: 1; padding: 8px 12px; background: #111; color: white; border: 1px solid #444; border-radius: 6px; font-family: monospace; font-size: 0.95rem;
                ">
                <button id="apply-hex-btn" style="background: #333; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: background 0.2s;">Set</button>
            </div>
        `;
        
        if (buttonContainer) mainCard.insertBefore(colorWrapper, buttonContainer);

        // Logic for Bead Selection
        const selectEl = document.getElementById('bead-template-select');
        const textContainer = document.getElementById('text-input-container');
        const textInput = document.getElementById('bead-text-input');

        function checkLetterBeadVisibility(beadId) {
            const bead = getBeadById(beadId);
            textContainer.style.display = (bead instanceof LetterBead) ? 'block' : 'none';
        }
        checkLetterBeadVisibility(braceletData.selectedBeadId);

        selectEl.addEventListener('change', (e) => {
            setSelectedBead(e.target.value);
            checkLetterBeadVisibility(e.target.value);
        });
        textInput.addEventListener('input', (e) => setSelectedText(e.target.value.toUpperCase()));

        // Logic for Color Selection
        const paletteEl = document.getElementById('color-palette');
        const nativePicker = document.getElementById('native-color-picker');
        const hexInput = document.getElementById('custom-hex-input');
        const applyBtn = document.getElementById('apply-hex-btn');

        function updateSwatchBorders() {
            paletteEl.querySelectorAll('div').forEach((swatch, idx) => {
                swatch.style.border = braceletData.selectedColor === defaultColors[idx] ? '2px solid #fff' : '2px solid transparent';
            });
        }

        defaultColors.forEach(colorHex => {
            const swatch = document.createElement('div');
            swatch.style.cssText = `width: 100%; height: 30px; background-color: ${colorHex}; border-radius: 4px; cursor: pointer; transition: transform 0.1s;`;
            swatch.addEventListener('click', () => {
                setSelectedColor(colorHex);
                nativePicker.value = colorHex;
                hexInput.value = colorHex;
                updateSwatchBorders();
            });
            paletteEl.appendChild(swatch);
        });
        updateSwatchBorders();

        nativePicker.addEventListener('input', (e) => {
            hexInput.value = e.target.value;
            setSelectedColor(e.target.value);
            updateSwatchBorders();
        });

        applyBtn.addEventListener('click', () => {
            let val = hexInput.value.trim();
            if (!val.startsWith('#')) val = '#' + val;
            if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                setSelectedColor(val);
                nativePicker.value = val;
                updateSwatchBorders();
            } else {
                alert('Invalid hex! Use a 6-digit code like #ff007f');
            }
        });

        // Initialize the first render
        renderBracelet();

    } catch (err) {
        console.error("UI Initialization failed:", err);
    }
}

export function renderBracelet() {
    // Assuming your black box has an id or class we can target. 
    // If not, you might need to add id="bracelet-display" to the black div in your HTML!
    const display = document.getElementById('bracelet-display') || document.querySelector('.string-container');
    if (!display) return;

    if (braceletData.beads.length === 0) {
        display.innerHTML = '';
        return;
    }

    display.innerHTML = braceletData.beads.map(b => 
        renderBeadHTML(b.beadId, b.color, b.text)
    ).join('');
}
