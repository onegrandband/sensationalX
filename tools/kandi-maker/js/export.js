// js/export.js

/**
 * Exports the bracelet container element as a downloadable PNG image.
 * Automatically injects html2canvas if not already loaded in the page.
 * @param {HTMLElement} containerElement - The DOM element to capture
 */
export async function exportBraceletAsImage(containerElement) {
    if (!window.html2canvas) {
        await loadHtml2CanvasScript();
    }

    if (!window.html2canvas) {
        alert('Image export library could not be loaded.');
        return;
    }

    try {
        const canvas = await window.html2canvas(containerElement, {
            backgroundColor: '#000000',
            scale: 2, // High resolution capture
            logging: false
        });

        const imageURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imageURL;
        link.download = `kandi-bracelet-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error exporting bracelet image:', error);
        alert('Failed to generate image export.');
    }
}

function loadHtml2CanvasScript() {
    return new Promise((resolve) => {
        if (window.html2canvas) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => resolve();
        script.onerror = () => resolve();
        document.head.appendChild(script);
    });
}
