// script2.js - Upgrades System :3

const upgradesData = [
    { id: 'u1', name: 'Sharper Pickaxe', type: 'gpc', boost: 1, baseCost: 15, cost: 15, count: 0, desc: '+1 Gem Per Click' },
    { id: 'u2', name: 'Auto Miner', type: 'gps', boost: 1, baseCost: 50, cost: 50, count: 0, desc: '+1 Gem Per Second' },
    { id: 'u3', name: 'Gem Mine', type: 'gps', boost: 5, baseCost: 250, cost: 250, count: 0, desc: '+5 Gems Per Second' },
    { id: 'u4', name: 'Dwarf Blacksmith', type: 'gpc', boost: 10, baseCost: 1000, cost: 1000, count: 0, desc: '+10 Gems Per Click' },
    { id: 'u5', name: 'Diamond Drill', type: 'gps', boost: 25, baseCost: 3500, cost: 3500, count: 0, desc: '+25 Gems Per Second' }
];

const upgradesListEl = document.getElementById('upgrades-list');

function renderUpgrades() {
    upgradesListEl.innerHTML = ''; // Clear the loading text
    
    upgradesData.forEach((upgrade, index) => {
        const item = document.createElement('div');
        item.className = 'shop-item';
        
        item.innerHTML = `
            <div class="shop-item-info">
                <h4>${upgrade.name} (Owned: ${upgrade.count})</h4>
                <p>${upgrade.desc}</p>
                <p>Cost: <span style="color:#e94560; font-weight:bold;">${Math.floor(upgrade.cost)}</span> Gems</p>
            </div>
            <button class="buy-btn" id="buy-${upgrade.id}" onclick="buyUpgrade(${index})">Buy</button>
        `;
        
        upgradesListEl.appendChild(item);
    });
}

function buyUpgrade(index) {
    const upgrade = upgradesData[index];
    
    // Check if we have enough gems
    if (gameState.gems >= upgrade.cost) {
        // Deduct gems
        gameState.gems -= upgrade.cost;
        
        // Apply the boost
        if (upgrade.type === 'gpc') {
            gameState.gemsPerClick += upgrade.boost;
        } else if (upgrade.type === 'gps') {
            gameState.gemsPerSecond += upgrade.boost;
        }
        
        // Increase the cost by 15% and increment count
        upgrade.count++;
        upgrade.cost = upgrade.baseCost * Math.pow(1.15, upgrade.count);
        
        // Update screen
        updateDisplay();
        renderUpgrades();
    } else {
        alert("Not enough gems! Keep clicking! :3");
    }
}

// Initial render
renderUpgrades();
