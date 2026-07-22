// ==========================================
// SensationalX Video Recorder Logic
// ==========================================

let mediaRecorder;
let recordedChunks = [];
let stream = null;

// Target DOM Elements (Ensure these IDs exist in your HTML)
const videoPreview = document.getElementById('videoPreview');     // <video> for live webcam feed
const recordedPlayback = document.getElementById('recordedPlayback'); // <video> for playback
const startBtn = document.getElementById('startRecordBtn');       // <button> to start
const stopBtn = document.getElementById('stopRecordBtn');         // <button> to stop
const downloadBtn = document.getElementById('downloadBtn');       // <button> to download

/**
 * Request access to the user's webcam and microphone
 */
async function setupCamera() {
    try {
        // Request high definition video and audio
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 1280, height: 720 }, 
            audio: true 
        });
        
        if (videoPreview) {
            videoPreview.srcObject = stream;
            videoPreview.muted = true; // Mute the live preview to prevent audio feedback loops
        }
        
        console.log("Camera and microphone successfully initialized.");
    } catch (error) {
        console.error("Error accessing media devices:", error);
        alert("Could not access the camera or microphone. Please ensure permissions are granted in your browser settings.");
    }
}

/**
 * Start the recording process
 */
function startRecording() {
    if (!stream) {
        alert("Camera stream is not initialized yet.");
        return;
    }
    
    recordedChunks = []; // Clear any previous recordings
    
    // Prefer WebM format with VP9 codec for high quality/compression
    const options = { mimeType: 'video/webm; codecs=vp9' };
    
    try {
        mediaRecorder = new MediaRecorder(stream, options);
    } catch (e) {
        console.warn("VP9 format not supported, falling back to browser default.", e);
        mediaRecorder = new MediaRecorder(stream);
    }

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
    
    mediaRecorder.start();
    
    // Toggle UI States
    if (startBtn) startBtn.disabled = true;
    if (stopBtn) stopBtn.disabled = false;
    if (downloadBtn) downloadBtn.disabled = true;
    
    console.log("Recording started...");
}

/**
 * Push streaming data chunks into our array as they become available
 */
function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
    }
}

/**
 * Stop the active recording
 */
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        
        // Toggle UI States
        if (startBtn) startBtn.disabled = false;
        if (stopBtn) stopBtn.disabled = true;
        if (downloadBtn) downloadBtn.disabled = false;
        
        console.log("Recording stopped.");
    }
}

/**
 * Process the data once the recording has fully stopped
 */
function handleStop() {
    const superBuffer = new Blob(recordedChunks, { type: 'video/webm' });
    const videoURL = window.URL.createObjectURL(superBuffer);
    
    // If you have a second video element for playback, set its source
    if (recordedPlayback) {
        recordedPlayback.src = videoURL;
        recordedPlayback.controls = true; 
    }
}

/**
 * Generate a downloadable file for the user
 */
function downloadRecording() {
    if (recordedChunks.length === 0) {
        console.warn("No recording available to download.");
        return;
    }
    
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    // Create a temporary anchor link to trigger the file download
    document.body.appendChild(a);
    a.style.display = 'none';
    a.href = url;
    a.download = `SX_Recording_${new Date().getTime()}.webm`; // Dynamic filename with timestamp
    a.click();
    
    // Clean up the temporary URL and anchor element
    window.URL.revokeObjectURL(url);
    a.remove();
}

// ==========================================
// Initialization & Event Listeners
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Start the camera stream as soon as the page loads
    setupCamera(); 
    
    // Attach click events to your buttons
    if (startBtn) startBtn.addEventListener('click', startRecording);
    if (stopBtn) stopBtn.addEventListener('click', stopRecording);
    if (downloadBtn) downloadBtn.addEventListener('click', downloadRecording);
});
