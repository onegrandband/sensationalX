// --- Supabase Client Setup ---
const SUPABASE_URL = 'https://wamggwkmkarbocdkzlkz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_HbnR4WzeAzj3BXoB8GvcTA_1lXwDn1E';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- State Variables ---
let songs = [];
let comments = [];
let currentAudio = null;
let currentPlayingId = null;

// --- Theme Handling ---
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('themeIcon').setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    lucide.createIcons();
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

    songs = data;
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

    comments = data;
    renderComments();
}

// --- Rendering UI ---

function renderSongs() {
    const container = document.getElementById('songs-container');
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
            const playBtn = hasAudio
                ? `<button onclick="togglePlay('${song.id}', '${song.url}')" class="bg-[#ff3366] text-white p-3 rounded-full hover:bg-[#e62e5c] transition-colors focus:outline-none shrink-0"><i id="icon-${song.id}" data-lucide="play" class="w-5 h-5"></i></button>`
                : `<div class="p-3 shrink-0"><i data-lucide="music" class="w-5 h-5 text-gray-400"></i></div>`;

            const downloadBtn = song.download_url && song.download_url.trim() !== ''
                ? `<a href="${song.download_url}" target="_blank" class="p-2 text-gray-400 hover:text-[#ff3366] transition-colors" title="Download Track"><i data-lucide="download" class="w-6 h-6"></i></a>`
                : '';

            card.innerHTML = `
                <div class="flex items-center gap-4">
                    ${playBtn}
                    <div>
                        <span class="font-bold text-lg block">${song.title}</span>
                        <span class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">${song.genre || ''} ${song.bpm ? '• ' + song.bpm : ''}</span>
                    </div>
                </div>
                <div class="flex items-center gap-4 self-end sm:self-auto">
                    ${downloadBtn}
                    <button onclick="likeSong('${song.id}')" class="flex items-center gap-2 text-gray-400 hover:text-[#ff3366] transition-colors focus:outline-none group">
                        <i id="heart-${song.id}" data-lucide="heart" class="w-6 h-6 transition-colors"></i>
                        <span id="likes-${song.id}" class="font-bold text-lg text-gray-700 dark:text-white">${song.likes}</span>
                    </button>
                </div>
            `;
            container.appendChild(card);
        });
    }
    
    lucide.createIcons();
}

function renderComments() {
    const container = document.getElementById('comments-container');
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
                <span class="font-bold text-[#ff3366]">${comment.user_name}</span>
                <span class="text-xs text-gray-400">${new Date(comment.created_at).toLocaleDateString()}</span>
            </div>
            <p class="text-gray-700 dark:text-gray-300">${comment.text}</p>
        `;
        container.appendChild(div);
    });
}

// --- Audio Player Logic ---

function togglePlay(id, url) {
    const iconElement = document.getElementById(`icon-${id}`);
    
    if (currentPlayingId === id) {
        if (currentAudio.paused) {
            currentAudio.play();
            iconElement.setAttribute('data-lucide', 'pause');
        } else {
            currentAudio.pause();
            iconElement.setAttribute('data-lucide', 'play');
        }
    } else {
        if (currentAudio) {
            currentAudio.pause();
            const prevIcon = document.getElementById(`icon-${currentPlayingId}`);
            if (prevIcon) prevIcon.setAttribute('data-lucide', 'play');
        }
        
        currentAudio = new Audio(url);
        currentAudio.play();
        currentPlayingId = id;
        iconElement.setAttribute('data-lucide', 'pause');
        
        currentAudio.onended = () => {
            iconElement.setAttribute('data-lucide', 'play');
            currentPlayingId = null;
            lucide.createIcons();
        };
    }
    
    lucide.createIcons();
}

// --- Database Mutations ---

async function likeSong(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;

    const newLikes = song.likes + 1;
    song.likes = newLikes;
    document.getElementById(`likes-${id}`).textContent = newLikes;

    const heartIcon = document.getElementById(`heart-${id}`);
    heartIcon.classList.add('liked-animation');
    setTimeout(() => heartIcon.classList.remove('liked-animation'), 500);

    const { error } = await supabaseClient
        .from('songs')
        .update({ likes: newLikes })
        .eq('id', id);

    if (error) {
        console.error('Error liking song:', error.message);
    }
}

// Comment Submission
document.getElementById('comment-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const user = document.getElementById('username').value.trim();
    const text = document.getElementById('comment-text').value.trim();
    
    if (user && text) {
        const { error } = await supabaseClient
            .from('comments')
            .insert([{ user_name: user, text: text }]);

        if (error) {
            alert('Failed to post comment. Try again!');
            console.error(error.message);
            return;
        }

        document.getElementById('comment-form').reset();
        await loadComments();
    }
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    const isDark = document.documentElement.classList.contains('dark');
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    }
    
    loadSongs();
    loadComments();
});
