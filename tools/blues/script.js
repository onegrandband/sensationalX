let audioCtx = null;
let isPlaying = false;
let timerID = null;
let nextNoteTime = 0.0;

// Audio Recording Pipeline
let destNode = null;
let mediaRecorder = null;
let recordedChunks = [];
let noiseBuffer = null; 

// 12 Bar Blues Structural Progression
const bluesProgression = ["E", "E", "E", "E", "A", "A", "E", "E", "B", "A", "E", "B"];
let currentStep = 0;
let currentBar = 0;

const tempo = 90; 
const beatDuration = 60 / tempo; // Length of 1 beat (Quarter note)
const tripletShort = beatDuration / 3;

// Frequencies (Dropped down an octave for bass)
const bassNotes = {
    "E": [41.20, 51.91, 61.74, 69.30],   
    "A": [55.00, 69.30, 82.41, 92.50],   
    "B": [61.74, 77.78, 92.50, 103.83]   
};

// Dominant 7th chords 
const chords = {
    "E": [164.81, 207.65, 246.94, 293.66], 
    "A": [110.00, 138.59, 164.81, 196.00], 
    "B": [123.47, 155.56, 185.00, 220.00]  
};

// DOM Elements
const btnPlay = document.getElementById('btn-play');
const btnStop = document.getElementById('btn-stop');
const btnDownload = document.getElementById('btn-download');
const statusDisplay = document.getElementById('status-display');
const barIndicator = document.getElementById('bar-indicator');
const formatSelect = document.getElementById('format-select');

function initAudio() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    destNode = audioCtx.createMediaStreamDestination();

    // Pre-compute noise once
    const bufferSize = audioCtx.sampleRate * 1;
    noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
}

// Procedural Synthesizer Instruments 
function playBassNote(freq, time, duration) {
    let osc = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    
    osc.type = 'sine'; 
    osc.frequency.setValueAtTime(freq, time);
    
    gainNode.gain.setValueAtTime(0, time);
    gainNode.gain.linearRampToValueAtTime(0.6, time + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration - 0.05);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    gainNode.connect(destNode);
    
    osc.start(time);
    osc.stop(time + duration);
}

function playChord(chordName, time, duration) {
    const freqs = chords[chordName];
    freqs.forEach(freq => {
        let osc = audioCtx.createOscillator();
        let gain = audioCtx.createGain();
        
        osc.type = 'triangle'; 
        osc.frequency.value = freq;

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.15, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);
        gain.connect(destNode);

        osc.start(time);
        osc.stop(time + duration);
    });
}

function playCymbalShuffle(time) {
    let noise = audioCtx.createBufferSource();
    noise.buffer = noiseBuffer;
    
    let filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(7000, time);
    
    let gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    gain.connect(destNode);
    
    noise.start(time);
    noise.stop(time + 0.1); 
}

// Centralized Sequencer
function scheduleBeat(time) {
    let currentChord = bluesProgression[currentBar];
    
    // 1. Walking Bass Note on Downbeat
    let noteToPlay = bassNotes[currentChord][currentStep % 4];
    playBassNote(noteToPlay, time, beatDuration);

    // 2. Chords on the backbeat
    if (currentStep % 2 === 1) { 
        playChord(currentChord, time, beatDuration / 1.5);
    }

    // 3. Blues Shuffle High-Hats
    playCymbalShuffle(time);
    playCymbalShuffle(time + (tripletShort * 2));

    requestAnimationFrame(() => {
        barIndicator.innerText = `Bar: ${currentBar + 1} / 12 | Chord: ${currentChord}7`;
        statusDisplay.innerText = `Status: Synthesizing Blues Shuffle...`;
    });

    currentStep++;
    if (currentStep % 4 === 0) {
        currentBar++;
        if (currentBar >= 12) currentBar = 0;
    }
}

function scheduler() {
    while (nextNoteTime < audioCtx.currentTime + 0.1) {
        scheduleBeat(nextNoteTime);
        nextNoteTime += beatDuration;
    }
    timerID = setTimeout(scheduler, 25);
}

// Recording Pipeline
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

// UI Triggers
btnPlay.addEventListener('click', () => {
    if (isPlaying) return;
    if (!audioCtx) initAudio();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    isPlaying = true;
    currentBar = 0;
    currentStep = 0;
    btnPlay.disabled = true;
    btnStop.disabled = false;
    btnDownload.disabled = true;
    
    startRecordingPipeline();
    
    nextNoteTime = audioCtx.currentTime + 0.05;
    scheduler();
});

btnStop.addEventListener('click', () => {
    if (!isPlaying) return;
    isPlaying = false;
    btnPlay.disabled = false;
    btnStop.disabled = true;
    
    clearTimeout(timerID);
    mediaRecorder.stop();
    statusDisplay.innerText = "Status: Session Stopped.";
});

btnDownload.addEventListener('click', () => {
    const format = formatSelect.value;
    const mimeType = format === 'wav' ? 'audio/wav' : 'audio/webm'; 
    const blob = new Blob(recordedChunks, { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `blues_ai_jam.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});
