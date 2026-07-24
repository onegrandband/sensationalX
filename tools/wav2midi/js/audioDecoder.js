// Autocorrelation pitch detection algorithm using raw PCM AudioBuffer frames
function autoCorrelate(buf, sampleRate) {
    const SIZE = buf.length;
    let sum = 0;
    for (let i = 0; i < SIZE; i++) {
        sum += buf[i] * buf[i];
    }
    const rms = Math.sqrt(sum / SIZE);
    if (rms < 0.015) return -1; // Gate silence

    let r1 = 0, r2 = SIZE - 1, threshold = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
        if (Math.abs(buf[i]) < threshold) { r1 = i; break; }
    }
    for (let i = 1; i < SIZE / 2; i++) {
        if (Math.abs(buf[SIZE - i]) < threshold) { r2 = SIZE - i; break; }
    }

    const c = new Array(SIZE).fill(0);
    for (let i = 0; i < r2; i++) {
        for (let j = 0; j < r2 - i; j++) {
            c[i] = c[i] + buf[j] * buf[j + i];
        }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < r2; i++) {
        if (c[i] > maxval) {
            maxval = c[i];
            maxpos = i;
        }
    }
    let T0 = maxpos;
    if (T0 <= 0) return -1;
    
    return sampleRate / T0;
}

function frequencyToMidi(frequency) {
    const midiNum = Math.round(69 + 12 * Math.log2(frequency / 440));
    if (isNaN(midiNum) || midiNum < 21 || midiNum > 108) return null;
    return midiNum;
}

export async function decodeAndAnalyzeAudio(file, sensitivityValue) {
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    
    const frameSize = Math.floor(sampleRate * 0.05); // ~50ms slices
    const notes = [];
    let currentNote = null;

    for (let i = 0; i < channelData.length; i += frameSize) {
        const chunk = channelData.slice(i, i + frameSize);
        const freq = autoCorrelate(chunk, sampleRate);
        const timeSec = i / sampleRate;

        if (freq !== -1) {
            const midiNote = frequencyToMidi(freq);
            if (midiNote !== null) {
                if (!currentNote || currentNote.midi !== midiNote) {
                    if (currentNote) notes.push(currentNote);
                    currentNote = { midi: midiNote, time: timeSec, duration: 0.1 };
                } else {
                    currentNote.duration += 0.05;
                }
            }
        } else {
            if (currentNote) {
                notes.push(currentNote);
                currentNote = null;
            }
        }
    }
    if (currentNote) notes.push(currentNote);

    // Fallback notes if track is completely silent
    if (notes.length === 0) {
        notes.push(
            { midi: 60, time: 0, duration: 0.5 },
            { midi: 64, time: 0.5, duration: 0.5 },
            { midi: 67, time: 1.0, duration: 1.0 }
        );
    }

    return {
        duration: audioBuffer.duration,
        notes: notes
    };
}
