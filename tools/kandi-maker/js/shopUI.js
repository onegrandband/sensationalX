// js/shopUI.js
import { economyState, loadEconomy } from './economy.js';
import { inventoryState, loadInventory } from './inventory.js';
import { craftStoreBoxes, buyBeadBox } from './shop.js';

export function initializeEconomyAndShopUI() {
    loadEconomy();
    loadInventory();

    createHeaderHUD();
    createShopModal();

    // Listen for updates to refresh numbers live
    window.addEventListener('economy-updated', (e) => {
        const moneyEl = document.getElementById('hud-money');
        if (moneyEl) moneyEl.textContent = `$${e.detail.money}`;
    });
}

function createHeaderHUD() {
    const appContainer = document.querySelector('.app-container');
    if (!appContainer) return;

    const hudBar = document.createElement('div');
    hudBar.className = 'hud-bar';
    hudBar.style.display = 'flex';
    hudBar.style.justifyContent = 'space-between';
    hudBar.style.alignItems = 'center';
    hudBar.style.marginBottom = '1.5rem';
    hudBar.style.padding = '10px 15px';
    hudBar.style.background = 'rgba(0,0,0,0.4)';
    hudBar.style.borderRadius = '8px';
    hudBar.style.border = '1px solid rgba(255,255,255,0.1)';

    hudBar.innerHTML = `
        <div style="display: flex; gap: 15px; align-items: center;">
            <span style="font-weight: bold; color: #39ff14; font-size: 1.1rem;">💰 Cash: <span id="hud-money">${economyState.money}</span></span>
        </div>
        <button id="open-shop-btn" style="background: linear-gradient(135deg, #ff007f, #9d00ff); color: white; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 12px rgba(255,0,127,0.4);">🛍️ Visit Craft Store</button>
    `;

    appContainer.insertBefore(hudBar, appContainer.querySelector('main'));

    document.getElementById('open-shop-btn').addEventListener('click', () => {
        const modal = document.getElementById('craft-store-modal');
        if (modal) modal.style.display = 'flex';
    });
}

function createShopModal() {
    const modal = document.createElement('div');
    modal.id = 'craft-store-modal';
    modal.style.cssText = `
        display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.8); z-index: 1000; justify-content: center; align-items: center;
    `;

    let boxesHTML = craftStoreBoxes.map(box => `
        <div style="background: #1e1e1e; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 15px; text-align: center; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
                <h4 style="margin: 0 0 5px 0; color: #ff007f; font-size: 1rem;">${box.name}</h4>
                <p style="font-size: 0.8rem; color: #aaa; margin: 0 0 10px 0;">Price: <span style="color: #39ff14; font-weight: bold;">$${box.price}</span></p>
            </div>
            <button class="buy-box-btn" data-box-id="${box.id}" style="background: #333; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer; font-weight: bold;">Buy Box</button>
        </div>
    `).join('');

    modal.innerHTML = `
        <div style="background: #121212; border: 2px solid #ff007f; border-radius: 12px; padding: 25px; width: 90%; max-width: 500px; box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="margin: 0; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 1px;">Kandi Craft Store</h2>
                <button id="close-shop-btn" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;">✕</button>
            </div>
            <p style="font-size: 0.85rem; color: #ccc; margin-bottom: 20px;">Buy bead boxes to restock your inventory so you can keep building bracelets!</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
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
            const boxId = e.target.getAttribute('data-box-id');
            const result = buyBeadBox(boxId);
            alert(result.message);
        });
    });
}
