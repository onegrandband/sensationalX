// script2.js - Fixed Audio Routing, Instant Playback, and Responsive Stop

window.WaveState = window.WaveState || {};
Object.assign(window.WaveState, {
    startedAt: 0,
    pausedAt: 0
});

// Initialize stop button reference once DOM loads
window.addEventListener('DOMContentLoaded', () => {
    window.WaveState.elements.stopBtn = document.getElementById('stop-btn');
    if (window.WaveState.elements.stopBtn) {
        window.WaveState.elements.stopBtn.addEventListener('click', stopAudio);
    }
});

async function playAudio() {
    const state = window.WaveState;

    if (!state.audioContext || !state.audioBuffer) return;

    // CRITICAL FIX: Browsers suspend audio contexts until a direct user click resumes them!
    if (state.audioContext.state === 'suspended') {
        await state.audioContext.resume();
    }

    // If already playing, stop current node first to prevent overlapping sounds
    if (state.isPlaying && state.sourceNode) {
        try {
            state.sourceNode.stop();
            state.sourceNode.disconnect();
        } catch (e) {}
    }

    // 1. Create a fresh buffer source node
    state.sourceNode = state.audioContext.createBufferSource();
    state.sourceNode.buffer = state.audioBuffer;

    // 2. Create or reuse the AnalyserNode for visualizer bars
    if (!state.analyser) {
        state.analyser = state.audioContext.createAnalyser();
        state.analyser.fftSize = 256;
    }

    // 3. Wire Audio Graph: Source -> Analyser -> Speakers (Destination)
    state.sourceNode.connect(state.analyser);
    state.analyser.connect(state.audioContext.destination);

    // 4. Calculate offset position
    const offset = state.pausedAt || 0;
    
    // Ensure offset doesn't exceed track length
    const safeOffset = Math.min(offset, state.audioBuffer.duration);

    // 5. Start playback instantly
    state.sourceNode.start(0, safeOffset);
    
    state.startedAt = state.audioContext.currentTime - safeOffset;
    state.isPlaying = true;

    // 6. Update UI button states immediately
    if (state.elements.playBtn) state.elements.playBtn.disabled = true;
    if (state.elements.pauseBtn) state.elements.pauseBtn.disabled = false;
    if (state.elements.stopBtn) state.elements.stopBtn.disabled = false;

    // 7. Handle natural track finish
    state.sourceNode.onended = function() {
        // Only trigger if it wasn't manually stopped or paused
        if (state.isPlaying && (state.audioContext.currentTime - state.startedAt >= state.audioBuffer.duration)) {
            stopAudio();
        }
    };
}

function pauseAudio() {
    const state = window.WaveState;

    if (!state.isPlaying || !state.sourceNode) return;

    try {
        state.sourceNode.stop(0);
        state.sourceNode.disconnect();
    } catch (e) {}

    // Save exact position
    state.pausedAt = state.audioContext.currentTime - state.startedAt;
    state.isPlaying = false;

    // Update UI
    if (state.elements.playBtn) state.elements.playBtn.disabled = false;
    if (state.elements.pauseBtn) state.elements.pauseBtn.disabled = true;
}

function stopAudio() {
    const state = window.WaveState;

    if (state.sourceNode) {
        try {
            state.sourceNode.stop(0);
            state.sourceNode.disconnect();
        } catch (e) {}
    }

    state.isPlaying = false;
    state.pausedAt = 0; // Reset playhead completely back to the start!
    localStorage.setItem('wave_pausedAt', 0);

    // Update UI immediately
    if (state.elements.playBtn) state.elements.playBtn.disabled = false;
    if (state.elements.pauseBtn) state.elements.pauseBtn.disabled = true;
    if (state.elements.stopBtn) state.elements.stopBtn.disabled = true;
}

// Hook up Play and Pause buttons safely
window.addEventListener('DOMContentLoaded', () => {
    if (window.WaveState.elements.playBtn) {
        window.WaveState.elements.playBtn.addEventListener('click', playAudio);
    }
    if (window.WaveState.elements.pauseBtn) {
        window.WaveState.elements.pauseBtn.addEventListener('click', pauseAudio);
    }
});
