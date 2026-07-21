// script2.js - Audio Routing & Playback Controls

// Add time tracking to our global state so we can pause and resume
window.WaveState.startedAt = 0;
window.WaveState.pausedAt = 0;

function playAudio() {
    const state = window.WaveState;

    // Safety checks: Make sure we have an audio context and a loaded buffer
    if (!state.audioContext || !state.audioBuffer || state.isPlaying) return;

    // 1. Create the source node (the audio player)
    state.sourceNode = state.audioContext.createBufferSource();
    state.sourceNode.buffer = state.audioBuffer;

    // 2. Create the AnalyserNode (the piece that extracts frequency/wave data for our canvas)
    state.analyser = state.audioContext.createAnalyser();
    
    // fftSize determines how detailed the wave will be. 2048 is a standard, good-looking size.
    state.analyser.fftSize = 2048; 

    // 3. Wire everything together: Source -> Analyser -> Destination (Speakers)
    state.sourceNode.connect(state.analyser);
    state.analyser.connect(state.audioContext.destination);

    // 4. Start playing from where we last paused (or 0 if starting fresh)
    const offset = state.pausedAt;
    state.sourceNode.start(0, offset);
    
    // Track when we started so we can calculate the pause time later
    state.startedAt = state.audioContext.currentTime - offset;
    state.isPlaying = true;

    // 5. Update UI Buttons
    state.elements.playBtn.disabled = true;
    state.elements.pauseBtn.disabled = false;

    // 6. Handle what happens when the song ends naturally
    state.sourceNode.onended = function() {
        // If it stopped naturally (not because we hit pause)
        if (state.isPlaying) {
            state.isPlaying = false;
            state.pausedAt = 0; // Reset to beginning
            state.elements.playBtn.disabled = false;
            state.elements.pauseBtn.disabled = true;
        }
    };
}

function pauseAudio() {
    const state = window.WaveState;

    if (!state.isPlaying || !state.sourceNode) return;

    // 1. Stop the audio
    state.sourceNode.stop(0);
    
    // 2. Calculate exactly where we stopped so we can resume later
    state.pausedAt = state.audioContext.currentTime - state.startedAt;
    state.isPlaying = false;

    // 3. Update UI Buttons
    state.elements.playBtn.disabled = false;
    state.elements.pauseBtn.disabled = true;
}

// Hook up the buttons from the DOM
window.WaveState.elements.playBtn.addEventListener('click', playAudio);
window.WaveState.elements.pauseBtn.addEventListener('click', pauseAudio);
