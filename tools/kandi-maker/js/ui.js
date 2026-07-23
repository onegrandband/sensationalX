// js/ui.js
import { braceletData, addBead, removeLastBead, clearBracelet, setSelectedBead, setSelectedColor, setSelectedText } from './state.js';
import { beadCatalog, renderBeadHTML, LetterBead, getBeadById } from './beads.js';

const display = document.getElementById('bracelet-display');
const paletteContainer = document.getElementById('color-palette');

const defaultColors = [
    '#ff007f', '#00ffff', '#39ff14', '#ffff00', 
    '#9d00ff', '#ffffff', '#000000', '#ff5733', 
    '#33ff57', '#3357ff', '#ff33f3', '#ff8633'
];

/**
 * Entry point for initializing the user interface components
 */
export function initializeUI() {
    setupCatalogPicker();
    setupColorPicker();
    setupControls();
    renderBracelet();
}

/**
 * Builds a visual grid catalog of all available beads from beads.js
 */
function setupCatalogPicker() {
    const controlsPanel = document.querySelector('.controls');
    
    const catalogWrapper = document.createElement('div');
    catalogWrapper.className = 'catalog-wrapper';
    catalogWrapper.innerHTML = `<h3 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; color: #ccc;">Select Bead Type</h3>`;
    
    const catalogGrid = document.createElement('div');
    catalogGrid.className = 'catalog-grid';
    catalogGrid.style.display = 'grid';
    catalogGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(50px, 1fr))';
    catalogGrid.style.gap = '6px';
    catalogGrid.style.maxHeight = '140px';
    catalogGrid.style.overflowY = 'auto';
    catalogGrid.style.marginBottom = '1rem';
    catalogGrid.style.padding = '8px';
    catalogGrid.style.background = 'rgba(0,0,0,0.3)';
    catalogGrid.style.borderRadius = '8px';
    catalogGrid.style.border = '1px solid rgba(255,255,255,0.1)';

    beadCatalog.forEach(bead => {
        const item = document.createElement('div');
        item.className = 'catalog-item';
        item.title = bead.name;
        item.style.cursor = 'pointer';
        item.style.padding = '4px';
        item.style.border = '2px solid transparent';
        item.style.borderRadius = '6px';
        item.style.display = 'flex';
        item.style.flexDirection = 'column';
        item.style.alignItems = 'center';
        item.style.justifyContent = 'center';
        item.style.background = 'rgba(255,255,255,0.03)';

        // Render preview thumbnail
        const previewHTML = renderBeadHTML(bead.id, braceletData.selectedColor, 'K');
        item.innerHTML = previewHTML;
        
        // Scale down preview for the catalog selection grid
        const previewEl = item.firstElementChild;
        if (previewEl) {
            previewEl.style.transform = 'scale(0.55)';
            previewEl.style.transformOrigin = 'center';
            previewEl.style.margin = '-10px 0';
        }

        if (bead.id === braceletData.selectedBeadId) {
            item.style.borderColor = '#ff007f';
            item.style.background = 'rgba(255,0,127,0.15)';
        }

        item.addEventListener('click', () => {
            setSelectedBead(bead.id);
            document.querySelectorAll('.catalog-item').forEach(i => {
                i.style.borderColor = 'transparent';
                i.style.background = 'rgba(255,255,255,0.03)';
            });
            item.style.borderColor = '#ff007f';
            item.style.background = 'rgba(255,0,127,0.15)';

            // Toggle custom text input box if it's a letter bead
            toggleTextInputVisibility(bead);
        });

        catalogGrid.appendChild(item);
    });

    catalogWrapper.appendChild(catalogGrid);
    controlsPanel.insertBefore(catalogWrapper, paletteContainer);

    // Setup input field for custom text (used by LetterBeads)
    setupTextInput(controlsPanel);
}

/**
 * Creates a text input field dynamically shown when letter beads are selected
 */
function setupTextInput(parentEl) {
    const textWrapper = document.createElement('div');
    textWrapper.id = 'letter-input-wrapper';
    textWrapper.className = 'letter-input-wrapper';
    textWrapper.style.marginBottom = '1rem';
    textWrapper.style.display = 'none';
    textWrapper.innerHTML = `
        <label style="display: block; font-size: 0.8rem; margin-bottom: 4px; color: #aaa;">Letter Bead Character:</label>
        <input type="text" id="bead-text-input" maxlength="1" value="K" style="padding: 8px; width: 50px; background: #111; color: white; border: 1px solid #444; border-radius: 6px; text-align: center; font-weight: bold; font-size: 16px;" />
    `;
    
    parentEl.insertBefore(textWrapper, paletteContainer);

    document.getElementById('bead-text-input').addEventListener('input', (e) => {
        const val = e.target.value.toUpperCase() || 'A';
        setSelectedText(val);
    });

    const initialBead = getBeadById(braceletData.selectedBeadId);
    toggleTextInputVisibility(initialBead);
}

/**
 * Checks if the chosen bead accepts text, showing or hiding the input box
 */
function toggleTextInputVisibility(bead) {
    const wrapper = document.getElementById('letter-input-wrapper');
    if (!wrapper) return;
    
    if (bead instanceof LetterBead) {
        wrapper.style.display = 'block';
    } else {
        wrapper.style.display = 'none';
    }
}

/**
 * Sets up the standard color swatches palette
 */
function setupColorPicker() {
    paletteContainer.innerHTML = '<h3 style="font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; color: #ccc;">Bead Color</h3>';
    const swatchesDiv = document.createElement('div');
    swatchesDiv.className = 'swatches-flex';
    swatchesDiv.style.display = 'flex';
    swatchesDiv.style.gap = '8px';
    swatchesDiv.style.flexWrap = 'wrap';
    swatchesDiv.style.justifyContent = 'center';

    defaultColors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.style.width = '32px';
        swatch.style.height = '32px';
        swatch.style.borderRadius = '50%';
        swatch.style.cursor = 'pointer';
        swatch.style.border = '2px solid rgba(255,255,255,0.2)';

        if (color === braceletData.selectedColor) {
            swatch.style.border = '2px solid white';
            swatch.style.transform = 'scale(1.1)';
            swatch.classList.add('selected');
        }

        swatch.addEventListener('click', () => {
            setSelectedColor(color);
            document.querySelectorAll('.color-swatch').forEach(s => {
                s.style.border = '2px solid rgba(255,255,255,0.2)';
                s.style.transform = 'scale(1)';
                s.classList.remove('selected');
            });
            swatch.style.border = '2px solid white';
            swatch.style.transform = 'scale(1.1)';
            swatch.classList.add('selected');
        });

        swatchesDiv.appendChild(swatch);
    });

    paletteContainer.appendChild(swatchesDiv);
}

/**
 * Attaches event listeners to action buttons
 */
function setupControls() {
    document.getElementById('add-bead-btn').addEventListener('click', () => {
        addBead();
        renderBracelet();
    });

    document.getElementById('remove-bead-btn').addEventListener('click', () => {
        removeLastBead();
        renderBracelet();
    });

    document.getElementById('clear-btn').addEventListener('click', () => {
        clearBracelet();
        renderBracelet();
    });
}

/**
 * Renders all beads currently sitting on the string canvas
 */
function renderBracelet() {
    display.innerHTML = '';
    
    if (braceletData.beads.length === 0) {
        display.innerHTML = `<span style="color: rgba(255,255,255,0.4); font-style: italic; font-size: 0.9rem; padding: 0 15px; white-space: nowrap;">Your string is empty. Pick a bead and click Add Bead!</span>`;
        return;
    }

    braceletData.beads.forEach(item => {
        // Generate raw HTML string from the bead template class
        const htmlString = renderBeadHTML(item.beadId, item.color, item.text);
        
        // Parse string into a functional DOM node
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const beadElement = doc.body.firstElementChild;
        
        if (beadElement) {
            display.appendChild(beadElement);
        }
    });

    // Auto-scroll the container to show the newest bead added
    display.scrollLeft = display.scrollWidth;
}
