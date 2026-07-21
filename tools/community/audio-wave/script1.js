// script1.js - Core Setup & File Handling

// 1. Global State Object
// We attach this to 'window' so script2, script3, etc., can read and update these values.
window.WaveState = {
    audioContext: null,
    audioBuffer: null,
    analyser: null,
    sourceNode: null,
    isPlaying: false,
    elements: {
        canvas: document.getElementById('wave-canvas'),
        upload: document.getElementById('audio-upload'),
        playBtn: document.getElementById('play-btn'),
        pauseBtn: document.getElementById('pause-btn')
    }
};

// 2. Initialize the Web Audio API
function initAudioContext() {
    if (!window.WaveState.audioContext) {
        // Handle cross-browser compatibility
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        window.WaveState.audioContext = new AudioContext();
    }
}

// 3. Handle File Uploads
window.WaveState.elements.upload.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;

    // The AudioContext must be initialized after a user interaction
    initAudioContext();
    
    const reader = new FileReader();

    // When the file is read, decode the audio data
    reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        
        // Decode the raw data into an audio buffer
        window.WaveState.audioContext.decodeAudioData(arrayBuffer, function(buffer) {
            window.WaveState.audioBuffer = buffer;
            console.log("Audio loaded successfully!");
            
            // Enable the play button (The actual play logic will go in a later script)
            window.WaveState.elements.playBtn.disabled = false;
        }, function(err) {
            console.error("Error decoding audio data:", err);
            alert("Error loading audio file. Please try a different MP3 or WAV.");
        });
    };

    reader.readAsArrayBuffer(file);
});
