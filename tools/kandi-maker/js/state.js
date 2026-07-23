// js/state.js
import { STORAGE_KEYS } from './config.js';

// Load saved bracelet or default to empty
const savedBracelet = localStorage.getItem(STORAGE_KEYS.SAVED_BRACELET);

export const braceletData = savedBracelet ? JSON.parse(savedBracelet) : {
    beads: [],
    selectedBeadId: 'p_op_red',
    selectedColor: '#ff007f',
    selectedText: 'K'
};

function saveState() {
    localStorage.setItem(STORAGE_KEYS.SAVED_BRACELET, JSON.stringify(braceletData));
}

export function addBead(beadId = braceletData.selectedBeadId, color = braceletData.selectedColor, text = braceletData.selectedText) {
    braceletData.beads.push({ beadId, color, text });
    saveState();
}

export function removeLastBead() {
    braceletData.beads.pop();
    saveState();
}

export function clearBracelet() {
    braceletData.beads = [];
    saveState();
}

export function setPresetBeads(beadsArray) {
    braceletData.beads = beadsArray;
    saveState();
}

export function setSelectedBead(id) {
    braceletData.selectedBeadId = id;
    saveState();
}

export function setSelectedColor(color) {
    braceletData.selectedColor = color;
    saveState();
}

export function setSelectedText(text) {
    braceletData.selectedText = text;
    saveState();
}
