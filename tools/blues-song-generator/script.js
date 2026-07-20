let audioCtx = null;
let isPlaying = false;
let loopInterval = null;

// Audio Recording Pipeline
let destNode = null;
let mediaRecorder = null;
let recordedChunks = [];

// 12 Bar Blues Structural Progression in E
const bluesProgression = ["E", "E", "E", "E", "A", "A", "E", "E", "B", "A", "E", "B"];
let currentStep = 0;
let currentBar = 0;

const tempo = 90; 
const beatDuration = 60 / tempo; // Length of 1 beat (Quarter note)
const tripletShort = beatDuration / 3;

// Frequencies for walking basslines
const scaleNotes = {
    "E": [82.41, 103.83, 123.47, 138.59], // E2, G#2, B2, C#3
    "A": [110.00, 138.59, 164.81, 185.00], // A2, C#3, E3, F#3
    "B": [123.47, 155.56, 185.00, 207.65]  // B2, D#3, F#3, G#3
};

// Target DOM Interactive Elements
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnDownload = document.getElementById('btn-download');
const statusDisplay = document.getElementById('status-display');
const barIndicator = document.getElementById('bar-indicator');
const formatSelect = document.getElementById('format-select');

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    destNode = audioCtx.createMediaStreamDestination();
}

// Procedural Synthesizer: Instruments Setup
function playBassNote(freq, startTime, duration) {
    let osc = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    
    osc.type = 'triangle'; // Smooth blues bass tone
    osc.frequency.setValueAtTime(freq, startTime);
    
    gainNode.gain.setValueAtTime(0.4, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration - 0.02);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.connect(destNode); // Route to dynamic audio recorder
    
    osc.start(startTime);
    osc.stop(startTime + duration);
}

function playCymbalShuffle(startTime) {
    // Generate white noise asset for the high-hat cymbal shuffle
    let bufferSize = audioCtx.sampleRate * 0.05;
    let buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    let data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    let noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    
    let filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, startTime);
    
    let gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.08, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    gain.connect(destNode);
    
    noise.start(startTime);
}

// Centralized Sequencer Loop Engine
function sequenceNextBeat() {
    let now = audioCtx.currentTime;
    let currentChord = bluesProgression[currentBar];
    
    barIndicator.innerText = `Bar: ${currentBar + 1} / 12 | Chord: ${currentChord}7`;
    statusDisplay.innerText = `Status: Synthesizing Blues Shuffle...`;

    // 1. Trigger Walking Bass Note on Downbeat
    let notes = scaleNotes[currentChord];
    let noteToPlay = notes[currentStep % 4];
    playBassNote(noteToPlay, now, beatDuration);

    // 2. Trigger Blues Shuffle High-Hats (Triplet Swing Feel: Beat 1 and Beat 3 of triplet)
    playCymbalShuffle(now);
    playCymbalShuffle(now + (tripletShort * 2));

    // Move step counters forward
    currentStep++;
    if (currentStep % 4 === 0) {
        currentBar++;
        if (currentBar >= 12) {
            currentBar = 0; // Seamless loop round the 12 bars
        }
    }
}

// Recording Control Setup
function startRecordingPipeline() {
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(destNode.stream);
    
    mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
        btnDownload.disabled = false;
        statusDisplay.innerText = "Status: Track Rendered. Ready to Export!";
    };
    
    mediaRecorder.start();
}

// Global UI Trigger Operations
btnPlay.addEventListener('click', () => {
    if (isPlaying) return;
    if (!audioCtx) initAudio();
    
    isPlaying = true;
    currentBar = 0;
    currentStep = 0;
    btnPlay.disabled = true;
    btnStop.disabled = false;
    btnDownload.disabled = true;
    
    startRecordingPipeline();
    
    // Fire first beat immediately, loop the rest at tempo interval
    sequenceNextBeat();
    loopInterval = setInterval(sequenceNextBeat, beatDuration * 1000);
});

btnStop.addEventListener('click', () => {
    if (!isPlaying) return;
    isPlaying = false;
    btnPlay.disabled = false;
    btnStop.disabled = true;
    
    clearInterval(loopInterval);
    mediaRecorder.stop();
    statusDisplay.innerText = "Status: Session Stopped.";
});

btnDownload.addEventListener('click', () => {
    const format = formatSelect.value;
    const blob = new Blob(recordedChunks, { type: `audio/${format === 'wav' ? 'wav' : 'mpeg'}` });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `blues_ai_jam.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
