// js/dragDrop.js

/**
 * Enables drag-and-drop bead rearrangement on the bracelet string display.
 * @param {HTMLElement} displayContainer - The container holding the bead DOM nodes
 * @param {Array} beadsArray - The active braceletData.beads array reference
 * @param {Function} onReorderCallback - Callback triggered after successful reordering
 */
export function enableDragAndDrop(displayContainer, beadsArray, onReorderCallback) {
    let draggedIndex = null;

    displayContainer.addEventListener('dragstart', (e) => {
        const beadNode = e.target.closest('[draggable="true"]');
        if (!beadNode) return;
        
        const children = Array.from(displayContainer.children);
        draggedIndex = children.indexOf(beadNode);
        e.dataTransfer.effectAllowed = 'move';
    });

    displayContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    });

    displayContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        const targetNode = e.target.closest('#bracelet-display > *');
        if (!targetNode || draggedIndex === null) return;

        const children = Array.from(displayContainer.children);
        const targetIndex = children.indexOf(targetNode);

        if (draggedIndex !== targetIndex && targetIndex >= 0) {
            // Reorder array elements
            const [movedItem] = beadsArray.splice(draggedIndex, 1);
            beadsArray.splice(targetIndex, 0, movedItem);

            if (typeof onReorderCallback === 'function') {
                onReorderCallback();
            }
        }
        draggedIndex = null;
    });
}
