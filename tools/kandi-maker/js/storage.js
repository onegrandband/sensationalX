// js/storage.js
import { STORAGE_KEYS } from './config.js';

/**
 * Saves the current bracelet data state to browser localStorage
 * @param {Object} braceletData 
 */
export function saveBracelet(braceletData) {
    try {
        const serialized = JSON.stringify(braceletData);
        localStorage.setItem(STORAGE_KEYS.SAVED_BRACELET, serialized);
        return true;
    } catch (e) {
        console.error('Failed to save bracelet to localStorage:', e);
        return false;
    }
}

/**
 * Loads the saved bracelet data state from browser localStorage
 * @returns {Object|null} The saved bracelet object or null if none exists
 */
export function loadBracelet() {
    try {
        const serialized = localStorage.getItem(STORAGE_KEYS.SAVED_BRACELET);
        if (!serialized) return null;
        return JSON.parse(serialized);
    } catch (e) {
        console.error('Failed to load bracelet from localStorage:', e);
        return null;
    }
}

/**
 * Clears the saved bracelet storage entry
 */
export function clearSavedBracelet() {
    try {
        localStorage.removeItem(STORAGE_KEYS.SAVED_BRACELET);
        return true;
    } catch (e) {
        console.error('Failed to clear saved bracelet storage:', e);
        return false;
    }
}
