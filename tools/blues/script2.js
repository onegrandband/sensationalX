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

// Targets for the Lyrics Output
const generateBtn = document.getElementById('btn-trigger-lyrics');
const outputCard = document.getElementById('lyrics-output-target');

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function createVerse() {
    const index = Math.floor(Math.random() * verseA.length);
    const lineA = verseA[index];
    const lineB = verseB[index]; 
    return `${lineA}<br>${lineA}<br>${lineB}`;
}

function generateBluesSong() {
    const title = `${getRandomItem(titlesFirst)} ${getRandomItem(titlesLast)}`;
    const key = getRandomItem(keys);
    const tempo = Math.floor(Math.random() * (110 - 70 + 1)) + 70;

    let lyricsHTML = '';
    lyricsHTML += `<div style="margin-bottom: 15px;">${createVerse()}</div>`;
    lyricsHTML += `<div style="margin-bottom: 15px;">${createVerse()}</div>`;
    lyricsHTML += `<div style="margin-bottom: 15px; font-weight: bold;">[CHORUS]<br>${getRandomItem(choruses)}</div>`;
    lyricsHTML += `<div style="margin-bottom: 15px;">${createVerse()}</div>`;

    outputCard.innerHTML = `
        <h3 style="margin: 0 0 5px 0; color: #45f3ff;">${title}</h3>
        <div style="font-size: 0.8rem; color: #888; margin-bottom: 15px; border-bottom: 1px solid #2e3944; padding-bottom: 10px;">
            Tempo: ${tempo} BPM | Key: ${key}
        </div>
        <div>${lyricsHTML}</div>
    `;

    outputCard.classList.remove('hidden');
}

generateBtn.addEventListener('click', generateBluesSong);
