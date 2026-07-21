// script3.js - Fixed Waveform Engine & Modal Settings

// Ensure global state exists to prevent crashes
window.WaveState = window.WaveState || {};
Object.assign(window.WaveState, {
    canvasCtx: null,
    canvasWidth: 0,
    canvasHeight: 0,
    waveformPeaks: [],
    selection: { start: 0, end: 0, active: false },
    isDragging: false,
    hoverTime: 0,
    visualStyle: localStorage.getItem('wave_visualStyle') || 'sensational',
    showPlayhead: localStorage.getItem('wave_showPlayhead') !== 'false', // Default ON
    animationFrameId: null
});

function initCanvas() {
    const state = window.WaveState;
    if (!state.elements || !state.elements.canvas) return; // Safety check

    const canvas = state.elements.canvas;
    state.canvasCtx = canvas.getContext('2d');

    function resize() {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        state.canvasCtx.scale(dpr, dpr);
        state.canvasWidth = rect.width;
        state.canvasHeight = rect.height;
    }

    window.addEventListener('resize', resize);
    resize();
    setupCanvasInteractions();
    setupSettingsModal();
}

function setupSettingsModal() {
    const state = window.WaveState;
    
    // Elements
    const openBtn = document.getElementById('settings-open-btn');
    const closeBtn = document.getElementById('settings-close-btn');
    const modal = document.getElementById('settings-modal');
    const playheadToggle = document.getElementById('playhead-toggle');
    const styleToggle = document.getElementById('style-toggle');

    if (!modal) return;

    // Open/Close Modal
    openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    // 1. Playhead Toggle
    const updatePlayheadUI = () => {
        playheadToggle.innerText = state.showPlayhead ? 'ON' : 'OFF';
        playheadToggle.style.backgroundColor = state.showPlayhead ? '#2ecc71' : '#e74c3c';
    };
    updatePlayheadUI();

    playheadToggle.addEventListener('click', () => {
        state.showPlayhead = !state.showPlayhead;
        localStorage.setItem('wave_showPlayhead', state.showPlayhead);
        updatePlayheadUI();
    });

    // 2. Style Toggle
    const updateStyleUI = () => {
        styleToggle.innerText = state.visualStyle === 'sensational' ? 'Sensational Bars' : 'Original Wave';
        styleToggle.style.backgroundColor = state.visualStyle === 'sensational' ? '#7928ca' : '#0077ff';
    };
    updateStyleUI();

    styleToggle.addEventListener('click', () => {
        state.visualStyle = state.visualStyle === 'sensational' ? 'original' : 'sensational';
        localStorage.setItem('wave_visualStyle', state.visualStyle);
        updateStyleUI();
    });
}

// Fixed Peak Extraction
function extractWaveformPeaks() {
    const state = window.WaveState;
    if (!state.audioBuffer) return;

    const buffer = state.audioBuffer;
    const rawData = buffer.getChannelData(0);
    const totalBars = 90;
    const samplesPerBar = Math.floor(rawData.length / totalBars);
    state.waveformPeaks = [];

    let globalMax = 0.0001; 

    const rawPeaks = [];
    for (let i = 0; i < totalBars; i++) {
        let blockStart = samplesPerBar * i;
        let sum = 0;
        for (let j = 0; j < samplesPerBar; j++) {
            const val = rawData[blockStart + j];
            sum += val * val;
        }
        const rms = Math.sqrt(sum / samplesPerBar);
        rawPeaks.push(rms);
        if (rms > globalMax) globalMax = rms;
    }

    for (let i = 0; i < totalBars; i++) {
        state.waveformPeaks.push(rawPeaks[i] / globalMax);
    }
}

// Sensational Audio Bar Visualizer
function drawSensationalBarWaveform(ctx, width, height) {
    const state = window.WaveState;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#ff00aa');   
    gradient.addColorStop(0.5, '#a020f0'); 
    gradient.addColorStop(1, '#00f0ff');   

    ctx.save();
    
    if (state.isPlaying && state.analyser) {
        const bufferLength = state.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        state.analyser.getByteFrequencyData(dataArray);

        const barCount = 70;
        const barWidth = width / barCount;
        const step = Math.floor(bufferLength / barCount);

        for (let i = 0; i < barCount; i++) {
            const index = i * step;
            const normalizedVal = dataArray[index] / 255;
            const barHeight = Math.max(4, normalizedVal * (height * 0.82));
            const x = i * barWidth;

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, [3, 3, 0, 0]);
            ctx.fill();
        }
    } else if (state.waveformPeaks.length > 0) {
        const peaks = state.waveformPeaks;
        const barWidth = width / peaks.length;

        for (let i = 0; i < peaks.length; i++) {
            const x = i * barWidth;
            const barHeight = Math.max(4, peaks[i] * (height * 0.82));

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, [3, 3, 0, 0]);
            ctx.fill();
        }
    }
    ctx.restore();
}

function drawStaticWaveform(ctx, width, height) {
    const state = window.WaveState;
    if (state.waveformPeaks.length === 0) return;

    const peaks = state.waveformPeaks;
    const barWidth = width / peaks.length;
    const centerY = height / 2;

    ctx.save();
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#00ffcc');
    grad.addColorStop(0.5, '#7928ca');
    grad.addColorStop(1, '#00ffcc');

    ctx.fillStyle = grad;

    for (let i = 0; i < peaks.length; i++) {
        const x = i * barWidth;
        const peakHeight = peaks[i] * (height * 0.82);
        ctx.fillRect(x, centerY - (peakHeight / 2), barWidth + 0.5, peakHeight);
    }
    ctx.restore();
}

function drawRealtimeOscilloscope(ctx, width, height) {
    const state = window.WaveState;
    if (!state.analyser || !state.isPlaying) return;

    const bufferLength = state.analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);
    state.analyser.getByteTimeDomainData(dataArray);

    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#00ffcc';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ffcc';

    ctx.beginPath();
    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
    }

    ctx.stroke();
    ctx.restore();
}

function drawOverlays(ctx, width, height) {
    const state = window.WaveState;
    const duration = state.audioBuffer ? state.audioBuffer.duration : 0;
    if (duration === 0) return;

    // Always show selection box if dragging or active
    if (state.selection.active || state.isDragging) {
        const startX = (state.selection.start / duration) * width;
        const endX = (state.selection.end / duration) * width;
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 128, 0.3)';
        ctx.strokeStyle = '#ff0080';
        ctx.fillRect(startX, 0, endX - startX, height);
        ctx.strokeRect(startX, 0, endX - startX, height);
        ctx.restore();
    }

    // ONLY SHOW PLAYHEAD IF SETTING IS ON
    if (state.showPlayhead) {
        let currentPos = state.isPlaying 
            ? state.audioContext.currentTime - state.startedAt 
            : state.pausedAt;

        const playheadX = (currentPos / duration) * width;

        ctx.save();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(playheadX, 0);
        ctx.lineTo(playheadX, height);
        ctx.stroke();

        ctx.fillStyle = '#ff0055';
        ctx.beginPath();
        ctx.moveTo(playheadX - 6, 0);
        ctx.lineTo(playheadX + 6, 0);
        ctx.lineTo(playheadX, 10);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

function setupCanvasInteractions() {
    const state = window.WaveState;
    const canvas = state.elements.canvas;

    function getTimeFromX(e) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const duration = state.audioBuffer ? state.audioBuffer.duration : 0;
        return (x / rect.width) * duration;
    }

    canvas.addEventListener('mousedown', (e) => {
        if (!state.audioBuffer) return;
        const clickedTime = getTimeFromX(e);

        state.isDragging = true;
        state.selection.start = clickedTime;
        state.selection.end = clickedTime;
        state.selection.active = false;

        if (state.isPlaying) {
            // Optional check for pauseAudio existence
            if (typeof pauseAudio === 'function') pauseAudio();
            state.pausedAt = clickedTime;
            if (typeof playAudio === 'function') playAudio();
        } else {
            state.pausedAt = clickedTime;
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!state.audioBuffer) return;
        state.hoverTime = getTimeFromX(e);

        if (state.isDragging) {
            state.selection.end = state.hoverTime;
            if (Math.abs(state.selection.end - state.selection.start) > 0.05) {
                state.selection.active = true;
            }
        }
    });

    window.addEventListener('mouseup', () => {
        if (state.isDragging) {
            state.isDragging = false;
            if (state.selection.start > state.selection.end) {
                const temp = state.selection.start;
                state.selection.start = state.selection.end;
                state.selection.end = temp;
            }
        }
    });
}

function renderLoop() {
    const state = window.WaveState;
    const ctx = state.canvasCtx;
    const w = state.canvasWidth;
    const h = state.canvasHeight;

    if (ctx && w && h) {
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, w, h);

        if (state.visualStyle === 'sensational') {
            drawSensationalBarWaveform(ctx, w, h);
        } else {
            if (state.audioBuffer) drawStaticWaveform(ctx, w, h);
            if (state.isPlaying) drawRealtimeOscilloscope(ctx, w, h);
        }

        drawOverlays(ctx, w, h);
    }

    state.animationFrameId = requestAnimationFrame(renderLoop);
}

// Watcher to extract peaks when an audio file is uploaded
setInterval(() => {
    if (window.WaveState && window.WaveState.audioBuffer && window.WaveState.waveformPeaks.length === 0) {
        extractWaveformPeaks();
    }
}, 300);

window.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    renderLoop();
});
