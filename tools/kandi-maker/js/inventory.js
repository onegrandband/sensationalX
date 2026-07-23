// js/inventory.js
import { STORAGE_KEYS } from './config.js';

export const inventoryState = {
    beadCounts: {
        'p_op_red': 50,
        'p_op_blue': 50,
        'p_op_black': 50,
        'p_op_white': 50,
        'l_cube_wb': 30
    }
};

export function loadInventory() {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES + '_inventory');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            inventoryState.beadCounts = parsed.beadCounts || inventoryState.beadCounts;
        } catch (e) {
            console.error('Failed to load inventory', e);
        }
    }
}

export function saveInventory() {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES + '_inventory', JSON.stringify(inventoryState));
}

export function hasBead(beadId, amount = 1) {
    return (inventoryState.beadCounts[beadId] || 0) >= amount;
}

export function consumeBead(beadId) {
    if (inventoryState.beadCounts[beadId] > 0) {
        inventoryState.beadCounts[beadId]--;
        saveInventory();
        window.dispatchEvent(new CustomEvent('inventory-updated', { detail: inventoryState.beadCounts }));
        return true;
    }
    return false;
}

export function addToBeadStock(beadId, amount) {
    if (!inventoryState.beadCounts[beadId]) {
        inventoryState.beadCounts[beadId] = 0;
    }
    inventoryState.beadCounts[beadId] += amount;
    saveInventory();
    window.dispatchEvent(new CustomEvent('inventory-updated', { detail: inventoryState.beadCounts }));
}
