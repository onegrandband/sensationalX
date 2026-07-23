// js/economy.js
import { STORAGE_KEYS } from './config.js';

export const economyState = {
    money: 100 // Starting cash for your first bead box trip
};

export function loadEconomy() {
    const saved = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES + '_money');
    if (saved !== null) {
        economyState.money = parseFloat(saved);
    }
}

export function saveEconomy() {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES + '_money', economyState.money.toString());
}

export function addMoney(amount) {
    economyState.money += amount;
    saveEconomy();
    window.dispatchEvent(new CustomEvent('economy-updated', { detail: { money: economyState.money } }));
}

export function spendMoney(amount) {
    if (economyState.money >= amount) {
        economyState.money -= amount;
        saveEconomy();
        window.dispatchEvent(new CustomEvent('economy-updated', { detail: { money: economyState.money } }));
        return true;
    }
    return false;
}
