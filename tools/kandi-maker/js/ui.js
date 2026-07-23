// js/ui.js
import { braceletData, addBead, removeLastBead, clearBracelet, setSelectedBead, setSelectedColor, setSelectedText } from './state.js';
import { beadCatalog, renderBeadHTML, LetterBead, getBeadById } from './beads.js';
import { earnMoney } from './economy.js';

const display = document.getElementById('bracelet-display');

const defaultColors = [
    '#ff007f', '#00ffff', '#39ff14', '#ffff00', 
    '#9d00ff', '#ffffff', '#000000', '#ff5733', 
    '#33ff57', '#3357ff', '#ff33f3', '#ff8633'
];

let lastClickTime = 0;
let isCoolingDown = false;
let cooldownTimeLeft = 0;
let spamLockout = false;

/**
 * Entry point for initializing the user interface components
 */
export function initializeUI() {
    setupCatalogPicker();
    setupColorPicker();
    setupControls();
    renderBracelet();
}

/**
 * Sets up the bead catalog picker UI
 */
function setupCatalogPicker() {
    const controlsPanel = document.querySelector('.controls');
    if (!controlsPanel) return;

    const catalogWrapper = document.createElement('div');
    catalogWrapper.className = 'catalog-wrapper';
    catalogWrapper.style.marginBottom = '1.5rem';
    catalogWrapper.style.padding = '10px';
    catalogWrapper.style.background = 'rgba(0,0,0,0.3)';
    catalogWrapper.style.borderRadius = '8px';
    catalogWrapper.style.border = '1px solid rgba(255,255,255,0.1)';

    catalogWrapper.innerHTML = `
        <h3 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; color: #ccc;">Select Bead Template</h3>
        <select id="bead-template-select" style="width: 100%; padding: 8px; background: #111; color: white; border: 1px solid #444; border-radius: 6px; font-size: 0.9rem; margin-bottom: 8px;">
            ${beadCatalog.map(b => `<option value="${b.id}" ${b.id === braceletData.selectedBeadId ? 'selected' : ''}>${b.name} (${b.shape})</option>`).join('')}
        </select>
        <div id="text-input-container" style="display: none; margin-top: 8px;">
            <label style="font-size: 0.8rem; color: #aaa; display: block; margin-bottom: 4px;">Letter Bead Text (1 char):</label>
            <input type="text" id="bead-text-input" maxlength="1" value="${braceletData.selectedText}" style="width: 100%; padding: 6px; background: #111; color: white; border: 1px solid #444; border-radius: 6px; text-align: center; font-weight: bold; font-size: 1.1rem;">
        </div>
    `;

    controlsPanel.insertBefore(catalogWrapper, controlsPanel.firstChild);

    const selectEl = document.getElementById('bead-template-select');
    const textContainer = document.getElementById('text-input-container');
    const textInput = document.getElementById('bead-text-input');

    function checkLetterBeadVisibility(beadId) {
        const bead = getBeadById(beadId);
        if (bead instanceof LetterBead) {
            textContainer.style.display = 'block';
        } else {
            textContainer.style.display = 'none';
        }
    }

    checkLetterBeadVisibility(braceletData.selectedBeadId);

    selectEl.addEventListener('change', (e) => {
        const id = e.target.value;
        setSelectedBead(id);
        checkLetterBeadVisibility(id);
    });

    textInput.addEventListener('input', (e) => {
        setSelectedText(e.target.value.toUpperCase());
    });
}

/**
 * Sets up color palettes and the Custom Hex Color Adder
 */
function setupColorPicker() {
    const controlsPanel = document.querySelector('.controls');
    if (!controlsPanel) return;

    const colorWrapper = document.createElement('div');
    colorWrapper.className = 'color-picker-wrapper';
    colorWrapper.style.marginBottom = '1.5rem';
    colorWrapper.style.padding = '10px';
    colorWrapper.style.background = 'rgba(0,0,0,0.3)';
    colorWrapper.style.borderRadius = '8px';
    colorWrapper.style.border = '1px solid rgba(255,255,255,0.1)';

    colorWrapper.innerHTML = `
        <h3 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; color: #ccc;">Bead Color & Custom Hex</h3>
        <div id="color-palette" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 6px; margin-bottom: 10px;"></div>
        
        <!-- Custom Hex Input Adder -->
        <div style="display: flex; gap: 8px; align-items: center; margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10px;">
            <label style="font-size: 0.8rem; color: #aaa;">Custom Hex:</label>
            <input type="color" id="native-color-picker" value="${braceletData.selectedColor}" style="width: 35px; height: 30px; border: none; background: none; cursor: pointer; border-radius: 4px;">
            <input type="text" id="custom-hex-input" value="${braceletData.selectedColor}" placeholder="#ff007f" maxlength="7" style="
                flex: 1; padding: 6px 10px; background: #111; color: white; border: 1px solid #444; border-radius: 6px; font-family: monospace; font-size: 0.9rem;
            ">
            <button id="apply-hex-btn" style="background: #333; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">Set</button>
        </div>
    `;

    controlsPanel.appendChild(colorWrapper);

    const paletteEl = document.getElementById('color-palette');
    defaultColors.forEach(colorHex => {
        const swatch = document.createElement('div');
        swatch.style.cssText = `
            width: 100%; height: 25px; background-color: ${colorHex}; border-radius: 4px;
            cursor: pointer; border: 2px solid ${braceletData.selectedColor === colorHex ? '#fff' : 'transparent'};
            transition: transform 0.1s;
        `;
        swatch.addEventListener('click', () => {
            setSelectedColor(colorHex);
            nativePicker.value = colorHex;
            hexInput.value = colorHex;
            updateSwatchBorders();
        });
        paletteEl.appendChild(swatch);
    });

    const nativePicker = document.getElementById('native-color-picker');
    const hexInput = document.getElementById('custom-hex-input');
    const applyBtn = document.getElementById('apply-hex-btn');

    nativePicker.addEventListener('input', (e) => {
        const val = e.target.value;
        hexInput.value = val;
        setSelectedColor(val);
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
            alert('Please enter a valid 6-digit hex code (e.g. #ff007f)!');
        }
    });

    hexInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            applyBtn.click();
        }
    });

    function updateSwatchBorders() {
        paletteEl.querySelectorAll('div').forEach((swatch, idx) => {
            const col = defaultColors[idx];
            swatch.style.border = braceletData.selectedColor === col ? '2px solid #fff' : '2px solid transparent';
        });
    }
}

/**
 * Attaches action buttons and the Create Button with cooldown & 18-bead validation
 */
function setupControls() {
    const controlsPanel = document.querySelector('.controls');
    if (!controlsPanel) return;

    const actionWrapper = document.createElement('div');
    actionWrapper.style.display = 'flex';
    actionWrapper.style.gap = '8px';
    actionWrapper.style.marginBottom = '1.5rem';

    actionWrapper.innerHTML = `
        <button id="add-bead-btn" style="flex: 2; background: linear-gradient(135deg, #ff007f, #9d00ff); color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Add Bead</button>
        <button id="remove-bead-btn" style="flex: 1; background: #333; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Remove</button>
        <button id="clear-btn" style="flex: 1; background: #422; color: #ff8888; border: none; padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;">Clear</button>
    `;
    controlsPanel.appendChild(actionWrapper);

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

    // Create Button & Cooldown Section
    const createWrapper = document.createElement('div');
    createWrapper.style.marginTop = '1.5rem';
    createWrapper.innerHTML = `
        <button id="create-bracelet-btn" style="
            width: 100%;
            background: linear-gradient(135deg, #39ff14, #00ffff);
            color: #000;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 1rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(57,255,20,0.4);
            text-transform: uppercase;
            letter-spacing: 1px;
        ">✨ Finish & Create Bracelet</button>
        <div id="create-status-msg" style="font-size: 0.8rem; text-align: center; margin-top: 6px; color: #ff007f; min-height: 18px;"></div>
    `;
    controlsPanel.appendChild(createWrapper);

    const createBtn = document.getElementById('create-bracelet-btn');
    const statusMsg = document.getElementById('create-status-msg');

    createBtn.addEventListener('click', () => {
        const now = Date.now();

        if (now - lastClickTime < 300 || spamLockout) {
            statusMsg.textContent = "You're clicking too fast! Please wait 2.5 seconds.";
            spamLockout = true;
            setTimeout(() => {
                spamLockout = false;
                if (!isCoolingDown) statusMsg.textContent = "";
            }, 2500);
            return;
        }
        lastClickTime = now;

        if (isCoolingDown) {
            statusMsg.textContent = `Cooldown active! Wait ${Math.ceil(cooldownTimeLeft)}s before creating another.`;
            return;
        }

        if (braceletData.beads.length < 18) {
            statusMsg.textContent = `You need at least 18 beads! (Current: ${braceletData.beads.length})`;
            return;
        }

        const earnings = braceletData.beads.length * 5;
        earnMoney(earnings);
        statusMsg.style.color = '#39ff14';
        statusMsg.textContent = `Success! Bracelet created and sold for $${earnings}! 🎉`;

        isCoolingDown = true;
        cooldownTimeLeft = 35;
        createBtn.style.opacity = '0.5';
        createBtn.style.cursor = 'not-allowed';

        const timer = setInterval(() => {
            cooldownTimeLeft -= 1;
            if (cooldownTimeLeft > 0) {
                if (!spamLockout) {
                    statusMsg.style.color = '#ff007f';
                    statusMsg.textContent = `Cooldown: ${cooldownTimeLeft}s remaining...`;
                }
            } else {
                clearInterval(timer);
                isCoolingDown = false;
                createBtn.style.opacity = '1';
                createBtn.style.cursor = 'pointer';
                statusMsg.style.color = '#ff007f';
                statusMsg.textContent = "";
            }
        }, 1000);
    });
}

/**
 * Renders the bracelet string onto the display container
 */
export function renderBracelet() {
    if (!display) return;

    if (braceletData.beads.length === 0) {
        display.innerHTML = `<span style="color: #666; font-size: 0.9rem; font-style: italic;">Your bracelet string is empty. Add some beads!</span>`;
        return;
    }

    display.innerHTML = braceletData.beads.map(b => 
        renderBeadHTML(b.beadId, b.color, b.text)
    ).join('');
}
