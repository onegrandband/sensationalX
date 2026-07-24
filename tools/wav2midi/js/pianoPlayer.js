let pianoSynth = null;
let isPlaying = false;
let currentPart = null;

export function initPianoPlayer() {
    if (!pianoSynth) {
        pianoSynth = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: "triangle8" },
            envelope: {
                attack: 0.005,
                decay: 3.0,
                sustain: 0.05,
                release: 1.2
            }
        }).toDestination();
        
        const reverb = new Tone.Reverb({ roomSize: 0.4, wet: 0.2 }).toDestination();
        pianoSynth.connect(reverb);
    }
}

export function drawPianoRoll(canvas, notes) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0b0f19';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (!notes || notes.length === 0) return;

    const minMidi = Math.min(...notes.map(n => n.midi));
    const maxMidi = Math.max(...notes.map(n => n.midi));
    const midiRange = Math.max(maxMidi - minMidi, 12);
    const maxTime = Math.max(...notes.map(n => n.time + n.duration)) || 1;

    notes.forEach(note => {
        const x = (note.time / maxTime) * (canvas.width - 20) + 10;
        const y = canvas.height - 20 - ((note.midi - minMidi) / midiRange) * (canvas.height - 30);
        const w = Math.max((note.duration / maxTime) * (canvas.width - 20), 6);
        const h = 6;

        ctx.fillStyle = '#6366f1';
        ctx.shadowColor = '#818cf8';
        ctx.shadowBlur = 4;
        ctx.fillRect(x, y, w, h);
        ctx.shadowBlur = 0;
    });
}

export async function playMidiNotes(notes, onStart, onStop) {
    await Tone.start();
    if (isPlaying) stopMidiPlayback();

    initPianoPlayer();
    isPlaying = true;
    if (onStart) onStart();

    const transportEvents = notes.map(n => {
        const noteName = Tone.Frequency(n.midi, "midi").toNote();
        return {
            time: n.time,
            note: noteName,
            duration: n.duration || 0.3
        };
    });

    currentPart = new Tone.Part((time, value) => {
        pianoSynth.triggerAttackRelease(value.note, value.duration, time);
    }, transportEvents);

    currentPart.start(0);
    Tone.Transport.position = 0;
    Tone.Transport.start();

    const maxDuration = Math.max(...notes.map(n => n.time + n.duration)) + 1.5;
    setTimeout(() => {
        if (isPlaying) {
            stopMidiPlayback();
            if (onStop) onStop();
        }
    }, maxDuration * 1000);
}

export function stopMidiPlayback() {
    isPlaying = false;
    Tone.Transport.stop();
    Tone.Transport.cancel();
    if (currentPart) {
        currentPart.dispose();
        currentPart = null;
    }
}
