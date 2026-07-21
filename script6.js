window.internalAuthMode = 'signin';

function openAuthModal() {
    if (window.currentUserContext) {
        document.getElementById('settingsModal').classList.remove('hidden');
    } else {
        const emailInput = document.getElementById('authEmail');
        if (emailInput) {
            emailInput.disabled = false;
            emailInput.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        
        document.getElementById('authModal').classList.remove('hidden');
        
        if (window.internalAuthMode === 'reset') {
            toggleAuthMode();
        }
    }
    if (window.lucide) lucide.createIcons();
}

function closeAuthModal() {
    document.getElementById('authModal').classList.add('hidden');
}

function closeSettingsModal() {
    document.getElementById('settingsModal').classList.add('hidden');
}

function openResetFromSettings() {
    closeSettingsModal();
    document.getElementById('authModal').classList.remove('hidden');
    changeToResetMode();
    
    if (window.currentUserContext) {
        const emailInput = document.getElementById('authEmail');
        if (emailInput) {
            emailInput.value = window.currentUserContext.email;
            emailInput.disabled = true;
            emailInput.classList.add('opacity-50', 'cursor-not-allowed');
        }
    }
}

function changeToResetMode() {
    window.internalAuthMode = 'reset';
    document.getElementById('authModalTitle').textContent = 'Reset Password Forever';
    document.getElementById('usernameField').classList.add('hidden');
    document.getElementById('passwordField').classList.add('hidden');
    document.getElementById('optionalAuthLayers').classList.add('hidden');
    document.getElementById('socialAuthBlock').classList.add('hidden');
    
    document.getElementById('resetFieldsBlock').classList.remove('hidden');
    document.getElementById('authSubmitBtn').textContent = 'Confirm Changes';
    
    if (window.currentUserContext) {
        document.getElementById('authToggleBtn').classList.add('hidden');
        document.getElementById('authResetBtn').classList.add('hidden');
    } else {
        document.getElementById('authToggleBtn').classList.remove('hidden');
        document.getElementById('authToggleBtn').textContent = 'Return to Sign In';
        document.getElementById('authResetBtn').classList.add('hidden');
    }
}

function toggleAuthMode() {
    const title = document.getElementById('authModalTitle');
    const userField = document.getElementById('usernameField');
    const passField = document.getElementById('passwordField');
    const optionalLayers = document.getElementById('optionalAuthLayers');
    const socialBlock = document.getElementById('socialAuthBlock');
    const resetBlock = document.getElementById('resetFieldsBlock');
    const submitBtn = document.getElementById('authSubmitBtn');
    const toggleBtn = document.getElementById('authToggleBtn');
    const resetBtn = document.getElementById('authResetBtn');
    
    const emailInput = document.getElementById('authEmail');
    if (emailInput) {
        emailInput.disabled = false;
        emailInput.classList.remove('opacity-50', 'cursor-not-allowed');
    }
    
    if (window.internalAuthMode === 'signin' || window.internalAuthMode === 'reset') {
        window.internalAuthMode = 'signup';
        title.textContent = 'Sign Up';
        userField.classList.remove('hidden');
        passField.classList.remove('hidden');
        optionalLayers.classList.remove('hidden');
        socialBlock.classList.remove('hidden');
        resetBlock.classList.add('hidden');
        submitBtn.textContent = 'Sign Up';
        toggleBtn.classList.remove('hidden');
        toggleBtn.textContent = 'Already have an account? Sign In';
        resetBtn.classList.add('hidden');
    } else {
        window.internalAuthMode = 'signin';
        title.textContent = 'Sign In';
        userField.classList.add('hidden');
        passField.classList.remove('hidden');
        optionalLayers.classList.remove('hidden');
        socialBlock.classList.remove('hidden');
        resetBlock.classList.add('hidden');
        submitBtn.textContent = 'Sign In';
        toggleBtn.classList.remove('hidden');
        toggleBtn.textContent = "Don't have an account? Sign Up";
        resetBtn.classList.remove('hidden');
    }
}

function handleAuthSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const username = document.getElementById('authUsername').value;
    const optionalPayload = {
        passkey: document.getElementById('authPasskey').value,
        authenticator: document.getElementById('auth2FA').value,
        passcode: document.getElementById('authPasscode').value
    };
    window.firebaseAuthAction(window.internalAuthMode, email, password, username, optionalPayload);
}

function handleSettingsUpdate(e) {
    e.preventDefault();
    const newUsername = document.getElementById('settingsUsername').value;
    const newEmail = document.getElementById('settingsEmail').value;
    window.firebaseUpdateAccount(newUsername, newEmail);
}

const catalog = [
    { id: "cat-2", title: "Relaxed Afternoon", type: "single", genre: "Chill Out", coverLabel: "Single", tracks: [{ id: "t-2", title: "Relaxed Afternoon", genre: "Chill Out", bpm: "110 BPM", musicKey: "C Major", streamUrl: "https://files.catbox.moe/ndxt0a.wav" }] }
];
let state = { activeQueue: [], activeTrackIndex: 0, isPlaying: false, selectedAlbum: null };

const audio = document.getElementById('audioEngine');
const bottomPlayer = document.getElementById('bottomPlayer');
const albumModal = document.getElementById('albumModal');

function formatTime(t) {
    if (isNaN(t)) return "0:00";
    return `${Math.floor(t/60)}:${Math.floor(t%60).toString().padStart(2,"0")}`;
}

function handlePlayRequest(queueJSON, index) {
    const queue = JSON.parse(decodeURIComponent(queueJSON));
    const track = queue[index];
    if (!track || !track.streamUrl) { alert("Track asset unmapped!"); return; }

    const current = state.activeQueue[state.activeTrackIndex];
    if (current && current.id === track.id) {
        togglePlayback();
    } else {
        state.activeQueue = queue;
        state.activeTrackIndex = index;
        audio.src = track.streamUrl;
        audio.play();
        state.isPlaying = true;
    }
    updateUI();
}

function togglePlayback() {
    if (!state.activeQueue.length) return;
    state.isPlaying ? audio.pause() : audio.play();
    state.isPlaying = !state.isPlaying;
    updateUI();
}

function skipTime(amt) { audio.currentTime += amt; }

function skipTrack(dir) {
    const ni = state.activeTrackIndex + dir;
    if (ni >= 0 && ni < state.activeQueue.length && state.activeQueue[ni].streamUrl) {
        state.activeTrackIndex = ni;
        audio.src = state.activeQueue[ni].streamUrl;
        audio.play();
        state.isPlaying = true;
        updateUI();
    }
}

function handleSeek(e) { audio.currentTime = (e.target.value/100) * (audio.duration||0); }
function handleVolume(e) { audio.volume = e.target.value; }

function closeModal() { albumModal.classList.add('hidden'); state.selectedAlbum = null; }

if (audio) {
    audio.addEventListener('timeupdate', () => {
        const c = audio.currentTime||0, d = audio.duration||1;
        const progressSlider = document.getElementById('progressSlider');
        if (progressSlider) progressSlider.value = (c/d)*100;
        const timeDisplay = document.getElementById('currentTimeDisplay');
        if (timeDisplay) timeDisplay.textContent = formatTime(c);
    });
    audio.addEventListener('loadedmetadata', () => {
        const durationDisplay = document.getElementById('durationDisplay');
        if (durationDisplay) durationDisplay.textContent = formatTime(audio.duration||0);
    });
    audio.addEventListener('ended', () => skipTrack(1));
}

function renderCatalog() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    grid.innerHTML = '';
    catalog.forEach((item, i) => {
        const qs = encodeURIComponent(JSON.stringify(item.tracks));
        const btn = `<button onclick="handlePlayRequest('${qs}', 0)" class="flex h-16 w-16 items-center justify-center rounded-full bg-[#ff3366] text-white transition-transform hover:scale-105 shadow-lg"><i data-lucide="play" class="w-[26px] h-[26px] ml-1"></i></button>`;

        grid.innerHTML += `
            <article class="group overflow-hidden rounded-xl border border-gray-200 dark:border-[#2a2a2e] bg-white dark:bg-[#1c1c1f] shadow-sm hover:shadow-md transition-shadow duration-300">
                <div class="relative flex aspect-square items-center justify-center bg-gray-100 dark:bg-[#251124]">
                    <i data-lucide="music" class="text-[#ff3366]/70 w-14 h-14"></i>
                    <div class="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">${btn}</div>
                </div>
                <div class="p-5 text-left">
                    <h3 class="font-semibold text-lg text-gray-900 dark:text-white">${item.title}</h3>
                    <p class="text-xs text-[#ff3366] mt-1">${item.genre}</p>
                </div>
            </article>
        `;
    });
    if (window.lucide) lucide.createIcons();
}

function updateUI() {
    const act = state.activeQueue[state.activeTrackIndex];
    if (act && bottomPlayer) {
        bottomPlayer.classList.remove('translate-y-full');
        document.getElementById('playerTrackTitle').textContent = act.title;
        document.getElementById('playerTrackMeta').textContent = `${act.genre} • ${act.bpm}`;
        const pi = document.getElementById('playerPlayIcon');
        const visualizer = document.getElementById('visualizerContainer');
        if (pi && visualizer) {
            if (state.isPlaying) {
                pi.setAttribute('data-lucide', 'pause');
                pi.classList.remove('ml-0.5');
                visualizer.classList.replace('hidden', 'flex');
            } else {
                pi.setAttribute('data-lucide', 'play');
                pi.classList.add('ml-0.5');
                visualizer.classList.replace('flex', 'hidden');
            }
        }
    }
    if (window.lucide) lucide.createIcons();
}

window.addEventListener('DOMContentLoaded', renderCatalog);
