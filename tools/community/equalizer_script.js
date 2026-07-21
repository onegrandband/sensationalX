const audioFileInput = document.getElementById('audioFile');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const exportBtn = document.getElementById('exportBtn');
const exportFormatSelect = document.getElementById('exportFormat');
const trackInfo = document.getElementById('trackInfo');
const canvas = document.getElementById('waveformCanvas');
const canvasContainer = document.getElementById('canvasContainer');
const deleteDataBtn = document.getElementById('deleteDataBtn');
const ctx = canvas.getContext('2d');
const eqGrid = document.getElementById('eqGrid');

let audioCtx = null;
let audioBuffer = null;
let sourceNode = null;
let gainNode = null;
let eqFilters = [];
let loadedFileName = "audio_processed";

let isPlaying = false;
let startTime = 0;
let pauseOffset = 0;
let animationFrameId = null;

let ffmpegInstance = null;

const eqBands = [
    { freq: 60, label: '60 Hz' },
    { freq: 170, label: '170 Hz' },
    { freq: 350, label: '350 Hz' },
    { freq: 1000, label: '1 kHz' },
    { freq: 3500, label: '3.5 kHz' },
    { freq: 10000, label: '10 kHz' }
];

function initEQUI() {
    eqGrid.innerHTML = '';
    eqBands.forEach((band, index) => {
        const group = document.createElement('div');
        group.className = 'eq-slider-group';
        group.innerHTML = `
            <label>${band.label}</label>
            <input type="range" id="eq-${index}" min="-20" max="20" step="0.5" value="0">
            <span class="eq-value" id="val-${index}">0.0 dB</span>
        `;
        eqGrid.appendChild(group);

        const slider = group.querySelector('input');
        const valDisplay = group.querySelector(`#val-${index}`);
        
        slider.addEventListener('input', (e) => {
            const val = parseFloat(e.target.value);
            valDisplay.textContent = `${val > 0 ? '+' : ''}${val.toFixed(1)} dB`;
            if (eqFilters[index]) {
                eqFilters[index].gain.value = val;
            }
            saveEQSettings();
        });
    });
    loadEQSettings();
}
initEQUI();

function saveEQSettings() {
    const settings = eqBands.map((_, index) => {
        const slider = document.getElementById(`eq-${index}`);
        return slider ? parseFloat(slider.value) : 0;
    });
    localStorage.setItem('studio_eq_settings', JSON.stringify(settings));
}

function loadEQSettings() {
    const saved = localStorage.getItem('studio_eq_settings');
    if (saved) {
        try {
            const settings = JSON.parse(saved);
            settings.forEach((val, index) => {
                const slider = document.getElementById(`eq-${index}`);
                const valDisplay = document.getElementById(`val-${index}`);
                if (slider && valDisplay) {
                    slider.value = val;
                    valDisplay.textContent = `${val > 0 ? '+' : ''}${val.toFixed(1)} dB`;
                    if (eqFilters[index]) {
                        eqFilters[index].gain.value = val;
                    }
                }
            });
        } catch (e) {
            console.error("Failed to load saved EQ data:", e);
        }
    }
}

deleteDataBtn.addEventListener('click', () => {
    if (confirm("Are you sure you would like to delete your saved data? Any unsaved changes will be deleted permanently.")) {
        localStorage.removeItem('studio_eq_settings');
        eqBands.forEach((_, index) => {
            const slider = document.getElementById(`eq-${index}`);
            const valDisplay = document.getElementById(`val-${index}`);
            if (slider && valDisplay) {
                slider.value = 0;
                valDisplay.textContent = "0.0 dB";
                if (eqFilters[index]) {
                    eqFilters[index].gain.value = 0;
                }
            }
        });
        trackInfo.textContent = "Saved data cleared successfully.";
    }
});

audioFileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const lastDot = file.name.lastIndexOf('.');
    loadedFileName = lastDot !== -1 ? file.name.substring(0, lastDot) : file.name;
    
    trackInfo.textContent = `Loading: ${file.name}...`;
    stopAudio();

    try {
        const arrayBuffer = await file.arrayBuffer();
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        
        trackInfo.textContent = `Loaded: ${file.name} (${formatTime(audioBuffer.duration)})`;
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        exportBtn.disabled = false;
        pauseOffset = 0;

        resizeCanvas();
        drawWaveform();
    } catch (err) {
        trackInfo.textContent = 'Error loading audio file.';
        alert('Could not decode audio file. Ensure it is a valid format.');
    }
});

function resizeCanvas() {
    canvas.width = canvasContainer.clientWidth * window.devicePixelRatio;
    canvas.height = 180 * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

window.addEventListener('resize', () => {
    if (audioBuffer) {
        resizeCanvas();
        drawWaveform();
    }
});

function drawWaveform(playheadTime = 0) {
    if (!audioBuffer) return;

    const width = canvasContainer.clientWidth;
    const height = 180;
    ctx.clearRect(0, 0, width, height);

    const rawData = audioBuffer.getChannelData(0);
    const samples = width;
    const blockSz = Math.floor(rawData.length / samples);
    const amp = height / 2;

    for (let i = 0; i < samples; i++) {
        let min = 1.0;
        let max = -1.0;
        for (let j = 0; j < blockSz; j++) {
            const val = rawData[i * blockSz + j];
            if (val < min) min = val;
            if (val > max) max = val;
        }
        const yMin = (1.0 + min) * amp;
        const yMax = (1.0 + max) * amp;
        
        const progressTime = (i / samples) * audioBuffer.duration;
        ctx.fillStyle = progressTime <= playheadTime ? '#ff3366' : '#3f3f4a';
        ctx.fillRect(i, yMin, 1, Math.max(1, yMax - yMin));
    }

    if (audioBuffer.duration > 0) {
        const playheadX = (playheadTime / audioBuffer.duration) * width;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, height);
        ctx.stroke();
    }
}

function setupAudioGraph() {
    sourceNode = audioCtx.createBufferSource();
    sourceNode.buffer = audioBuffer;

    gainNode = audioCtx.createGain();
    gainNode.gain.value = 1.0;

    eqFilters = eqBands.map((band, index) => {
        const filter = audioCtx.createBiquadFilter();
        filter.type = index === 0 ? 'lowshelf' : (index === eqBands.length - 1 ? 'highshelf' : 'peaking');
        filter.frequency.value = band.freq;
        filter.Q.value = 1.0;
        
        const sliderVal = parseFloat(document.getElementById(`eq-${index}`).value);
        filter.gain.value = sliderVal;
        return filter;
    });

    let lastNode = sourceNode;
    eqFilters.forEach(filter => {
        lastNode.connect(filter);
        lastNode = filter;
    });

    lastNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    sourceNode.onended = () => {
        if (isPlaying && (audioCtx.currentTime - startTime >= audioBuffer.duration - pauseOffset)) {
            stopAudio();
        }
    };
}

playBtn.addEventListener('click', () => {
    if (!audioBuffer || isPlaying) return;
    if (audioCtx.state === 'suspended') audioCtx.resume();

    setupAudioGraph();

    sourceNode.start(0, pauseOffset);
    startTime = audioCtx.currentTime;
    isPlaying = true;

    playBtn.disabled = true;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
    audioFileInput.disabled = true;

    trackLoop();
});

pauseBtn.addEventListener('click', () => {
    if (!isPlaying) return;
    pauseOffset += audioCtx.currentTime - startTime;
    stopPlaybackOnly();

    playBtn.disabled = false;
    pauseBtn.disabled = true;
    stopBtn.disabled = false;
    audioFileInput.disabled = false;
});

stopBtn.addEventListener('click', () => {
    stopAudio();
});

function stopPlaybackOnly() {
    if (sourceNode) {
        try { sourceNode.stop(); } catch (e) {}
        sourceNode.disconnect();
        sourceNode = null;
    }
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    isPlaying = false;
}

function stopAudio() {
    stopPlaybackOnly();
    pauseOffset = 0;
    if (audioBuffer) {
        drawWaveform(0);
        playBtn.disabled = false;
    }
    pauseBtn.disabled = true;
    stopBtn.disabled = true;
    audioFileInput.disabled = false;
}

function trackLoop() {
    if (!isPlaying) return;

    const currentPlaybackTime = pauseOffset + (audioCtx.currentTime - startTime);
    if (currentPlaybackTime >= audioBuffer.duration) {
        stopAudio();
        return;
    }

    drawWaveform(currentPlaybackTime);
    animationFrameId = requestAnimationFrame(trackLoop);
}

canvasContainer.addEventListener('click', (e) => {
    if (!audioBuffer) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    const targetTime = clickRatio * audioBuffer.duration;

    const wasPlaying = isPlaying;
    if (isPlaying) {
        stopPlaybackOnly();
    }

    pauseOffset = targetTime;
    drawWaveform(targetTime);

    if (wasPlaying) {
        playBtn.click();
    }
});

// --- FFMPEX LOADING & EXPORT LOGIC ---
async function getFFmpegInstance() {
    if (ffmpegInstance && ffmpegInstance.loaded) return ffmpegInstance;
    
    const { FFmpeg } = window.FFmpegWASM;
    const { toBlobURL } = window.FFmpegUtil;

    ffmpegInstance = new FFmpeg();
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    
    trackInfo.textContent = "Loading FFmpeg core (WASM)...";
    await ffmpegInstance.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    return ffmpegInstance;
}

exportBtn.addEventListener('click', async () => {
    if (!audioBuffer) return;

    exportBtn.disabled = true;
    trackInfo.textContent = "Rendering EQ offline...";

    try {
        const offlineCtx = new OfflineAudioContext(
            audioBuffer.numberOfChannels,
            audioBuffer.length,
            audioBuffer.sampleRate
        );

        const offlineSource = offlineCtx.createBufferSource();
        offlineSource.buffer = audioBuffer;

        const offlineFilters = eqBands.map((band, index) => {
            const filter = offlineCtx.createBiquadFilter();
            filter.type = index === 0 ? 'lowshelf' : (index === eqBands.length - 1 ? 'highshelf' : 'peaking');
            filter.frequency.value = band.freq;
            filter.Q.value = 1.0;
            filter.gain.value = parseFloat(document.getElementById(`eq-${index}`).value);
            return filter;
        });

        let lastNode = offlineSource;
        offlineFilters.forEach(filter => {
            lastNode.connect(filter);
            lastNode = filter;
        });

        lastNode.connect(offlineCtx.destination);
        offlineSource.start(0);

        const renderedBuffer = await offlineCtx.startRendering();
        const format = exportFormatSelect.value; // 'wav', 'mp3', 'flac', 'm4a', 'm4r'

        const wavBlob = encodeWAV(renderedBuffer);
        const wavArrayBuffer = await wavBlob.arrayBuffer();

        trackInfo.textContent = `Transcoding to .${format} via FFmpeg...`;
        const ffmpeg = await getFFmpegInstance();

        const inputFileName = 'input.wav';
        const outputFileName = `output.${format === 'm4r' ? 'm4a' : format}`;

        await ffmpeg.writeFile(inputFileName, new Uint8Array(wavArrayBuffer));

        let ffmpegArgs = ['-i', inputFileName];
        if (format === 'mp3') {
            ffmpegArgs.push('-codec:a', 'libmp3lame', '-b:a', '192k');
        } else if (format === 'flac') {
            ffmpegArgs.push('-codec:a', 'flac');
        } else if (format === 'm4a' || format === 'm4r') {
            ffmpegArgs.push('-codec:a', 'aac', '-b:a', '192k');
        } else {
            ffmpegArgs.push('-codec:a', 'pcm_s16le');
        }
        ffmpegArgs.push(outputFileName);

        await ffmpeg.exec(ffmpegArgs);

        const data = await ffmpeg.readFile(outputFileName);
        
        let mimeType = 'audio/wav';
        if (format === 'mp3') mimeType = 'audio/mpeg';
        else if (format === 'flac') mimeType = 'audio/flac';
        else if (format === 'm4a' || format === 'm4r') mimeType = 'audio/mp4';

        const outputBlob = new Blob([data.buffer], { type: mimeType });
        const url = URL.createObjectURL(outputBlob);
        
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${loadedFileName}_eq.${format}`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        trackInfo.textContent = `Export complete! Downloaded as .${format}`;
    } catch (err) {
        console.error(err);
        trackInfo.textContent = "Export failed.";
        alert("Error during FFmpeg export: " + err.message);
    } finally {
        exportBtn.disabled = false;
    }
});

function encodeWAV(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;

    const resultBuffer = numChannels === 2 ? interleave(buffer.getChannelData(0), buffer.getChannelData(1)) : buffer.getChannelData(0);
    const dataLength = resultBuffer.length * (bitDepth / 8);
    const headerLength = 44;
    const wavBuffer = new ArrayBuffer(headerLength + dataLength);
    const view = new DataView(wavBuffer);

    function writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + dataLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true);
    view.setUint16(32, numChannels * (bitDepth / 8), true);
    view.setUint16(34, bitDepth, true);
    writeString(view, 36, 'data');
    view.setUint32(40, dataLength, true);

    let offset = 44;
    for (let i = 0; i < resultBuffer.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, resultBuffer[i]));
        view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }

    return new Blob([view], { type: 'audio/wav' });
}

function interleave(inputL, inputR) {
    const length = inputL.length + inputR.length;
    const result = new Float32Array(length);
    let index = 0;
    for (let i = 0; i < inputL.length; i++) {
        result[index++] = inputL[i];
        result[index++] = inputR[i];
    }
    return result;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
