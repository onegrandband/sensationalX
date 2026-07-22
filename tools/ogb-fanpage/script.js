// --- Theme Handling ---
function toggleTheme() {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    document.getElementById('themeIcon').setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    lucide.createIcons();
}

// --- Dummy Data & Database Setup ---
// In a real app, this data would live in Firebase/Supabase.
// For now, we load from localStorage, or use defaults if empty.

const defaultSongs = [
    { id: 'song1', title: 'Midnight Drive', url: 'https://files.catbox.moe/dummy1.mp3', likes: 0 },
    { id: 'song2', title: 'Neon Lights', url: 'https://files.catbox.moe/dummy2.mp3', likes: 0 },
    { id: 'song3', title: 'Echoes of the City', url: 'https://files.catbox.moe/dummy3.mp3', likes: 0 }
];

let songs = JSON.parse(localStorage.getItem('ogb_songs')) || defaultSongs;
let comments = JSON.parse(localStorage.getItem('ogb_comments')) || [];
let currentAudio = null;
let currentPlayingId = null;

// --- Rendering Functions ---

function renderSongs() {
    const container = document.getElementById('songs-container');
    container.innerHTML = '';

    songs.forEach(song => {
        // Create song card
        const card = document.createElement('div');
        card.className = 'flex items-center justify-between p-4 bg-white dark:bg-[#1c1c1f] rounded-xl border border-gray-200 dark:border-[#2a2a2e] shadow-sm transition-transform hover:-translate-y-1';
        
        card.innerHTML = `
            <div class="flex items-center gap-4">
                <button onclick="togglePlay('${song.id}', '${song.url}')" class="bg-[#ff3366] text-white p-3 rounded-full hover:bg-[#e62e5c] transition-colors focus:outline-none">
                    <i id="icon-${song.id}" data-lucide="play" class="w-5 h-5"></i>
                </button>
                <span class="font-bold text-lg">${song.title}</span>
            </div>
            <button onclick="likeSong('${song.id}')" class="flex items-center gap-2 text-gray-500 hover:text-[#ff3366] transition-colors focus:outline-none group">
                <i id="heart-${song.id}" data-lucide="heart" class="w-6 h-6 transition-colors"></i>
                <span id="likes-${song.id}" class="font-bold text-lg">${song.likes}</span>
            </button>
        `;
        container.appendChild(card);
    });
    
    // Re-initialize icons after modifying DOM
    lucide.createIcons();
}

function renderComments() {
    const container = document.getElementById('comments-container');
    container.innerHTML = '';

    if (comments.length === 0) {
        container.innerHTML = '<p class="text-gray-500 italic">No comments yet. Be the first to show some love!</p>';
        return;
    }

    // Render comments (newest first)
    [...comments].reverse().forEach(comment => {
        const div = document.createElement('div');
        div.className = 'p-4 bg-white dark:bg-[#1c1c1f] rounded-xl border border-gray-200 dark:border-[#2a2a2e] shadow-sm';
        div.innerHTML = `
            <div class="flex justify-between items-start mb-2">
                <span class="font-bold text-[#ff3366]">${comment.user}</span>
                <span class="text-xs text-gray-400">${new Date(comment.date).toLocaleDateString()}</span>
            </div>
            <p class="text-gray-700 dark:text-gray-300">${comment.text}</p>
        `;
        container.appendChild(div);
    });
}

// --- Interaction Logic ---

function togglePlay(id, url) {
    const iconElement = document.getElementById(`icon-${id}`);
    
    // If clicking the same song that's already playing
    if (currentPlayingId === id) {
        if (currentAudio.paused) {
            currentAudio.play();
            iconElement.setAttribute('data-lucide', 'pause');
        } else {
            currentAudio.pause();
            iconElement.setAttribute('data-lucide', 'play');
        }
    } else {
        // Stop current playing audio if exists
        if (currentAudio) {
            currentAudio.pause();
            document.getElementById(`icon-${currentPlayingId}`).setAttribute('data-lucide', 'play');
        }
        
        // Start new audio
        currentAudio = new Audio(url);
        currentAudio.play();
        currentPlayingId = id;
        iconElement.setAttribute('data-lucide', 'pause');
        
        // When song ends naturally, reset icon
        currentAudio.onended = () => {
            iconElement.setAttribute('data-lucide', 'play');
            currentPlayingId = null;
            lucide.createIcons();
        };
    }
    
    lucide.createIcons();
}

function likeSong(id) {
    // Find song and increment likes
    const songIndex = songs.findIndex(s => s.id === id);
    if (songIndex !== -1) {
        songs[songIndex].likes += 1;
        
        // Save to local storage (Replace this line with Firebase write later!)
        localStorage.setItem('ogb_songs', JSON.stringify(songs));
        
        // Update UI instantly
        document.getElementById(`likes-${id}`).textContent = songs[songIndex].likes;
        
        // Play animation
        const heartIcon = document.getElementById(`heart-${id}`);
        heartIcon.classList.add('liked-animation');
        setTimeout(() => heartIcon.classList.remove('liked-animation'), 500);
    }
}

// --- Form Handling ---

document.getElementById('comment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const user = document.getElementById('username').value.trim();
    const text = document.getElementById('comment-text').value.trim();
    
    if (user && text) {
        const newComment = {
            id: Date.now(),
            user: user,
            text: text,
            date: new Date().toISOString()
        };
        
        comments.push(newComment);
        
        // Save to local storage (Replace this line with Firebase write later!)
        localStorage.setItem('ogb_comments', JSON.stringify(comments));
        
        // Reset form and re-render
        document.getElementById('comment-form').reset();
        renderComments();
    }
});

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Set up dark mode icon
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('themeIcon').setAttribute('data-lucide', isDark ? 'moon' : 'sun');
    
    // Initial Render
    renderSongs();
    renderComments();
    lucide.createIcons();
});
