// script4.js - Digital Audio Workstation (DAW) Editing Tools

// 1. Dynamically inject the Editor UI into the page
function injectEditorUI() {
    const mainContainer = document.querySelector('main');
    
    const editorPanel = document.createElement('div');
    editorPanel.className = 'editor-panel';
    editorPanel.style.cssText = `
        margin-top: 1.5rem;
        padding: 1.5rem;
        background-color: #1a1a1a;
        border-radius: 8px;
        border: 1px solid #333;
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        align-items: center;
    `;

    editorPanel.innerHTML = `
        <button id="btn-trim" disabled style="background-color: #ffaa00; color: #000;">Trim Selection</button>
        <button id="btn-cut" disabled style="background-color: #ff0055; color: #fff;">Cut Selection</button>
        
        <div style="display: flex; align-items: center; gap: 0.5rem; border-left: 1px solid #444; padding-left: 1rem;">
            <label for="gain-slider" style="color: #aaa; font-size: 0.9rem;">Gain Level:</label>
            <input type="range" id="gain-slider" min="0" max="3" step="0.1" value="1.5">
            <button id="btn-gain" disabled style="background-color: #7928ca; color: #fff;">Apply Gain</button>
        </div>
    `;

    mainContainer.appendChild(editorPanel);

    // Save references to global state
    window.WaveState.elements.btnTrim = document.getElementById('btn-trim');
    window.WaveState.elements.btnCut = document.getElementById('btn-cut');
    window.WaveState.elements.btnGain = document.getElementById('btn-gain');
    window.WaveState.elements.gainSlider = document.getElementById('gain-slider');
}

// 2. Helper to replace the buffer and trigger a UI redraw
function commitBufferChange(newBuffer) {
    const state = window.WaveState;
    
    // Stop playback if running to prevent glitching
    if (state.isPlaying && typeof pauseAudio === 'function') {
        pauseAudio();
    }

    // Update global state
    state.audioBuffer = newBuffer;
    state.waveformPeaks = []; // Clears the peaks so script3 regenerates them
    state.selection.active = false;
    state.selection.start = 0;
    state.selection.end = 0;
    state.pausedAt = 0; // Reset playhead
}

// 3. Audio Processing Functions
function applyTrim() {
    const state = window.WaveState;
    if (!state.audioBuffer || !state.selection.active) return;

    const startSample = Math.floor(state.selection.start * state.audioBuffer.sampleRate);
    const endSample = Math.floor(state.selection.end * state.audioBuffer.sampleRate);
    const frameCount = endSample - startSample;

    // Create a new shortened buffer
    const newBuffer = state.audioContext.createBuffer(
        state.audioBuffer.numberOfChannels,
        frameCount,
        state.audioBuffer.sampleRate
    );

    // Copy only the selected data over
    for (let channel = 0; channel < state.audioBuffer.numberOfChannels; channel++) {
        const oldData = state.audioBuffer.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            newData[i] = oldData[startSample + i];
        }
    }

    commitBufferChange(newBuffer);
}

function applyCut() {
    const state = window.WaveState;
    if (!state.audioBuffer || !state.selection.active) return;

    const startSample = Math.floor(state.selection.start * state.audioBuffer.sampleRate);
    const endSample = Math.floor(state.selection.end * state.audioBuffer.sampleRate);
    const cutLength = endSample - startSample;
    const newFrameCount = state.audioBuffer.length - cutLength;

    // Create a new buffer minus the cut section
    const newBuffer = state.audioContext.createBuffer(
        state.audioBuffer.numberOfChannels,
        newFrameCount,
        state.audioBuffer.sampleRate
    );

    // Copy data before the cut, then data after the cut
    for (let channel = 0; channel < state.audioBuffer.numberOfChannels; channel++) {
        const oldData = state.audioBuffer.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);
        
        // Part 1: Before cut
        for (let i = 0; i < startSample; i++) {
            newData[i] = oldData[i];
        }
        // Part 2: After cut
        for (let i = startSample; i < newFrameCount; i++) {
            newData[i] = oldData[i + cutLength];
        }
    }

    commitBufferChange(newBuffer);
}

function applyGain() {
    const state = window.WaveState;
    if (!state.audioBuffer || !state.selection.active) return;

    const gainValue = parseFloat(state.elements.gainSlider.value);
    const startSample = Math.floor(state.selection.start * state.audioBuffer.sampleRate);
    const endSample = Math.floor(state.selection.end * state.audioBuffer.sampleRate);

    // Create a copy of the full buffer
    const newBuffer = state.audioContext.createBuffer(
        state.audioBuffer.numberOfChannels,
        state.audioBuffer.length,
        state.audioBuffer.sampleRate
    );

    // Copy and apply math to the selected region
    for (let channel = 0; channel < state.audioBuffer.numberOfChannels; channel++) {
        const oldData = state.audioBuffer.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);
        
        for (let i = 0; i < state.audioBuffer.length; i++) {
            if (i >= startSample && i <= endSample) {
                // Apply gain to the selection (clamping to prevent severe digital clipping)
                let amplified = oldData[i] * gainValue;
                newData[i] = Math.max(-1, Math.min(1, amplified));
            } else {
                newData[i] = oldData[i]; // Leave the rest untouched
            }
        }
    }

    // Keep the selection active after applying gain so the user can see the change
    const oldStart = state.selection.start;
    const oldEnd = state.selection.end;
    
    commitBufferChange(newBuffer);
    
    // Restore selection visually
    state.selection.start = oldStart;
    state.selection.end = oldEnd;
    state.selection.active = true;
}

// 4. Watcher Loop to Enable/Disable Buttons based on Selection State
function monitorSelectionState() {
    const state = window.WaveState;
    if (state.elements.btnTrim) {
        const hasSelection = state.selection.active && state.audioBuffer;
        state.elements.btnTrim.disabled = !hasSelection;
        state.elements.btnCut.disabled = !hasSelection;
        state.elements.btnGain.disabled = !hasSelection;
    }
    requestAnimationFrame(monitorSelectionState);
}

// Initialize script4
window.addEventListener('DOMContentLoaded', () => {
    injectEditorUI();
    
    // Attach Event Listeners to our new injected buttons
    window.WaveState.elements.btnTrim.addEventListener('click', applyTrim);
    window.WaveState.elements.btnCut.addEventListener('click', applyCut);
    window.WaveState.elements.btnGain.addEventListener('click', applyGain);

    monitorSelectionState();
});
