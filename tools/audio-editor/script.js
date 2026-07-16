const audioUpload = document.getElementById('audio-upload');
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const pauseBtn = document.getElementById('pause-btn');
const volumeSlider = document.getElementById('volume-slider');
const speedSlider = document.getElementById('speed-slider');
const canvas = document.getElementById('visualizer');
const canvasCtx = canvas.getContext('2d');

let audioContext;
let analyser;
let source;

// Load the audio file
audioUpload.addEventListener('change', function(e) {
    const file = this.files[0];
    if (file) {
        const fileURL = URL.createObjectURL(file);
        audioPlayer.src = fileURL;
        
        // Initialize Web Audio API on first upload to bypass browser auto-play policies
        if (!audioContext) {
            setupAudioContext();
        }
    }
});

function setupAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    
    // Connect the HTML5 audio element to the Web Audio API
    source = audioContext.createMediaElementSource(audioPlayer);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    analyser.fftSize = 256;
    drawVisualizer();
}

// Play and Pause controls
playBtn.addEventListener('click', () => {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume();
    }
    audioPlayer.play();
});

pauseBtn.addEventListener('click', () => {
    audioPlayer.pause();
});

// Sliders for Volume and Speed
volumeSlider.addEventListener('input', (e) => {
    audioPlayer.volume = e.target.value;
});

speedSlider.addEventListener('input', (e) => {
    audioPlayer.playbackRate = e.target.value;
});

// Draw the frequency bar graph
function drawVisualizer() {
    requestAnimationFrame(drawVisualizer);
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    analyser.getByteFrequencyData(dataArray);
    
    // Adjust canvas size internally
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    
    canvasCtx.fillStyle = '#12121c';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = (canvas.width / bufferLength) * 2.5;
    let barHeight;
    let x = 0;
    
    for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        
        canvasCtx.fillStyle = `rgb(${barHeight + 100}, 175, 250)`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
    }
}
