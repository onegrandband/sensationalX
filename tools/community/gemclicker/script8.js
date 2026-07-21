// script8.js - Game Stats & Master Hook :3

let gameStats = {
    totalClicks: 0,
    lifetimeGems: 0,
    timePlayedSeconds: 0
};

// We need to hook into the original clickGem function from script1 to track clicks
const originalClickGem = clickGem; 
window.clickGem = function(event) { // Override it globally
    // Do the original click stuff
    const originalGems = gameState.gems;
    
    // Apply prestige multiplier to base click
    const actualClickPower = gameState.gemsPerClick * prestigeState.multiplier;
    gameState.gems += actualClickPower;
    
    // Stat Tracking
    gameStats.totalClicks++;
    gameStats.lifetimeGems += actualClickPower;
    
    updateDisplay();
    createFloatingText(event || window.event, `+${actualClickPower.toFixed(1)}`);
    
    // Check achievements
    if (typeof checkAchievements === 'function') {
        checkAchievements(gameStats, gameState.gems, gameState.gemsPerSecond);
    }
};

// Hook into game loop to track lifetime idle gems and time
setInterval(() => {
    const idleGain = (gameState.gemsPerSecond * prestigeState.multiplier) / 10;
    // We already add it in script1, but we need to track lifetime stats here
    gameStats.lifetimeGems += idleGain;
    
    // Achievements check
    if (typeof checkAchievements === 'function') {
        checkAchievements(gameStats, gameState.gems, gameState.gemsPerSecond * prestigeState.multiplier);
    }
}, 100);

// Timer for play time
setInterval(() => {
    gameStats.timePlayedSeconds++;
    renderStats();
}, 1000);

function renderStats() {
    const statsList = document.getElementById('stats-list');
    
    // Format time
    const hours = Math.floor(gameStats.timePlayedSeconds / 3600);
    const minutes = Math.floor((gameStats.timePlayedSeconds % 3600) / 60);
    const seconds = gameStats.timePlayedSeconds % 60;
    
    statsList.innerHTML = `
        <div class="shop-item"><div class="shop-item-info">
            <h4>Total Clicks</h4><p>${gameStats.totalClicks}</p>
        </div></div>
        <div class="shop-item"><div class="shop-item-info">
            <h4>Lifetime Gems Earned</h4><p>${Math.floor(gameStats.lifetimeGems)}</p>
        </div></div>
        <div class="shop-item"><div class="shop-item-info">
            <h4>Time Played</h4><p>${hours}h ${minutes}m ${seconds}s</p>
        </div></div>
    `;
}

// Master Save Interceptor (Hooks into script4's save)
const originalSaveGame = window.saveGame;
window.saveGame = function() {
    originalSaveGame(); // Do original save
    
    // Save new data
    const expansionData = {
        stats: gameStats,
        prestige: prestigeState,
        achieves: achievements
    };
    localStorage.setItem('gemClickerExpansion', JSON.stringify(expansionData));
};

// Master Load Interceptor
const originalLoadGame = window.loadGame;
window.loadGame = function() {
    originalLoadGame(); // Do original load
    
    const savedExp = localStorage.getItem('gemClickerExpansion');
    if (savedExp) {
        const data = JSON.parse(savedExp);
        Object.assign(gameStats, data.stats);
        Object.assign(prestigeState, data.prestige);
        
        // Carefully load achievements so we don't overwrite new ones added in updates
        data.achieves.forEach(savedAch => {
            const match = achievements.find(a => a.id === savedAch.id);
            if (match) match.unlocked = savedAch.unlocked;
        });
    }
    
    renderStats();
    renderPrestige();
    renderAchievements();
};

// Trigger Initial renders
window.onload = () => {
    if (window.loadGame) window.loadGame();
};
