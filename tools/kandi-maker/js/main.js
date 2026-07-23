// js/main.js
import { initializeUI, renderBracelet } from './ui.js';
import { initializeEconomyAndShopUI } from './shopUI.js';
import { initializePresetsUI } from './presetsUI.js';
import { initializeZoomAndScroll } from './zoomPan.js';
import { checkFirstTimeUser } from './onboarding.js';

// Call this on app load
checkFirstTimeUser();

document.addEventListener('DOMContentLoaded', () => {
    console.log("Kandi Maker Fully Initializing...");
    
    // Initialize standard controls and display renderer
    initializeUI();
    
    // Initialize economy, shop, and zoom features
    initializeEconomyAndShopUI();
    initializeZoomAndScroll(document.querySelector('.bracelet-container'));
    
    // Initialize the preset patterns UI and pass the render callback
    initializePresetsUI(renderBracelet);
});
