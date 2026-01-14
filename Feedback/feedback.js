document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. MOBILE MENU LOGIC (PRIORITY)
    // ==========================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // ==========================================
    // 2. DONATION MODAL LOGIC
    // ==========================================
    const modal = document.getElementById('donationModal');
    const closeBtn = document.getElementById('closeModal');

    // Only run donation logic if the modal exists on this page
    if (modal) {
        // Helper function to open the modal
        const openModal = (e) => {
            if(e) e.preventDefault(); 
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; 
        };

        // A. Handle Buttons (Checks for any button with text "Donate")
        const allButtons = document.querySelectorAll('button'); 
        allButtons.forEach(btn => {
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
    }

    // ==========================================
    // 3. FAQ ACCORDION LOGIC
    // ==========================================
    const accordionItems = document.querySelectorAll('.accordion-item');

    if (accordionItems.length > 0) {
        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            
            if (header) {
                header.addEventListener('click', () => {
                    // Check if currently active
                    const isActive = item.classList.contains('active');
                    
                    // Toggle current
                    if (isActive) {
                        item.classList.remove('active');
                        // Change icon back to plus
                        const icon = item.querySelector('.fa-minus');
                        if(icon) {
                            icon.classList.replace('fa-minus', 'fa-plus');
                        }
                    } else {
                        item.classList.add('active');
                        // Change icon to minus
                        const icon = item.querySelector('.fa-plus');
                        if(icon) {
                            icon.classList.replace('fa-plus', 'fa-minus');
                        }
                    }
                });
            }
        });
    }

});

// ==========================================
// 4. GLOBAL FUNCTIONS (Tabs & Copy)
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