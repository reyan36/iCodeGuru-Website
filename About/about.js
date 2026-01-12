document.addEventListener('DOMContentLoaded', () => {

    // --- 1. MOBILE MENU (Keep this as is) ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // --- 2. TEAM SCROLL FIX (PC & Mobile) ---
    const slider = document.querySelector('.team-track');
    const progressBar = document.querySelector('.scroll-thumb');
    const scrollContainer = document.querySelector('.custom-scrollbar'); // The grey line container

    if (slider && progressBar && scrollContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Mouse Down (Start Drag)
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        // Mouse Leave/Up (Stop Drag)
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        // Mouse Move (The Dragging Motion)
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault(); // This stops weird browser selections
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Speed multiplier (2x speed)
            slider.scrollLeft = scrollLeft - walk;
        });

        // --- 3. SCROLLBAR SYNCHRONIZATION ---
        // We listen to the 'scroll' event so it works with Touch, MouseDrag, and Touchpad
        slider.addEventListener('scroll', () => {
            // How much have we scrolled? (0 to 1)
            const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
            
            // Avoid division by zero if content fits on screen
            if (maxScrollLeft === 0) return;

            const scrollRatio = slider.scrollLeft / maxScrollLeft;

            // Calculate widths to move the bar correctly
            const containerWidth = scrollContainer.clientWidth;
            const barWidth = progressBar.clientWidth;
            
            // The empty space the bar can move into
            const availableSpace = containerWidth - barWidth;

            // Move the bar
            const movePixels = scrollRatio * availableSpace;
            progressBar.style.left = `${movePixels}px`;
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. MOBILE MENU --- */
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    /* --- 2. TEAM DRAG SCROLL (Keep your existing Team code here) --- */
    const teamSlider = document.querySelector('.team-track');
    // ... include your previous team slider code here ...

    /* --- 3. TESTIMONIAL SLIDER BUTTONS (FIXED) --- */
    const testiTrack = document.querySelector('.testimonial-track');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (testiTrack && nextBtn && prevBtn) {
        
        nextBtn.addEventListener('click', () => {
            // Scroll right by width of one card (approx 600px)
            // We use 'scrollBy' on the track itself
            testiTrack.scrollBy({ left: 600, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            // Scroll left
            testiTrack.scrollBy({ left: -600, behavior: 'smooth' });
        });
    }

});