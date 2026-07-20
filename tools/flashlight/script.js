// Grab the flashlight overlay from the HTML
const flashlight = document.querySelector('.flashlight');

// Listen for mouse movement
document.addEventListener('mousemove', (e) => {
    // Get the X and Y coordinates of the mouse
    const x = e.clientX;
    const y = e.clientY;
    
    // Update the radial gradient position to follow the mouse
    flashlight.style.background = `radial-gradient(circle 150px at ${x}px ${y}px, transparent 0%, rgba(0, 0, 0, 0.98) 80%)`;
});

// Add touch support so it works on mobile devices too
document.addEventListener('touchmove', (e) => {
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    
    flashlight.style.background = `radial-gradient(circle 150px at ${x}px ${y}px, transparent 0%, rgba(0, 0, 0, 0.98) 80%)`;
});
