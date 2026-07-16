// UI Selectors
const audioUpload = document.getElementById('audio-upload');
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
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
let convolverNode; // Reverb Effect Node
let reverbGainNode; // Controls Reverb dry/wet mix
let dryGainNode; // Controls original audio volume
let masterGain;
let analyser;

let mediaRecorder;
let recordedChunks = [];

// Initialize & setup Routing Node Web Audio chain
function initAudioEngine() {
    if (audioCtx) return;

    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Nodes instantiation
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;

    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = 'lowpass';
    biquadFilter.frequency.setValueAtTime(20000, audioCtx.currentTime);

    // Dynamic procedural reverb generation
    convolverNode = audioCtx.createConvolver();
    convolverNode.buffer = createReverbImpulse(3.5, 2.0); // 3.5 sec decay, 2.0 sec pre-delay simulation

    reverbGainNode = audioCtx.createGain();
    dryGainNode = audioCtx.createGain();
    masterGain = audioCtx.createGain();

    // Set Default Mix volumes
    reverbGainNode.gain.setValueAtTime(0, audioCtx.currentTime); 
    dryGainNode.gain.setValueAtTime(1, audioCtx.currentTime);
    masterGain.gain.setValueAtTime(volumeSlider.value, audioCtx.currentTime);

    // Audio Graph Routing Chain:
    // sourceNode -> biquadFilter -> split to (dryGain & convolverNode -> reverbGain) -> masterGain -> analyser -> destination
    sourceNode = audioCtx.createMediaElementSource(audioPlayer);
    
    sourceNode.connect(biquadFilter);
    
    // Wet path (Reverb)
    biquadFilter.connect(convolverNode);
    convolverNode.connect(reverbGainNode);
    reverbGainNode.connect(masterGain);

    // Dry path (Original)
    biquadFilter.connect(dryGainNode);
    dryGainNode.connect(masterGain);

    masterGain.connect(analyser);
    analyser.connect(audioCtx.destination);

    // Kickoff Visualizer draw frame loop
    drawOscilloscope();
}

// Procedural impulse generator to create realistic studio space without needing heavy asset files
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

// Visualizer Syncing directly to incoming frequency bands
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

        // Color dynamic shifting depending on the beat volume
        const red = barHeight + (25 * (i / bufferLength));
        const green = 242 - barHeight;
        const blue = 254;

        canvasCtx.fillStyle = `rgb(${red},${green},${blue})`;
        canvasCtx.fillRect(x, canvas.height - barHeight * 0.5, barWidth - 1, barHeight * 0.5);

        x += barWidth;
    }
}

// Event Listeners
audioUpload.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
        audioPlayer.src = URL.createObjectURL(file);
        initAudioEngine();
    }
});

playBtn.addEventListener('click', () => {
    if (audioCtx) audioCtx.resume();
    audioPlayer.play();
});

pauseBtn.addEventListener('click', () => {
    audioPlayer.pause();
});

volumeSlider.addEventListener('input', (e) => {
    if (masterGain) {
        masterGain.gain.setValueAtTime(e.target.value, audioCtx.currentTime);
    }
});

speedSlider.addEventListener('input', (e) => {
    audioPlayer.playbackRate = e.target.value;
});

filterSlider.addEventListener('input', (e) => {
    if (biquadFilter) {
        biquadFilter.frequency.setValueAtTime(e.target.value, audioCtx.currentTime);
    }
});

reverbSlider.addEventListener('input', (e) => {
    if (reverbGainNode) {
        const wetVal = e.target.value;
        reverbGainNode.gain.setValueAtTime(wetVal, audioCtx.currentTime);
        dryGainNode.gain.setValueAtTime(1 - wetVal, audioCtx.currentTime); // Balance volume automatically
    }
});

// --- MICROPHONE VOICE RECORDER ---
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

            // Route our recording dynamically back into the DAW track player for editing
            audioPlayer.src = recordedUrl; 
        };

        mediaRecorder.start();
        recordBtn.innerText = "Recording...";
        recordBtn.disabled = true;
        stopRecordBtn.disabled = false;
    } catch (err) {
        alert("Microphone permission denied or unavailable on this device.");
    }
});

stopRecordBtn.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        // Stop user mic track access to clear active recording indicators
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
        recordBtn.innerText = "Record";
        recordBtn.disabled = false;
        stopRecordBtn.disabled = true;
    }
});

// --- MIDI INPUT CONNECTIVITY (USB & BLUETOOTH ADAPTERS) ---
connectMidiBtn.addEventListener('click', () => {
    initAudioEngine();
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess({ sysex: false })
            .then(onMIDISuccess, onMIDIFailure);
    } else {
        alert("Web MIDI API not supported in this browser. Try Chrome, Edge, or Safari.");
    }
});

function onMIDISuccess(midiAccess) {
    midiStatus.innerText = "MIDI: Scan Active";
    midiStatus.style.color = "#10b981"; // Green indicator
    
    const inputs = midiAccess.inputs.values();
    for (let input of inputs) {
        input.onmidimessage = handleMidiMessage;
    }
    
    // Listen for connection status changes (e.g., plugging in Bluetooth MIDI adapter live)
    midiAccess.onstatechange = (e) => {
        midiStatus.innerText = `MIDI: Device ${e.port.state}`;
    };
}

function onMIDIFailure() {
    midiStatus.innerText = "MIDI: Error Accessing";
    midiStatus.style.color = "#ef4444";
}

// Basic synthesizer node engine triggered by MIDI Controller
let activeOscillators = {};

function handleMidiMessage(message) {
    const command = message.data[0] & 0xf0;
    const note = message.data[1];
    const velocity = (message.data.length > 2) ? message.data[2] : 0;

    // Convert MIDI pitch to frequencies
    const frequency = Math.pow(2, (note - 69) / 12) * 440;
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const noteName = noteNames[note % 12] + (Math.floor(note / 12) - 1);

    if (command === 144 && velocity > 0) { // Note ON Command
        currentNoteDisplay.innerText = noteName;
        playSynthNote(note, frequency, velocity);
    } else if (command === 128 || (command === 144 && velocity === 0)) { // Note OFF Command
        stopSynthNote(note);
    }
}

function playSynthNote(note, frequency, velocity) {
    if (activeOscillators[note]) return; // Avoid note stacking overlap

    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();

    osc.type = 'triangle'; // Warm studio synth wave
    osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

    // Map MIDI velocity (0-127) to output gain
    const gainVolume = (velocity / 127) * 0.2; 
    oscGain.gain.setValueAtTime(gainVolume, audioCtx.currentTime);

    // Route synthesis keyboard straight into the master DAW analyser stream
    osc.connect(oscGain);
    oscGain.connect(masterGain);
    
    osc.start();

    activeOscillators[note] = { osc, gain: oscGain };
}

function stopSynthNote(note) {
    if (activeOscillators[note]) {
        const { osc, gain } = activeOscillators[note];
        // Smooth release tail
        gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.stop(audioCtx.currentTime + 0.1);
        delete activeOscillators[note];
    }
}
