document.addEventListener('DOMContentLoaded', () => {
    
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

});

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. MODAL OPEN/CLOSE LOGIC ---
    const modal = document.getElementById('donationModal');
    const closeBtn = document.getElementById('closeModal');
    
    // Select ALL buttons that contain the text "Donate"
    // This works for Header, Mobile Menu, and Footer buttons automatically
    const allButtons = document.querySelectorAll('button, a.btn'); 

    allButtons.forEach(btn => {
        if(btn.innerText.includes('Donate')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default link jump
                modal.classList.add('show');
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            });
        }
    });

    // Close on X button
    if(closeBtn){
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        });
    }

    // Close on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

});

// --- 2. TAB SWITCHING FUNCTION ---
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    
    // Hide all tab contents
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove('active-content');
    }

    // Remove active class from all buttons
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // Show current tab and activate button
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.classList.add("active");
}

// --- 3. COPY TEXT + SHOW TOAST ---

/* --- COPY TEXT + SHOW TOAST --- */
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        
        // Get the Toast Element
        const toast = document.getElementById("customToast");
        
        // SET THE TEXT TO EXACTLY WHAT YOU WANTED
        toast.innerText = "Copied successfully";
        
        // Show Toast
        toast.className = "show";
        
        // Hide after 3 seconds
        setTimeout(function(){ 
            toast.className = toast.className.replace("show", ""); 
        }, 3000);
        
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}
