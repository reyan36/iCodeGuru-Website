/* =================================================================
   GLOBAL FUNCTIONS (Tabs & Toast)
   These must be outside DOMContentLoaded to be accessible via HTML onClick
   ================================================================= */

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

/* =================================================================
   MAIN INITIALIZATION
   ================================================================= */
document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // 1. MOBILE MENU LOGIC
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
    // 2. DONATION MODAL LOGIC (FIXED)
    // ==========================================
    const donationModal = document.getElementById('donationModal');
    
    // FIX: Look for the close button specifically INSIDE the donation modal
    // This prevents conflict with the Calendar modal
    const closeDonationBtn = donationModal ? donationModal.querySelector('#closeModal, .close, .btn-close, button') : null;

    if (donationModal) {
        const openDonationModal = (e) => {
            if(e) e.preventDefault(); 
            donationModal.classList.add('show');
            document.body.style.overflow = 'hidden'; 
        };

        // Handle Donate Buttons
        const allButtons = document.querySelectorAll('button'); 
        allButtons.forEach(btn => {
            if(btn.innerText.includes('Donate')) {
                btn.addEventListener('click', openDonationModal);
            }
        });

        // Handle Footer Links
        const donateLinks = document.querySelectorAll('a[href="#donationModal"]');
        donateLinks.forEach(link => {
            link.addEventListener('click', openDonationModal);
        });

        // Close Logic
        if(closeDonationBtn){
            closeDonationBtn.addEventListener('click', () => {
                donationModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === donationModal) {
                donationModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // =================================================================
    // 3. CALENDAR CONFIGURATION & VARIABLES
    // =================================================================
    const API_KEY = 'AIzaSyBJJPQlzSUbkDmurD-AlVUaitq7wvB7WjU'; 
    
    const CALENDARS = {
        track1: 'b1204900a8b4caf3d89cc594f4f312759934df605f22373ecea3fe986315b694@group.calendar.google.com',
        track2: '5ed9f05f32cb98df8204a7c5468b1b578cdedce66df1ccc46e6ae3c6b12e08ba@group.calendar.google.com',
        track3: 'cbc08d11084d4d92f0d19c1cbac6da74405dc6bbd6ba09dd6a4594549c22f11f@group.calendar.google.com'
    };

    let currentCalendarId = CALENDARS.track1;
    let currentView = 'month'; 
    let currentDate = new Date(); 

    // DOM Elements
    const calendarDays = document.getElementById('calendarDays');
    const monthYearDisplay = document.getElementById('currentMonthYear');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');
    const trackSelector = document.getElementById('calendarSelector');
    const viewSelector = document.getElementById('viewSelector');

    // Event Modal Elements
    const eventModalOverlay = document.getElementById('eventModal');
    const eventModalTitle = document.getElementById('modalTitle');
    const eventModalTime = document.getElementById('modalTimeBadge');
    const eventModalDesc = document.getElementById('modalDesc');
    const eventModalLink = document.getElementById('modalLink');
    
    // FIX: Look for close button specifically INSIDE the event modal
    const closeEventModalBtn = eventModalOverlay ? eventModalOverlay.querySelector('.modal-close-btn') : null;

    // Initialize Calendar if elements exist
    if(calendarDays) {
        renderCalendar();
    }

    // =================================================================
    // 4. CALENDAR EVENT LISTENERS
    // =================================================================
    
    if(prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => changeDate(-1));
        nextBtn.addEventListener('click', () => changeDate(1));
    }

    function changeDate(step) {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + step);
        } else {
            currentDate.setDate(currentDate.getDate() + (step * 7));
        }
        renderCalendar();
    }
    
    if(trackSelector) {
        trackSelector.addEventListener('change', function(e) {
            currentCalendarId = CALENDARS[e.target.value];
            renderCalendar();
        });
    }

    if(viewSelector) {
        viewSelector.addEventListener('change', function(e) {
            currentView = e.target.value;
            renderCalendar();
        });
    }

    // =================================================================
    // 5. MAIN RENDER LOGIC
    // =================================================================
    async function renderCalendar() {
        if(!calendarDays) return;

        calendarDays.innerHTML = '<div class="calendar-loading">Loading...</div>';

        // Calculate Time Range
        let startDate, endDate, headerText;

        if (currentView === 'month') {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            startDate = new Date(year, month, 1);
            endDate = new Date(year, month + 1, 1);
            
            const monthName = currentDate.toLocaleString('default', { month: 'long' });
            headerText = `<span class="calendar-month">${monthName}</span> <span class="calendar-year">${year}</span>`;
        } else {
            const dayOfWeek = currentDate.getDay(); 
            startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - dayOfWeek); 
            startDate.setHours(0,0,0,0);

            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 7); 

            const startStr = startDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });
            const endStr = new Date(endDate);
            endStr.setDate(endStr.getDate() - 1); 
            const endTxt = endStr.toLocaleDateString('default', { month: 'short', day: 'numeric' });
            
            headerText = `<span class="calendar-month">${startStr} - ${endTxt}</span> <span class="calendar-year">${startDate.getFullYear()}</span>`;
        }

        if(monthYearDisplay) monthYearDisplay.innerHTML = headerText;

        const events = await fetchGoogleEvents(startDate, endDate);
        calendarDays.innerHTML = ''; 

        // RENDER GRID
        if (currentView === 'month') {
            const year = startDate.getFullYear();
            const month = startDate.getMonth();
            const firstDayIndex = startDate.getDay(); 
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDayIndex; i++) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'calendar-date empty';
                calendarDays.appendChild(emptyDiv);
            }

            for (let day = 1; day <= daysInMonth; day++) {
                renderDayCell(new Date(year, month, day), events);
            }

        } else {
            for (let i = 0; i < 7; i++) {
                const tempDate = new Date(startDate);
                tempDate.setDate(startDate.getDate() + i);
                renderDayCell(tempDate, events);
            }
        }
    }

    function renderDayCell(dateObj, allEvents) {
        const day = dateObj.getDate();
        const dateCell = document.createElement('div');
        dateCell.className = 'calendar-date active';
        
        if(currentView === 'week') {
            dateCell.style.height = '350px'; 
        }

        const dateNum = document.createElement('div');
        dateNum.className = 'date-number';
        dateNum.innerText = day;
        dateCell.appendChild(dateNum);

        const daysEvents = allEvents.filter(event => {
            const start = event.start.dateTime || event.start.date;
            const evtDate = new Date(start);
            return evtDate.getDate() === day && evtDate.getMonth() === dateObj.getMonth();
        });

        daysEvents.forEach(event => {
            const eventEl = createEventElement(event);
            dateCell.appendChild(eventEl);
        });

        calendarDays.appendChild(dateCell);
    }

    // =================================================================
    // 6. EVENT CREATION & COLOR LOGIC
    // =================================================================
    function createEventElement(event) {
        const rawTitle = event.summary || "No Title";
        let displayTitle = rawTitle;
        let displayTime = "";

        const timeMatch = rawTitle.match(/^(\d+[AP]M)/i);
        if (timeMatch) {
            displayTime = timeMatch[1]; 
        } else {
            const dateObj = new Date(event.start.dateTime);
            displayTime = dateObj.toLocaleTimeString([], { hour: 'numeric', hour12: true }).replace(':00', ''); 
        }

        // Clean Title
        displayTitle = displayTitle.replace(/^[0-9]+[AP]M-/i, ''); 
        displayTitle = displayTitle.replace(/-for-fully-funded-scholarships?/gi, '');
        displayTitle = displayTitle.replace(/-for-fully-funded-scholar/gi, ''); 
        displayTitle = displayTitle.replace(/prepship/gi, 'Prep');
        displayTitle = displayTitle.replace(/-/g, ' '); 
        if(displayTitle.includes("Free Duolingo")) displayTitle = "Duolingo Prep";

        const eventDiv = document.createElement('div');
        eventDiv.className = 'event'; 

        // --------------------------------------------------------
        // 4-COLOR PALETTE LOGIC
        // --------------------------------------------------------
        const t = displayTitle.toLowerCase();
        let bgColor, borderColor;

        // 1. DARK BLUE (Core CS, Physics)
        if (t.includes('algorithm') || t.includes('dsa') || t.includes('system') || t.includes('compiler') || t.includes('code') || t.includes('physics')) {
            bgColor = '#2c5282'; 
            borderColor = '#1a365d';
        }
        
        // 2. GREEN (Data, Python, Biology)
        else if (t.includes('python') || t.includes('machine') || t.includes('ai') || t.includes('data') || t.includes('biology') || t.includes('duolingo')) {
            bgColor = '#2f855a'; 
            borderColor = '#22543d';
        }

        // 3. LIGHT GREEN (Applied, Web, English)
        else if (t.includes('web') || t.includes('bootcamp') || t.includes('project') || t.includes('dev') || t.includes('gram') || t.includes('english') || t.includes('writing')) {
            bgColor = '#65a30d'; 
            borderColor = '#365314';
        } 

        // 4. PURPLE (Default, IELTS)
        else {
            bgColor = '#553c9a'; 
            borderColor = '#44337a';
        }

        // Apply Styles
        eventDiv.style.backgroundColor = bgColor;
        eventDiv.style.borderLeft = `3px solid ${borderColor}`;
        // --------------------------------------------------------

        const timeSpan = document.createElement('span');
        timeSpan.className = 'event-time';
        timeSpan.innerText = displayTime;

        const titleSpan = document.createElement('span');
        titleSpan.className = 'event-title';
        titleSpan.innerText = displayTitle; 

        eventDiv.appendChild(timeSpan);
        eventDiv.appendChild(titleSpan);
        
        // CLICK LISTENER FOR MODAL
        eventDiv.addEventListener('click', (e) => {
            e.stopPropagation(); 
            openEventModal(displayTitle, displayTime, event.description, event.htmlLink, bgColor);
        });

        return eventDiv;
    }

    async function fetchGoogleEvents(start, end) {
        if (!API_KEY || API_KEY.includes('PASTE_')) return [];

        const timeMin = start.toISOString();
        const timeMax = end.toISOString();

        const url = `https://www.googleapis.com/calendar/v3/calendars/${currentCalendarId}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    // =================================================================
    // 7. EVENT POPUP MODAL LOGIC
    // =================================================================
    
    // Helper to create soft background colors from hex
    function hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function openEventModal(title, time, description, link, color) {
        if(!eventModalOverlay) return; 

        eventModalTitle.innerText = title;
        eventModalTime.innerText = time;
        
        // 1. Theme the Time Badge
        eventModalTime.style.backgroundColor = color;
        
        // 2. Theme the Modal Header
        const softColor = hexToRgba(color, 0.12);
        document.querySelector('.modal-header').style.backgroundColor = softColor;
        
        // 3. Add a colored glow
        const glowColor = hexToRgba(color, 0.3);
        document.querySelector('.event-modal-content').style.boxShadow = `0 20px 60px -10px ${glowColor}`;

        // Description
        if(description) {
            eventModalDesc.innerHTML = description;
        } else {
            eventModalDesc.innerText = "Join us for this interactive session to enhance your skills. Click the button below to add this to your personal calendar.";
        }

        // Button
        if(link) {
            eventModalLink.href = link;
            eventModalLink.style.display = 'block';
            eventModalLink.style.backgroundColor = color; 
            eventModalLink.innerText = "Add to Calendar";
        } else {
            eventModalLink.style.display = 'none';
        }

        eventModalOverlay.classList.add('active');
    }

    // Close Event Modal Logic
    if(closeEventModalBtn) {
        closeEventModalBtn.addEventListener('click', () => {
            eventModalOverlay.classList.remove('active');
        });
    }

    if(eventModalOverlay) {
        eventModalOverlay.addEventListener('click', (e) => {
            if (e.target === eventModalOverlay) {
                eventModalOverlay.classList.remove('active');
            }
        });
    }

    // Shared Escape Key Listener (Closes both if active)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (eventModalOverlay && eventModalOverlay.classList.contains('active')) {
                eventModalOverlay.classList.remove('active');
            }
            if (donationModal && donationModal.classList.contains('show')) {
                donationModal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        }
    });

    // =================================================================
    // 8. CUSTOM DROPDOWN UI BUILDER
    // =================================================================
    document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
        const select = wrapper.querySelector('select');
        const options = select.querySelectorAll('option');
        
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        trigger.innerHTML = `<span>${options[0].text}</span> <div class="custom-arrow"></div>`;
        wrapper.appendChild(trigger);

        const customOptions = document.createElement('div');
        customOptions.className = 'custom-options';
        
        options.forEach(option => {
            const div = document.createElement('div');
            div.className = 'custom-option';
            if(option.selected) div.classList.add('selected');
            div.textContent = option.text;
            div.dataset.value = option.value;
            
            div.addEventListener('click', function() {
                trigger.querySelector('span').textContent = this.textContent;
                select.value = this.dataset.value;
                customOptions.querySelectorAll('.custom-option').forEach(el => el.classList.remove('selected'));
                this.classList.add('selected');
                wrapper.classList.remove('open');
                select.dispatchEvent(new Event('change'));
            });
            
            customOptions.appendChild(div);
        });
        
        wrapper.appendChild(customOptions);

        trigger.addEventListener('click', function(e) {
            e.stopPropagation(); 
            document.querySelectorAll('.custom-select-wrapper').forEach(el => {
                if(el !== wrapper) el.classList.remove('open');
            });
            wrapper.classList.toggle('open');
        });
    });

    document.addEventListener('click', function() {
        document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
            wrapper.classList.remove('open');
        });
    });
});