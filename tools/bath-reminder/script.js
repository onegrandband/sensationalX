let activeTimerTarget = null; 
let activeSchedule = null;     
let animationFrameId = null;
let isEditingMode = false;  

// Load your specific audio file
const alarmAudio = new Audio('bathub-alert.mp3');
alarmAudio.loop = true; // Let it loop until they click OK on the alert

const MS_PER_SEC = 1000;
const MS_PER_MIN = MS_PER_SEC * 60;
const MS_PER_HR = MS_PER_MIN * 60;
const MS_PER_DAY = MS_PER_HR * 24;
const MS_PER_WK = MS_PER_DAY * 7;

const lblWk = document.getElementById('lbl-wk');
const lblDay = document.getElementById('lbl-day');
const lblHr = document.getElementById('lbl-hr');
const lblMin = document.getElementById('lbl-min');
const lblSec = document.getElementById('lbl-sec');
const lblMs = document.getElementById('lbl-ms');
const lblNs = document.getElementById('lbl-ns');
const statusText = document.getElementById('status-text');
const mainCard = document.getElementById('main-timer-card');
const btnClearActive = document.getElementById('btn-clear-active');
const btnEditActive = document.getElementById('btn-edit-active');

const tabOnce = document.getElementById('tab-once');
const tabRepeat = document.getElementById('tab-repeat');
const panelOnce = document.getElementById('panel-once');
const panelRepeat = document.getElementById('panel-repeat');
const btnOnceSubmit = document.getElementById('btn-start-once');
const btnRepeatSubmit = document.getElementById('btn-save-schedule');

window.addEventListener('DOMContentLoaded', () => {
    loadDataFromStorage();
    initTabs();
    setupEventListeners();
    
    if (activeTimerTarget) {
        startSyncLoop();
    } else if (activeSchedule) {
        calculateNextScheduledOccurrence();
    }
});

// Required to allow the MP3 to play later on iPhones
function unlockAudio() {
    alarmAudio.play().then(() => {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
    }).catch(err => console.log("Audio unlock pending interaction.", err));
}

function loadDataFromStorage() {
    const storedTarget = localStorage.getItem('bath_target_timestamp');
    const storedSchedule = localStorage.getItem('bath_repeat_schedule');
    if (storedTarget) activeTimerTarget = parseInt(storedTarget);
    if (storedSchedule) activeSchedule = JSON.parse(storedSchedule);
}

function startSyncLoop() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    btnClearActive.classList.remove('hidden');
    btnEditActive.classList.remove('hidden');
    mainCard.classList.add('active-running');
    
    function update() {
        const now = Date.now();
        let diff = activeTimerTarget - now;

        if (diff <= 0) {
            triggerAlarmLoop();
            return;
        }

        const weeks = Math.floor(diff / MS_PER_WK); diff %= MS_PER_WK;
        const days = Math.floor(diff / MS_PER_DAY); diff %= MS_PER_DAY;
        const hours = Math.floor(diff / MS_PER_HR); diff %= MS_PER_HR;
        const minutes = Math.floor(diff / MS_PER_MIN); diff %= MS_PER_MIN;
        const seconds = Math.floor(diff / MS_PER_SEC);
        const milliseconds = Math.floor(diff % MS_PER_SEC);
        const nanoseconds = Math.floor((performance.now() % 1) * 1000000);

        lblWk.innerText = String(weeks).padStart(2, '0');
        lblDay.innerText = String(days).padStart(2, '0');
        lblHr.innerText = String(hours).padStart(2, '0');
        lblMin.innerText = String(minutes).padStart(2, '0');
        lblSec.innerText = String(seconds).padStart(2, '0');
        lblMs.innerText = String(milliseconds).padStart(3, '0');
        lblNs.innerText = String(nanoseconds).padStart(6, '0');

        statusText.innerText = activeSchedule ? "📅 Recurring Schedule Armed" : "⏳ One-Time Timer Armed";
        animationFrameId = requestAnimationFrame(update);
    }
    update();
}

function triggerAlarmLoop() {
    cancelAnimationFrame(animationFrameId);
    mainCard.classList.remove('active-running');
    statusText.innerText = "🚨 Time's Up! Water is Ready.";

    // Start playing the MP3
    alarmAudio.play().catch(err => console.log("Playback failed:", err));

    // Wait slightly so the sound actually starts before the browser pauses everything for the alert box
    setTimeout(() => {
        alert("🛁 Time to take your bath!");
        stopAlarmLoop();
        if (activeSchedule) calculateNextScheduledOccurrence();
        else clearActiveTimerState();
    }, 400); 
}

function stopAlarmLoop() {
    alarmAudio.pause();
    alarmAudio.currentTime = 0; // Reset it to the beginning for next time
}

function enterEditingMode() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    isEditingMode = true;
    btnEditActive.classList.add('hidden');
    mainCard.classList.remove('active-running');
    statusText.innerText = "✏️ Editing Active Configuration...";

    if (activeSchedule) {
        switchTabFocus('repeat');
        document.querySelectorAll('input[name="sched-day"]').forEach(cb => {
            cb.checked = activeSchedule.days.includes(parseInt(cb.value));
        });
        document.getElementById('sched-time').value = activeSchedule.time;
        btnRepeatSubmit.innerText = "Update Schedule";
        btnRepeatSubmit.classList.add('edit-mode');
    } else {
        switchTabFocus('once');
        let remainingDiff = activeTimerTarget - Date.now();
        if (remainingDiff < 0) remainingDiff = 0;

        const weeks = Math.floor(remainingDiff / MS_PER_WK); remainingDiff %= MS_PER_WK;
        const days = Math.floor(remainingDiff / MS_PER_DAY); remainingDiff %= MS_PER_DAY;
        const hours = Math.floor(remainingDiff / MS_PER_HR); remainingDiff %= MS_PER_HR;
        const minutes = Math.floor(remainingDiff / MS_PER_MIN); remainingDiff %= MS_PER_MIN;
        const seconds = Math.floor(remainingDiff / MS_PER_SEC);
        const milliseconds = Math.floor(remainingDiff % MS_PER_SEC);

        document.getElementById('in-wk').value = weeks;
        document.getElementById('in-day').value = days;
        document.getElementById('in-hr').value = hours;
        document.getElementById('in-min').value = minutes;
        document.getElementById('in-sec').value = seconds;
        document.getElementById('in-ms').value = milliseconds;

        btnOnceSubmit.innerText = "Update Timer";
        btnOnceSubmit.classList.add('edit-mode');
    }
}

function exitEditingModeUIReset() {
    isEditingMode = false;
    btnOnceSubmit.innerText = "Start One-Time Timer";
    btnOnceSubmit.classList.remove('edit-mode');
    btnRepeatSubmit.innerText = "Save Repeating Schedule";
    btnRepeatSubmit.classList.remove('edit-mode');
}

function calculateNextScheduledOccurrence() {
    if (!activeSchedule || activeSchedule.days.length === 0) return;
    const now = new Date();
    const [targetHrs, targetMins] = activeSchedule.time.split(':').map(Number);
    let absoluteClosestTarget = null;

    for (let i = 0; i < 8; i++) {
        let inspectDate = new Date(now.getTime() + (i * MS_PER_DAY));
        let inspectDayOfWeek = inspectDate.getDay();

        if (activeSchedule.days.includes(inspectDayOfWeek)) {
            inspectDate.setHours(targetHrs, targetMins, 0, 0);
            if (inspectDate.getTime() > now.getTime()) {
                absoluteClosestTarget = inspectDate.getTime();
                break;
            }
        }
    }

    if (absoluteClosestTarget) {
        activeTimerTarget = absoluteClosestTarget;
        localStorage.setItem('bath_target_timestamp', activeTimerTarget);
        startSyncLoop();
    }
}

function clearActiveTimerState() {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    stopAlarmLoop();
    activeTimerTarget = null;
    localStorage.removeItem('bath_target_timestamp');
    mainCard.classList.remove('active-running');
    
    lblWk.innerText = "00"; lblDay.innerText = "00"; lblHr.innerText = "00";
    lblMin.innerText = "00"; lblSec.innerText = "00"; lblMs.innerText = "000"; lblNs.innerText = "000000";
    
    statusText.innerText = "No active timers";
    btnClearActive.classList.add('hidden');
    btnEditActive.classList.add('hidden');
    exitEditingModeUIReset();
}

function setupEventListeners() {
    btnOnceSubmit.addEventListener('click', () => {
        unlockAudio(); 

        activeSchedule = null;
        localStorage.removeItem('bath_repeat_schedule');

        const wk = parseInt(document.getElementById('in-wk').value) || 0;
        const d = parseInt(document.getElementById('in-day').value) || 0;
        const h = parseInt(document.getElementById('in-hr').value) || 0;
        const m = parseInt(document.getElementById('in-min').value) || 0;
        const s = parseInt(document.getElementById('in-sec').value) || 0;
        const ms = parseInt(document.getElementById('in-ms').value) || 0;

        const totalAddedMs = (wk * MS_PER_WK) + (d * MS_PER_DAY) + (h * MS_PER_HR) + (m * MS_PER_MIN) + (s * MS_PER_SEC) + ms;
        if (totalAddedMs <= 0) return alert("Please enter a valid time value.");

        activeTimerTarget = Date.now() + totalAddedMs;
        localStorage.setItem('bath_target_timestamp', activeTimerTarget);
        exitEditingModeUIReset();
        startSyncLoop();
    });

    btnRepeatSubmit.addEventListener('click', () => {
        unlockAudio(); 

        const checkedBoxes = document.querySelectorAll('input[name="sched-day"]:checked');
        const selectedTime = document.getElementById('sched-time').value;

        if (checkedBoxes.length === 0) return alert("Select at least one day.");
        if (!selectedTime) return alert("Specify a time.");

        const daysArray = Array.from(checkedBoxes).map(cb => parseInt(cb.value));
        activeSchedule = { days: daysArray, time: selectedTime };
        localStorage.setItem('bath_repeat_schedule', JSON.stringify(activeSchedule));
        
        exitEditingModeUIReset();
        calculateNextScheduledOccurrence();
    });

    btnEditActive.addEventListener('click', enterEditingMode);
    btnClearActive.addEventListener('click', () => {
        localStorage.removeItem('bath_repeat_schedule');
        activeSchedule = null;
        clearActiveTimerState();
    });
}

function switchTabFocus(mode) {
    if (mode === 'once') {
        tabOnce.classList.add('active'); tabRepeat.classList.remove('active');
        panelOnce.classList.remove('hidden'); panelRepeat.classList.add('hidden');
    } else {
        tabRepeat.classList.add('active'); tabOnce.classList.remove('active');
        panelRepeat.classList.remove('hidden'); panelOnce.classList.add('hidden');
    }
}

function initTabs() {
    tabOnce.addEventListener('click', () => {
        if(isEditingMode) return alert("Save or cancel your current edit mode modifications first.");
        switchTabFocus('once');
    });
    tabRepeat.addEventListener('click', () => {
        if(isEditingMode) return alert("Save or cancel your current edit mode modifications first.");
        switchTabFocus('repeat');
    });
}
