document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MOBILE MENU LOGIC (PRIORITY)
    // ==========================================
    // We put this first so it always works, even if other parts fail.
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // ==========================================
    // 2. MODAL LOGIC
    // ==========================================
    const modal = document.getElementById('donationModal');
    const closeBtn = document.getElementById('closeModal');

    // SAFETY CHECK: If the modal HTML is missing on this page, stop here.
    // This prevents the script from crashing.
    if (!modal) {
        return; 
    }
    
    // Helper function to open the modal
    const openModal = (e) => {
        if(e) e.preventDefault(); 
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; 
    };

    // A. Handle Buttons (Checks for any button with text "Donate")
    const allButtons = document.querySelectorAll('button'); 
    allButtons.forEach(btn => {
        // Use includes() instead of trim()=== to be safer with icons/spaces
        if(btn.innerText.includes('Donate')) {
            btn.addEventListener('click', openModal);
        }
    });

    // B. Handle Links (Footer links pointing to #donationModal)
    const donateLinks = document.querySelectorAll('a[href="#donationModal"]');
    donateLinks.forEach(link => {
        link.addEventListener('click', openModal);
    });

    // C. Close on X button
    if(closeBtn){
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    // D. Close on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

});

// ==========================================
// 3. GLOBAL FUNCTIONS (Tabs & Copy)
// ==========================================

function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    
    // Hide all content
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove('active-content');
    }

    // Remove active class from buttons
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Show selected content
    const selectedTab = document.getElementById(tabName);
    if(selectedTab) {
        selectedTab.style.display = "block";
        evt.currentTarget.classList.add("active");
    }
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById("customToast");
        if(toast) {
            toast.innerText = "Copied successfully";
            toast.className = "show";
            setTimeout(function(){ 
                toast.className = toast.className.replace("show", ""); 
            }, 3000);
        }
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

/* --- GALLERY INTERACTION --- */
function toggleDetails(element) {
    // 1. Check if this card is already active
    const isActive = element.classList.contains('active');

    // 2. Remove 'active' from ALL items (so only one shows at a time)
    document.querySelectorAll('.pin-item').forEach(item => {
        item.classList.remove('active');
        // Unmute logic (Optional: if you want sound on click)
        // item.querySelector('video').muted = true;
    });

    // 3. If it wasn't active before, make it active now
    if (!isActive) {
        element.classList.add('active');
        // Optional: Unmute this specific video
        // element.querySelector('video').muted = false;
    }
}

document.addEventListener('DOMContentLoaded', () => {

    /* --- SMART VIDEO AUTOPLAY (Fixes Lag) --- */
    const videos = document.querySelectorAll('.video-wrapper video');

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If video is on screen
            if (entry.isIntersecting) {
                const video = entry.target;
                
                // Try to play
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        // Play started successfully
                        video.classList.add('is-playing'); // Fade it in via CSS
                    }).catch(error => {
                        console.log("Autoplay prevented:", error);
                    });
                }
            } 
            // If video is OFF screen
            else {
                const video = entry.target;
                video.pause(); // Pause to save bandwidth for other videos
                // Optional: remove class if you want them to fade out when off screen
                // video.classList.remove('is-playing'); 
            }
        });
    }, {
        threshold: 0.25 // Trigger when 25% of the video is visible
    });

    // Start observing all videos
    videos.forEach(video => {
        videoObserver.observe(video);
    });

});



document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. FILTERING LOGIC --- */
    window.filterVideos = function(category) {
        const items = document.querySelectorAll('.pin-item');
        const buttons = document.querySelectorAll('.tab-btn');

        // Update Button Styles
        buttons.forEach(btn => btn.classList.remove('active'));
        event.target.classList.add('active');

        // Filter Items
        items.forEach(item => {
            const itemCat = item.getAttribute('data-category');
            if (category === 'all' || itemCat === category) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    };

    /* --- 2. SOUND TOGGLE LOGIC --- */
    window.toggleSound = function(event, btn) {
        event.stopPropagation(); // Stop clicking the card itself
        
        const video = btn.closest('.video-wrapper').querySelector('video');
        const icon = btn.querySelector('i');

        if (video.muted) {
            video.muted = false;
            icon.classList.remove('fa-volume-xmark');
            icon.classList.add('fa-volume-high');
        } else {
            video.muted = true;
            icon.classList.remove('fa-volume-high');
            icon.classList.add('fa-volume-xmark');
        }
    };

    /* --- 3. LOADING & SMART AUTOPLAY --- */
    const videos = document.querySelectorAll('.video-wrapper video');

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            const wrapper = video.closest('.video-wrapper');

            if (entry.isIntersecting) {
                // When video loads enough data to play, hide loader
                video.addEventListener('canplay', () => {
                    wrapper.classList.add('loaded');
                });

                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        video.classList.add('is-playing');
                        wrapper.classList.add('loaded'); // Backup loader hide
                    }).catch(err => console.log("Autoplay blocked"));
                }
            } else {
                video.pause();
                video.muted = true; // Auto-mute when scrolling away
                // Reset icon to mute
                const btnIcon = wrapper.querySelector('.volume-btn i');
                if(btnIcon) {
                    btnIcon.classList.remove('fa-volume-high');
                    btnIcon.classList.add('fa-volume-xmark');
                }
            }
        });
    }, { threshold: 0.25 });

    videos.forEach(video => videoObserver.observe(video));
});

/* --- DETAILS TOGGLE (Existing) --- */
function toggleDetails(element) {
    const isActive = element.classList.contains('active');
    document.querySelectorAll('.pin-item').forEach(item => item.classList.remove('active'));
    if (!isActive) element.classList.add('active');
}