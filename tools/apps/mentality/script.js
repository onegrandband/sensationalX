const olderVersions = document.getElementById('more-versions');
function revealOlderVersions() {
    if (location.hash === '#more-versions') olderVersions.open = true;
}
document.getElementById('viewMore').addEventListener('click', () => {
    olderVersions.open = true;
});
window.addEventListener('hashchange', revealOlderVersions);
revealOlderVersions();

const notificationStatus = document.getElementById('notificationStatus');
let registration;
let checking = false;
let enabled = false;

async function checkRelease() {
    if (!registration || !enabled || Notification.permission !== 'granted' || checking) return;
    checking = true;
    try {
        const response = await fetch('release.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('Release information is unavailable.');
        const release = await response.json();
        const worker = registration.active;
        if (!worker) throw new Error('The notification worker is not ready yet.');
        worker.postMessage({ type: 'CHECK_RELEASE', release });
    } catch (error) {
        notificationStatus.textContent = error.message;
    } finally {
        checking = false;
    }
}

async function requestNotifications() {
    if (!window.isSecureContext || !('serviceWorker' in navigator) || !('Notification' in window)) {
        notificationStatus.textContent = 'Notifications require HTTPS (or localhost) and a supported browser.';
        return;
    }
    // Attempt on every visit; browsers may require a click or a settings change.
    if (Notification.permission !== 'granted') {
        try {
            await Notification.requestPermission();
        } catch (error) {
            console.warn('Notification permission request failed:', error);
            return;
        }
    }
    if (Notification.permission !== 'granted') return;

    try {
        await navigator.serviceWorker.register('service-worker.js');
        registration = await navigator.serviceWorker.ready;
    } catch (error) {
        notificationStatus.textContent = `Service worker registration failed: ${error.message}`;
        return;
    }

    enabled = true;
    notificationStatus.textContent = 'Notifications enabled.';
    await checkRelease();
}

// Register periodic background sync for offline checks (Chromium 80+)
async function registerPeriodicSync() {
    if (!registration || !registration.periodicSync) return;
    try {
        const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
        if (status.state === 'granted') {
            await registration.periodicSync.register('mentality-release-check', {
                minInterval: 60 * 60 * 1000 // check every hour
            });
        }
    } catch (err) {
        // Periodic sync not supported or permission denied — that's fine
    }
}

navigator.serviceWorker?.addEventListener('message', event => {
    if (event.data?.type === 'RELEASE_ERROR') notificationStatus.textContent = event.data.message;
});

const entryGate = document.getElementById('entryGate');
const accessKey = 'mentality-site-entered';
let previouslyEntered = false;
try {
    previouslyEntered = localStorage.getItem(accessKey) === 'true';
} catch (error) {
    // Access still works if browser storage is unavailable.
}

function startNotifications() {
    requestNotifications().then(() => registerPeriodicSync());
}

if (previouslyEntered) {
    startNotifications();
} else {
    entryGate.showModal();
}
entryGate.addEventListener('cancel', event => event.preventDefault());
document.getElementById('enterSite').addEventListener('click', () => {
    try {
        localStorage.setItem(accessKey, 'true');
    } catch (error) {
        // In this case the visitor will be asked again next time.
    }
    entryGate.close();
    startNotifications();
});

setInterval(checkRelease, 60000);
window.addEventListener('focus', checkRelease);
