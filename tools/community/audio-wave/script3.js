// script3.js - High-Performance Interactive Waveform & Oscilloscope Engine

// Extend global state for editor features
Object.assign(window.WaveState, {
    canvasCtx: null,
    canvasWidth: 0,
    canvasHeight: 0,
    waveformPeaks: [], // Extracted raw audio peaks for Audacity/FL studio timeline view
    selection: { start: 0, end: 0, active: false }, // Selection range in seconds
    isDragging: false,
    hoverTime: 0,
    animationFrameId: null
});

// 1. Canvas Setup & DPI Auto-Resizer
function initCanvas() {
    const state = window.WaveState;
    const canvas = state.elements.canvas;
    state.canvasCtx = canvas.getContext('2d');

    function resize() {
        // High-DPI screen scaling for ultra-sharp waveforms
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
}

// 2. Pre-calculate Audio Buffer Peaks (Audacity Style static overview)
function extractWaveformPeaks() {
    const state = window.WaveState;
    if (!state.audioBuffer) return;

    const buffer = state.audioBuffer;
    const rawData = buffer.getChannelData(0); // Primary left/mono channel
    const samples = 1000; // Number of peak bars across the timeline width
    const blockSize = Math.floor(rawData.length / samples);
    state.waveformPeaks = [];

    for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        let max = 0;
        for (let j = 0; j < blockSize; j++) {
            let val = Math.abs(rawData[blockStart + j]);
            if (val > max) max = val;
            sum += val;
        }
        // Store both max peak and RMS average for realistic FL Studio peak outlines
        state.waveformPeaks.push({
            max: max,
            avg: sum / blockSize
        });
    }
}

// 3. FL Studio / Audacity Timeline Grid Drawer
function drawTimelineGrid(ctx, width, height, duration) {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '10px monospace';
    ctx.lineWidth = 1;

    const gridSections = 10;
    const stepX = width / gridSections;
    const timeStep = duration / gridSections;

    for (let i = 0; i <= gridSections; i++) {
        const x = i * stepX;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        // Draw Timestamp (e.g. 01:25)
        if (duration > 0) {
            const timeSec = i * timeStep;
            const mins = Math.floor(timeSec / 60);
            const secs = Math.floor(timeSec % 60).toString().padStart(2, '0');
            const millis = Math.floor((timeSec % 1) * 10);
            ctx.fillText(`${mins}:${secs}.${millis}`, x + 4, 14);
        }
    }

    // Center Zero-Line
    ctx.strokeStyle = 'rgba(0, 255, 204, 0.2)';
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

    ctx.restore();
}

// 4. Static Audio Waveform Overview (Audacity View)
function drawStaticWaveform(ctx, width, height) {
    const state = window.WaveState;
    if (state.waveformPeaks.length === 0) return;

    const peaks = state.waveformPeaks;
    const barWidth = width / peaks.length;
    const centerY = height / 2;

    ctx.save();
    // Waveform gradient (FL Studio style neon purple/cyan fill)
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#00ffcc');
    grad.addColorStop(0.5, '#7928ca');
    grad.addColorStop(1, '#00ffcc');

    ctx.fillStyle = grad;

    for (let i = 0; i < peaks.length; i++) {
        const x = i * barWidth;
        const peakHeight = peaks[i].max * (height * 0.85);

        // Mirror wave top and bottom around centerline
        ctx.fillRect(x, centerY - (peakHeight / 2), barWidth + 0.5, peakHeight);
    }
    ctx.restore();
}

// 5. Live Oscilloscope Waveform Drawer (Real-Time Visualizer Mode)
function drawRealtimeOscilloscope(ctx, width, height) {
    const state = window.WaveState;
    if (!state.analyser || !state.isPlaying) return;

    const bufferLength = state.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    state.analyser.getByteTimeDomainData(dataArray);

    ctx.save();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#00ffcc';
    ctx.shadowBlur = 12;
    ctx.shadowColor = '#00ffcc';

    ctx.beginPath();
    const sliceWidth = width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0; // Normalize [0, 255] to [0, 2]
        const y = (v * height) / 2;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        x += sliceWidth;
    }

    ctx.stroke();
    ctx.restore();
}

// 6. Interactive Playhead and Selection Highlight Drawer
function drawOverlays(ctx, width, height) {
    const state = window.WaveState;
    const duration = state.audioBuffer ? state.audioBuffer.duration : 0;
    if (duration === 0) return;

    // Draw Selection Box (Audacity edit region)
    if (state.selection.active) {
        const startX = (state.selection.start / duration) * width;
        const endX = (state.selection.end / duration) * width;
        const selWidth = endX - startX;

        ctx.save();
        ctx.fillStyle = 'rgba(255, 85, 0, 0.35)';
        ctx.strokeStyle = '#ff5500';
        ctx.lineWidth = 1.5;
        ctx.fillRect(startX, 0, selWidth, height);
        ctx.strokeRect(startX, 0, selWidth, height);
        ctx.restore();
    }

    // Current Playhead Line
    let currentPos = 0;
    if (state.isPlaying) {
        currentPos = state.audioContext.currentTime - state.startedAt;
    } else {
        currentPos = state.pausedAt;
    }

    const playheadX = (currentPos / duration) * width;

    // Draw Playhead Line & Cursor Handle
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#ffffff';

    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();

    // Top Cursor Triangle
    ctx.fillStyle = '#ff0055';
    ctx.beginPath();
    ctx.moveTo(playheadX - 6, 0);
    ctx.lineTo(playheadX + 6, 0);
    ctx.lineTo(playheadX, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// 7. Canvas Interaction (Scrubbing, Seeking & Drag Selection)
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

        // Jump playback position to click (Seek feature)
        if (state.isPlaying) {
            pauseAudio();
            state.pausedAt = clickedTime;
            playAudio();
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
            // Normalize start & end times if dragged backwards
            if (state.selection.start > state.selection.end) {
                const temp = state.selection.start;
                state.selection.start = state.selection.end;
                state.selection.end = temp;
            }
        }
    });
}

// 8. Main Continuous Renderer Loop
function renderLoop() {
    const state = window.WaveState;
    const ctx = state.canvasCtx;
    const w = state.canvasWidth;
    const h = state.canvasHeight;
    const duration = state.audioBuffer ? state.audioBuffer.duration : 0;

    if (ctx && w && h) {
        // Clear background
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(0, 0, w, h);

        // Draw Layer 1: Timeline Grid
        drawTimelineGrid(ctx, w, h, duration);

        // Draw Layer 2: Audio Waveform Background
        if (state.audioBuffer) {
            drawStaticWaveform(ctx, w, h);
        }

        // Draw Layer 3: Live Oscilloscope Overlay during active playback
        if (state.isPlaying) {
            drawRealtimeOscilloscope(ctx, w, h);
        }

        // Draw Layer 4: Selection Region & Playhead Cursor
        drawOverlays(ctx, w, h);
    }

    state.animationFrameId = requestAnimationFrame(renderLoop);
}

// Intercept file loading from script1 to trigger peak generation
const originalFileHandler = state => state;
const checkBufferInterval = setInterval(() => {
    if (window.WaveState && window.WaveState.audioBuffer && window.WaveState.waveformPeaks.length === 0) {
        extractWaveformPeaks();
    }
}, 300);

// Initialize Engine
window.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    renderLoop();
});
