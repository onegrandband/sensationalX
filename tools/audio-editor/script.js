// UI Selectors
const audioUpload = document.getElementById('audio-upload');
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const stopBtn = document.getElementById('stop-btn'); // New Stop Button
const volumeSlider = document.getElementById('volume-slider');
const speedSlider = document.getElementById('speed-slider');
const reverbSlider = document.getElementById('reverb-slider');
const filterSlider = document.getElementById('filter-slider');
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');

const recordBtn = document.getElementById('record-btn');
const stopRecordBtn = document.getElementById('stop-record-btn');
const recordedAudio = document.getElementById('recorded-audio');
const connectMidiBtn = document.getElementById('connect-midi');
const midiStatus = document.getElementById('midi-status');
const currentNoteDisplay = document.getElementById('current-note');

// Audio API nodes
let audioCtx;
let sourceNode;
let biquadFilter;
let convolverNode; 
let reverbGainNode; 
let dryGainNode; 
let masterGain;
let analyser;

let mediaRecorder;
let recordedChunks = [];

// --- LOCAL STORAGE: LOAD SAVED SETTINGS ---
function loadSavedSettings() {
    if (localStorage.getItem('studio_volume') !== null) {
        volumeSlider.value = localStorage.getItem('studio_volume');
    }
    if (localStorage.getItem('studio_speed') !== null) {
        speedSlider.value = localStorage.getItem('studio_speed');
    }
    if (localStorage.getItem('studio_reverb') !== null) {
        reverbSlider.value = localStorage.getItem('studio_reverb');
    }
    if (localStorage.getItem('studio_filter') !== null) {
        filterSlider.value = localStorage.getItem('studio_filter');
    }
}

// Save settings to LocalStorage helper
function saveSetting(key, value) {
    localStorage.setItem(key, value);
}

// Apply settings to the audio engine (Crucial for fixing Chrome resets!)
function applyAudioSettings() {
    if (!audioCtx) return;

    // Apply volume
    if (masterGain) {
        masterGain.gain.setValueAtTime(parseFloat(volumeSlider.value), audioCtx.currentTime);
    }

    // Apply playback speed directly to the HTML5 audio element
    audioPlayer.playbackRate = parseFloat(speedSlider.value);

    // Apply Lowpass Filter
    if (biquadFilter) {
        biquadFilter.frequency.setValueAtTime(parseFloat(filterSlider.value), audioCtx.currentTime);
    }

    // Apply Reverb Mix
    if (reverbGainNode && dryGainNode) {
        const wetVal = parseFloat(reverbSlider.value);
        reverbGainNode.gain.setValueAtTime(wetVal, audioCtx.currentTime);
        dryGainNode.gain.setValueAtTime(1 - wetVal, audioCtx.currentTime);
    }
}

// Run immediately on page load
loadSavedSettings();

// Initialize the DAW Audio Engine
function initAudioEngine() {
    if (audioCtx) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;

    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = 'lowpass';

    convolverNode = audioCtx.createConvolver();
    convolverNode.buffer = createReverbImpulse(3.5, 2.0); // Warm studio reverb

    reverbGainNode = audioCtx.createGain();
    dryGainNode = audioCtx.createGain();
    masterGain = audioCtx.createGain();

    // Setup routing graph
    sourceNode = audioCtx.createMediaElementSource(audioPlayer);
    sourceNode.connect(biquadFilter);
    
    // Wet path (Reverb)
    biquadFilter.connect(convolverNode);
    convolverNode.connect(reverbGainNode);
    reverbGainNode.connect(masterGain);

    // Dry path (Clean)
    biquadFilter.connect(dryGainNode);
    dryGainNode.connect(masterGain);

    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);

    // Force apply localstorage settings to the newly built engine nodes
    applyAudioSettings();

    // Run the synchronized visualizer loop
    drawOscilloscope();
}

// Reverb Impulse Space Generator
function createReverbImpulse(duration, decay) {
    const sampleRate = audioCtx ? audioCtx.sampleRate : 44100;
    const length = sampleRate * duration;
    const impulse = audioCtx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
        const percent = i / length;
        const decayFormula = Math.exp(-percent * decay);
        left[i] = (Math.random() * 2 - 1) * decayFormula;
        right[i] = (Math.random() * 2 - 1) * decayFormula;
    }
    return impulse;
}

// Synchronized Visualizer 
function drawOscilloscope() {
    requestAnimationFrame(drawOscilloscope);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    canvasCtx.fillStyle = '#09090e';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 1.5;
    let barHeight;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i];

        // Dynamic synth wave gradient (cyan to hot pink!)
        const red = barHeight + (25 * (i / bufferLength));
        const green = 242 - barHeight;
        const blue = 254;

        canvasCtx.fillStyle = `rgb(${red},${green},${blue})`;
        canvasCtx.fillRect(x, canvas.height - barHeight * 0.5, barWidth - 1, barHeight * 0.5);

        x += barWidth;
    }
}

// --- CORE CONTROLS & FIXES ---

// Fix: Re-apply settings whenever a new track metadata finishes loading
audioPlayer.addEventListener('loadedmetadata', () => {
    applyAudioSettings();
});

// Fix: Force settings on play event to stop Chrome resetting playback speed
audioPlayer.addEventListener('play', () => {
    applyAudioSettings();
});

audioUpload.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        audioPlayer.src = URL.createObjectURL(file);
        initAudioEngine();
    }
});

// PLAY BUTTON
playBtn.addEventListener('click', () => {
    initAudioEngine();
    if (audioCtx) audioCtx.resume();
    audioPlayer.play();
});

// PAUSE BUTTON (Fixed connection sync issues)
pauseBtn.addEventListener('click', () => {
    audioPlayer.pause();
});

// STOP BUTTON (Pauses and resets position to the beginning)
if (stopBtn) {
    stopBtn.addEventListener('click', () => {
        audioPlayer.pause();
        audioPlayer.currentTime = 0; // Rewind track to start
    });
}

// --- SLIDERS + LOCAL STORAGE SAVING ---

volumeSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    saveSetting('studio_volume', val);
    if (masterGain) {
        masterGain.gain.setValueAtTime(val, audioCtx.currentTime);
    }
});

speedSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    saveSetting('studio_speed', val);
    audioPlayer.playbackRate = val; // Works perfectly now on active play state
});

filterSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    saveSetting('studio_filter', val);
    if (biquadFilter) {
        biquadFilter.frequency.setValueAtTime(val, audioCtx.currentTime);
    }
});

reverbSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    saveSetting('studio_reverb', val);
    if (reverbGainNode && dryGainNode) {
        reverbGainNode.gain.setValueAtTime(val, audioCtx.currentTime);
        dryGainNode.gain.setValueAtTime(1 - val, audioCtx.currentTime);
    }
});

// --- MICROPHONE RECORDER ---
recordBtn.addEventListener('click', async () => {
    initAudioEngine();
    recordedChunks = [];
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'audio/wav' });
            const recordedUrl = URL.createObjectURL(blob);
            recordedAudio.src = recordedUrl;
            audioPlayer.src = recordedUrl; // Loads recording into DAW engine
        };

        mediaRecorder.start();
        recordBtn.innerText = "Recording...";
        recordBtn.disabled = true;
        stopRecordBtn.disabled = false;
    } catch (err) {
        alert("Microphone connection failed. Make sure Chrome has mic permissions enabled!");
    }
});

stopRecordBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        recordBtn.innerText = "Record";
        recordBtn.disabled = false;
        stopRecordBtn.disabled = true;
    }
});

// --- CHROME SECURE MIDI CONNECTION HANDLING ---
connectMidiBtn.addEventListener('click', () => {
    initAudioEngine();
    
    // Safety check: Chrome requires HTTPS or Localhost for MIDI controllers.
    if (!window.isSecureContext && window.location.protocol !== "file:") {
        alert("Chrome Security Alert: MIDI connections require a secure environment (HTTPS or localhost). If you are testing locally, try opening this page on Firefox, or set up a simple local server!");
    }

    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({ sysex: false })
            .then(onMIDISuccess, onMIDIFailure);
    } else {
        alert("Web MIDI is not supported on this browser context. If you are on an iPad or iPhone, try using the WebMIDI Browser app!");
    }
});

function onMIDISuccess(midiAccess) {
    midiStatus.innerText = "MIDI: Online";
    midiStatus.style.color = "#10b981"; 
    
    const inputs = midiAccess.inputs.values();
    for (let input of inputs) {
        input.onmidimessage = handleMidiMessage;
    }
    
    midiAccess.onstatechange = (e) => {
        midiStatus.innerText = `MIDI: Device ${e.port.state}`;
    };
}

function onMIDIFailure(error) {
    console.error("MIDI Failure Details:", error);
    midiStatus.innerText = "MIDI: Blocked";
    midiStatus.style.color = "#ef4444";
    alert("MIDI connection blocked. If you're running this locally by double-clicking 'index.html', Chrome blocks MIDI devices. Tip: Switch to Firefox for local files, or host a quick local server!");
}

// Synth engine keys triggered by MIDI Controller
let activeOscillators = {};

function handleMidiMessage(message) {
    const command = message.data[0] & 0xf0;
    const note = message.data[1];
    const velocity = (message.data.length > 2) ? message.data[2] : 0;

    const frequency = Math.pow(2, (note - 69) / 12) * 440;
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const noteName = noteNames[note % 12] + (Math.floor(note / 12) - 1);

    if (command === 144 && velocity > 0) { 
        currentNoteDisplay.innerText = noteName;
        playSynthNote(note, frequency, velocity);
    } else if (command === 128 || (command === 144 && velocity === 0)) { 
        stopSynthNote(note);
    }
}

function playSynthNote(note, frequency, velocity) {
    if (activeOscillators[note]) return; 

    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();

    osc.type = 'triangle'; 
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    const gainVolume = (velocity / 127) * 0.2; 
    oscGain.gain.setValueAtTime(gainVolume, audioCtx.currentTime);

    osc.connect(oscGain);
    oscGain.connect(masterGain);
    
    osc.start();

    activeOscillators[note] = { osc, gain: oscGain };
}

function stopSynthNote(note) {
    if (activeOscillators[note]) {
        const { osc, gain } = activeOscillators[note];
        gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.stop(audioCtx.currentTime + 0.1);
        delete activeOscillators[note];
    }
}
