// script5.js - Theme Customizer :3

let currentTheme = 'dark'; // default

function setTheme(themeName) {
    currentTheme = themeName;
    document.body.className = ''; // reset classes
    
    if (themeName === 'light') {
        document.body.classList.add('light-mode');
    } else if (themeName === 'neon') {
        document.body.classList.add('neon-mode');
    }
    
    // Save preference
    localStorage.setItem('gemClickerTheme', themeName);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('gemClickerTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
}

// Load theme on startup
loadTheme();

// Hook up the new tabs to the menu logic
const allTabs = document.querySelectorAll('.tab-btn');
const allPanels = document.querySelectorAll('.shop-panel');

allTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all
        allTabs.forEach(t => t.classList.remove('active'));
        allPanels.forEach(p => p.classList.remove('active'));
        
        // Add active to clicked tab
        tab.classList.add('active');
        const panelId = tab.id.replace('tab-', 'shop-');
        document.getElementById(panelId).classList.add('active');
    });
});
