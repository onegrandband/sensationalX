// js/state.js
export const braceletData = {
    beads: [],
    selectedColor: '#ff007f' // Default hot pink
};

export function addBead() {
    braceletData.beads.push({ 
        id: Date.now(), 
        color: braceletData.selectedColor 
    });
}

export function removeLastBead() {
    braceletData.beads.pop();
}

export function clearBracelet() {
    braceletData.beads = [];
}

export function setColor(color) {
    braceletData.selectedColor = color;
}
