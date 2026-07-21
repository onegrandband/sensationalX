// Database containing custom assets, games, and projects
const initialProjects = [
    // --- GAMES ---
    {
        id: 1,
        title: "Ant Smasher Game",
        category: "games",
        status: "active",
        excerpt: "A fun, fast-paced arcade game where you tap to smash invading ants before they cross the screen!",
        creator: "zee12",
        likes: 8,
        icon: "bug"
    },
    {
        id: 2,
        title: "Apple Catch Game",
        category: "games",
        status: "active",
        excerpt: "Control your basket and catch the falling golden apples. Don't let them hit the ground!",
        creator: "zee12",
        likes: 9,
        icon: "apple"
    },
    {
        id: 3,
        title: "Axe Throwing Game",
        category: "games",
        status: "active",
        excerpt: "Test your aim in this virtual axe-throwing simulator. Hit the bullseye to unlock custom axes!",
        creator: "axe-throwing",
        likes: 2,
        icon: "zee12"
    },
    {
        id: 4,
        title: "Banana Catcher Game",
        category: "games",
        status: "active",
        excerpt: "Can you catch all of the bananas before time runs out?",
        creator: "zee12",
        likes: 4,
        icon: "banana"
    },
    {
        id: 5,
        title: "Bell Ringer Game",
        category: "games",
        status: "active",
        excerpt: "Timing is everything! Ring the festive bells at the exact peak of their swing to score combos.",
        creator: "jonah-oijinnka",
        likes: 3,
        icon: "bell"
    },
    {
        id: 6,
        title: "Catch the Kitty Game",
        category: "games",
        status: "active",
        excerpt: "A cute, physics-based puzzle-catching adventure where you coax energetic kittens into cozy baskets.",
        creator: "agas12",
        likes: 12,
        icon: "cat"
    },

    // --- UTILITIES / TOOLS / PAGES ---
    {
        id: 7,
        title: "Audio Converter",
        category: "web-tools",
        status: "completed",
        excerpt: "Convert audio easily.",
        creator: "sensationalx",
        likes: 8,
        icon: "cassette"
    },
    {
        id: 8,
        title: "Video Converter Page",
        category: "web-tools",
        status: "completed",
        excerpt: "Convert videos!",
        creator: "sensationalx",
        likes: 12,
        icon: "video"
    },
    {
        id: 9,
        title: "Pride Page",
        category: "art",
        status: "completed",
        excerpt: "A pride page.",
        creator: "zee12",
        likes: 2,
        icon: "flag"
    },
    {
        id: 10,
        title: "Pixel Art",
        category: "art",
        status: "active",
        excerpt: "Pixel Art Maker",
        creator: "zee12",
        likes: 2,
        icon: "user-search"
    },
    {
        id: 11,
        title: "Create a Project!",
        category: "art",
        status: "completed",
        excerpt: "Create a new community project here.",
        creator: "sensationalx",
        likes: 9,
        icon: "palette"
    }
];

// App State
let projects = [...initialProjects];
let currentPage = 1;
const itemsPerPage = 6;

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
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageNumbersContainer = document.getElementById('page-numbers');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    updateAndRender();
});

// Event Listeners
function setupEventListeners() {
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase().trim();
        currentPage = 1;
        updateAndRender();
    });

    categorySelect.addEventListener('change', (e) => {
        currentFilters.category = e.target.value;
        currentPage = 1;
        updateAndRender();
    });

    statusSelect.addEventListener('change', (e) => {
        currentFilters.status = e.target.value;
        currentPage = 1;
        updateAndRender();
    });

    sortSelect.addEventListener('change', (e) => {
        currentFilters.sort = e.target.value;
        currentPage = 1;
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

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProjects();
            scrollToGrid();
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(projects.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderProjects();
            scrollToGrid();
        }
    });

    document.getElementById('submit-project-btn').addEventListener('click', () => {
        alert("Project submission form feature coming soon!");
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
    } else { // trending
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
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--color-text-muted);">
                <i data-lucide="search-x" style="width: 48px; height: 48px; margin-bottom: 12px; color: var(--color-primary);"></i>
                <h3 style="font-size: 1.25rem; font-weight: 700; color: var(--color-text-main);">No projects found</h3>
                <p>Try adjusting your search terms or filters.</p>
            </div>
        `;
        resultsCount.textContent = "Showing 0 projects";
        renderPagination(0);
        lucide.createIcons();
        return;
    }

    resultsCount.textContent = `Showing ${projects.length} project${projects.length === 1 ? '' : 's'}`;

    // Pagination slicing
    const totalPages = Math.ceil(projects.length / itemsPerPage);
    if (currentPage > totalPages) currentPage = totalPages;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProjects = projects.slice(startIndex, startIndex + itemsPerPage);

    paginatedProjects.forEach(project => {
        const card = document.createElement('article');
        card.className = 'project-card';

        let badgeClass = 'badge-active';
        if (project.status === 'completed') badgeClass = 'badge-completed';
        if (project.status === 'planning') badgeClass = 'badge-planning';

        card.innerHTML = `
            <div class="project-thumbnail">
                <i data-lucide="${project.icon}" class="project-hero-icon"></i>
                <span class="badge ${badgeClass}">${project.status}</span>
            </div>
            <div class="project-card-content">
                <span class="project-category">${project.category.replace('-', ' ').toUpperCase()}</span>
                <h3><a href="#project-${project.id}" class="project-link">${project.title}</a></h3>
                <p class="project-excerpt">${project.excerpt}</p>
                <div class="project-meta">
                    <span class="project-creator">By <strong>${project.creator}</strong></span>
                    <span class="project-likes" onclick="likeProject(${project.id})">
                        <i data-lucide="heart" class="icon-sm"></i> ${project.likes}
                    </span>
                </div>
            </div>
        `;
        projectsGrid.appendChild(card);
    });

    renderPagination(totalPages);
    lucide.createIcons();
}

function renderPagination(totalPages) {
    pageNumbersContainer.innerHTML = '';

    if (totalPages <= 1) {
        prevPageBtn.disabled = true;
        nextPageBtn.disabled = true;
        return;
    }

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `page-num ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.addEventListener('click', () => {
            currentPage = i;
            renderProjects();
            scrollToGrid();
        });
        pageNumbersContainer.appendChild(btn);
    }
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
            currentPage = 1;
            updateAndRender();
        });
    }

    if (currentFilters.category !== 'all') {
        createTag(`Category: ${currentFilters.category}`, () => {
            currentFilters.category = 'all';
            categorySelect.value = 'all';
            currentPage = 1;
            updateAndRender();
        });
    }

    if (currentFilters.status !== 'all') {
        createTag(`Status: ${currentFilters.status}`, () => {
            currentFilters.status = 'all';
            statusSelect.value = 'all';
            currentPage = 1;
            updateAndRender();
        });
    }

    lucide.createIcons();
}

function createTag(text, onRemove) {
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.innerHTML = `${text} <i data-lucide="x" class="remove-icon"></i>`;
    tag.querySelector('.remove-icon').addEventListener('click', onRemove);
    activeFiltersContainer.appendChild(tag);
}

function scrollToGrid() {
    projectsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
