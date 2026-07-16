// --- MULTI-TRACK DAW ENGINE (script2.js) ---

// Ensure we integrate smoothly with script.js global state
window.tracks = [];
let trackIdCounter = 0;

// Create the Multi-Track Container and "Add Track" Button dynamically
const containerDiv = document.querySelector('.container');
const trackSection = document.createElement('div');
trackSection.className = 'section';
trackSection.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0;">5. Multi-Track Mixer</h3>
        <button id="add-track-btn" style="padding: 6px 12px; font-size: 12px;">+ Add New Track</button>
    </div>
    <div id="tracks-container" style="display: flex; flex-direction: column; gap: 12px;"></div>
`;

// Insert the track section right before the MIDI configuration section
const midiSection = document.querySelector('.midi-section');
containerDiv.insertBefore(trackSection, midiSection);

const tracksContainer = document.getElementById('tracks-container');
const addTrackBtn = document.getElementById('add-track-btn');

// --- TRACK CLASS DEFINITION ---
class DAWTrack {
    constructor(id) {
        this.id = id;
        this.isMuted = false;
        this.isSoloed = false;
        this.volume = 0.8;
        this.pan = 0.0; // -1.0 (Left) to 1.0 (Right)
        this.audioBuffer = null;
        this.audioSource = null;
        
        // Dynamic LocalStorage keys
        this.storageKeyVol = `track_${this.id}_vol`;
        this.storageKeyPan = `track_${this.id}_pan`;

        this.loadSavedTrackSettings();
        this.createDOMElement();
        this.setupAudioNodes();
    }

    loadSavedTrackSettings() {
        if (localStorage.getItem(this.storageKeyVol) !== null) {
            this.volume = parseFloat(localStorage.getItem(this.storageKeyVol));
        }
        if (localStorage.getItem(this.storageKeyPan) !== null) {
            this.pan = parseFloat(localStorage.getItem(this.storageKeyPan));
        }
    }

    setupAudioNodes() {
        // Initialize the main audio engine if it hasn't been yet
        if (!window.audioCtx) {
            initAudioEngine();
        }

        // Create channel-specific gain (volume) and stereo panner nodes
        this.gainNode = audioCtx.createGain();
        this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : this.volume, audioCtx.currentTime);

        this.pannerNode = audioCtx.createStereoPanner ? audioCtx.createStereoPanner() : null;
        if (this.pannerNode) {
            this.pannerNode.pan.setValueAtTime(this.pan, audioCtx.currentTime);
            
            // Route: Track Source -> Panner -> Gain -> Master Gain (from script.js)
            this.pannerNode.connect(this.gainNode);
        } else {
            // Fallback for older browsers without StereoPanner support
            this.gainNode.connect(masterGain);
        }
        
        this.gainNode.connect(masterGain);
    }

    createDOMElement() {
        const trackRow = document.createElement('div');
        trackRow.className = 'track-lane';
        trackRow.id = `track-lane-${this.id}`;
        trackRow.style.cssText = `
            background: #181824;
            border: 1px solid #2d2d3f;
            border-radius: 8px;
            padding: 10px;
            display: grid;
            grid-template-columns: 1.2fr 1fr 1fr 0.8fr;
            align-items: center;
            gap: 10px;
        `;

        trackRow.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 4px;">
                <span style="font-size: 13px; font-weight: bold; color: #00f2fe;">Track ${this.id + 1}</span>
                <input type="file" id="track-file-${this.id}" accept="audio/*" style="font-size: 10px; width: 100%;">
            </div>

            <div class="slider-group">
                <label style="font-size: 10px;">Vol: <span id="vol-txt-${this.id}">${Math.round(this.volume * 100)}%</span></label>
                <input type="range" id="track-vol-${this.id}" min="0" max="1" step="0.01" value="${this.volume}" style="width: 100%;">
            </div>

            <div class="slider-group">
                <label style="font-size: 10px;">Pan: <span id="pan-txt-${this.id}">${this.pan === 0 ? 'C' : this.pan > 0 ? 'R ' + Math.round(this.pan * 100) : 'L ' + Math.round(Math.abs(this.pan) * 100)}</span></label>
                <input type="range" id="track-pan-${this.id}" min="-1" max="1" step="0.1" value="${this.pan}" style="width: 100%;">
            </div>

            <div style="display: flex; gap: 4px; justify-content: flex-end;">
                <button id="mute-btn-${this.id}" style="padding: 4px 8px; font-size: 11px; background: #3e3e56; color: white;">M</button>
                <button id="solo-btn-${this.id}" style="padding: 4px 8px; font-size: 11px; background: #3e3e56; color: white;">S</button>
                <button id="del-btn-${this.id}" style="padding: 4px 8px; font-size: 11px; background: #ef4444; color: white;">X</button>
            </div>
        `;

        tracksContainer.appendChild(trackRow);
        this.addEventListeners();
    }

    addEventListeners() {
        const fileInput = document.getElementById(`track-file-${this.id}`);
        const volSlider = document.getElementById(`track-vol-${this.id}`);
        const panSlider = document.getElementById(`track-pan-${this.id}`);
        const muteBtn = document.getElementById(`mute-btn-${this.id}`);
        const soloBtn = document.getElementById(`solo-btn-${this.id}`);
        const delBtn = document.getElementById(`del-btn-${this.id}`);

        // Load Audio File into Web Audio Buffer (for professional, sample-accurate playback syncing!)
        fileInput.addEventListener('change', async (e) => {
            initAudioEngine();
            const file = e.target.files[0];
            if (file) {
                const arrayBuffer = await file.arrayBuffer();
                audioCtx.decodeAudioData(arrayBuffer, (decodedBuffer) => {
                    this.audioBuffer = decodedBuffer;
                    fileInput.style.borderColor = "#00f2fe";
                }, (err) => console.error("Error decoding audio data:", err));
            }
        });

        // Track Volume Slider
        volSlider.addEventListener('input', (e) => {
            this.volume = parseFloat(e.target.value);
            localStorage.setItem(this.storageKeyVol, this.volume);
            document.getElementById(`vol-txt-${this.id}`).innerText = `${Math.round(this.volume * 100)}%`;
            if (!this.isMuted) {
                this.gainNode.gain.setValueAtTime(this.volume, audioCtx.currentTime);
            }
        });

        // Stereo Panning Slider (Left / Right channel balance)
        panSlider.addEventListener('input', (e) => {
            this.pan = parseFloat(e.target.value);
            localStorage.setItem(this.storageKeyPan, this.pan);
            const txt = this.pan === 0 ? 'C' : this.pan > 0 ? 'R ' + Math.round(this.pan * 100) : 'L ' + Math.round(Math.abs(this.pan) * 100);
            document.getElementById(`pan-txt-${this.id}`).innerText = txt;
            if (this.pannerNode) {
                this.pannerNode.pan.setValueAtTime(this.pan, audioCtx.currentTime);
            }
        });

        // Mute Button
        muteBtn.addEventListener('click', () => {
            this.isMuted = !this.isMuted;
            if (this.isMuted) {
                this.gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
                muteBtn.style.background = "#ef4444";
            } else {
                this.gainNode.gain.setValueAtTime(this.volume, audioCtx.currentTime);
                muteBtn.style.background = "#3e3e56";
            }
        });

        // Solo Button
        soloBtn.addEventListener('click', () => {
            this.isSoloed = !this.isSoloed;
            soloBtn.style.background = this.isSoloed ? "#eab308" : "#3e3e56";
            applySoloMuteStates();
        });

        // Delete Track
        delBtn.addEventListener('click', () => {
            this.stop();
            document.getElementById(`track-lane-${this.id}`).remove();
            window.tracks = window.tracks.filter(t => t.id !== this.id);
            localStorage.removeItem(this.storageKeyVol);
            localStorage.removeItem(this.storageKeyPan);
            applySoloMuteStates();
        });
    }

    // Playback controls using raw audio buffer for millisecond-perfect timing
    play(startTimeOffset = 0) {
        if (!this.audioBuffer || !audioCtx) return;

        this.stop(); // Stop any currently playing instance to prevent doubling

        this.audioSource = audioCtx.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;
        
        // Connect to panning routing chain
        if (this.pannerNode) {
            this.audioSource.connect(this.pannerNode);
        } else {
            this.audioSource.connect(this.gainNode);
        }

        // Apply global playback speed rate
        this.audioSource.playbackRate.setValueAtTime(parseFloat(speedSlider.value), audioCtx.currentTime);
        
        this.audioSource.start(0, startTimeOffset);
    }

    stop() {
        if (this.audioSource) {
            try {
                this.audioSource.stop();
            } catch (e) {
                // Buffer wasn't started yet or has already stopped
            }
            this.audioSource = null;
        }
    }
}

// --- GLOBAL MULTI-TRACK CONTROL INTERACTION ---

// Apply logic to mute everything except the soloed tracks
function applySoloMuteStates() {
    const anySoloed = window.tracks.some(t => t.isSoloed);

    window.tracks.forEach(t => {
        if (anySoloed) {
            if (t.isSoloed && !t.isMuted) {
                t.gainNode.gain.setValueAtTime(t.volume, audioCtx.currentTime);
            } else {
                t.gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            }
        } else {
            // Restore normal mute state
            t.gainNode.gain.setValueAtTime(t.isMuted ? 0 : t.volume, audioCtx.currentTime);
        }
    });
}

// Instantiate new track lanes when clicking the button
addTrackBtn.addEventListener('click', () => {
    initAudioEngine();
    const newTrack = new DAWTrack(trackIdCounter++);
    window.tracks.push(newTrack);
});

// Sync Play, Pause, and Stop buttons from script.js to trigger the new tracks!
playBtn.addEventListener('click', () => {
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    // Play all loaded buffer tracks simultaneously
    window.tracks.forEach(track => track.play());
});

pauseBtn.addEventListener('click', () => {
    // Note: Since buffer sources can't be "paused" and resumed like standard <audio> elements,
    // they are stopped, and when Play is hit they will restart.
    window.tracks.forEach(track => track.stop());
});

stopBtn.addEventListener('click', () => {
    window.tracks.forEach(track => track.stop());
});
