// Database containing all my custom assets with Lucide :3
const initialProjects = [
    // --- GAMES ---
    {
        id: 1,
        title: "Ant Smasher Game",
        category: "games",
        status: "active",
        excerpt: "A fun, fast-paced arcade game where you tap to smash invading ants before they cross the screen!",
        creator: "ants",
        likes: 142,
        // Lucide: Bug
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bug"><path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-4.97 0-9-4.03-9-9 0-4.14 3.36-7.5 7.5-7.5h3c4.14 0 7.5 3.36 7.5 7.5 0 4.97-4.03 9-9 9Z"/><path d="M12 9v4"/><path d="M9 15c-1.33 0-4-1-4-1"/><path d="M9 12H3"/><path d="M9 9c-1.33 0-4 1-4 1"/><path d="M15 15c1.33 0 4-1 4-1"/><path d="M15 12h6"/><path d="M15 9c1.33 0 4 1 4 1"/></svg>`
    },
    {
        id: 2,
        title: "Apple Catch Game",
        category: "games",
        status: "active",
        excerpt: "Control your basket and catch the falling golden apples. Don't let them hit the ground!",
        creator: "apple",
        likes: 118,
        // Lucide: Apple
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-apple"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 8a2 2 0 0 1-2-2c0-1.5 1-3 2-3s2 1.5 2 3a2 2 0 0 1-2 2z"/></svg>`
    },
    {
        id: 3,
        title: "Axe Throwing Game",
        category: "games",
        status: "active",
        excerpt: "Test your aim in this virtual axe-throwing simulator. Hit the bullseye to unlock custom axes!",
        creator: "axe-throwing",
        likes: 189,
        // Lucide: Target
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-target"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`
    },
    {
        id: 4,
        title: "Banana Catcher Game",
        category: "games",
        status: "active",
        excerpt: "A chaotic catching game featuring falling bananas and crazy monkey power-ups.",
        creator: "banana",
        likes: 95,
        // Lucide: Trophy
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/><path d="M12 2a6.3 6.3 0 0 0-6 6.5C6 11.5 8 15 12 15s6-3.5 6-6.5A6.3 6.3 0 0 0 12 2Z"/></svg>`
    },
    {
        id: 5,
        title: "Bell Ringer Game",
        category: "games",
        status: "active",
        excerpt: "Timing is everything! Ring the festive bells at the exact peak of their swing to score combos.",
        creator: "bell",
        likes: 67,
        // Lucide: Bell
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`
    },
    {
        id: 6,
        title: "Catch the Kitty Game",
        category: "games",
        status: "active",
        excerpt: "A cute, physics-based puzzle-catching adventure where you coax energetic kittens into cozy baskets.",
        creator: "cat",
        likes: 243,
        // Lucide: Cat (Custom / Smile & Ears combo)
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cat"><path d="M12 5c.67 0 1.35.09 2 .26L18.5 2 18 6.5c1.23 1.13 2 2.72 2 4.5 0 3.87-3.58 7-8 7s-8-3.13-8-7c0-1.78.77-3.37 2-4.5L5.5 2 10 5.26c.65-.17 1.33-.26 2-.26Z"/><path d="M8 10.5h.01"/><path d="M16 10.5h.01"/><path d="M12 13.5c-.75 0-1.5-.25-2-.75s-.25-1 .5-1.25H13.5c.75.25 1 .75.5 1.25s-1.25.75-2 .75Z"/></svg>`
    },

    // --- UTILITIES / 404 PAGES ---
    {
        id: 7,
        title: "Audio Converter - 404 Error Page",
        category: "web-tools",
        status: "completed",
        excerpt: "A themed, retro-styled cassette layout error page for lost audio conversion routes.",
        creator: "audio-converter",
        likes: 54,
        // Lucide: Audio-Lines
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-audio-lines"><path d="M2 10v3"/><path d="M6 6v11"/><path d="M10 3v18"/><path d="M14 8v7"/><path d="M18 5v13"/><path d="M22 10v3"/></svg>`
    },
    {
        id: 8,
        title: "Video Converter - 404 Error Page",
        category: "web-tools",
        status: "completed",
        excerpt: "A custom 404 glitch-art styled screen representing broken video translation paths.",
        creator: "video-converter",
        likes: 72,
        // Lucide: Video
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-video"><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>`
    },
    {
        id: 9,
        title: "Pride Theme 404 Page",
        category: "art",
        status: "completed",
        excerpt: "A vibrant, custom pride-themed 404 page celebrating identity while pointing users safely back home.",
        creator: "pride",
        likes: 312,
        // Lucide: Heart
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>`
    },
    {
        id: 10,
        title: "Gender Not Found 404 Page",
        category: "art",
        status: "completed",
        excerpt: "A custom-styled 404 page featuring a witty 'Gender Not Found: Please select custom values' theme.",
        creator: "transf",
        likes: 389,
        // Lucide: Help-circle
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-help-circle"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`
    },
    {
        id: 11,
        title: "Transmasc Styled 404 Page",
        category: "art",
        status: "completed",
        excerpt: "A beautifully styled error fallback page featuring transmasculine palette pride flag graphics.",
        creator: "transm",
        likes: 274,
        // Lucide: Sparkles
        iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5.5z"/><path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1z"/></svg>`
    }
];

// Local state
let projects = [...initialProjects];
let currentFilters = {
    search: '',
    category: 'all',
    status: 'all',
    sort: 'trending'
};

// DOM Elements
const searchInput = document.getElementById('project-search');
const categorySelect = document.getElementById('category-select');
const statusSelect = document.getElementById('status-select');
const sortSelect = document.getElementById('sort-select');
const projectsGrid = document.getElementById('projects-grid');
const resultsCount = document.getElementById('results-count');
const gridViewBtn = document.getElementById('grid-view-btn');
const listViewBtn = document.getElementById('list-view-btn');
const activeFiltersContainer = document.getElementById('active-filters');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase().trim();
        updateAndRender();
    });

    categorySelect.addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        updateAndRender();
    });

    statusSelect.addEventListener('change', (e) => {
        currentFilters.status = e.target.value;
        updateAndRender();
    });

    sortSelect.addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        updateAndRender();
    });

    gridViewBtn.addEventListener('click', () => {
        projectsGrid.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    });

    listViewBtn.addEventListener('click', () => {
        projectsGrid.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    });

    document.getElementById('submit-project-btn').addEventListener('click', () => {
        alert("This button will let users submit their custom layouts!");
    });
}

function updateAndRender() {
    let filtered = initialProjects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(currentFilters.search) || 
                              project.excerpt.toLowerCase().includes(currentFilters.search) ||
                              project.creator.toLowerCase().includes(currentFilters.search);
        
        const matchesCategory = currentFilters.category === 'all' || project.category === currentFilters.category;
        const matchesStatus = currentFilters.status === 'all' || project.status === currentFilters.status;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    if (currentFilters.sort === 'newest') {
        filtered.sort((a, b) => b.id - a.id);
    } else if (currentFilters.sort === 'popular') {
        filtered.sort((a, b) => b.likes - a.likes);
    } else {
        filtered.sort((a, b) => b.likes - a.likes);
    }

    projects = filtered;
    renderProjects();
    renderActiveFilterTags();
}

function renderProjects() {
    projectsGrid.innerHTML = '';

    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <span style="font-size: 48px;">🔍</span>
                <h3 style="margin-top: 16px;">No matches found</h3>
                <p>Try refining your keywords or checking different categories.</p>
            </div>
        `;
        resultsCount.textContent = "Showing 0 projects";
        return;
    }

    resultsCount.textContent = `Showing ${projects.length} project${projects.length === 1 ? '' : 's'}`;

    projects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card';
        card.setAttribute('data-category', project.category);
        card.setAttribute('data-status', project.status);

        let statusClass = 'badge-active';
        if (project.status === 'completed') statusClass = 'badge-completed';
        if (project.status === 'planning') statusClass = 'badge-planning';

        card.innerHTML = `
            <div class="project-thumbnail project-icon-display">
                ${project.iconSvg}
                <span class="badge ${statusClass}">${project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
            </div>
            <div class="project-card-content">
                <span class="project-category">${project.category.replace('-', ' ').toUpperCase()}</span>
                <h3><a href="#project-${project.id}" class="project-link">${project.title}</a></h3>
                <p class="project-excerpt">${project.excerpt}</p>
                <div class="project-meta">
                    <span class="project-creator">Creator: <strong>${project.creator}</strong></span>
                    <span class="project-likes" onclick="likeProject(${project.id})">❤️ ${project.likes}</span>
                </div>
            </div>
        `;
        projectsGrid.appendChild(card);
    });
}

window.likeProject = function(projectId) {
    const project = initialProjects.find(p => p.id === projectId);
    if (project) {
        project.likes += 1;
        updateAndRender();
    }
}

function renderActiveFilterTags() {
    activeFiltersContainer.innerHTML = '';

    if (currentFilters.search) {
        createTag(`Search: "${currentFilters.search}"`, () => {
            currentFilters.search = '';
            searchInput.value = '';
            updateAndRender();
        });
    }

    if (currentFilters.category !== 'all') {
        createTag(`Category: ${currentFilters.category}`, () => {
            currentFilters.category = 'all';
            categorySelect.value = 'all';
            updateAndRender();
        });
    }

    if (currentFilters.status !== 'all') {
        createTag(`Status: ${currentFilters.status}`, () => {
            currentFilters.status = 'all';
            statusSelect.value = 'all';
            updateAndRender();
        });
    }
}

function createTag(text, onRemove) {
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.innerHTML = `${text} <span aria-label="Remove filter">&times;</span>`;
    tag.querySelector('span').addEventListener('click', onRemove);
    activeFiltersContainer.appendChild(tag);
}
