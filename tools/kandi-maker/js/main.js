// js/main.js
import { initializeUI } from './ui.js';
import { initializeEconomyAndShopUI } from './shopUI.js';
import { initializePresetsUI } from './presetsUI.js';
import { initializeZoomAndScroll } from './zoomPan.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Kandi Maker Fully Initializing...");
    
    // Initialize standard controls and display renderer
    initializeUI();
    
    // Initialize economy, shop, and zoom features
    initializeEconomyAndShopUI();
    initializeZoomAndScroll(document.querySelector('.bracelet-container'));
    
    // Pass a re-render trigger to the presets UI
    // (Ensure renderBracelet is exported from ui.js if needed, or trigger click)
});
