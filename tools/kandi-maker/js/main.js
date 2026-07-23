// js/main.js
import { initializeUI } from './ui.js';
import { initializeEconomyAndShopUI } from './shopUI.js';
import { initializeZoomAndScroll } from './zoomPan.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Loading Kandi Maker...");
    initializeUI();
    initializeEconomyAndShopUI();
    initializeZoomAndScroll(document.querySelector('.bracelet-container'));
});
