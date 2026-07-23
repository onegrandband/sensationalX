// js/presetsUI.js
import { PRESET_PATTERNS } from './patterns.js';
import { setPresetBeads } from './state.js';

export function initializePresetsUI(renderBraceletCallback) {
    const controlsPanel = document.querySelector('.controls');
    if (!controlsPanel) return;

    // 1. Create a prominent button to open the Preset Library Modal
    const presetTriggerWrapper = document.createElement('div');
    presetTriggerWrapper.className = 'preset-trigger-wrapper';
    presetTriggerWrapper.style.marginBottom = '1.5rem';

    presetTriggerWrapper.innerHTML = `
        <button id="open-presets-modal-btn" style="
            width: 100%;
            background: linear-gradient(135deg, #9d00ff, #ff007f);
            color: white;
            border: none;
            padding: 12px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 0.95rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(157,0,255,0.4);
            text-transform: uppercase;
            letter-spacing: 1px;
        ">📖 Browse Preset Pattern Library (200+)</button>
    `;
    controlsPanel.insertBefore(presetTriggerWrapper, controlsPanel.firstChild);

    // 2. Create the Modal Menu Element
    const modal = document.createElement('div');
    modal.id = 'presets-modal';
    modal.style.cssText = `
        display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.85); z-index: 1100; justify-content: center; align-items: center;
    `;

    modal.innerHTML = `
        <div style="
            background: #121212; border: 2px solid #9d00ff; border-radius: 12px;
            padding: 25px; width: 90%; max-width: 600px; max-height: 85vh;
            display: flex; flex-direction: column; box-shadow: 0 10px 40px rgba(0,0,0,0.9);
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h2 style="margin: 0; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 1px; color: #ff007f;">Kandi Preset Library</h2>
                <button id="close-presets-modal-btn" style="background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer;">✕</button>
            </div>
            
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <input type="text" id="preset-search-input" placeholder="Search patterns by name or description..." style="
                    flex: 1; padding: 10px; background: #1a1a1a; color: white; border: 1px solid #444; border-radius: 6px; font-size: 0.9rem;
                ">
                <select id="preset-sort-select" style="
                    padding: 10px; background: #1a1a1a; color: white; border: 1px solid #444; border-radius: 6px; font-size: 0.9rem;
                ">
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="beads-desc">Beads (Longest first)</option>
                    <option value="beads-asc">Beads (Shortest first)</option>
                </select>
            </div>

            <div id="presets-list-container" style="
                flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding-right: 5px;
            ">
                <!-- Dynamically populated preset items -->
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Event Listeners for Modal Open/Close
    document.getElementById('open-presets-modal-btn').addEventListener('click', () => {
        modal.style.display = 'flex';
        renderPresetList();
    });

    document.getElementById('close-presets-modal-btn').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    const searchInput = document.getElementById('preset-search-input');
    const sortSelect = document.getElementById('preset-sort-select');

    searchInput.addEventListener('input', () => renderPresetList());
    sortSelect.addEventListener('change', () => renderPresetList());

    function renderPresetList() {
        const container = document.getElementById('presets-list-container');
        const query = searchInput.value.toLowerCase().trim();
        const sortBy = sortSelect.value;

        // Filter patterns
        let filtered = PRESET_PATTERNS.filter(p => 
            p.name.toLowerCase().includes(query) || 
            (p.description && p.description.toLowerCase().includes(query))
        );

        // Sort patterns
        filtered.sort((a, b) => {
            if (sortBy === 'name-asc') {
                return a.name.localeCompare(b.name);
            } else if (sortBy === 'beads-desc') {
                return b.beads.length - a.beads.length;
            } else if (sortBy === 'beads-asc') {
                return a.beads.length - b.beads.length;
            }
            return 0;
        });

        if (filtered.length === 0) {
            container.innerHTML = `<p style="text-align: center; color: #888; padding: 20px;">No matching Kandi patterns found!</p>`;
            return;
        }

        container.innerHTML = filtered.map(preset => `
            <div style="
                background: #1e1e1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
                padding: 12px 15px; display: flex; justify-content: space-between; align-items: center; gap: 15px;
            ">
                <div style="flex: 1; min-width: 0;">
                    <h4 style="margin: 0 0 4px 0; color: #39ff14; font-size: 0.95rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${preset.name}</h4>
                    <p style="margin: 0; font-size: 0.75rem; color: #aaa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${preset.description || 'Custom Kandi pattern design.'}</p>
                    <span style="display: inline-block; margin-top: 4px; font-size: 0.7rem; color: #ff007f; background: rgba(255,0,127,0.15); padding: 2px 6px; border-radius: 4px;">${preset.beads.length} beads</span>
                </div>
                <button class="load-specific-preset-btn" data-preset-id="${preset.id}" style="
                    background: linear-gradient(135deg, #ff007f, #9d00ff); color: white; border: none;
                    padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 0.85rem; flex-shrink: 0;
                ">Load</button>
            </div>
        `).join('');

        // Attach event listeners to individual load buttons
        container.querySelectorAll('.load-specific-preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const presetId = e.target.getAttribute('data-preset-id');
                const preset = PRESET_PATTERNS.find(p => p.id === presetId);
                if (!preset) return;

                const mappedBeads = preset.beads.map((b, idx) => ({
                    instanceId: Date.now() + idx,
                    beadId: b.beadId,
                    color: b.color || '#ff007f',
                    text: b.text || ''
                }));

                setPresetBeads(mappedBeads);
                modal.style.display = 'none';
                alert(`Loaded "${preset.name}" successfully!`);

                if (typeof renderBraceletCallback === 'function') {
                    renderBraceletCallback();
                }
            });
        });
    }
}
