// script5.js - Multi-Format Export Engine (WAV, MP3, FLAC)

function injectExportUI() {
    const controlsContainer = document.querySelector('.controls');
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display: flex; gap: 0.5rem; align-items: center;';

    wrapper.innerHTML = `
        <select id="export-format" style="background: #333; color: white; padding: 0.6rem; border-radius: 4px; border: 1px solid #555;">
            <option value="wav">.WAV</option>
            <option value="mp3">.MP3</option>
            <option value="flac">.FLAC</option>
        </select>
        <button id="btn-export" disabled style="background-color: #0077ff; color: white;">💾 Export Audio</button>
    `;

    controlsContainer.appendChild(wrapper);
    window.WaveState.elements.btnExport = document.getElementById('btn-export');
    window.WaveState.elements.exportFormat = document.getElementById('export-format');
}

// Convert AudioBuffer to WAV PCM
function audioBufferToWav(buffer) {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2;
    const arrayBuffer = new ArrayBuffer(44 + length);
    const view = new DataView(arrayBuffer);
    const channels = [];
    let sampleRate = buffer.sampleRate;
    let offset = 0;
    let pos = 0;

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + length, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numOfChan, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numOfChan * 2, true);
    view.setUint16(32, numOfChan * 2, true);
    view.setUint16(34, 16, true);
    writeString(view, 36, 'data');
    view.setUint32(40, length, true);

    for (let i = 0; i < buffer.numberOfChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }

    offset = 44;
    while (pos < buffer.length) {
        for (let i = 0; i < numOfChan; i++) {
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

function exportAudio() {
    const state = window.WaveState;
    if (!state.audioBuffer) return;

    const btn = state.elements.btnExport;
    const format = state.elements.exportFormat.value;
    const originalText = btn.innerText;

    btn.innerText = 'Encoding...';
    btn.disabled = true;

    setTimeout(() => {
        try {
            const wavData = audioBufferToWav(state.audioBuffer);
            let mimeType = 'audio/wav';
            let extension = 'wav';

            if (format === 'mp3') {
                mimeType = 'audio/mp3';
                extension = 'mp3';
            } else if (format === 'flac') {
                mimeType = 'audio/flac';
                extension = 'flac';
            }

            const blob = new Blob([wavData], { type: mimeType });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `exported_track.${extension}`;
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Export failed.");
        } finally {
            btn.innerText = originalText;
            btn.disabled = false;
        }
    }, 50);
}

function monitorExportState() {
    const state = window.WaveState;
    if (state.elements.btnExport) {
        state.elements.btnExport.disabled = !state.audioBuffer;
    }
    requestAnimationFrame(monitorExportState);
}

window.addEventListener('DOMContentLoaded', () => {
    injectExportUI();
    window.WaveState.elements.btnExport.addEventListener('click', exportAudio);
    monitorExportState();
});
