import { decodeAndAnalyzeAudio } from './audioDecoder.js';
import { createMidiBlob } from './midiGenerator.js';
import { drawPianoRoll, playMidiNotes, stopMidiPlayback } from './pianoPlayer.js';

const dropZone = document.getElementById('dropZone');
const audioFileInput = document.getElementById('audioFile');
const fileLabel = document.getElementById('fileLabel');
const convertBtn = document.getElementById('convertBtn');
const sensitivityInput = document.getElementById('sensitivity');
const sensitivityValue = document.getElementById('sensitivityValue');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const statusText = document.getElementById('statusText');

const editorSection = document.getElementById('editorSection');
const editorStats = document.getElementById('editorStats');
const pianoRollCanvas = document.getElementById('pianoRollCanvas');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadBtn = document.getElementById('downloadBtn');

let selectedFile = null;
let currentNotes = [];
let midiBlob = null;

sensitivityInput.addEventListener('input', (e) => {
    sensitivityValue.textContent = e.target.value;
});

dropZone.addEventListener('click', () => audioFileInput.click());
dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFileSelection(e.dataTransfer.files[0]);
});

audioFileInput.addEventListener('change', (e) => {
    if (e.target.files.length) handleFileSelection(e.target.files[0]);
});

function handleFileSelection(file) {
    if (!file.name.endsWith('.wav') && !file.type.includes('audio')) {
        alert('Please choose a valid WAV file.');
        return;
    }
    selectedFile = file;
    fileLabel.innerHTML = `Selected: <strong>${file.name}</strong>`;
    convertBtn.disabled = false;
    editorSection.style.display = 'none';
}

convertBtn.addEventListener('click', async () => {
    if (!selectedFile) return;

    convertBtn.disabled = true;
    progressContainer.style.display = 'block';
    editorSection.style.display = 'none';
    progressFill.style.width = '20%';
    statusText.textContent = 'Decoding audio stream...';

    try {
        const sensitivity = parseInt(sensitivityInput.value);
        progressFill.style.width = '50%';
        statusText.textContent = 'Analyzing waveform & mapping notes...';

        const result = await decodeAndAnalyzeAudio(selectedFile, sensitivity);
        currentNotes = result.notes;

        progressFill.style.width = '80%';
        statusText.textContent = 'Building MIDI sequence & piano roll...';

        midiBlob = createMidiBlob(currentNotes);

        progressFill.style.width = '100%';
        statusText.textContent = 'Conversion successful!';

        setTimeout(() => {
            progressContainer.style.display = 'none';
            editorSection.style.display = 'block';
            editorStats.textContent = `Extracted Notes: ${currentNotes.length} | Audio Duration: ${result.duration.toFixed(1)}s`;
            
            drawPianoRoll(pianoRollCanvas, currentNotes);
            convertBtn.disabled = false;
        }, 300);

    } catch (err) {
        console.error(err);
        alert('Failed to process audio file. Make sure it is an uncompressed PCM WAV file.');
        progressContainer.style.display = 'none';
        convertBtn.disabled = false;
    }
});

playBtn.addEventListener('click', () => {
    if (currentNotes.length === 0) return;
    playMidiNotes(
        currentNotes,
        () => {
            playBtn.disabled = true;
            stopBtn.disabled = false;
            playBtn.textContent = 'Playing...';
        },
        () => {
            playBtn.disabled = false;
            stopBtn.disabled = true;
            playBtn.textContent = '▶ Play Preview';
        }
    );
});

stopBtn.addEventListener('click', () => {
    stopMidiPlayback();
    playBtn.disabled = false;
    stopBtn.disabled = true;
    playBtn.textContent = '▶ Play Preview';
});

downloadBtn.addEventListener('click', () => {
    if (!midiBlob) return;

    const url = URL.createObjectURL(midiBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, '') + '.mid' : 'converted.mid';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});
