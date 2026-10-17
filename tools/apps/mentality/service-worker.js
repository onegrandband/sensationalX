const STATE_CACHE = 'mentality-release-state-v1';
const stateURL = new URL('notification-state', self.registration.scope).href;
let pending = Promise.resolve();

self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

function isNewer(version, previous) {
    const next = version.split('.').map(Number);
    const old = previous.split('.').map(Number);
    for (let i = 0; i < 3; i++) {
        if (next[i] !== old[i]) return next[i] > old[i];
    }
    return false;
}

async function fetchAndCheckRelease() {
    try {
        const response = await fetch('release.json', { cache: 'no-store' });
        if (!response.ok) return;
        const release = await response.json();
        await checkRelease(release);
    } catch (err) {
        // Offline or unreachable — silently ignore
    }
}

async function checkRelease(release) {
    if (!release || !/^\d+\.\d+\.\d+$/.test(release.version)) {
        throw new Error('Release information must contain a valid version.');
    }
    const cache = await caches.open(STATE_CACHE);
    const saved = await cache.match(stateURL);
    const previous = saved ? await saved.text() : null;
    // Record the current release silently on first opt-in.
    if (!previous || isNewer(release.version, previous)) {
        if (previous) {
            if (Notification.permission !== 'granted') return;
            await self.registration.showNotification(`Mentality v${release.version} is available!`, {
                body: release.description || 'A new Mentality release is available.',
                tag: `mentality-${release.version}`,
                data: { url: new URL('index.html', self.registration.scope).href }
            });
        }
        await cache.put(stateURL, new Response(release.version));
    }
}

self.addEventListener('message', event => {
    if (event.data?.type !== 'CHECK_RELEASE') return;
    pending = pending.then(() => checkRelease(event.data.release)).catch(error => {
        event.source?.postMessage({ type: 'RELEASE_ERROR', message: error.message });
    });
    event.waitUntil(pending);
});

// Periodic background sync (Chromium 80+)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'mentality-release-check') {
        event.waitUntil(fetchAndCheckRelease());
    }
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    const url = new URL('index.html', self.registration.scope).href;
    event.waitUntil((async () => {
        const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        const existing = windows.find(client => client.url === url);
        if (existing) return existing.focus();
        return self.clients.openWindow(url);
    })());
});
