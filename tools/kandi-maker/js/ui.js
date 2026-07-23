// js/ui.js
import { braceletData, addBead, removeLastBead, clearBracelet, setSelectedBead, setSelectedColor, setSelectedText } from './state.js';
import { beadCatalog, renderBeadHTML, LetterBead, getBeadById } from './beads.js';
import { earnMoney } from './economy.js';

const display = document.getElementById('bracelet-display');
const paletteContainer = document.getElementById('color-palette');

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
 * Attaches event listeners to action buttons including the Create button with cooldown & validation
 */
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

    // --- Create Button & Cooldown Setup ---
    const controlsPanel = document.querySelector('.controls');
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

        // Check for spam clicking (< 300ms between clicks)
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

        // Check 35-second cooldown
        if (isCoolingDown) {
            statusMsg.textContent = `Cooldown active! Wait ${Math.ceil(cooldownTimeLeft)}s before creating another.`;
            return;
        }

        // Check minimum bead requirement (18 beads)
        if (braceletData.beads.length < 18) {
            statusMsg.textContent = `You need at least 18 beads! (Current: ${braceletData.beads.length})`;
            return;
        }

        // Success: Reward money and start 35s cooldown
        const earnings = braceletData.beads.length * 5; // $5 per bead earned
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

// (Retain catalog picker, text input, color picker, and renderBracelet functions below...)
