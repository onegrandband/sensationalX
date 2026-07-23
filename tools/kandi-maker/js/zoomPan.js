// js/zoomPan.js

export function initializeZoomAndScroll(containerElement) {
    if (!containerElement) return;

    let currentZoom = 1;

    containerElement.addEventListener('wheel', (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            currentZoom += e.deltaY * -0.001;
            currentZoom = Math.max(0.5, Math.min(3.0, currentZoom)); // Clamp zoom between 50% and 300%
            
            const display = containerElement.querySelector('#bracelet-display');
            if (display) {
                display.style.transform = `scale(${currentZoom})`;
                display.style.transformOrigin = 'left center';
            }
        } else {
            if (e.deltaX === 0) {
                containerElement.scrollLeft += e.deltaY;
            }
        }
    }, { passive: false });
}
