// script7.js - Prestige & Rebirth System :3

let prestigeState = {
    level: 0,
    multiplier: 1 // Starts at 1x
};

function calculatePrestigeGain() {
    // You get 0.1x multiplier for every 10,000 lifetime gems
    // We will access lifetimeGems from script8 via the global scope soon!
    const lifetime = (typeof gameStats !== 'undefined') ? gameStats.lifetimeGems : 0;
    const bonus = Math.floor(lifetime / 10000) * 0.1;
    return bonus;
}

function renderPrestige() {
    const container = document.getElementById('prestige-info');
    const potentialGain = calculatePrestigeGain();
    
    container.innerHTML = `
        <div class="shop-item">
            <div class="shop-item-info">
                <h4>Current Multiplier: x${prestigeState.multiplier.toFixed(1)}</h4>
                <p>Prestige Level: ${prestigeState.level}</p>
                <p style="color:#2ecc71; margin-top:10px;">Prestige now to add <b>+${potentialGain.toFixed(1)}x</b> to your multiplier!</p>
            </div>
        </div>
        <button class="buy-btn" style="width:100%; padding:15px; font-size:1.2rem; background:#8e44ad;" onclick="doPrestige()">PRESTIGE NOW</button>
    `;
    
    // Show multiplier on main screen if > 1
    const multDisplay = document.getElementById('prestige-multiplier-display');
    if (prestigeState.multiplier > 1) {
        multDisplay.style.display = 'block';
        document.getElementById('mult-count').innerText = prestigeState.multiplier.toFixed(1);
    }
}

function doPrestige() {
    const gain = calculatePrestigeGain();
    if (gain < 0.1) {
        alert("You haven't earned enough gems in this lifetime to prestige! (Need at least 10,000 lifetime gems)");
        return;
    }
    
    if(confirm("Are you sure? You will lose all current Gems and Upgrades, but gain a permanent multiplier! (Skins and Trophies are kept)")) {
        prestigeState.multiplier += gain;
        prestigeState.level++;
        
        // Hard Reset Game State
        gameState.gems = 0;
        gameState.gemsPerClick = 1 * prestigeState.multiplier;
        gameState.gemsPerSecond = 0;
        
        // Reset Upgrades
        upgradesData.forEach(upg => {
            upg.count = 0;
            upg.cost = upg.baseCost;
        });
        
        updateDisplay();
        renderUpgrades();
        renderPrestige();
        showToast(`🌌 PRESTIGE! Multiplier is now x${prestigeState.multiplier.toFixed(1)}`);
    }
}

// Update prestige menu every second to show real-time potential gain
setInterval(renderPrestige, 1000);
