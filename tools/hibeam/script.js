const toggleBtn = document.getElementById('torch-toggle');
const btnText = document.getElementById('btn-text');
const statusMsg = document.getElementById('status-msg');
const video = document.getElementById('video-stream');

let track = null;
let isTorchOn = false;

async function toggleFlashlight() {
    try {
        if (!track) {
            statusMsg.innerText = "Connecting to camera...";
            
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: "environment" } }
            });
            
            video.srcObject = stream;
            track = stream.getVideoTracks()[0];
            
            const capabilities = track.getCapabilities();
            
            // Check if browser/system is blocking the hardware torch
            if (!capabilities.torch) {
                statusMsg.style.color = "#ff5555";
                statusMsg.innerText = "Apple blocks web browsers from using the physical iPad flashlight. Try an App Store app or use the Control Center panel instead!";
                
                // Shut down the camera stream since Apple blocked the flash
                track.stop();
                track = null;
                return;
            }
        }

        isTorchOn = !isTorchOn;
        await track.applyConstraints({
            advanced: [{ torch: isTorchOn }]
        });

        if (isTorchOn) {
            toggleBtn.className = "power-btn on";
            btnText.innerText = "Turn Off";
            statusMsg.innerText = "Flashlight Active";
        } else {
            toggleBtn.className = "power-btn off";
            btnText.innerText = "Turn On";
            statusMsg.innerText = "Flashlight Inactive";
        }

    } catch (error) {
        console.error(error);
        statusMsg.style.color = "#ff5555";
        statusMsg.innerText = "Camera access denied. Go to Settings > Safari > Camera to allow access.";
    }
}

toggleBtn.addEventListener('click', toggleFlashlight);
