// js/state.js

export const braceletData = {
    beads: [],
    selectedBeadId: 'classic-barrel',
    selectedColor: '#ff007f',
    selectedText: 'A'
};

// 🌟 NEW: The Inventory System
export const inventory = {
    'classic-barrel': 50,
    'letter-cube': 50,
    'trans-heart': 0, // Starts at 0, bought in store
    'trans-star': 0   // Starts at 0, bought in store
};

export function getInventoryCount(beadId) {
    return inventory[beadId] || 0;
}

export function addBead() {
    const beadId = braceletData.selectedBeadId;
    
    // Check if we have enough in inventory
    if (getInventoryCount(beadId) > 0) {
        braceletData.beads.push({
            beadId: beadId,
            color: braceletData.selectedColor,
            text: braceletData.selectedText
        });
        inventory[beadId] -= 1; // Deduct 1 from inventory
        return true; // Success
    } else {
        alert("You are out of this bead! Buy more in the Craft Store.");
        return false; // Failed
    }
}

export function removeLastBead() {
    if (braceletData.beads.length > 0) {
        const removedBead = braceletData.beads.pop();
        inventory[removedBead.beadId] += 1; // Give it back to inventory
        return true;
    }
    return false;
}

export function clearBracelet() {
    // Refund all beads back to inventory before clearing
    braceletData.beads.forEach(bead => {
        inventory[bead.beadId] += 1;
    });
    braceletData.beads = [];
}

export function setSelectedBead(id) { braceletData.selectedBeadId = id; }
export function setSelectedColor(color) { braceletData.selectedColor = color; }
export function setSelectedText(text) { braceletData.selectedText = text; }
