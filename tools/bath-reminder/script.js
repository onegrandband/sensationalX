let countdownInterval = null;
let totalSecondsRemaining = 0;

// DOM Element Registry
const setupContainer = document.getElementById('setup-container');
const countdownContainer = document.getElementById('countdown-container');
const minutesInput = document.getElementById('minutes-input');
const timerDisplay = document.getElementById('timer-display');
const btnStart = document.getElementById('btn-start');
const btnCancel = document.getElementById('btn-cancel');

// Procedural Audio Engine (Generates a clean notification tone)
function playReminderChime() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Play two sweet notes sequentially
    const notes = [523.25, 659.25]; // C5 then E5
    const times = [0, 0.15];

    notes.forEach((freq, index) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + times[index]);
        
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime + times[index]);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + times[index] + 0.4);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(audioCtx.currentTime + times[index]);
        osc.stop(audioCtx.currentTime + times[index] + 0.4);
    });
}

function updateDisplay() {
    const mins = Math.floor(totalSecondsRemaining / 60);
    const secs = totalSecondsRemaining % 60;
    
    // Format numbers with leading zeros (e.g. "05:09")
    timerDisplay.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function startTimer() {
    const inputVal = parseInt(minutesInput.value);
    
    // Validation guardrails
    if (isNaN(inputVal) || inputVal <= 0) {
        alert("Please enter a valid number of minutes.");
        return;
    }

    totalSecondsRemaining = inputVal * 60;
    updateDisplay();

    // Toggle Card View Layouts
    setupContainer.classList.add('hidden');
    countdownContainer.classList.remove('hidden');

    countdownInterval = setInterval(() => {
        totalSecondsRemaining--;
        updateDisplay();

        if (totalSecondsRemaining <= 0) {
            clearInterval(countdownInterval);
            
            // Trigger alerts
            playReminderChime();
            setTimeout(() => {
                alert("🛁 Time to take your bath! Your water is waiting.");
                resetUIState();
            }, 50);
        }
    }, 1000);
}

function resetUIState() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    setupContainer.classList.remove('hidden');
    countdownContainer.classList.add('hidden');
}

// Global Event Listeners
btnStart.addEventListener('click', startTimer);
btnCancel.addEventListener('click', resetUIState);
