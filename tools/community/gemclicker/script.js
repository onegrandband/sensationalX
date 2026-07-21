// script.js - Core Game Logic

// Core Game Variables
let gameState = {
    gems: 0,
    gemsPerClick: 1,
    gemsPerSecond: 0,
};

// DOM Elements
const gemElement = document.getElementById('main-gem');
const gemCountElement = document.getElementById('gem-count');
const gpsCountElement = document.getElementById('gps-count');

// Basic Click Function
function clickGem() {
    gameState.gems += gameState.gemsPerClick;
    updateDisplay();
    
    // Create a little visual pop effect (optional but fun!)
    createFloatingText(event, `+${gameState.gemsPerClick}`);
}

// Game Loop (Handles Gems Per Second)
function gameLoop() {
    gameState.gems += (gameState.gemsPerSecond / 10); // Divides by 10 because it runs every 100ms
    updateDisplay();
}

// Update the screen numbers
function updateDisplay() {
    // Math.floor prevents long decimals from showing up
    gemCountElement.innerText = Math.floor(gameState.gems);
    gpsCountElement.innerText = gameState.gemsPerSecond.toFixed(1);
}

// Visual Effect: Floating numbers when you click
function createFloatingText(e, text) {
    const floater = document.createElement('div');
    floater.innerText = text;
    floater.style.position = 'absolute';
    floater.style.color = '#fff';
    floater.style.fontWeight = 'bold';
    floater.style.pointerEvents = 'none';
    
    // Get mouse position
    floater.style.left = e.clientX + 'px';
    floater.style.top = e.clientY + 'px';
    
    // Add simple animation styles dynamically
    floater.style.transition = 'all 1s ease-out';
    
    document.body.appendChild(floater);
    
    // Animate it floating up and fading out
    setTimeout(() => {
        floater.style.top = (e.clientY - 50) + 'px';
        floater.style.opacity = '0';
    }, 10);
    
    // Remove it from the HTML after animation finishes
    setTimeout(() => {
        floater.remove();
    }, 1000);
}

// --- TAB SWITCHING LOGIC ---
const tabUpgrades = document.getElementById('tab-upgrades');
const tabSkins = document.getElementById('tab-skins');
const shopUpgrades = document.getElementById('shop-upgrades');
const shopSkins = document.getElementById('shop-skins');

tabUpgrades.addEventListener('click', () => {
    tabUpgrades.classList.add('active');
    tabSkins.classList.remove('active');
    shopUpgrades.classList.add('active');
    shopSkins.classList.remove('active');
});

tabSkins.addEventListener('click', () => {
    tabSkins.classList.add('active');
    tabUpgrades.classList.remove('active');
    shopSkins.classList.add('active');
    shopUpgrades.classList.remove('active');
});

// Event Listeners
gemElement.addEventListener('click', clickGem);

// Start the game loop (runs 10 times a second for smooth generation)
setInterval(gameLoop, 100);

// Initialize display
updateDisplay();
