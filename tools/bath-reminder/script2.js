// script2.js - Visual Enhancements & Extras! 🫧

let bubbleInterval = null;

window.addEventListener('DOMContentLoaded', () => {
    setupThemeToggle();
});

// --- 🌙 Dark Mode Toggle ---
function setupThemeToggle() {
    // Make sure you add <button id="btn-theme-toggle">Toggle Theme</button> to your HTML!
    const themeBtn = document.getElementById('btn-theme-toggle');
    if (!themeBtn) return; 

    // Load saved theme from local storage
    const savedTheme = localStorage.getItem('bath_timer_theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);

    themeBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('bath_timer_theme', newTheme);
    });
}

// --- 🫧 Bath Bubble Animation ---
// Call window.startBubbleEffect() inside triggerAlarmLoop() in script.js!
window.startBubbleEffect = function() {
    let bubbleContainer = document.getElementById('bubble-container');
    
    // Create the container if it doesn't exist yet
    if (!bubbleContainer) {
        bubbleContainer = document.createElement('div');
        bubbleContainer.id = 'bubble-container';
        bubbleContainer.style.position = 'fixed';
        bubbleContainer.style.bottom = '0';
        bubbleContainer.style.left = '0';
        bubbleContainer.style.width = '100%';
        bubbleContainer.style.height = '100%';
        bubbleContainer.style.pointerEvents = 'none'; // Lets you click through it
        bubbleContainer.style.overflow = 'hidden';
        bubbleContainer.style.zIndex = '9999';
        document.body.appendChild(bubbleContainer);
    }

    // Spawn a new bubble every 300ms
    bubbleInterval = setInterval(() => {
        const bubble = document.createElement('div');
        
        // Randomize bubble size and starting position
        const size = Math.random() * 40 + 10; // Between 10px and 50px
        const leftPos = Math.random() * 100; // 0% to 100% across the screen
        
        // Style the bubble
        bubble.style.position = 'absolute';
        bubble.style.bottom = '-50px';
        bubble.style.left = `${leftPos}%`;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;
        bubble.style.backgroundColor = 'rgba(173, 216, 230, 0.6)'; // Light blue
        bubble.style.border = '2px solid rgba(255, 255, 255, 0.8)';
        bubble.style.borderRadius = '50%';
        bubble.style.transition = 'bottom 4s ease-in, opacity 4s ease-out';
        
        bubbleContainer.appendChild(bubble);

        // Animate the bubble floating up
        setTimeout(() => {
            bubble.style.bottom = '120%'; // Float past the top of the screen
            bubble.style.opacity = '0';
        }, 50);

        // Remove the bubble from the DOM after it finishes floating
        setTimeout(() => {
            if (bubble.parentNode) bubble.remove();
        }, 4050);

    }, 300);
};

// --- 🛑 Stop the Bubbles ---
// Call window.stopBubbleEffect() inside stopAlarmLoop() in script.js!
window.stopBubbleEffect = function() {
    if (bubbleInterval) {
        clearInterval(bubbleInterval);
        bubbleInterval = null;
    }
    
    const bubbleContainer = document.getElementById('bubble-container');
    if (bubbleContainer) {
        bubbleContainer.innerHTML = ''; // Clear out remaining bubbles
    }
};
