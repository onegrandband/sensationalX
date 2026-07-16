// Updated Database containing all your custom assets, games, and pages
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
        img: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        title: "Apple Catch Game",
        category: "games",
        status: "active",
        excerpt: "Control your basket and catch the falling golden apples. Don't let them hit the ground!",
        creator: "apple",
        likes: 118,
        img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        title: "Axe Throwing Game",
        category: "games",
        status: "active",
        excerpt: "Test your aim in this virtual axe-throwing simulator. Hit the bullseye to unlock custom axes!",
        creator: "axe-throwing",
        likes: 189,
        img: "https://images.unsplash.com/photo-1595206133361-b1fe343e5e23?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 4,
        title: "Banana Catcher Game",
        category: "games",
        status: "active",
        excerpt: "A chaotic catching game featuring falling bananas and crazy monkey power-ups.",
        creator: "banana",
        likes: 95,
        img: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 5,
        title: "Bell Ringer Game",
        category: "games",
        status: "active",
        excerpt: "Timing is everything! Ring the festive bells at the exact peak of their swing to score combos.",
        creator: "bell",
        likes: 67,
        img: "https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 6,
        title: "Catch the Kitty Game",
        category: "games",
        status: "active",
        excerpt: "A cute, physics-based puzzle-catching adventure where you coax energetic kittens into cozy baskets.",
        creator: "cat",
        likes: 243,
        img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80"
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
        img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 8,
        title: "Video Converter - 404 Error Page",
        category: "web-tools",
        status: "completed",
        excerpt: "A custom 404 glitch-art styled screen representing broken video translation paths.",
        creator: "video-converter",
        likes: 72,
        img: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 9,
        title: "Pride Theme 404 Page",
        category: "art",
        status: "completed",
        excerpt: "A vibrant, custom pride-themed 404 page celebrating identity while pointing users safely back home.",
        creator: "pride",
        likes: 312,
        img: "https://images.unsplash.com/photo-1572537144122-f155981245b7?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 10,
        title: "Gender Not Found 404 Page",
        category: "art",
        status: "completed",
        excerpt: "A custom-styled 404 page featuring a witty 'Gender Not Found: Please select custom values' theme.",
        creator: "transf",
        likes: 389,
        img: "https://images.unsplash.com/photo-1611590027211-b954fd027b51?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 11,
        title: "Transmasc Styled 404 Page",
        category: "art",
        status: "completed",
        excerpt: "A beautifully styled error fallback page featuring transmasculine palette pride flag graphics.",
        creator: "transm",
        likes: 274,
        img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=400&q=80"
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
            <div class="project-thumbnail">
                <img src="${project.img}" alt="${project.title} Thumbnail" class="project-img">
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
