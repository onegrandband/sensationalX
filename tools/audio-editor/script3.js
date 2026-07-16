// --- MASTERING EQ, COMPRESSION, & EXPORT ENGINE (script3.js) ---

// Dynamically inject the Mastering & Export UI into the DOM
const mainContainer = document.querySelector('.container');
const masterSection = document.createElement('div');
masterSection.className = 'section';
masterSection.innerHTML = `
    <h3>6. Mastering Rack & Export</h3>
    <div class="grid-controls" style="margin-bottom: 15px;">
        <div class="slider-group">
            <label>EQ Bass (80Hz): <span id="eq-low-txt">0 dB</span></label>
            <input type="range" id="eq-low" min="-12" max="12" step="1" value="0">
        </div>
        
        <div class="slider-group">
            <label>EQ Mid (1000Hz): <span id="eq-mid-txt">0 dB</span></label>
            <input type="range" id="eq-mid" min="-12" max="12" step="1" value="0">
        </div>

        <div class="slider-group">
            <label>EQ Treble (8000Hz): <span id="eq-high-txt">0 dB</span></label>
            <input type="range" id="eq-high" min="-12" max="12" step="1" value="0">
        </div>

        <div class="slider-group">
            <label>Glue Compressor: <span id="comp-txt">Off</span></label>
            <input type="range" id="comp-threshold" min="-40" max="0" step="1" value="0">
        </div>
    </div>
    
    <div style="text-align: center;">
        <button id="export-btn" style="width: 100%; background: linear-gradient(135deg, #a855f7 0%, #00f2fe 100%); color: white; font-size: 16px; padding: 12px;">
            ✨ Export Master Mix (.WAV)
        </button>
        <span id="export-status" style="font-size: 12px; color: #a0aec0; margin-top: 8px; display: block;"></span>
    </div>
`;

// Insert the mastering rack right above the MIDI section
const midiSect = document.querySelector('.midi-section');
mainContainer.insertBefore(masterSection, midiSect);

// EQ & Compressor Node variables
let eqLowNode, eqMidNode, eqHighNode, compressorNode;

// Load Saved EQ/Comp settings from LocalStorage
function loadSavedMastering() {
    if (localStorage.getItem('eq_low') !== null) document.getElementById('eq-low').value = localStorage.getItem('eq_low');
    if (localStorage.getItem('eq_mid') !== null) document.getElementById('eq-mid').value = localStorage.getItem('eq_mid');
    if (localStorage.getItem('eq_high') !== null) document.getElementById('eq-high').value = localStorage.getItem('eq_high');
    if (localStorage.getItem('comp_thresh') !== null) document.getElementById('comp-threshold').value = localStorage.getItem('comp_thresh');
}
loadSavedMastering();

// Extend the original setupAudioContext to inject the Mastering FX chain
const originalInitAudioEngine = window.initAudioEngine;
window.initAudioEngine = function() {
    // If already initialized, stop here
    if (window.audioCtx) return;

    // Call the original initialization from script.js
    originalInitAudioEngine();

    // Create the EQ Nodes
    eqLowNode = audioCtx.createBiquadFilter();
    eqLowNode.type = 'lowshelf';
    eqLowNode.frequency.setValueAtTime(80, audioCtx.currentTime);

    eqMidNode = audioCtx.createBiquadFilter();
    eqMidNode.type = 'peaking';
    eqMidNode.Q.setValueAtTime(1.0, audioCtx.currentTime);
    eqMidNode.frequency.setValueAtTime(1000, audioCtx.currentTime);

    eqHighNode = audioCtx.createBiquadFilter();
    eqHighNode.type = 'highshelf';
    eqHighNode.frequency.setValueAtTime(8000, audioCtx.currentTime);

    // Create Studio Compressor (prevents nasty digital clipping and adds warm density)
    compressorNode = audioCtx.createDynamicsCompressor();
    compressorNode.ratio.setValueAtTime(4.0, audioCtx.currentTime); // 4:1 compression ratio
    compressorNode.knee.setValueAtTime(30, audioCtx.currentTime);   // Soft knee
    compressorNode.attack.setValueAtTime(0.01, audioCtx.currentTime); // 10ms attack
    compressorNode.release.setValueAtTime(0.25, audioCtx.currentTime); // 250ms release

    // Intercept masterGain -> Analyser routing and patch the new Mastering chain inside!
    // Original path: masterGain -> analyser -> destination
    // New Path: masterGain -> eqLow -> eqMid -> eqHigh -> Compressor -> analyser -> destination
    masterGain.disconnect(analyser);
    
    masterGain.connect(eqLowNode);
    eqLowNode.connect(eqMidNode);
    eqMidNode.connect(eqHighNode);
    eqHighNode.connect(compressorNode);
    compressorNode.connect(analyser);

    // Apply any loaded slider values
    applyMasteringFX();
};

function applyMasteringFX() {
    if (!audioCtx) return;

    const lowVal = parseFloat(document.getElementById('eq-low').value);
    const midVal = parseFloat(document.getElementById('eq-mid').value);
    const highVal = parseFloat(document.getElementById('eq-high').value);
    const compVal = parseFloat(document.getElementById('comp-threshold').value);

    // Set Text Display
    document.getElementById('eq-low-txt').innerText = `${lowVal > 0 ? '+' : ''}${lowVal} dB`;
    document.getElementById('eq-mid-txt').innerText = `${midVal > 0 ? '+' : ''}${midVal} dB`;
    document.getElementById('eq-high-txt').innerText = `${highVal > 0 ? '+' : ''}${highVal} dB`;
    document.getElementById('comp-txt').innerText = compVal === 0 ? "Off" : `${compVal} dB`;

    // Apply values to Web Audio API parameters
    if (eqLowNode) eqLowNode.gain.setValueAtTime(lowVal, audioCtx.currentTime);
    if (eqMidNode) eqMidNode.gain.setValueAtTime(midVal, audioCtx.currentTime);
    if (eqHighNode) eqHighNode.gain.setValueAtTime(highVal, audioCtx.currentTime);
    if (compressorNode) compressorNode.threshold.setValueAtTime(compVal, audioCtx.currentTime);
}

// Add Event Listeners for mastering sliders with Auto-Saving
['eq-low', 'eq-mid', 'eq-high', 'comp-threshold'].forEach(id => {
    document.getElementById(id).addEventListener('input', (e) => {
        const val = e.target.value;
        const storageKey = id.replace('-', '_');
        localStorage.setItem(storageKey, val);
        applyMasteringFX();
    });
});

// --- OFFLINE RENDERING & EXPORT SYSTEM ---
document.getElementById('export-btn').addEventListener('click', async () => {
    initAudioEngine();
    
    // Check if there are tracks to render
    const allTracks = window.tracks || [];
    const hasMainAudio = audioPlayer.src && audioPlayer.src !== "";
    
    if (allTracks.length === 0 && !hasMainAudio) {
        alert("Please load or record some audio tracks first before trying to export!");
        return;
    }

    const statusSpan = document.getElementById('export-status');
    statusSpan.innerText = "Processing & mastering tracks... Please wait...";
    statusSpan.style.color = "#00f2fe";

    // 1. Determine total length of the export
    let duration = 5; // Default safety limit
    if (hasMainAudio && !isNaN(audioPlayer.duration)) {
        duration = Math.max(duration, audioPlayer.duration);
    }
    allTracks.forEach(t => {
        if (t.audioBuffer) {
            duration = Math.max(duration, t.audioBuffer.duration);
        }
    });

    const sampleRate = 44100;
    const renderLength = sampleRate * duration;
    
    // 2. Initialize the Offline Audio Context (Runs in the background at lightning speed!)
    const offlineCtx = new OfflineAudioContext(2, renderLength, sampleRate);

    // 3. Recreate the precise DSP processing chain inside the offline context
    const offlineMasterGain = offlineCtx.createGain();
    offlineMasterGain.gain.setValueAtTime(parseFloat(volumeSlider.value), 0);

    const offlineLowEQ = offlineCtx.createBiquadFilter();
    offlineLowEQ.type = 'lowshelf';
    offlineLowEQ.frequency.setValueAtTime(80, 0);
    offlineLowEQ.gain.setValueAtTime(parseFloat(document.getElementById('eq-low').value), 0);

    const offlineMidEQ = offlineCtx.createBiquadFilter();
    offlineMidEQ.type = 'peaking';
    offlineMidEQ.Q.setValueAtTime(1.0, 0);
    offlineMidEQ.frequency.setValueAtTime(1000, 0);
    offlineMidEQ.gain.setValueAtTime(parseFloat(document.getElementById('eq-mid').value), 0);

    const offlineHighEQ = offlineCtx.createBiquadFilter();
    offlineHighEQ.type = 'highshelf';
    offlineHighEQ.frequency.setValueAtTime(8000, 0);
    offlineHighEQ.gain.setValueAtTime(parseFloat(document.getElementById('eq-high').value), 0);

    const offlineComp = offlineCtx.createDynamicsCompressor();
    offlineComp.ratio.setValueAtTime(4.0, 0);
    offlineComp.knee.setValueAtTime(30, 0);
    offlineComp.attack.setValueAtTime(0.01, 0);
    offlineComp.release.setValueAtTime(0.25, 0);
    offlineComp.threshold.setValueAtTime(parseFloat(document.getElementById('comp-threshold').value), 0);

    // Connect Offline Mastering Web Graph
    offlineMasterGain.connect(offlineLowEQ);
    offlineLowEQ.connect(offlineMidEQ);
    offlineMidEQ.connect(offlineHighEQ);
    offlineHighEQ.connect(offlineComp);
    offlineComp.connect(offlineCtx.destination);

    // 4. Render Multi-track lanes to the Offline buffer
    for (const track of allTracks) {
        if (track.audioBuffer && !track.isMuted) {
            const trackSource = offlineCtx.createBufferSource();
            trackSource.buffer = track.audioBuffer;
            trackSource.playbackRate.setValueAtTime(parseFloat(speedSlider.value), 0);

            const trackGain = offlineCtx.createGain();
            // Respect Solo mode during offline master exports
            const anySoloed = allTracks.some(t => t.isSoloed);
            const activeVol = (anySoloed && !track.isSoloed) ? 0 : track.volume;
            trackGain.gain.setValueAtTime(activeVol, 0);

            const trackPanner = offlineCtx.createStereoPanner ? offlineCtx.createStereoPanner() : null;
            
            if (trackPanner) {
                trackPanner.pan.setValueAtTime(track.pan, 0);
                trackSource.connect(trackPanner);
                trackPanner.connect(trackGain);
            } else {
                trackSource.connect(trackGain);
            }

            trackGain.connect(offlineMasterGain);
            trackSource.start(0);
        }
    }

    // 5. Run Render Pipeline
    try {
        const renderedBuffer = await offlineCtx.startRendering();
        
        // Convert AudioBuffer to WAV blob
        const wavBlob = bufferToWav(renderedBuffer);
        const url = URL.createObjectURL(wavBlob);

        // Download Trigger Link
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `StudioWave_Master_Export.wav`;
        downloadLink.click();

        statusSpan.innerText = "✨ Export Finished Successfully!";
        statusSpan.style.color = "#10b981";
    } catch (err) {
        console.error(err);
        statusSpan.innerText = "Export failed. Check console for details.";
        statusSpan.style.color = "#ef4444";
    }
});

// --- HELPER AUDIO UTILITY: ENCODE AUDIOBUFFER TO CD-QUALITY WAV (16-bit Stereo) ---
function bufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArr = new ArrayBuffer(length);
    const view = new DataView(bufferArr);
    const channels = [];
    let i, sample, offset = 0, pos = 0;

    // Write WAV Header Block
    writeString(view, pos, 'RIFF'); pos += 4;
    view.setUint32(pos, length - 8, true); pos += 4;
    writeString(view, pos, 'WAVE'); pos += 4;
    writeString(view, pos, 'fmt '); pos += 4;
    view.setUint32(pos, 16, true); pos += 4; // Subchunk size
    view.setUint16(pos, 1, true); pos += 2;   // Audio format 1 (PCM)
    view.setUint16(pos, numOfChan, true); pos += 2;
    view.setUint32(pos, buffer.sampleRate, true); pos += 4;
    view.setUint32(pos, buffer.sampleRate * 2 * numOfChan, true); pos += 4; // byte rate
    view.setUint16(pos, numOfChan * 2, true); pos += 2; // block align
    view.setUint16(pos, 16, true); pos += 2; // bits per sample
    writeString(view, pos, 'data'); pos += 4;
    view.setUint32(pos, length - pos - 4, true); pos += 4;

    // Interleave left and right channels
    for (i = 0; i < numOfChan; i++) {
        channels.push(buffer.getChannelData(i));
    }

    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][offset])); // Hard limiter clamping
            sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF; // 16-bit PCM scale
            view.setInt16(pos, sample, true);
            pos += 2;
        }
        offset++;
    }

    return new Blob([bufferArr], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
