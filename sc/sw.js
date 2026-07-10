// This Service Worker caches the HTML, CSS, and your music files 
// so they load instantly with zero delay, even without internet.

const CACHE_NAME = 'sensationalx-audio-cache-v1';

// We add your critical assets to cache immediately upon installation
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/book.html',
    '/bpm-tapper.html',
    // Pre-cache your specific track URLs so they have zero delay
    'https://files.catbox.moe/kaxem8.wav',
    'https://files.catbox.moe/yijftf.wav',
    'https://files.catbox.moe/zl7fq6.wav',
    'https://files.catbox.moe/0uwnjg.wav',
    'https://files.catbox.moe/4nift9.wav',
    'https://files.catbox.moe/u0q0n9.wav',
    'https://files.catbox.moe/wbzujf.wav',
    'https://files.catbox.moe/ndxt0a.wav',
    'https://files.catbox.moe/7nfr9e.wav',
    'https://files.catbox.moe/7du7pj.wav'
];

// Install event: Download the tracks to the browser's hard drive
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

// Activate event: Clean up old caches if you update the CACHE_NAME
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                          .map(name => caches.delete(name))
            );
        })
    );
});

// Fetch event: Intercept network requests and serve from cache first
self.addEventListener('fetch', (event) => {
    // We specifically want to cache audio files (.wav) and our UI assets
    if (event.request.url.includes('.wav') || event.request.url.includes('catbox.moe')) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                // If the audio is in the cache, serve it instantly. 
                // If not, fetch it, play it, and save a copy for next time.
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    } else {
        // Standard caching strategy for the rest of the site
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});
