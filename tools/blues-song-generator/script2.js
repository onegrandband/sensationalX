// Data matrices for generating authentic blues lyrics (AAB Structure)
const verseA = [
    "Woke up this morning, dust all over my shoes.",
    "The rain keeps falling, pounding on my window pane.",
    "My wallet is empty, and my baby walked out the door.",
    "Left the station on a train that goes nowhere.",
    "Lord, I look in the mirror, don't even know my face.",
    "The coffee is cold and the clock is striking three.",
    "I've been walking these tracks until my feet turned numb."
];

const verseB = [
    "Yeah, I got those low-down, structural coding blues.",
    "Trying to outrun the shadow of my yesterday's pain.",
    "Can't even afford to buy sweet trouble anymore.",
    "Just watching the smoke rise up into the midnight air.",
    "Feels like I'm a stranger running in a losing race.",
    "Nothing but a lonely guitar keeping company with me.",
    "Still looking for the place where my good days started from."
];

const choruses = [
    "Oh, the blues don't care if you're a rich man or a fool.\nIt follows you around and breaks every single rule.",
    "Preach the blues from the valley to the shore.\nWhen the trouble knocks, you gotta open up the door.",
    "Sun's gonna shine in my back door someday.\nUntil that morning comes, I'll just sing my life away."
];

const titlesFirst = ["Midnight", "Dusty Road", "Low Down", "Broken String", "Empty Pocket", "Rainy Day", "Crossroads"];
const titlesLast = ["Blues", "Lament", "Trouble", "Stomp", "Heartache", "Boogie", "Train"];
const keys = ["E Minor", "A Major", "G Major", "C Seventh", "D Minor"];

// FIX: Target the actual IDs that exist in your index.html
const generateBtn = document.getElementById('btn-trigger-lyrics');
const outputCard = document.getElementById('lyrics-output-target');

// Helper function to pick random items
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Constructs a traditional AAB blues verse
function createVerse() {
    // Pick a random line from group A
    const index = Math.floor(Math.random() * verseA.length);
    const lineA = verseA[index];
    
    // Pick a corresponding or random line from group B that aligns
    const lineB = verseB[index]; 
    
    // Traditional blues repeats the first line twice (A-A-B)
    return `${lineA}<br>${lineA}<br>${lineB}`;
}

// Generation Logic
function generateBluesSong() {
    // 1. Generate Metadata
    const title = `${getRandomItem(titlesFirst)} ${getRandomItem(titlesLast)}`;
    const key = getRandomItem(keys);
    const tempo = Math.floor(Math.random() * (110 - 70 + 1)) + 70; // 70 to 110 BPM

    // 2. Generate Lyric Structure (Verse 1, Verse 2, Chorus, Verse 3)
    let lyricsHTML = '';

    lyricsHTML += `<div style="margin-bottom: 15px;">${createVerse()}</div>`;
    lyricsHTML += `<div style="margin-bottom: 15px;">${createVerse()}</div>`;
    lyricsHTML += `<div style="margin-bottom: 15px; font-weight: bold;">[CHORUS]<br>${getRandomItem(choruses)}</div>`;
    lyricsHTML += `<div style="margin-bottom: 15px;">${createVerse()}</div>`;

    // 3. Inject Title, Meta, and Lyrics into the output target
    outputCard.innerHTML = `
        <h3 style="margin: 0 0 5px 0; color: #45f3ff;">${title}</h3>
        <div style="font-size: 0.8rem; color: #888; margin-bottom: 15px; border-bottom: 1px solid #2e3944; padding-bottom: 10px;">
            Tempo: ${tempo} BPM | Key: ${key}
        </div>
        <div>${lyricsHTML}</div>
    `;

    // Show card if hidden
    outputCard.classList.remove('hidden');
}

// Event Listener
generateBtn.addEventListener('click', generateBluesSong);
