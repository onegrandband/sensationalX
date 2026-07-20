const toggleBtn = document.getElementById('torch-toggle');
const btnText = document.getElementById('btn-text');
const statusMsg = document.getElementById('status-msg');
const video = document.getElementById('video-stream');

let track = null;
let isTorchOn = false;

// Function to initialize and toggle the hardware flashlight
async function toggleFlashlight() {
    try {
        // 1. If we don't have a camera track yet, request it
        if (!track) {
            statusMsg.innerText = "Requesting camera permission...";
            
            // Ask for the rear-facing camera specifically
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: { exact: "environment" } }
            });
            
            video.srcObject = stream;
            track = stream.getVideoTracks()[0];
            
            // Verify if this device actually has a physical torch/flashlight feature
            const capabilities = track.getCapabilities();
            if (!capabilities.torch) {
                statusMsg.innerText = "Error: Torch capability not supported on this device/browser.";
                track.stop();
                track = null;
                return;
            }
        }

        // 2. Flip the state and apply it to the hardware
        isTorchOn = !isTorchOn;
        await track.applyConstraints({
            advanced: [{ torch: isTorchOn }]
        });

        // 3. Update the UI styles
        if (isTorchOn) {
            toggleBtn.classList.remove('off');
            toggleBtn.classList.add('on');
            btnText.innerText = "Turn Off";
            statusMsg.innerText = "Flashlight Active";
        } else {
            toggleBtn.classList.remove('on');
            toggleBtn.classList.add('off');
            btnText.innerText = "Turn On";
            statusMsg.innerText = "Flashlight Inactive";
        }

    } catch (error) {
        console.error(error);
        statusMsg.innerText = "Error: Rear camera access denied or unavailable.";
    }
}

// Attach event listener to button
toggleBtn.addEventListener('click', toggleFlashlight);
