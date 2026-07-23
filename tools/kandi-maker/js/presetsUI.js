// js/presetsUI.js
import { PRESET_PATTERNS } from './patterns.js';
import { braceletData } from './state.js';
import { addMoney } from './economy.js';

export function initializePresetsUI(renderBraceletCallback) {
    const controlsPanel = document.querySelector('.controls');
    if (!controlsPanel) return;

    const presetWrapper = document.createElement('div');
    presetWrapper.className = 'preset-wrapper';
    presetWrapper.style.marginBottom = '1.5rem';
    presetWrapper.style.padding = '10px';
    presetWrapper.style.background = 'rgba(0,0,0,0.3)';
    presetWrapper.style.borderRadius = '8px';
    presetWrapper.style.border = '1px solid rgba(255,255,255,0.1)';

    presetWrapper.innerHTML = `
        <h3 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; color: #ccc;">Load Preset Pattern (200+ Available)</h3>
        <div style="display: flex; gap: 8px; align-items: center;">
            <select id="preset-select" style="flex: 1; padding: 8px; background: #111; color: white; border: 1px solid #444; border-radius: 6px; font-size: 0.9rem;">
                <option value="">-- Choose a Kandi Preset --</option>
                ${PRESET_PATTERNS.map(p => `<option value="${p.id}">${p.name} (${p.beads.length} beads)</option>`).join('')}
            </select>
            <button id="load-preset-btn" style="background: #333; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold;">Load</button>
        </div>
        <p id="preset-desc" style="font-size: 0.75rem; color: #aaa; margin: 6px 0 0 0; font-style: italic;"></p>
    `;

    // Insert at the top of the controls panel
    controlsPanel.insertBefore(presetWrapper, controlsPanel.firstChild);

    const selectEl = document.getElementById('preset-select');
    const descEl = document.getElementById('preset-desc');

    selectEl.addEventListener('change', (e) => {
        const selectedId = e.target.value;
        const preset = PRESET_PATTERNS.find(p => p.id === selectedId);
        descEl.textContent = preset ? preset.description : '';
    });

    document.getElementById('load-preset-btn').addEventListener('click', () => {
        const selectedId = selectEl.value;
        const preset = PRESET_PATTERNS.find(p => p.id === selectedId);
        if (!preset) {
            alert('Please select a valid preset pattern first!');
            return;
        }

        // Load preset beads into braceletData state
        braceletData.beads = preset.beads.map((b, idx) => ({
            instanceId: Date.now() + idx,
            beadId: b.beadId,
            color: b.color || '#ff007f',
            text: b.text || ''
        }));

        // Reward player cash for creating/loading a bracelet!
        addMoney(25);
        alert(`Loaded "${preset.name}"! You earned $25 for designing a bracelet!`);

        if (typeof renderBraceletCallback === 'function') {
            renderBraceletCallback();
        }
    });
}
