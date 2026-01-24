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

// ==========================================
    // ALUMNI CARD HOVER GLOW EFFECT
    // ==========================================
    const cards = document.querySelectorAll(".alumni-card");

    // Check if device is desktop (to save resources on mobile)
    if (window.matchMedia("(min-width: 1025px)").matches) {
        
        cards.forEach((card) => {
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                // Update CSS variables for this specific card
                card.style.setProperty("--mouse-x", `${x}px`);
                card.style.setProperty("--mouse-y", `${y}px`);
            });
        });
        
    }