// script4.js - Save and Load System :3

function saveGame() {
    const saveData = {
        gameState: gameState,
        upgradesData: upgradesData,
        skinsData: skinsData
    };
    localStorage.setItem('gemClickerSave', JSON.stringify(saveData));
    console.log("Game Saved! :3");
}

function loadGame() {
    const saveString = localStorage.getItem('gemClickerSave');
    if (saveString) {
        const saveData = JSON.parse(saveString);
        
        // Load Game State
        Object.assign(gameState, saveData.gameState);
        
        // Load Upgrades
        for (let i = 0; i < upgradesData.length; i++) {
            if (saveData.upgradesData[i]) {
                Object.assign(upgradesData[i], saveData.upgradesData[i]);
            }
        }
        
        // Load Skins
        for (let i = 0; i < skinsData.length; i++) {
            if (saveData.skinsData[i]) {
                Object.assign(skinsData[i], saveData.skinsData[i]);
                if (skinsData[i].equipped) {
                    document.getElementById('main-gem').style.backgroundColor = skinsData[i].color;
                }
            }
        }
        
        // Update UI
        updateDisplay();
        renderUpgrades();
        renderSkins();
        console.log("Game Loaded! :3");
    }
}

// Automatically save the game every 5 seconds
setInterval(saveGame, 5000);

// Load the game immediately when the script runs
window.onload = loadGame;
