// js/stringCustomizerUI.js
import { stringSettings, setStringColor, setStringThickness, setStringStyle, applyStringStyles } from './stringCustomizer.js';

export function initializeStringCustomizerUI() {
    // Apply initial styles to any existing string elements
    document.querySelectorAll('.string').forEach(el => applyStringStyles(el));

    const slot = document.getElementById('control-panel-slot') || document.querySelector('.controls');
    if (!slot) return;

    if (document.getElementById('string-customizer-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'string-customizer-panel';
    panel.style.cssText = 'background: rgba(255, 255, 255, 0.05); padding: 18px; border-radius: 12px; margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.1); text-align: left;';
    
    panel.innerHTML = `
        <h3 style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 0; margin-bottom: 12px; color: #aaa;">String Customizer</h3>
        <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
            <div>
                <label style="font-size: 0.8rem; color: #ccc; display: block; margin-bottom: 4px;">Color</label>
                <input type="color" id="string-color-picker" value="#ffffff" style="width: 40px; height: 35px; border: none; background: none; cursor: pointer; border-radius: 6px;">
            </div>
            <div style="flex: 1; min-width: 130px;">
                <label style="font-size: 0.8rem; color: #ccc; display: block; margin-bottom: 4px;">Thickness (<span id="thickness-val">4</span>px)</label>
                <input type="range" id="string-thickness-range" min="1" max="12" value="4" style="width: 100%; cursor: pointer;">
            </div>
            <div>
                <label style="font-size: 0.8rem; color: #ccc; display: block; margin-bottom: 4px;">Style</label>
                <select id="string-style-select" style="background: #161616; color: white; border: 1px solid #333; padding: 8px; border-radius: 6px; outline: none; cursor: pointer;">
                    <option value="solid">Solid</option>
                    <option value="neon-glow">Neon Glow ✨</option>
                </select>
            </div>
        </div>
    `;

    slot.appendChild(panel);

    document.getElementById('string-color-picker').addEventListener('input', (e) => {
        setStringColor(e.target.value);
    });

    document.getElementById('string-thickness-range').addEventListener('input', (e) => {
        const val = e.target.value;
        document.getElementById('thickness-val').textContent = val;
        setStringThickness(Number(val));
    });

    document.getElementById('string-style-select').addEventListener('change', (e) => {
        setStringStyle(e.target.value);
    });
}
