// --- Supabase Client Setup ---
const SUPABASE_URL = 'https://wamggwkmkarbocdkzlkz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_HbnR4WzeAzj3BXoB8GvcTA_1lXwDn1E';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- State Variables ---
let songs = [];
let comments = [];
let currentAudio = null;
let currentPlayingId = null;

// --- Helper Functions ---
function escapeHTML(str) {
    return (str || '').replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function refreshIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
}

// --- Theme Handling ---
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    }
    refreshIcons();
}

// --- Fetch Data from Database ---
async function loadSongs() {
    const { data, error } = await supabaseClient
        .from('songs')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        console.error('Error fetching songs:', error.message);
        return;
    }

    songs = data || [];
    renderSongs();
}

async function loadComments() {
    const { data, error } = await supabaseClient
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching comments:', error.message);
        return;
    }

    comments = data || [];
    renderComments();
}

// --- Rendering UI ---
function renderSongs() {
    const container = document.getElementById('songs-container');
    if (!container) return;
    container.innerHTML = '';

    // Group songs by album
    const albums = {};
    songs.forEach(song => {
        const albumName = song.album || 'Uncategorized';
        if (!albums[albumName]) albums[albumName] = [];
        albums[albumName].push(song);
    });

    // Render each album group
    for (const [albumName, albumSongs] of Object.entries(albums)) {
        const header = document.createElement('h3');
        header.className = 'text-xl font-bold mt-10 mb-4 text-[#ff3366] uppercase tracking-widest border-b border-gray-200 dark:border-[#2a2a2e] pb-2';
        header.textContent = albumName === 'Single' ? 'Singles' : albumName;
        container.appendChild(header);

        albumSongs.forEach(song => {
            const card = document.createElement('div');
            card.className = 'flex flex-col sm:flex-row sm:items-center justify-between p-4 mb-3 bg-white dark:bg-[#1c1c1f] rounded-xl border border-gray-200 dark:border-[#2a2a2e] shadow-sm transition-transform hover:-translate-y-1 gap-4';
            
            const hasAudio = song.url && song.url.trim() !== '';
            const isPlayingThis = currentPlayingId === song.id && currentAudio && !currentAudio.paused;

            const playBtn = hasAudio
                ? `<button onclick="togglePlay('${song.id}', '${escapeHTML(song.url)}')" class="bg-[#ff3366] text-white p-3 rounded-full hover:bg-[#e62e5c] transition-colors focus:outline-none shrink-0"><i id="icon-${song.id}" data-lucide="${isPlayingThis ? 'pause' : 'play'}" class="w-5 h-5"></i></button>`
                : `<div class="p-3 shrink-0"><i data-lucide="music" class="w-5 h-5 text-gray-400"></i></div>`;

            const downloadBtn = song.download_url && song.download_url.trim() !== ''
                ? `<a href="${escapeHTML(song.download_url)}" target="_blank" class="p-2 text-gray-400 hover:text-[#ff3366] transition-colors" title="Download Track"><i data-lucide="download" class="w-6 h-6"></i></a>`
                : '';

            const subtext = [song.genre, song.bpm].filter(Boolean).map(escapeHTML).join(' • ');

            card.innerHTML = `
                <div class="flex items-center gap-4">
                    ${playBtn}
                    <div>
                        <span class="font-bold text-lg block">${escapeHTML(song.title)}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">${subtext}</span>
                    </div>
                </div>
                <div class="flex items-center gap-4 self-end sm:self-auto">
                    ${downloadBtn}
                    <button onclick="likeSong('${song.id}')" class="flex items-center gap-2 text-gray-400 hover:text-[#ff3366] transition-colors focus:outline-none group">
                        <i id="heart-${song.id}" data-lucide="heart" class="w-6 h-6 transition-colors"></i>
                        <span id="likes-${song.id}" class="font-bold text-lg text-gray-700 dark:text-white">${song.likes || 0}</span>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }
    
    refreshIcons();
}

function renderComments() {
    const container = document.getElementById('comments-container');
    if (!container) return;
    container.innerHTML = '';

    if (comments.length === 0) {
        container.innerHTML = '<p class="text-gray-500 italic">No comments yet. Be the first to leave one!</p>';
        return;
    }

    comments.forEach(comment => {
        const div = document.createElement('div');
        div.className = 'p-4 bg-white dark:bg-[#1c1c1f] rounded-xl border border-gray-200 dark:border-[#2a2a2e] shadow-sm';
        div.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="font-bold text-[#ff3366]">${escapeHTML(comment.user_name)}</span>
                <span class="text-xs text-gray-400">${new Date(comment.created_at).toLocaleDateString()}</span>
            </div>
            <p class="text-gray-700 dark:text-gray-300">${escapeHTML(comment.text)}</p>
        `;
        container.appendChild(div);
    });
}

// --- Audio Player Logic ---
function togglePlay(id, url) {
    const iconElement = document.getElementById(`icon-${id}`);
    if (!url) return;

    if (currentPlayingId === id) {
        if (currentAudio && currentAudio.paused) {
            currentAudio.play().then(() => {
                if (iconElement) iconElement.setAttribute('data-lucide', 'pause');
                refreshIcons();
            }).catch(err => console.error('Audio playback failed:', err));
        } else if (currentAudio) {
            currentAudio.pause();
            if (iconElement) iconElement.setAttribute('data-lucide', 'play');
            refreshIcons();
        }
    } else {
        if (currentAudio) {
            currentAudio.pause();
            const prevIcon = document.getElementById(`icon-${currentPlayingId}`);
            if (prevIcon) prevIcon.setAttribute('data-lucide', 'play');
        }
        
        currentAudio = new Audio(url);
        currentPlayingId = id;

        currentAudio.play().then(() => {
            if (iconElement) iconElement.setAttribute('data-lucide', 'pause');
            refreshIcons();
        }).catch(err => {
            console.error('Audio playback failed:', err);
            currentPlayingId = null;
            if (iconElement) iconElement.setAttribute('data-lucide', 'play');
            refreshIcons();
        });
        
        currentAudio.onended = () => {
            const activeIcon = document.getElementById(`icon-${id}`);
            if (activeIcon) activeIcon.setAttribute('data-lucide', 'play');
            currentPlayingId = null;
            refreshIcons();
        };
    }
    
    refreshIcons();
}

// --- Database Mutations ---
async function likeSong(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;

    // Optimistic UI update
    const previousLikes = song.likes || 0;
    const newLikes = previousLikes + 1;
    song.likes = newLikes;

    const likesCountEl = document.getElementById(`likes-${id}`);
    if (likesCountEl) likesCountEl.textContent = newLikes;

    const heartIcon = document.getElementById(`heart-${id}`);
    if (heartIcon) {
        heartIcon.classList.add('liked-animation');
        setTimeout(() => heartIcon.classList.remove('liked-animation'), 500);
    }

    const { error } = await supabaseClient
        .from('songs')
        .update({ likes: newLikes })
        .eq('id', id);

    if (error) {
        console.error('Error liking song:', error.message);
        // Revert UI on failure
        song.likes = previousLikes;
        if (likesCountEl) likesCountEl.textContent = previousLikes;
    }
}

// --- Event Listeners & Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    const isDark = document.documentElement.classList.contains('dark');
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    }

    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = commentForm.querySelector('button[type="submit"]');
            const userEl = document.getElementById('username');
            const textEl = document.getElementById('comment-text');
            
            const user = userEl ? userEl.value.trim() : '';
            const text = textEl ? textEl.value.trim() : '';
            
            if (user && text) {
                if (submitBtn) submitBtn.disabled = true;

                const { error } = await supabaseClient
                    .from('comments')
                    .insert([{ user_name: user, text: text }]);

                if (submitBtn) submitBtn.disabled = false;

                if (error) {
                    alert('Failed to post comment. Please try again!');
                    console.error('Comment Error:', error.message);
                    return;
                }

                commentForm.reset();
                await loadComments();
            }
        });
    }

    loadSongs();
    loadComments();
});
