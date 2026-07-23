// js/exportUI.js
import { exportBraceletAsImage } from './export.js';

export function initializeExportUI() {
    const actionsContainer = document.querySelector('.actions') || document.querySelector('.controls');
    if (!actionsContainer) return;

    // Prevent duplicate buttons if loaded twice
    if (document.getElementById('export-image-btn')) return;

    const exportBtn = document.createElement('button');
    exportBtn.id = 'export-image-btn';
    exportBtn.textContent = 'Export PNG 📸';
    exportBtn.style.cssText = 'background: linear-gradient(135deg, #00ffff, #39ff14); color: #000; border: none; padding: 10px 16px; border-radius: 8px; cursor: pointer; font-weight: bold; font-size: 0.9rem;';

    exportBtn.addEventListener('click', () => {
        const target = document.querySelector('.bracelet-container') || document.getElementById('bracelet-display');
        if (target) {
            exportBraceletAsImage(target);
        } else {
            alert('Bracelet container not found.');
        }
    });

    actionsContainer.appendChild(exportBtn);
}
