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

/* --- SCROLL ANIMATION (Dots on Line) --- */
document.addEventListener('scroll', () => {
    const timeline = document.getElementById('join-timeline');
    const movingLine = document.getElementById('scrollLine');
    const dots = document.querySelectorAll('.line-dot');

    if (!timeline || !movingLine) return;

    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const sectionHeight = timeline.offsetHeight;
    
    // Start slightly earlier
    const startOffset = windowHeight / 1.8; 
    
    // Calculate progress (0 to 100%)
    let percentage = ((startOffset - rect.top) / (sectionHeight - 100)) * 100;
    percentage = Math.max(0, Math.min(percentage, 100));

    movingLine.style.height = `${percentage}%`;

    // Activate Dots
    dots.forEach(dot => {
        // Position of dot relative to container
        const row = dot.closest('.timeline-row');
        const rowTop = row.offsetTop;
        const dotThreshold = (rowTop / sectionHeight) * 100;

        if (percentage >= dotThreshold) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
});


// ==========================================
    // 5. VIDEO MODAL LOGIC (Updated for Both Pages)
    // ==========================================
    const videoModal = document.getElementById('videoModal');
    const closeVideoBtn = document.getElementById('closeVideo');
    const iframe = document.getElementById('youtubeFrame');
    const videoCover = document.getElementById('videoCover');
    const startVideoBtn = document.getElementById('startVideoBtn');

    // TRIGGERS (Select both buttons)
    const homeBtn = document.getElementById('linkedinBtn'); // Home Page Button
    const joinInfoBtn = document.getElementById('linkedinInfoBtn'); // Join Page 'i' Icon

    // Your Video ID
    const videoID = "JC9A8bvJMWQ"; 

    // Function to Open Modal
    const openVideoModal = (e) => {
        e.preventDefault();
        if(videoModal) {
            videoModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Reset state
            if(videoCover) videoCover.classList.remove('hidden');
            if(iframe) iframe.setAttribute('src', ''); 
        }
    };

    // Add Event Listeners if elements exist
    if (homeBtn) homeBtn.addEventListener('click', openVideoModal);
    if (joinInfoBtn) joinInfoBtn.addEventListener('click', openVideoModal);

    // PLAY VIDEO LOGIC
    if (videoModal) {
        const playVideo = () => {
            if(videoCover) videoCover.classList.add('hidden');
            if(iframe) {
                const autoPlayUrl = `https://www.youtube.com/embed/${videoID}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
                iframe.setAttribute('src', autoPlayUrl);
            }
        };

        if(startVideoBtn) startVideoBtn.addEventListener('click', playVideo);
        if(videoCover) videoCover.addEventListener('click', playVideo);

        // CLOSE MODAL LOGIC
        const closeVideo = () => {
            videoModal.classList.remove('show');
            if(iframe) iframe.setAttribute('src', ''); // Stop Video
            document.body.style.overflow = 'auto';
        };

        if(closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideo);

        window.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideo();
            }
        });
    }


    document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SCROLL TRIGGER & SOUND LOGIC
    // ==========================================
    const registrationSection = document.getElementById('registration');
    const floatingNav = document.getElementById('slackFloatingNav');
    const soundEffect = document.getElementById('notificationSound');
    
    let hasPlayedSound = false; // Ensures sound only plays once

    if (registrationSection && floatingNav) {
        // Observer checks if user sees the registration section
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Show Buttons
                    floatingNav.classList.add('visible');
                    
                    // Play Sound (if not played yet)
                    if (!hasPlayedSound && soundEffect) {
                        soundEffect.volume = 0.5; // subtle volume
                        soundEffect.play().catch(e => console.log("Audio autoplay blocked by browser"));
                        hasPlayedSound = true;
                    }
                } else {
                    // Optional: Hide buttons if they scroll away? 
                    // Remove the else block if you want them to stay forever once shown.
                    floatingNav.classList.remove('visible');
                }
            });
        }, { threshold: 0.2 }); // Trigger when 20% of section is visible

        observer.observe(registrationSection);
    }

    // ==========================================
    // 2. DYNAMIC VIDEO MODAL LOGIC
    // ==========================================
    const videoModal = document.getElementById('videoModal');
    const iframe = document.getElementById('youtubeFrame');
    const videoCover = document.getElementById('videoCover');
    const coverImg = document.querySelector('.cover-img'); // Select the image tag
    const startVideoBtn = document.getElementById('startVideoBtn');
    const closeVideoBtn = document.getElementById('closeVideo');

    // -- TRIGGERS --
    const linkedinBtn = document.getElementById('linkedinInfoBtn'); // The 'i' icon
    const slackBtn = document.getElementById('slackVideoBtn');      // The new float button

    // -- DATA VARIABLES --
    let currentVideoID = ""; 

    // Function to Open Modal with Specific Data
    const openModalWithVideo = (videoId, thumbnailPath) => {
        if(videoModal) {
            // 1. Set Data
            currentVideoID = videoId;
            if(coverImg) coverImg.src = thumbnailPath; // Swap Image
            
            // 2. Reset Player State
            if(videoCover) videoCover.classList.remove('hidden');
            if(iframe) iframe.setAttribute('src', ''); 

            // 3. Show Modal
            videoModal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    };

    // EVENT 1: Clicked LinkedIn Icon
    if (linkedinBtn) {
        linkedinBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Pass LinkedIn ID and LinkedIn Thumbnail
            openModalWithVideo("JC9A8bvJMWQ", "../Images/Video Thumbnail.png");
        });
    }

    // EVENT 2: Clicked Slack Button
    if (slackBtn) {
        slackBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Pass Slack ID and Slack Thumbnail
            // REPLACE THESE WITH YOUR ACTUAL SLACK VIDEO ID AND IMAGE
            openModalWithVideo("JC9A8bvJMWQ", "../Images/Video Thumbnail.png"); 
        });
    }

    // PLAY BUTTON LOGIC
    const playVideo = () => {
        if(videoCover) videoCover.classList.add('hidden');
        if(iframe && currentVideoID) {
            const autoPlayUrl = `https://www.youtube.com/embed/${currentVideoID}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
            iframe.setAttribute('src', autoPlayUrl);
        }
    };

    if(startVideoBtn) startVideoBtn.addEventListener('click', playVideo);
    if(videoCover) videoCover.addEventListener('click', playVideo);

    // CLOSE LOGIC
    const closeVideo = () => {
        if(videoModal) videoModal.classList.remove('show');
        if(iframe) iframe.setAttribute('src', '');
        document.body.style.overflow = 'auto';
    };

    if(closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideo);
    
    window.addEventListener('click', (e) => {
        if (e.target === videoModal) closeVideo();
    });

});