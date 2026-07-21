// script2.js - Audio Routing, Playback & Stop Controls

window.WaveState.startedAt = 0;
window.WaveState.pausedAt = 0;

// Grab reference to Stop button
window.addEventListener('DOMContentLoaded', () => {
    window.WaveState.elements.stopBtn = document.getElementById('stop-btn');
    if (window.WaveState.elements.stopBtn) {
        window.WaveState.elements.stopBtn.addEventListener('click', stopAudio);
    }
});

function playAudio() {
    const state = window.WaveState;

    if (!state.audioContext || !state.audioBuffer || state.isPlaying) return;

    state.sourceNode = state.audioContext.createBufferSource();
    state.sourceNode.buffer = state.audioBuffer;

    state.analyser = state.audioContext.createAnalyser();
    state.analyser.fftSize = 256; // Optimized frequency bin size for spectrum bar visualization

    state.sourceNode.connect(state.analyser);
    state.analyser.connect(state.audioContext.destination);

    const offset = state.pausedAt;
    state.sourceNode.start(0, offset);
    
    state.startedAt = state.audioContext.currentTime - offset;
    state.isPlaying = true;

    state.elements.playBtn.disabled = true;
    state.elements.pauseBtn.disabled = false;
    if (state.elements.stopBtn) state.elements.stopBtn.disabled = false;

    state.sourceNode.onended = function() {
        if (state.isPlaying) {
            state.isPlaying = false;
            state.pausedAt = 0;
            state.elements.playBtn.disabled = false;
            state.elements.pauseBtn.disabled = true;
            if (state.elements.stopBtn) state.elements.stopBtn.disabled = true;
        }
    };
}

function pauseAudio() {
    const state = window.WaveState;

    if (!state.isPlaying || !state.sourceNode) return;

    state.sourceNode.stop(0);
    state.pausedAt = state.audioContext.currentTime - state.startedAt;
    state.isPlaying = false;

    state.elements.playBtn.disabled = false;
    state.elements.pauseBtn.disabled = true;
}

// STOP AUDIO FUNCTION
function stopAudio() {
    const state = window.WaveState;

    if (state.sourceNode && state.isPlaying) {
        try {
            state.sourceNode.stop(0);
        } catch (e) {
            console.warn(e);
        }
    }

    state.isPlaying = false;
    state.pausedAt = 0; // Reset playhead completely back to the beginning!

    // Save reset playhead to localStorage
    localStorage.setItem('wave_pausedAt', 0);

    state.elements.playBtn.disabled = false;
    state.elements.pauseBtn.disabled = true;
    if (state.elements.stopBtn) state.elements.stopBtn.disabled = true;
}

// Hook up buttons
window.WaveState.elements.playBtn.addEventListener('click', playAudio);
window.WaveState.elements.pauseBtn.addEventListener('click', pauseAudio);
