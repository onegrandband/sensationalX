// Mock Database of Community Projects
const initialProjects = [
    {
        id: 1,
        title: "Neighborhood Code Guild",
        category: "tech",
        status: "active",
        excerpt: "A volunteer-run initiative hosting free weekly coding workshops for youth in local community centers.",
        creator: "Sarah Jenkins",
        likes: 124,
        img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 2,
        title: "Greenspace Rooftops",
        category: "environment",
        status: "active",
        excerpt: "Transforming unused urban rooftop spaces into community-managed vegetable gardens and insect sanctuaries.",
        creator: "Marcus Vance",
        likes: 98,
        img: "https://images.unsplash.com/photo-1530741929037-f727d061967b?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 3,
        title: "Downtown Mural Walk",
        category: "art",
        status: "planning",
        excerpt: "Collaborating with local street artists to turn dull alleyways into a vibrant, story-rich open-air gallery.",
        creator: "Elena Rostova",
        likes: 76,
        img: "https://images.unsplash.com/photo-1561054790-30363a5a2292?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 4,
        title: "Books for Backpacks",
        category: "education",
        status: "completed",
        excerpt: "Successfully distributed over 1,200 books and back-to-school kits to elementary school students.",
        creator: "Community Guild",
        likes: 215,
        img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 5,
        title: "Ocean Cleanup Crew",
        category: "environment",
        status: "active",
        excerpt: "Weekly beach cleanups and community workshops focused on reducing single-use plastics.",
        creator: "Davey Jones",
        likes: 142,
        img: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=400&q=80"
    },
    {
        id: 6,
        title: "Senior Tech Support",
        category: "tech",
        status: "planning",
        excerpt: "Connecting high school volunteers with seniors to help them navigate smartphones, video calls, and online safety.",
        creator: "Liam Chen",
        likes: 54,
        img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80"
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
const searchForm = document.getElementById('project-search-form');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    setupEventListeners();
});

// Setup Event Listeners
function setupEventListeners() {
    // Search input typing (debounced slightly or just listening to 'input')
    searchInput.addEventListener('input', (e) => {
        currentFilters.search = e.target.value.toLowerCase().trim();
        updateAndRender();
    });

    // Dropdown changes
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

    // Layout toggles
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

    // Optional: Submit Project Alert
    document.getElementById('submit-project-btn').addEventListener('click', () => {
        alert("Awesome! This button could open a submit project form modal.");
    });
}

// Master Filtering, Sorting, and Rendering function
function updateAndRender() {
    // 1. Filter
    let filtered = initialProjects.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(currentFilters.search) || 
                              project.excerpt.toLowerCase().includes(currentFilters.search) ||
                              project.creator.toLowerCase().includes(currentFilters.search);
        
        const matchesCategory = currentFilters.category === 'all' || project.category === currentFilters.category;
        const matchesStatus = currentFilters.status === 'all' || project.status === currentFilters.status;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    // 2. Sort
    if (currentFilters.sort === 'newest') {
        // Sort descending by ID as a proxy for date/newest
        filtered.sort((a, b) => b.id - a.id);
    } else if (currentFilters.sort === 'popular') {
        // Sort descending by likes
        filtered.sort((a, b) => b.likes - a.likes);
    } else {
        // Trending default (randomized balance or default index)
        filtered.sort((a, b) => b.likes - a.likes);
    }

    projects = filtered;
    renderProjects();
    renderActiveFilterTags();
}

// Render Projects list to page
function renderProjects() {
    projectsGrid.innerHTML = '';

    if (projects.length === 0) {
        projectsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
                <span style="font-size: 48px;">🔍</span>
                <h3 style="margin-top: 16px;">No projects found</h3>
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

        // Map status value to a badge style class name
        let statusClass = 'badge-active';
        if (project.status === 'completed') statusClass = 'badge-completed';
        if (project.status === 'planning') statusClass = 'badge-planning';

        card.innerHTML = `
            <div class="project-thumbnail">
                <img src="${project.img}" alt="${project.title} Thumbnail" class="project-img" onerror="this.src='https://placehold.co/400x250?text=${encodeURIComponent(project.title)}'">
                <span class="badge ${statusClass}">${project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
            </div>
            <div class="project-card-content">
                <span class="project-category">${project.category.toUpperCase()}</span>
                <h3><a href="#project-${project.id}" class="project-link">${project.title}</a></h3>
                <p class="project-excerpt">${project.excerpt}</p>
                <div class="project-meta">
                    <span class="project-creator">By <strong>${project.creator}</strong></span>
                    <span class="project-likes" onclick="likeProject(${project.id})">❤️ ${project.likes}</span>
                </div>
            </div>
        `;
        projectsGrid.appendChild(card);
    });
}

// Interactivity: Increment Likes (Fake DB save)
window.likeProject = function(projectId) {
    const project = initialProjects.find(p => p.id === projectId);
    if (project) {
        project.likes += 1;
        updateAndRender();
    }
}

// Render small interactive tags showing what filters are active
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

// Helper to append a dynamic filter tag close button
function createTag(text, onRemove) {
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.innerHTML = `${text} <span aria-label="Remove filter">&times;</span>`;
    tag.querySelector('span').addEventListener('click', onRemove);
    activeFiltersContainer.appendChild(tag);
}
