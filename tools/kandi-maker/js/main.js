// js/main.js
import { initializeUI, renderBracelet } from './ui.js'; 
import { initializeEconomyAndShopUI } from './shopUI.js'; 
import { initializePresetsUI } from './presetsUI.js'; 
import { initializeZoomAndScroll } from './zoomPan.js'; 
import { initializeExportUI } from './exportUI.js'; 
import { checkFirstTimeUser } from './onboarding.js'; 
import { initializeStringCustomizerUI } from './stringCustomizerUI.js'; // Moved to top

checkFirstTimeUser();

document.addEventListener('DOMContentLoaded', () => {
    console.log("Kandi Maker Fully Initializing...");
    
    initializeUI();
    initializeEconomyAndShopUI();
    initializeZoomAndScroll(document.querySelector('.bracelet-container'));
    initializePresetsUI(renderBracelet);
    initializeExportUI(); 
    initializeStringCustomizerUI(); // Called safely inside the listener
});
