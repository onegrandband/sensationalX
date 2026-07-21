// script3.js - Skins System :3

const skinsData = [
    { id: 's1', name: 'Ruby', color: '#e94560', cost: 0, owned: true, equipped: true },
    { id: 's2', name: 'Sapphire', color: '#3498db', cost: 1000, owned: false, equipped: false },
    { id: 's3', name: 'Emerald', color: '#2ecc71', cost: 5000, owned: false, equipped: false },
    { id: 's4', name: 'Amethyst', color: '#9b59b6', cost: 25000, owned: false, equipped: false },
    { id: 's5', name: 'Gold', color: '#f1c40f', cost: 100000, owned: false, equipped: false }
];

const skinsListEl = document.getElementById('skins-list');

function renderSkins() {
    skinsListEl.innerHTML = ''; 
    
    skinsData.forEach((skin, index) => {
        const item = document.createElement('div');
        item.className = 'shop-item';
        
        // Determine button state
        let btnHTML = '';
        if (skin.equipped) {
            btnHTML = `<button class="buy-btn" style="background:#555;" disabled>Equipped</button>`;
        } else if (skin.owned) {
            btnHTML = `<button class="equip-btn" onclick="equipSkin(${index})">Equip</button>`;
        } else {
            btnHTML = `<button class="buy-btn" onclick="buySkin(${index})">Buy: ${skin.cost}</button>`;
        }
        
        item.innerHTML = `
            <div class="shop-item-info">
                <h4 style="color:${skin.color}">${skin.name} Gem</h4>
            </div>
            ${btnHTML}
        `;
        
        skinsListEl.appendChild(item);
    });
}

function buySkin(index) {
    const skin = skinsData[index];
    if (gameState.gems >= skin.cost) {
        gameState.gems -= skin.cost;
        skin.owned = true;
        updateDisplay();
        equipSkin(index); // Auto-equip on buy
    } else {
        alert("Not enough gems for this skin!");
    }
}

function equipSkin(index) {
    // Unequip all
    skinsData.forEach(s => s.equipped = false);
    
    // Equip selected
    skinsData[index].equipped = true;
    
    // Change the visual color of the gem in the DOM
    document.getElementById('main-gem').style.backgroundColor = skinsData[index].color;
    
    renderSkins();
}

// Initial render
renderSkins();
