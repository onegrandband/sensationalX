if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sc/sw.js').then(reg => {
            console.log('Offline Caching Active', reg.scope);
        }).catch(err => {
            console.log('Service Worker setup paused:', err);
        });
    });
}

function updateThemeIcon() {
    const isDark = document.documentElement.classList.contains('dark');
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
        if (window.lucide) lucide.createIcons();
    }
}

function toggleTheme() {
    const htmlEl = document.documentElement;
    htmlEl.classList.toggle('dark');
    const isDark = htmlEl.classList.contains('dark');
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
    if (localStorage.getItem('isHuman') !== 'true') {
        const box = document.getElementById('hcaptcha-box');
        if (box) {
            box.innerHTML = ''; 
            renderCaptcha();
        }
    }
}

document.addEventListener("DOMContentLoaded", updateThemeIcon);

function renderCaptcha() {
    if (localStorage.getItem('isHuman') === 'true') return;
    const isDark = document.documentElement.classList.contains('dark');
    const hcaptchaKeys = [
        "700ad886-6702-41f8-b838-b40ad9a03238", 
        "4448ac7c-b31a-4f32-b800-0a0246a6df44"
    ];
    const randomKey = hcaptchaKeys[Math.floor(Math.random() * hcaptchaKeys.length)];
    
    if (typeof hcaptcha !== 'undefined' && document.getElementById('hcaptcha-box')) {
        hcaptcha.render('hcaptcha-box', { 
            sitekey: randomKey,
            theme: isDark ? 'dark' : 'light',
            callback: function(token) {
                localStorage.setItem('isHuman', 'true');
                unlockGate();
            }
        });
    }
}

function hcaptchaLoaded() {
    if (localStorage.getItem('isHuman') === 'true') {
        const gate = document.getElementById('captchaGate') || document.getElementById('site-gate-overlay');
        if (gate) {
            gate.style.setProperty('display', 'none', 'important');
        }
    } else {
        renderCaptcha();
    }
}

function unlockGate() {
    const gate = document.getElementById('captchaGate') || document.getElementById('site-gate-overlay');
    if (gate) {
        gate.classList.add('opacity-0', 'pointer-events-none', 'site-gate-hidden');
        setTimeout(() => { gate.style.setProperty('display', 'none', 'important'); }, 700);
    }
}

function handleTextSizeChange(event) {
    const scaleFactor = event.target.value;
    document.documentElement.style.fontSize = `${scaleFactor * 100}%`;
}

function toggleReaderMode() {
    document.body.classList.toggle('reader-mode');
}
