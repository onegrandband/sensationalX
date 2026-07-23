// js/hudAndPresets.js
import { economyState, loadEconomy, addMoney } from './economy.js';
import { inventoryState, loadInventory } from './inventory.js';
import { craftStoreBoxes, buyBeadBox } from './shop.js';
import { PRESET_PATTERNS } from './patterns.js';
import { braceletData } from './state.js';

export function initializeGameUI(renderCallback) {
    loadEconomy();
    loadInventory();

    // Find the main Kandi card container from your HTML
    const mainCard = document.querySelector('.bracelet-maker') || document.querySelector('body > div') || document.body;

    // Create a unified top panel for Money, Shop, and Presets
    const gamePanel = document.createElement('div');
    gamePanel.id = 'kandi-game-hud';
    gamePanel.style.cssText = `
        background: rgba(20, 20, 20, 0.95);
        border: 1px solid rgba(255, 0, 127, 0.4);
        border-radius: 10px;
        padding: 12px 15px;
        margin-bottom: 15px;
        width: 100%;
        max-width: 600px;
        box-sizing: border-box;
    `;

    gamePanel.innerHTML = `
        <!-- Top Row: Money & Shop Button -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <span style="font-weight: bold; color: #39ff14; font-size: 1.1rem;">💰 Cash: <span id="hud-money">${economyState.money}</span></span>
            <button id="open-shop-btn" style="background: linear-gradient(135deg, #ff007f, #9d00ff); color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(255,0,127,0.4); font-size: 0.85rem;">🛍️ Craft Store</button>
        </div>

        <!-- Second Row: Presets Dropdown -->
        <div>
            <label style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: #aaa; display: block; margin-bottom: 4px;">Load Preset Pattern (200+ Available)</label>
            <div style="display: flex; gap: 8px;">
                <select id="preset-select" style="flex: 1; padding: 6px; background: #111; color: white; border: 1px solid #444; border-radius: 6px; font-size: 0.85rem;">
                    <option value="">-- Choose a Preset Pattern --</option>
                    ${PRESET_PATTERNS.map(p => `<option value="${p.id}">${p.name} (${p.beads.length} beads)</option>`).join('')}
                </select>
                <button id="load-preset-btn" style="background: #333; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem;">Load</button>
            </div>
            <p id="preset-desc" style="font-size: 0.7rem; color: #888; margin: 4px 0 0 0; font-style: italic;"></p>
        </div>
    `;

    // Insert right at the top of the Kandi maker interface card
    mainCard.insertBefore(gamePanel, mainCard.firstChild);

    // --- Craft Store Modal ---
    createShopModal();

    // Event Listeners
    window.addEventListener('economy-updated', (e) => {
        const moneyEl = document.getElementById('hud-money');
        if (moneyEl) moneyEl.textContent = `$${e.detail.money}`;
    });

    document.getElementById('open-shop-btn').addEventListener('click', () => {
        document.getElementById('craft-store-modal').style.display = 'flex';
    });

    const selectEl = document.getElementById('preset-select');
    const descEl = document.getElementById('preset-desc');

    selectEl.addEventListener('change', (e) => {
        const preset = PRESET_PATTERNS.find(p => p.id === e.target.value);
        descEl.textContent = preset ? preset.description : '';
    });

    document.getElementById('load-preset-btn').addEventListener('click', () => {
        const preset = PRESET_PATTERNS.find(p => p.id === selectEl.value);
        if (!preset) {
            alert('Please select a preset pattern first!');
            return;
        }

        braceletData.beads = preset.beads.map((b, idx) => ({
            instanceId: Date.now() + idx,
            beadId: b.beadId,
            color: b.color || '#ff007f',
            text: b.text || ''
        }));

        addMoney(25);
        alert(`Loaded "${preset.name}"! You earned $25!`);

        if (typeof renderCallback === 'function') renderCallback();
    });
}

function createShopModal() {
    if (document.getElementById('craft-store-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'craft-store-modal';
    modal.style.cssText = `
        display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); z-index: 10000; justify-content: center; align-items: center;
    `;

    let boxesHTML = craftStoreBoxes.map(box => `
        <div style="background: #1a1a1a; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 12px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h4 style="margin: 0 0 4px 0; color: #ff007f; font-size: 0.9rem;">${box.name}</h4>
                <p style="font-size: 0.75rem; color: #aaa; margin: 0 0 8px 0;">Price: <span style="color: #39ff14; font-weight: bold;">$${box.price}</span></p>
            </div>
            <button class="buy-box-btn" data-box-id="${box.id}" style="background: #333; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 0.8rem;">Buy Box</button>
        </div>
    `).join('');

    modal.innerHTML = `
        <div style="background: #121212; border: 2px solid #ff007f; border-radius: 12px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 10px 40px rgba(0,0,0,0.9);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 1.1rem; color: white; text-transform: uppercase;">Kandi Craft Store</h3>
                <button id="close-shop-btn" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;">✕</button>
            </div>
            <p style="font-size: 0.8rem; color: #ccc; margin-bottom: 15px;">Buy bead boxes to restock your inventory.</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                ${boxesHTML}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('close-shop-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.querySelectorAll('.buy-box-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const result = buyBeadBox(e.target.getAttribute('data-box-id'));
            alert(result.message);
        });
    });
}
