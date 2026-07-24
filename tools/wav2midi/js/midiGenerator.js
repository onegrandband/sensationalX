import MidiWriter from 'https://esm.run/midi-writer-js';

export function createMidiBlob(notes) {
    const track = new MidiWriter.Track();
    track.addTrackName('Converted Grand Piano');
    track.addInstrumentName('Acoustic Grand Piano');

    notes.forEach(n => {
        track.addEvent(new MidiWriter.NoteEvent({
            pitch: [n.midi],
            duration: '4',
            velocity: 80
        }));
    });

    const writer = new MidiWriter.Writer(track);
    const midiArray = writer.buildFile();
    return new Blob([midiArray], { type: 'audio/midi' });
}
