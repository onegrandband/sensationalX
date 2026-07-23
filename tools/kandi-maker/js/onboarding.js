// js/onboarding.js
import { STORAGE_KEYS } from './config.js';

export function checkFirstTimeUser() {
    const hasVisited = localStorage.getItem('kandi_seen_welcome');
    if (hasVisited) return;

    // Create Welcome Modal
    const modal = document.createElement('div');
    modal.id = 'welcome-modal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); z-index: 2000; display: flex;
        justify-content: center; align-items: center;
    `;

    modal.innerHTML = `
        <div style="
            background: #121212; border: 2px solid #ff007f; border-radius: 14px;
            padding: 30px; width: 90%; max-width: 480px; text-align: center;
            box-shadow: 0 10px 40px rgba(255,0,127,0.4); color: white;
        ">
            <h2 style="margin-top: 0; color: #39ff14; font-size: 1.4rem; text-transform: uppercase; letter-spacing: 1px;">Welcome to Kandi Maker! ✨</h2>
            <p style="color: #ccc; font-size: 0.9rem; line-height: 1.5; margin-bottom: 20px;">
                Design epic rave bracelets, collect custom beads and pride packs from the shop, and trade your creations for cash!
            </p>
            
            <div style="text-align: left; background: rgba(255,255,255,0.05); padding: 15px; border-radius: 8px; margin-bottom: 20px; font-size: 0.85rem; color: #ddd;">
                <div style="margin-bottom: 8px;">🧵 **Add Beads:** Build your bracelet bead by bead.</div>
                <div style="margin-bottom: 8px;">🎯 **Goal:** Reach at least 18 beads to finish and earn cash!</div>
                <div style="margin-bottom: 8px;">📖 **Presets:** Browse 200+ patterns instantly in the library.</div>
                <div>🛍️ **Shop:** Spend your cash on neon boxes and pride packs.</div>
            </div>

            <button id="close-welcome-btn" style="
                background: linear-gradient(135deg, #ff007f, #9d00ff); color: white; border: none;
                padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 1rem;
                cursor: pointer; box-shadow: 0 4px 15px rgba(255,0,127,0.4); width: 100%; text-transform: uppercase;
            ">Let's Craft! 💖</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('close-welcome-btn').addEventListener('click', () => {
        localStorage.setItem('kandi_seen_welcome', 'true');
        modal.remove();
    });
}
