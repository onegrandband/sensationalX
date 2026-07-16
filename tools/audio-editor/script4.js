// --- VIRTUAL KEYBOARD, BPM ENGINE & TIME-DELAY (script4.js) ---

// Inject the BPM Sync Delay & Virtual Piano UI
const rootContainer = document.querySelector('.container');
const finalSection = document.createElement('div');
finalSection.className = 'section';
finalSection.innerHTML = `
    <h3>7. Time-Sync Delay & Synth Keyboard</h3>
    
    <div class="grid-controls" style="margin-bottom: 15px;">
        <div class="slider-group">
            <label>Project Tempo: <span id="bpm-txt">120 BPM</span></label>
            <input type="range" id="bpm-slider" min="60" max="180" step="1" value="120">
        </div>

        <div class="slider-group">
            <label>Delay Time (Beat Sync): <span id="delay-sync-txt">1/4 Note</span></label>
            <select id="delay-division" style="background: #181824; color: #00f2fe; border: 1px solid #2d2d3f; padding: 6px; border-radius: 4px; font-weight: bold;">
                <option value="1">1/2 Note</option>
                <option value="0.5" selected>1/4 Note</option>
                <option value="0.25">1/8 Note</option>
                <option value="0.125">1/16 Note</option>
            </select>
        </div>

        <div class="slider-group">
            <label>Delay Feedback: <span id="delay-fb-txt">30%</span></label>
            <input type="range" id="delay-feedback" min="0" max="0.9" step="0.05" value="0.3">
        </div>

        <div class="slider-group">
            <label>Delay Wet Mix: <span id="delay-wet-txt">0%</span></label>
            <input type="range" id="delay-wet" min="0" max="0.8" step="0.05" value="0">
        </div>
    </div>

    <div class="piano-wrapper" style="margin-top: 15px;">
        <div id="piano-keyboard" style="display: flex; position: relative; background: #09090e; padding: 8px; border-radius: 8px; height: 110px; user-select: none;"></div>
    </div>
`;

// Insert it right above the MIDI section
const midiBox = document.querySelector('.midi-section');
rootContainer.insertBefore(finalSection, midiBox);

// Web Audio Delay Nodes
let delayNode, delayFeedbackNode, delayWetNode;
let currentBPM = 120;
let currentDivision = 0.5; // 1/4 note default

// Load LocalStorage Settings
function loadSavedDelaySettings() {
    if (localStorage.getItem('studio_bpm') !== null) {
        document.getElementById('bpm-slider').value = localStorage.getItem('studio_bpm');
        currentBPM = parseInt(localStorage.getItem('studio_bpm'));
    }
    if (localStorage.getItem('studio_delay_div') !== null) {
        document.getElementById('delay-division').value = localStorage.getItem('studio_delay_div');
        currentDivision = parseFloat(localStorage.getItem('studio_delay_div'));
    }
    if (localStorage.getItem('studio_delay_fb') !== null) {
        document.getElementById('delay-feedback').value = localStorage.getItem('studio_delay_fb');
    }
    if (localStorage.getItem('studio_delay_wet') !== null) {
        document.getElementById('delay-wet').value = localStorage.getItem('studio_delay_wet');
    }
}
loadSavedDelaySettings();

// Extend main Audio Engine initialization to include Delay Node FX
const delayInitAudioEngine = window.initAudioEngine;
window.initAudioEngine = function() {
    if (window.audioCtx) return;

    // Run upstream initializations
    delayInitAudioEngine();

    // Create delay system nodes
    delayNode = audioCtx.createDelay(5.0); // 5 seconds max delay buffer
    delayFeedbackNode = audioCtx.createGain();
    delayWetNode = audioCtx.createGain();

    // Connect feedback loop: Delay -> Feedback -> Delay
    delayNode.connect(delayFeedbackNode);
    delayFeedbackNode.connect(delayNode);

    // Route: masterGain -> Delay -> Delay Wet -> Compressor (from script3.js)
    masterGain.connect(delayNode);
    delayNode.connect(delayWetNode);
    
    if (typeof compressorNode !== 'undefined') {
        delayWetNode.connect(compressorNode);
    } else {
        delayWetNode.connect(analyser);
    }

    applyDelaySettings();
    drawPianoKeys();
};

function applyDelaySettings() {
    if (!audioCtx) return;

    const bpmVal = parseInt(document.getElementById('bpm-slider').value);
    const divVal = parseFloat(document.getElementById('delay-division').value);
    const fbVal = parseFloat(document.getElementById('delay-feedback').value);
    const wetVal = parseFloat(document.getElementById('delay-wet').value);

    currentBPM = bpmVal;
    currentDivision = divVal;

    document.getElementById('bpm-txt').innerText = `${bpmVal} BPM`;
    document.getElementById('delay-fb-txt').innerText = `${Math.round(fbVal * 100)}%`;
    document.getElementById('delay-wet-txt').innerText = `${Math.round(wetVal * 100)}%`;
    
    // Convert division values to readable notes
    const divNames = { "1": "1/2 Note", "0.5": "1/4 Note", "0.25": "1/8 Note", "0.125": "1/16 Note" };
    document.getElementById('delay-sync-txt').innerText = divNames[divVal] || "Custom";

    // Calculate time offset: Delay Time (s) = (60 / BPM) * 4 * Division
    // Tying this directly together gives us a perfect, math-accurate rhythm sync!
    const delayTimeInSeconds = (60 / bpmVal) * 4 * divVal;

    if (delayNode) delayNode.delayTime.setValueAtTime(delayTimeInSeconds, audioCtx.currentTime);
    if (delayFeedbackNode) delayFeedbackNode.gain.setValueAtTime(fbVal, audioCtx.currentTime);
    if (delayWetNode) delayWetNode.gain.setValueAtTime(wetVal, audioCtx.currentTime);
}

// Add UI listeners with auto-saving to localstorage
document.getElementById('bpm-slider').addEventListener('input', (e) => {
    localStorage.setItem('studio_bpm', e.target.value);
    applyDelaySettings();
});

document.getElementById('delay-division').addEventListener('change', (e) => {
    localStorage.setItem('studio_delay_div', e.target.value);
    applyDelaySettings();
});

document.getElementById('delay-feedback').addEventListener('input', (e) => {
    localStorage.setItem('studio_delay_fb', e.target.value);
    applyDelaySettings();
});

document.getElementById('delay-wet').addEventListener('input', (e) => {
    localStorage.setItem('studio_delay_wet', e.target.value);
    applyDelaySettings();
});


// --- INTERACTIVE NEON PIANO KEYBOARD ---
const pianoContainer = document.getElementById('piano-keyboard');

// Mapping notes from C4 to E5
const pianoKeys = [
    { note: 60, name: "C4", isBlack: false },
    { note: 61, name: "C#4", isBlack: true },
    { note: 62, name: "D4", isBlack: false },
    { note: 63, name: "D#4", isBlack: true },
    { note: 64, name: "E4", isBlack: false },
    { note: 65, name: "F4", isBlack: false },
    { note: 66, name: "F#4", isBlack: true },
    { note: 67, name: "G4", isBlack: false },
    { note: 68, name: "G#4", isBlack: true },
    { note: 69, name: "A4", isBlack: false },
    { note: 70, name: "A#4", isBlack: true },
    { note: 71, name: "B4", isBlack: false },
    { note: 72, name: "C5", isBlack: false },
    { note: 73, name: "C#5", isBlack: true },
    { note: 74, name: "D5", isBlack: false },
    { note: 75, name: "D#5", isBlack: true },
    { note: 76, name: "E5", isBlack: false }
];

function drawPianoKeys() {
    pianoContainer.innerHTML = ''; // Clear board
    let whiteKeyIndex = 0;

    pianoKeys.forEach((key) => {
        const keyEl = document.createElement('div');
        keyEl.id = `key-${key.note}`;
        keyEl.setAttribute('data-note', key.note);
        
        // Dynamic positioning of black keys over white keys
        if (key.isBlack) {
            keyEl.style.cssText = `
                background: #1e1e2f;
                border: 1px solid #000;
                width: 20px;
                height: 65px;
                position: absolute;
                left: ${whiteKeyIndex * 30 - 12}px;
                z-index: 10;
                border-radius: 0 0 3px 3px;
                cursor: pointer;
                transition: background 0.1s;
            `;
        } else {
            keyEl.style.cssText = `
                background: #f8fafc;
                border: 1px solid #cbd5e1;
                width: 28px;
                height: 100px;
                border-radius: 0 0 4px 4px;
                cursor: pointer;
                margin-right: 2px;
                transition: background 0.1s;
            `;
            whiteKeyIndex++;
        }

        // Mouse/Touch triggers for playing keys directly on screen
        const startPlay = (e) => {
            e.preventDefault();
            initAudioEngine();
            const freq = Math.pow(2, (key.note - 69) / 12) * 440;
            if (typeof playSynthNote === 'function') {
                playSynthNote(key.note, freq, 100);
                highlightKey(key.note, true);
            }
        };

        const stopPlay = (e) => {
            e.preventDefault();
            if (typeof stopSynthNote === 'function') {
                stopSynthNote(key.note);
                highlightKey(key.note, false);
            }
        };

        keyEl.addEventListener('mousedown', startPlay);
        keyEl.addEventListener('mouseup', stopPlay);
        keyEl.addEventListener('mouseleave', stopPlay);
        
        keyEl.addEventListener('touchstart', startPlay, {passive: false});
        keyEl.addEventListener('touchend', stopPlay, {passive: false});

        pianoContainer.appendChild(keyEl);
    });
}

// Visual key illumination (Cyan highlight for active notes
