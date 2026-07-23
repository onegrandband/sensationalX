// js/economy.js
import { STORAGE_KEYS } from './config.js';

export const economyState = {
    money: parseInt(localStorage.getItem('kandi_maker_money')) || 100
};

export function loadEconomy() {
    const saved = localStorage.getItem('kandi_maker_money');
    if (saved !== null) {
        economyState.money = parseInt(saved, 10);
    }
    dispatchUpdate();
}

function saveEconomy() {
    localStorage.setItem('kandi_maker_money', economyState.money);
    dispatchUpdate();
}

function dispatchUpdate() {
    window.dispatchEvent(new CustomEvent('economy-updated', { detail: { money: economyState.money } }));
}

export function earnMoney(amount) {
    economyState.money += amount;
    saveEconomy();
}

export function spendMoney(amount) {
    if (economyState.money >= amount) {
        economyState.money -= amount;
        saveEconomy();
        return true;
    }
    return false;
}
