// script5.js - Audio Export Engine

// 1. Inject the Export Button into our controls
function injectExportUI() {
    const controlsContainer = document.querySelector('.controls');
    
    const exportBtn = document.createElement('button');
    exportBtn.id = 'btn-export';
    exportBtn.innerText = '💾 Export .WAV';
    exportBtn.disabled = true;
    exportBtn.style.backgroundColor = '#0077ff';
    exportBtn.style.color = 'white';
    
    controlsContainer.appendChild(exportBtn);
    window.WaveState.elements.btnExport = exportBtn;
}

// 2. Convert AudioBuffer to WAV format
function audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);
    
    const channels = [];
    let sampleRate = buffer.sampleRate;
    let offset = 0;
    let pos = 0;

    // Write WAV Header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true);  // AudioFormat (1 for PCM)
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numOfChan * 2, true); // ByteRate
    view.setUint16(32, numOfChan * 2, true); // BlockAlign
    view.setUint16(34, 16, true); // BitsPerSample
    writeString(view, 36, 'data');
    view.setUint32(40, length, true);

    // Write Audio Data
    for (let i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }

    offset = 44;
    while (pos < buffer.length) {
        for (let i = 0; i < numOfChan; i++) {
            // Clamp the sample to -1 to 1, then convert to 16-bit PCM
            let sample = Math.max(-1, Math.min(1, channels[i][pos]));
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
            view.setInt16(offset, sample, true);
            offset += 2;
        }
        pos++;
    }

    return arrayBuffer;

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }
}

// 3. Trigger the actual download
function exportAudio() {
    const state = window.WaveState;
    if (!state.audioBuffer) return;

    // Change button text to show it's working (encoding can take a second)
    const btn = state.elements.btnExport;
    const originalText = btn.innerText;
    btn.innerText = 'Encoding...';
    btn.disabled = true;

    // Use a tiny timeout to allow the UI to update before heavy processing blocks the thread
    setTimeout(() => {
        try {
            const wavData = audioBufferToWav(state.audioBuffer);
            const blob = new Blob([wavData], { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            
            // Create a temporary link to force the browser to download
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'remixed_audio.wav';
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Export failed. File might be too large.");
        } finally {
            // Restore button
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }, 50);
}

// 4. Watcher to enable the button only when audio is loaded
function monitorExportState() {
    const state = window.WaveState;
    if (state.elements.btnExport) {
        // Enable export if we have an audio buffer and it's not currently playing
        state.elements.btnExport.disabled = !state.audioBuffer;
    }
    requestAnimationFrame(monitorExportState);
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    injectExportUI();
    window.WaveState.elements.btnExport.addEventListener('click', exportAudio);
    monitorExportState();
});
