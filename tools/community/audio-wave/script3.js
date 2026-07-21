// script3.js - Dual Waveform Renderer (Original Oscilloscope vs. Sensational Spectrum Bars)

Object.assign(window.WaveState, {
    canvasCtx: null,
    canvasWidth: 0,
    canvasHeight: 0,
    waveformPeaks: [],
    selection: { start: 0, end: 0, active: false },
    isDragging: false,
    hoverTime: 0,
    visualStyle: localStorage.getItem('wave_visualStyle') || 'sensational', // Loaded from localStorage!
    animationFrameId: null
});

function initCanvas() {
    const state = window.WaveState;
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
    setupStyleToggle();
}

// Save & restore style choice
function setupStyleToggle() {
    const state = window.WaveState;
    const toggleBtn = document.getElementById('style-toggle-btn');
    if (!toggleBtn) return;

    function updateBtnLabel() {
        toggleBtn.innerText = state.visualStyle === 'sensational' 
            ? 'Style: Sensational Bars' 
            : 'Style: Original Wave';
    }

    updateBtnLabel();

    toggleBtn.addEventListener('click', () => {
        state.visualStyle = state.visualStyle === 'sensational' ? 'original' : 'sensational';
        localStorage.setItem('wave_visualStyle', state.visualStyle); // Save to localStorage
        updateBtnLabel();
    });
}

function extractWaveformPeaks() {
    const state = window.WaveState;
    if (!state.audioBuffer) return;

    const buffer = state.audioBuffer;
    const rawData = buffer.getChannelData(0);
    const samples = 120; // Number of vertical bars across the screen
    const blockSize = Math.floor(rawData.length / samples);
    state.waveformPeaks = [];

    for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let max = 0;
        for (let j = 0; j < blockSize; j++) {
            let val = Math.abs(rawData[blockStart + j]);
            if (val > max) max = val;
        }
        state.waveformPeaks.push(max);
    }
}

// -------------------------------------------------------------
// SENSATIONAL AUDIO BAR VISUALIZER RENDERER (Pink to Cyan Gradient)
// -------------------------------------------------------------
function drawSensationalBarWaveform(ctx, width, height) {
    const state = window.WaveState;
    
    // Create Pink/Magenta -> Purple -> Cyan Gradient (Matches screenshots!)
    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, '#ff00aa');   // Neon Pink
    gradient.addColorStop(0.5, '#a020f0'); // Vibrant Purple
    gradient.addColorStop(1, '#00f0ff');   // Neon Cyan

    ctx.save();
    
    if (state.isPlaying && state.analyser) {
        // REAL-TIME FREQUENCY SPECTRUM BARS WHEN PLAYING
        const bufferLength = state.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        state.analyser.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 1.8;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * (height * 0.85);

            ctx.fillStyle = gradient;
            // Draw rounded-top bars sticking up from bottom
            ctx.beginPath();
            ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, [3, 3, 0, 0]);
            ctx.fill();

            x += barWidth;
        }
    } else if (state.waveformPeaks.length > 0) {
        // STATIC AUDIO BUFFER WAVEFORM BARS
        const peaks = state.waveformPeaks;
        const barWidth = width / peaks.length;
        const gap = 2;

        for (let i = 0; i < peaks.length; i++) {
            const x = i * barWidth;
            const barHeight = Math.max(4, peaks[i] * (height * 0.85));

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.roundRect(x, height - barHeight, barWidth - gap, barHeight, [3, 3, 0, 0]);
            ctx.fill();
        }
    }

    ctx.restore();
}

// ORIGINAL WAVEFORM RENDERER
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
        const peakHeight = peaks[i] * (height * 0.85);
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

    if (state.selection.active) {
        const startX = (state.selection.start / duration) * width;
        const endX = (state.selection.end / duration) * width;
        ctx.save();
        ctx.fillStyle = 'rgba(255, 0, 128, 0.3)';
        ctx.strokeStyle = '#ff0080';
        ctx.fillRect(startX, 0, endX - startX, height);
        ctx.strokeRect(startX, 0, endX - startX, height);
        ctx.restore();
    }

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
            pauseAudio();
            state.pausedAt = clickedTime;
            playAudio();
        } else {
            state.pausedAt = clickedTime;
        }

        localStorage.setItem('wave_pausedAt', state.pausedAt); // Persist position
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

        // CHOICE BETWEEN VISUAL STYLES
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

setInterval(() => {
    if (window.WaveState && window.WaveState.audioBuffer && window.WaveState.waveformPeaks.length === 0) {
        extractWaveformPeaks();
    }
}, 300);

window.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    renderLoop();
});
