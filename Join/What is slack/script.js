document.addEventListener('DOMContentLoaded', () => {
    
    // ... (Your other code) ...

    // ==========================================
    // SLACK PAGE: EMBEDDED VIDEO LOGIC
    // ==========================================
    const slackCover = document.getElementById('slackPageCover');
    const slackFrame = document.getElementById('slackPageFrame');
    const playEmbedBtn = document.getElementById('playSlackPageBtn');
    
    // REPLACE WITH YOUR SLACK VIDEO ID
    const slackVideoID = "JC9A8bvJMWQ"; 

    if (slackCover && slackFrame && playEmbedBtn) {
        
        const playEmbedVideo = () => {
            // 1. Hide Cover
            slackCover.classList.add('hidden');
            
            // 2. Play Video
            const autoPlayUrl = `https://www.youtube.com/embed/${slackVideoID}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
            slackFrame.setAttribute('src', autoPlayUrl);
        };

        // Click on Button OR Cover Image triggers play
        playEmbedBtn.addEventListener('click', playEmbedVideo);
        slackCover.addEventListener('click', playEmbedVideo);
    }

});

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

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // SLACK TUTORIAL LOGIC (STORY MODE)
    // ==========================================
    const demoForm = document.getElementById('demoForm');
    const demoInput = document.getElementById('demoInput');
    const demoFeed = document.getElementById('demoFeed');
    const headerTitle = document.getElementById('headerTitle');
    const typingInd = document.getElementById('typingIndicator');
    const tooltip = document.getElementById('demoTooltip');
    const channels = document.querySelectorAll('.channel-group li');

    // STATE VARIABLES
    let tutorialStep = 0; 
    let tutorialComplete = false;

    // --- CHANNEL CONTENT DATABASE (For after tutorial) ---
    const channelContent = {
        'general': `
            <div class="msg-row"><div class="msg-avatar z-avatar">Z</div><div class="msg-bubble"><div class="msg-name">Dr. Zafar Shahid</div><div class="msg-content">Welcome! This is the start of your journey.</div></div></div>
        `,
        'announcements': `
            <div class="msg-row"><div class="msg-avatar z-avatar">Z</div><div class="msg-bubble"><div class="msg-name">Dr. Zafar Shahid</div><div class="msg-content"><strong>Nouman ud din</strong> from Swat (UET Peshawar) at the Intl airpot, on his way to USA for fully funded scholarship.<br>#SuccessStory</div></div></div>
            <div class="msg-row"><div class="msg-avatar z-avatar">Z</div><div class="msg-bubble"><div class="msg-name">Dr. Zafar Shahid</div><div class="msg-content">We Welcome <strong>Ali Tariq Bajwa</strong>, a UET Alumni, to the USA airspace. He is coming on a fully funded scholarship in Fargo, North Dakota.<br>#SuccessStory</div></div></div>
            <div class="msg-row"><div class="msg-avatar r-avatar">R</div><div class="msg-bubble"><div class="msg-name">Dr. Rizwan Ghaffar</div><div class="msg-content">There is an upcoming hackathon titled as <strong>"Global AI Hackathon"</strong> by Hack-Nation. This is a 48 hour hackathon from Feb 7 to Feb 8.</div></div></div>
        `,
        'python-course': `
            <div class="msg-row"><div class="msg-avatar bot-avatar">S</div><div class="msg-bubble"><div class="msg-name">Slackbot <span style="font-size:11px;color:#888;">APP</span></div><div class="msg-content"><strong>Reminder:</strong> Python Session starting now!<br><a href="#" class="link-blue">https://us02web.zoom.us/j/834...</a><br>Passcode: 123456</div></div></div>
            <div class="msg-row"><div class="msg-avatar s-avatar">M</div><div class="msg-bubble"><div class="msg-name">Mubashir</div><div class="msg-content">Hey! I can help you with the loop syntax. Let's practice code sharing.</div></div></div>
        `,
        'wins': `
            <div class="msg-row"><div class="msg-avatar m-avatar">Z</div><div class="msg-bubble"><div class="msg-name">Zubair Zafar</div><div class="msg-content">I am landing in the US today for my master's..</div></div></div>
            <div class="msg-row"><div class="msg-avatar t-avatar">T</div><div class="msg-bubble"><div class="msg-name">Muhammad Talha</div><div class="msg-content">I published my new research paper in ICIP 2025</div></div></div>
            <div class="msg-row"><div class="msg-avatar a-avatar">A</div><div class="msg-bubble"><div class="msg-name">Afsheen Ghuman</div><div class="msg-content">Completed my master's degree in US, Thanks to iCodeGuru</div></div></div>
        `
    };

    if(demoForm && demoInput) {

        // --- SUBMIT LOGIC ---
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userVal = demoInput.value.toLowerCase();

            // STEP 1: USER TYPES "HI"
            if(tutorialStep === 0) {
                if(tooltip) tooltip.style.display = 'none';
                
                // User Message
                addMessage("You", "U", "m-avatar", "Hi!");
                demoInput.value = "";
                
                // Move to Announcements
                setTimeout(() => {
                    switchToAnnouncements();
                }, 800);
            }

            // STEP 3: USER TYPES "HELP"
            else if (tutorialStep === 3) { // Waiting for 'help'
                if(userVal.includes('help')) {
                    if(tooltip) tooltip.style.display = 'none';
                    addMessage("You", "U", "m-avatar", "I need some help please!");
                    demoInput.value = "";
                    
                    // Final Reply & Unlock
                    setTimeout(() => {
                        showTyping(true, "Mubashir is typing...");
                        setTimeout(() => {
                            showTyping(false);
                            addMessage("Mubashir", "M", "m-avatar", "I am here! I can review your code. Please share it!.");
                            finishTutorial();
                        }, 1500);
                    }, 500);
                }
            }
        });

        // --- STEP 2: SWITCH TO ANNOUNCEMENTS ---
        function switchToAnnouncements() {
            // UI Update
            setActiveChannel('chan-announce');
            headerTitle.innerText = "# announcements";
            demoFeed.innerHTML = channelContent['announcements'];
            
            // Highlight Python Channel
            setTimeout(() => {
                const pythonBtn = document.getElementById('chan-python');
                pythonBtn.classList.add('highlight-channel');
                pythonBtn.style.cursor = "pointer"; // Enable click
                tutorialStep = 2; // Ready for click
                
                // Show hint inside chat
                addSystemNote("👉 Click on <strong>#python-course</strong> in the sidebar to join the class.");
            }, 1500);
        }

        // --- STEP 2.5: HANDLE CHANNEL CLICKS ---
        channels.forEach(btn => {
            btn.addEventListener('click', function() {
                const chanName = this.getAttribute('data-name');

                // If tutorial finished, allow full navigation
                if(tutorialComplete) {
                    setActiveChannel(this.id);
                    headerTitle.innerText = "# " + chanName;
                    demoFeed.innerHTML = channelContent[chanName] || "";
                    return;
                }

                // If in tutorial, ONLY allow specific clicks
                if(tutorialStep === 2 && this.id === 'chan-python') {
                    startPythonStep();
                }
            });
        });

        // --- STEP 3: START PYTHON CHANNEL ---
        function startPythonStep() {
            const pythonBtn = document.getElementById('chan-python');
            pythonBtn.classList.remove('highlight-channel');
            setActiveChannel('chan-python');
            headerTitle.innerText = "# python-course";
            
            // Clear & Load Bot Msg
            demoFeed.innerHTML = `
                <div class="msg-row" style="animation:slideUp 0.3s">
                    <div class="msg-avatar s-avatar">S</div>
                    <div class="msg-bubble">
                        <div class="msg-name">Slackbot <span style="font-size:11px;color:#888;">APP</span></div>
                        <div class="msg-content">
                            <strong>Zoom Session Started!</strong> 🎥<br>
                            Topic: Python Basics<br>
                            <a href="#" class="link-blue">https://us02web.zoom.us/j/834303567...</a>
                        </div>
                    </div>
                </div>
            `;
            addSystemNote("You can join any session by clicking on the zoom link.");
            // Prompt User
            setTimeout(() => {
                addSystemNote("Now ask your fellows. Type <strong>'help'</strong> below.");
                if(tooltip) {
                    tooltip.innerHTML = "👇 Type 'help' now";
                    tooltip.style.display = "block";
                }
                demoInput.placeholder = "Type 'help' here...";
                demoInput.focus();
                tutorialStep = 3;
            }, 1000);
        }

        // --- STEP 4: FINISH TUTORIAL (Unlock All) ---
        function finishTutorial() {
            tutorialComplete = true;
            tutorialStep = 99; // Done
            demoInput.placeholder = "Explore the channels on the left...";
            
            // Unlock all CSS styles
            channels.forEach(ch => ch.classList.add('unlocked'));
            
            addSystemNote("🎉 <strong>Tutorial Complete!</strong> You can now click any channel on the left to explore.");
        }

        // --- HELPERS ---
        function addMessage(name, initial, avatarClass, text) {
            const html = `
                <div class="msg-row">
                    <div class="msg-avatar ${avatarClass}">${initial}</div>
                    <div class="msg-bubble"><div class="msg-name">${name}</div><div class="msg-content">${text}</div></div>
                </div>`;
            demoFeed.insertAdjacentHTML('beforeend', html);
            demoFeed.scrollTop = demoFeed.scrollHeight;
        }

        function addSystemNote(text) {
            const html = `<div style="text-align:center; color:#666; font-size:13px; margin:10px 0; background:#eee; padding:5px; border-radius:4px;">${text}</div>`;
            demoFeed.insertAdjacentHTML('beforeend', html);
            demoFeed.scrollTop = demoFeed.scrollHeight;
        }

        function setActiveChannel(id) {
            channels.forEach(c => c.classList.remove('active'));
            document.getElementById(id).classList.add('active');
        }

        function showTyping(show, text) {
            if(show) {
                typingInd.innerHTML = `${text}<span>.</span><span>.</span><span>.</span>`;
                typingInd.classList.add('active');
            } else {
                typingInd.classList.remove('active');
            }
            demoFeed.scrollTop = demoFeed.scrollHeight;
        }
    }
});