// script6.js - Achievements System :3

const achievements = [
    { id: 'a1', name: 'First Blood', desc: 'Click the gem 1 time.', target: 1, type: 'clicks', unlocked: false },
    { id: 'a2', name: 'Clicker Novice', desc: 'Click the gem 100 times.', target: 100, type: 'clicks', unlocked: false },
    { id: 'a3', name: 'Gem Hoarder', desc: 'Accumulate 1,000 gems.', target: 1000, type: 'gems', unlocked: false },
    { id: 'a4', name: 'Capitalist', desc: 'Reach 50 Gems Per Second.', target: 50, type: 'gps', unlocked: false },
    { id: 'a5', name: 'Carpal Tunnel', desc: 'Click the gem 1,000 times.', target: 1000, type: 'clicks', unlocked: false }
];

function checkAchievements(statsData, currentGems, currentGps) {
    achievements.forEach(ach => {
        if (!ach.unlocked) {
            let conditionMet = false;
            if (ach.type === 'clicks' && statsData.totalClicks >= ach.target) conditionMet = true;
            if (ach.type === 'gems' && statsData.lifetimeGems >= ach.target) conditionMet = true;
            if (ach.type === 'gps' && currentGps >= ach.target) conditionMet = true;
            
            if (conditionMet) {
                ach.unlocked = true;
                showToast(`🏆 Achievement Unlocked: ${ach.name}!`);
                renderAchievements();
            }
        }
    });
}

function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    toastContainer.appendChild(toast);
    
    // Cleanup DOM after animation finishes
    setTimeout(() => toast.remove(), 4000);
}

function renderAchievements() {
    const list = document.getElementById('achievements-list');
    list.innerHTML = '';
    
    achievements.forEach(ach => {
        const item = document.createElement('div');
        item.className = 'shop-item';
        item.style.opacity = ach.unlocked ? '1' : '0.5';
        item.style.borderColor = ach.unlocked ? '#f1c40f' : 'var(--border)';
        
        item.innerHTML = `
            <div class="shop-item-info">
                <h4 style="color: ${ach.unlocked ? '#f1c40f' : 'var(--text-main)'}">${ach.name}</h4>
                <p>${ach.desc}</p>
            </div>
            <div style="font-size:1.5rem;">${ach.unlocked ? '🏆' : '🔒'}</div>
        `;
        list.appendChild(item);
    });
}

// Initial render
renderAchievements();
