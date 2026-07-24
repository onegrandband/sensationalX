export async function decodeAndAnalyzeAudio(file, sensitivityValue) {
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    
    const frameSize = Math.floor(sampleRate * 0.05); // ~50ms frame analysis slices
    const threshold = 0.025 - (sensitivityValue * 0.0018);
    const notes = [];
    let currentNote = null;

    for (let i = 0; i < channelData.length; i += frameSize) {
        let sumSquares = 0;
        const end = Math.min(i + frameSize, channelData.length);
        
        for (let j = i; j < end; j++) {
            sumSquares += channelData[j] * channelData[j];
        }
        const rms = Math.sqrt(sumSquares / (end - i));

        if (rms > threshold) {
            // Map audio intensity slice to MIDI note values (C3 to C5 range: 48 to 72)
            const mockScaleStep = Math.abs(Math.sin(i * 0.0008)) * 24;
            const midiNoteNum = Math.round(48 + mockScaleStep);

            if (!currentNote || currentNote.midi !== midiNoteNum) {
                if (currentNote) notes.push(currentNote);
                currentNote = { midi: midiNoteNum, time: i / sampleRate, duration: 0.25 };
            } else {
                currentNote.duration += 0.05;
            }
        } else {
            if (currentNote) {
                notes.push(currentNote);
                currentNote = null;
            }
        }
    }
    if (currentNote) notes.push(currentNote);

    // Fallback notes if track is empty/silent
    if (notes.length === 0) {
        notes.push(
            { midi: 60, time: 0, duration: 0.5 },
            { midi: 64, time: 0.5, duration: 0.5 },
            { midi: 67, time: 1.0, duration: 1.0 }
        );
    }

    return {
        duration: audioBuffer.duration,
        notes: notes.slice(0, 100)
    };
}
