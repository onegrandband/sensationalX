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
        // 1. Hook into existing HTML buttons
        const buttons = Array.from(document.querySelectorAll('button'));
        const addBtn = buttons.find(b => b.textContent.includes('Add Bead'));
        const removeBtn = buttons.find(b => b.textContent.includes('Remove Last'));
        const clearBtn = buttons.find(b => b.textContent.includes('Clear String'));

        if (addBtn) addBtn.addEventListener('click', () => { addBead(); renderBracelet(); });
        if (removeBtn) removeBtn.addEventListener('click', () => { removeLastBead(); renderBracelet(); });
        if (clearBtn) clearBtn.addEventListener('click', () => { clearBracelet(); renderBracelet(); });

        const buttonContainer = addBtn ? addBtn.parentElement : null;
        const mainCard = buttonContainer ? buttonContainer.parentElement : document.body;

        // 2. Create a single, clean Unified Control Panel
        const controlPanel = document.createElement('div');
        controlPanel.style.cssText = 'background: rgba(255, 255, 255, 0.05); padding: 18px; border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.1);';
        
        controlPanel.innerHTML = `
            <!-- Bead Catalog -->
            <div style="margin-bottom: 18px; text-align: left;">
                <h3 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 0; margin-bottom: 10px; color: #aaa;">Bead Settings</h3>
                <select id="bead-template-select" style="width: 100%; padding: 12px; background: #161616; color: white; border: 1px solid #333; border-radius: 8px; font-size: 0.95rem; cursor: pointer; outline: none;">
                    ${beadCatalog.map(b => `<option value="${b.id}" ${b.id === braceletData.selectedBeadId ? 'selected' : ''}>${b.name} (${b.shape})</option>`).join('')}
                </select>
                <div id="text-input-container" style="display: none; margin-top: 10px;">
                    <input type="text" id="bead-text-input" maxlength="1" value="${braceletData.selectedText}" placeholder="Type 1 Letter" style="width: 100%; padding: 12px; background: #161616; color: white; border: 1px solid #333; border-radius: 8px; text-align: center; font-weight: bold; font-size: 1.1rem; box-sizing: border-box; outline: none;">
                </div>
            </div>

            <!-- Custom Divider -->
            <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;"></div>

            <!-- Color Palette & Hex -->
            <div style="text-align: left;">
                <h3 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 0; margin-bottom: 12px; color: #aaa;">Color Picker</h3>
                
                <!-- Fixed Grid Layout to stop stretching -->
                <div id="color-palette" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;"></div>
                
                <div style="display: flex; gap: 8px; align-items: stretch;">
                    <div style="background: #161616; border: 1px solid #333; border-radius: 8px; display: flex; align-items: center; justify-content: center; width: 42px; overflow: hidden;">
                        <input type="color" id="native-color-picker" value="${braceletData.selectedColor}" style="width: 50px; height: 50px; border: none; background: none; cursor: pointer; padding: 0;">
                    </div>
                    <input type="text" id="custom-hex-input" value="${braceletData.selectedColor}" placeholder="#ff007f" maxlength="7" style="
                        flex: 1; padding: 0 12px; background: #161616; color: white; border: 1px solid #333; border-radius: 8px; font-family: monospace; font-size: 0.95rem; outline: none; box-sizing: border-box;
                    ">
                    <button id="apply-hex-btn" style="background: #fff; color: #000; border: none; padding: 0 18px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9rem; transition: opacity 0.2s;">Set</button>
                </div>
            </div>
        `;
        
        // Inject above the action buttons
        if (buttonContainer) mainCard.insertBefore(controlPanel, buttonContainer);

        // 3. Logic for Bead Selection
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

        // 4. Logic for Colors
        const paletteEl = document.getElementById('color-palette');
        const nativePicker = document.getElementById('native-color-picker');
        const hexInput = document.getElementById('custom-hex-input');
        const applyBtn = document.getElementById('apply-hex-btn');

        function updateSwatchBorders() {
            paletteEl.querySelectorAll('div').forEach((swatch, idx) => {
                const isSelected = braceletData.selectedColor === defaultColors[idx];
                swatch.style.border = isSelected ? '2px solid #fff' : '2px solid transparent';
                swatch.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)';
            });
        }

        defaultColors.forEach(colorHex => {
            const swatch = document.createElement('div');
            // Fixed dimensions applied here to prevent stretching
            swatch.style.cssText = `width: 34px; height: 34px; background-color: ${colorHex}; border-radius: 6px; cursor: pointer; border: 2px solid transparent; transition: all 0.15s ease-in-out; flex-shrink: 0; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2);`;
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
                alert('Invalid hex code! Use a 6-digit format like #ff007f');
            }
        });

        // Initialize the first render
        renderBracelet();

    } catch (err) {
        console.error("UI Initialization failed:", err);
    }
}

export function renderBracelet() {
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
