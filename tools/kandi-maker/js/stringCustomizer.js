// js/stringCustomizer.js

export const stringSettings = {
    color: 'rgba(255, 255, 255, 0.3)',
    thickness: 4,
    style: 'solid'
};

export function applyStringStyles(stringElement) {
    if (!stringElement) return;
    stringElement.style.height = `${stringSettings.thickness}px`;
    stringElement.style.backgroundColor = stringSettings.color;
    
    if (stringSettings.style === 'neon-glow') {
        stringElement.style.boxShadow = `0 0 12px ${stringSettings.color}, 0 0 24px ${stringSettings.color}`;
    } else {
        stringElement.style.boxShadow = 'none';
    }
}

export function setStringColor(newColor) {
    stringSettings.color = newColor;
}

export function setStringThickness(newThickness) {
    stringSettings.thickness = newThickness;
}
