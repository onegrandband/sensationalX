// js/ui.js
import { braceletData, inventory, getInventoryCount, addBead, removeLastBead, clearBracelet, setSelectedBead, setSelectedColor, setSelectedText } from './state.js';
import { beadCatalog, renderBeadHTML, LetterBead, getBeadById } from './beads.js';

const defaultColors = ['#ff007f', '#00ffff', '#39ff14', '#ffff00', '#9d00ff', '#ffffff', '#000000', '#ff5733', '#33ff57', '#3357ff', '#ff33f3', '#ff8633'];

export function initializeUI() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', buildUI);
    } else {
        buildUI();
    }
}

function buildUI() {
    try {
        const buttons = Array.from(document.querySelectorAll('button'));
        const addBtn = buttons.find(b => b.textContent.includes('Add Bead'));
        const removeBtn = buttons.find(b => b.textContent.includes('Remove Last'));
        const clearBtn = buttons.find(b => b.textContent.includes('Clear String'));

        if (addBtn) addBtn.addEventListener('click', () => { if(addBead()) updateFullUI(); });
        if (removeBtn) removeBtn.addEventListener('click', () => { if(removeLastBead()) updateFullUI(); });
        if (clearBtn) clearBtn.addEventListener('click', () => { clearBracelet(); updateFullUI(); });

        const buttonContainer = addBtn ? addBtn.parentElement : null;
        const mainCard = buttonContainer ? buttonContainer.parentElement : document.body;

        // Remove any old injected control panels to prevent duplicates
        const oldPanel = document.getElementById('injected-control-panel');
        if (oldPanel) oldPanel.remove();

        const controlPanel = document.createElement('div');
        controlPanel.id = 'injected-control-panel';
        controlPanel.style.cssText = 'background: rgba(255, 255, 255, 0.05); padding: 18px; border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.1);';
        
        controlPanel.innerHTML = `
            <div style="margin-bottom: 18px; text-align: left;">
                <h3 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 0; margin-bottom: 10px; color: #aaa;">Bead Settings</h3>
                
                <!-- 100% Custom Dropdown (No native select elements used anywhere) -->
                <div class="custom-select-wrapper" id="bead-custom-select">
                    <div class="custom-select-trigger" id="bead-select-trigger">
                        <span id="bead-select-label">Select Bead...</span>
                    </div>
                    <div class="custom-options" id="bead-options-list"></div>
                </div>

                <div id="text-input-container" style="display: none; margin-top: 12px;">
                    <input type="text" id="bead-text-input" maxlength="1" value="${braceletData.selectedText}" placeholder="Type 1 Letter" style="width: 100%; padding: 12px; background: #161616; color: white; border: 1px solid #333; border-radius: 8px; text-align: center; font-weight: bold; font-size: 1.1rem; box-sizing: border-box; outline: none;">
                </div>
            </div>
            
            <div style="height: 1px; background: rgba(255,255,255,0.1); margin: 15px 0;"></div>
            
            <div style="text-align: left;">
                <h3 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 0; margin-bottom: 12px; color: #aaa;">Color Picker</h3>
                <div id="color-palette" style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px;"></div>
                <div style="display: flex; gap: 8px; align-items: stretch;">
                    <div style="background: #161616; border: 1px solid #333; border-radius: 8px; display: flex; align-items: center; justify-content: center; width: 42px; overflow: hidden;">
                        <input type="color" id="native-color-picker" value="${braceletData.selectedColor}" style="width: 50px; height: 50px; border: none; background: none; cursor: pointer; padding: 0;">
                    </div>
                    <input type="text" id="custom-hex-input" value="${braceletData.selectedColor}" placeholder="#ff007f" maxlength="7" style="flex: 1; padding: 0 12px; background: #161616; color: white; border: 1px solid #333; border-radius: 8px; font-family: monospace; font-size: 0.95rem; outline: none; box-sizing: border-box;">
                    <button id="apply-hex-btn" style="background: #fff; color: #000; border: none; padding: 0 18px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9rem;">Set</button>
                </div>
            </div>
        `;
        
        if (buttonContainer) mainCard.insertBefore(controlPanel, buttonContainer);

        // --- Custom Dropdown Event Listeners ---
        const selectWrapper = document.getElementById('bead-custom-select');
        const selectTrigger = document.getElementById('bead-select-trigger');
        
        selectTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            selectWrapper.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!selectWrapper.contains(e.target)) {
                selectWrapper.classList.remove('open');
            }
        });

        document.getElementById('bead-text-input').addEventListener('input', (e) => setSelectedText(e.target.value.toUpperCase()));

        // --- Color Picker Event Listeners ---
        const paletteEl = document.getElementById('color-palette');
        const nativePicker = document.getElementById('native-color-picker');
        const hexInput = document.getElementById('custom-hex-input');

        defaultColors.forEach(colorHex => {
            const swatch = document.createElement('div');
            swatch.style.cssText = `width: 34px; height: 34px; background-color: ${colorHex}; border-radius: 6px; cursor: pointer; border: 2px solid transparent; transition: all 0.15s ease-in-out; flex-shrink: 0; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.2);`;
            swatch.addEventListener('click', () => {
                setSelectedColor(colorHex);
                nativePicker.value = colorHex;
                hexInput.value = colorHex;
                updateFullUI();
            });
            paletteEl.appendChild(swatch);
        });

        nativePicker.addEventListener('input', (e) => {
            hexInput.value = e.target.value;
            setSelectedColor(e.target.value);
            updateFullUI();
        });

        document.getElementById('apply-hex-btn').addEventListener('click', () => {
            let val = hexInput.value.trim();
            if (!val.startsWith('#')) val = '#' + val;
            if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
                setSelectedColor(val);
                nativePicker.value = val;
                updateFullUI();
            }
        });

        setupStoreButtons();
        updateFullUI();

    } catch (err) {
        console.error("UI Initialization failed:", err);
    }
}

function updateFullUI() {
    renderBracelet();
    
    const paletteEl = document.getElementById('color-palette');
    paletteEl.querySelectorAll('div').forEach((swatch, idx) => {
        const isSelected = braceletData.selectedColor === defaultColors[idx];
        swatch.style.border = isSelected ? '2px solid #fff' : '2px solid transparent';
        swatch.style.transform = isSelected ? 'scale(1.1)' : 'scale(1)';
    });

    const optionsList = document.getElementById('bead-options-list');
    optionsList.innerHTML = beadCatalog.map(b => {
        const count = getInventoryCount(b.id);
        const isSelected = b.id === braceletData.selectedBeadId;
        const color = count === 0 ? '#ff4444' : (isSelected ? '#ff007f' : '#ccc');
        return `
            <div class="custom-option ${isSelected ? 'selected' : ''}" data-value="${b.id}" style="padding: 12px 16px; color: ${color}; cursor: pointer; display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.03);">
                <span>${b.name} <strong style="font-size: 0.8em;">(x${count})</strong></span>
                <span style="opacity: 0.4; font-size: 0.85em;">(${b.shape})</span>
            </div>
        `;
    }).join('');

    const selectLabel = document.getElementById('bead-select-label');
    const selectedBead = getBeadById(braceletData.selectedBeadId) || beadCatalog[0];
    const count = getInventoryCount(selectedBead.id);
    selectLabel.innerHTML = `<span>${selectedBead.name} <strong>(x${count})</strong></span>`;

    optionsList.querySelectorAll('.custom-option').forEach(option => {
        option.addEventListener('click', () => {
            const selectedId = option.getAttribute('data-value');
            setSelectedBead(selectedId);
            
            const bead = getBeadById(selectedId);
            document.getElementById('text-input-container').style.display = (bead instanceof LetterBead) ? 'block' : 'none';
            
            document.getElementById('bead-custom-select').classList.remove('open');
            updateFullUI();
        });
    });
}

function setupStoreButtons() {
    const storeButtons = document.querySelectorAll('.store-modal button');
    storeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const packContainer = e.target.parentElement;
            const packTitle = packContainer.innerText || "";
            
            if (packTitle.includes('Trans Pride Pack') || packTitle.includes('Trans')) {
                inventory['trans-heart'] += 20;
                inventory['trans-star'] += 20;
                alert('Success! You got 20 Trans Hearts and 20 Trans Stars!');
            }
            updateFullUI();
        });
    });
}

export function renderBracelet() {
    const display = document.getElementById('bracelet-display') || document.querySelector('.string-container');
    if (!display) return;
    if (braceletData.beads.length === 0) { display.innerHTML = ''; return; }
    display.innerHTML = braceletData.beads.map(b => renderBeadHTML(b.beadId, b.color, b.text)).join('');
}
