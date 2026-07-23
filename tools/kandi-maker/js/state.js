// js/state.js
import { beadCatalog } from './beads.js';

export const braceletData = {
    beads: [],
    selectedBeadId: beadCatalog[0].id, // Default to first bead in the catalog
    selectedColor: '#ff007f',         // Default hot pink color
    selectedText: 'K'                 // Default letter for alphabet beads
};

/**
 * Adds a new bead instance to the bracelet based on current selections
 */
export function addBead() {
    braceletData.beads.push({
        instanceId: Date.now() + Math.random(), // Unique ID for each placed bead
        beadId: braceletData.selectedBeadId,
        color: braceletData.selectedColor,
        text: braceletData.selectedText
    });
}

/**
 * Removes the last bead from the string
 */
export function removeLastBead() {
    braceletData.beads.pop();
}

/**
 * Clears all beads from the string
 */
export function clearBracelet() {
    braceletData.beads = [];
}

/**
 * Updates the currently selected bead template ID
 * @param {string} id 
 */
export function setSelectedBead(id) {
    braceletData.selectedBeadId = id;
}

/**
 * Updates the active color for colored beads
 * @param {string} color 
 */
export function setSelectedColor(color) {
    braceletData.selectedColor = color;
}

/**
 * Updates the active text character for letter beads
 * @param {string} text 
 */
export function setSelectedText(text) {
    braceletData.selectedText = text;
}
