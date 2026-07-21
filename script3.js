tailwind.config = {
    darkMode: 'class',
}

if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

if (localStorage.getItem('isHuman') === 'true') {
    const gate = document.getElementById('captchaGate') || document.getElementById('site-gate-overlay');
    if (gate) {
        gate.style.setProperty('display', 'none', 'important');
    }
}
