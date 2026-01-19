/* =================================================================
   GLOBAL FUNCTIONS (Tabs & Toast)
   ================================================================= */
function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove('active-content');
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
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
            setTimeout(function(){ toast.className = toast.className.replace("show", ""); }, 3000);
        }
    });
}

/* =================================================================
   MAIN LOGIC INITIALIZATION
   ================================================================= */
document.addEventListener('DOMContentLoaded', function() {

    // --- 1. MOBILE MENU ---
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mainNav = document.querySelector('.main-nav');
    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // --- 2. DONATION MODAL ---
    const donationModal = document.getElementById('donationModal');
    // Scope the close button to inside the modal to avoid conflicts
    const closeDonationBtn = donationModal ? donationModal.querySelector('#closeModal, .close, .btn-close, button.close-btn') : null;

    if (donationModal) {
        const openDonationModal = (e) => {
            if(e) e.preventDefault(); 
            donationModal.classList.add('show');
            document.body.style.overflow = 'hidden'; 
        };
        document.querySelectorAll('button').forEach(btn => {
            if(btn.innerText.includes('Donate')) btn.addEventListener('click', openDonationModal);
        });
        document.querySelectorAll('a[href="#donationModal"]').forEach(link => {
            link.addEventListener('click', openDonationModal);
        });
        if(closeDonationBtn) {
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

    // --- 3. CALENDAR CONFIG ---
    const API_KEY = 'AIzaSyBJJPQlzSUbkDmurD-AlVUaitq7wvB7WjU'; 
    const CALENDARS = {
        track1: 'b1204900a8b4caf3d89cc594f4f312759934df605f22373ecea3fe986315b694@group.calendar.google.com',
        track2: '5ed9f05f32cb98df8204a7c5468b1b578cdedce66df1ccc46e6ae3c6b12e08ba@group.calendar.google.com',
        track3: 'cbc08d11084d4d92f0d19c1cbac6da74405dc6bbd6ba09dd6a4594549c22f11f@group.calendar.google.com'
    };

    let currentCalendarId = CALENDARS.track1;
    let currentView = 'week'; // Default View
    let currentDate = new Date(); 

    // Calendar Elements
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
    const closeEventModalBtn = eventModalOverlay ? eventModalOverlay.querySelector('.modal-close-btn') : null;

    if(calendarDays) renderCalendar();

    // --- 4. CALENDAR LISTENERS ---
    if(prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => changeDate(-1));
        nextBtn.addEventListener('click', () => changeDate(1));
    }

    function changeDate(step) {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + step);
        } else {
            // Jump by Week (7 Days)
            currentDate.setDate(currentDate.getDate() + (step * 7));
        }
        renderCalendar();
    }
    
    if(trackSelector) {
        trackSelector.addEventListener('change', (e) => {
            currentCalendarId = CALENDARS[e.target.value];
            renderCalendar();
        });
    }
    if(viewSelector) {
        viewSelector.addEventListener('change', (e) => {
            currentView = e.target.value;
            renderCalendar();
        });
    }

    // --- 5. RENDER CALENDAR ---
    async function renderCalendar() {
        if(!calendarDays) return;
        calendarDays.innerHTML = '<div class="calendar-loading">Loading...</div>';

        let startDate, endDate, headerText;

        if (currentView === 'month') {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            startDate = new Date(year, month, 1);
            endDate = new Date(year, month + 1, 1);
            
            const monthName = currentDate.toLocaleString('default', { month: 'long' });
            headerText = `<span class="calendar-month">${monthName}</span> <span class="calendar-year">${year}</span>`;
        } else {
            // Week Logic (Monday Start)
            const dayOfWeek = currentDate.getDay(); // 0 (Sun) - 6 (Sat)
            const distanceToMonday = (dayOfWeek + 6) % 7; 
            
            startDate = new Date(currentDate);
            startDate.setDate(currentDate.getDate() - distanceToMonday); // Set to Monday
            startDate.setHours(0,0,0,0);

            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 7); 

            // Header: Mon - Sat
            const startStr = startDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });
            const endDispDate = new Date(startDate);
            endDispDate.setDate(startDate.getDate() + 5); // Show until Sat
            const endTxt = endDispDate.toLocaleDateString('default', { month: 'short', day: 'numeric' });
            
            headerText = `<span class="calendar-month">${startStr} - ${endTxt}</span> <span class="calendar-year">${startDate.getFullYear()}</span>`;
        }

        if(monthYearDisplay) monthYearDisplay.innerHTML = headerText;
        
        const events = await fetchGoogleEvents(startDate, endDate, currentCalendarId);
        calendarDays.innerHTML = ''; 

        if (currentView === 'month') {
            const year = startDate.getFullYear();
            const month = startDate.getMonth();
            
            // Adjust 1st day index for Monday start
            let firstDayIndex = new Date(year, month, 1).getDay();
            let adjustedFirstDayIndex = (firstDayIndex === 0) ? 6 : firstDayIndex - 1;

            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < adjustedFirstDayIndex; i++) {
                const emptyDiv = document.createElement('div');
                emptyDiv.className = 'calendar-date empty';
                calendarDays.appendChild(emptyDiv);
            }

            for (let day = 1; day <= daysInMonth; day++) {
                const checkDate = new Date(year, month, day);
                if(checkDate.getDay() !== 0) { // Skip Sundays
                    renderDayCell(checkDate, events);
                }
            }
        } else {
            // Week View (6 Days: Mon-Sat)
            for (let i = 0; i < 6; i++) {
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
        
        // Highlight Today
        const today = new Date();
        if (dateObj.getDate() === today.getDate() && 
            dateObj.getMonth() === today.getMonth() && 
            dateObj.getFullYear() === today.getFullYear()) {
            dateCell.classList.add('today-highlight');
        }

        if(currentView === 'week') dateCell.style.height = '350px'; 
        
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

    // --- 6. EVENT CREATION ---
    function createEventElement(event) {
        const rawTitle = event.summary || "No Title";
        let displayTitle = rawTitle;
        let displayTime = "";

        const timeMatch = rawTitle.match(/^(\d+[AP]M)/i);
        if (timeMatch) displayTime = timeMatch[1]; 
        else {
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

        // --- 4-COLOR PALETTE ---
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

        const timeSpan = document.createElement('span');
        timeSpan.className = 'event-time';
        timeSpan.innerText = displayTime;
        const titleSpan = document.createElement('span');
        titleSpan.className = 'event-title';
        titleSpan.innerText = displayTitle; 

        eventDiv.appendChild(timeSpan);
        eventDiv.appendChild(titleSpan);
        
        // Modal Click Listener
        eventDiv.addEventListener('click', (e) => {
            e.stopPropagation(); 
            openEventModal(displayTitle, displayTime, event.description, event.htmlLink, bgColor);
        });

        return eventDiv;
    }

    async function fetchGoogleEvents(start, end, calendarId) {
        if (!API_KEY || API_KEY.includes('PASTE_')) return [];
        const timeMin = start.toISOString();
        const timeMax = end.toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.items || [];
        } catch (error) { return []; }
    }

    // --- 7. EVENT MODAL LOGIC ---
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
        eventModalTime.style.backgroundColor = color;
        
        const softColor = hexToRgba(color, 0.12);
        document.querySelector('.modal-header').style.backgroundColor = softColor;
        
        const glowColor = hexToRgba(color, 0.3);
        document.querySelector('.event-modal-content').style.boxShadow = `0 20px 60px -10px ${glowColor}`;

        if(description) eventModalDesc.innerHTML = description;
        else eventModalDesc.innerText = "Join us for this interactive session to enhance your skills. Click the button below to add this to your personal calendar.";

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

    if(closeEventModalBtn) {
        closeEventModalBtn.addEventListener('click', () => {
            eventModalOverlay.classList.remove('active');
        });
    }
    if(eventModalOverlay) {
        eventModalOverlay.addEventListener('click', (e) => {
            if (e.target === eventModalOverlay) eventModalOverlay.classList.remove('active');
        });
    }
    
    // Escape Key to Close Modals
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (eventModalOverlay) eventModalOverlay.classList.remove('active');
            if (donationModal) donationModal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // --- 8. CUSTOM DROPDOWN ---
    document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => {
        const select = wrapper.querySelector('select');
        const options = select.querySelectorAll('option');
        const trigger = document.createElement('div');
        trigger.className = 'custom-select-trigger';
        trigger.innerHTML = `<span>${options[select.selectedIndex].text}</span> <div class="custom-arrow"></div>`;
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
        document.querySelectorAll('.custom-select-wrapper').forEach(wrapper => wrapper.classList.remove('open'));
    });

    // =================================================================
    // 9. DYNAMIC CARD DATES
    // =================================================================
    updateStaticCards();
    updateDynamicCards();

    function updateStaticCards() {
        const now = new Date();
        const nextWebinar = getNextDayOfWeek(now, 6, 21, 0); 
        updateCardText('date-webinars', nextWebinar);
        const nextCareer = getNextDayOfWeek(now, 6, 17, 0); 
        updateCardText('date-career', nextCareer);
        const nextHackathon = getNextHackathon(now);
        updateCardText('date-hackathon', nextHackathon);
    }

    async function updateDynamicCards() {
        const now = new Date();
        const future = new Date();
        future.setDate(now.getDate() + 60); 
        const p1 = fetchEventsForCards(CALENDARS.track1, now, future);
        const p2 = fetchEventsForCards(CALENDARS.track2, now, future);
        const p3 = fetchEventsForCards(CALENDARS.track3, now, future);
        
        try {
            const results = await Promise.all([p1, p2, p3]);
            const rawEvents = [].concat(...results);
            
            // ACTIVE SESSION LOGIC (Uses End Time)
            const allEvents = rawEvents.filter(event => {
                const endDate = new Date(event.end.dateTime || event.end.date);
                return endDate > now; 
            });
            allEvents.sort((a, b) => new Date(a.start.dateTime) - new Date(b.start.dateTime));

            // 1. DSA
            const dsa = allEvents.find(e => {
                const t = (e.summary || "").toLowerCase();
                return t.includes("structure") || t.includes("dsa") || t.includes("leetcode");
            });
            updateDynamicCardText('date-dsa', dsa, "Check Calendar");

            // 2. IELTS
            const ielts = allEvents.find(e => (e.summary||"").toLowerCase().includes("ielts")) 
                       || allEvents.find(e => (e.summary||"").toLowerCase().includes("gre"));
            updateDynamicCardText('date-ielts', ielts, "Check Calendar");

            // 3. ML / Data Science (FIXED: STRICT FILTER)
            const ml = allEvents.find(e => {
                const t = (e.summary || "").toLowerCase();
                // BLOCK "Data Structure" or "Algorithms" from appearing here
                if(t.includes("structure") || t.includes("algorithm") || t.includes("dsa")) return false;
                
                return t.includes("machine") || t.includes("data") || t.includes("neural") || t.includes("ai ");
            });
            updateDynamicCardText('date-ml', ml, "Check Calendar");

            // 4. Web Dev (FIXED: STRICT FILTER)
            const web = allEvents.find(e => {
                const t = (e.summary || "").toLowerCase();
                // BLOCK "Weekly Webinar" from appearing here
                if(t.includes("weekly")) return false;
                
                return t.includes("web") || t.includes("stack") || t.includes("app") || t.includes("react");
            });
            updateDynamicCardText('date-webdev', web, "Coming Soon");

        } catch (err) {}
    }

    async function fetchEventsForCards(calendarId, start, end) {
        if (!API_KEY || API_KEY.includes('PASTE_')) return [];
        const timeMin = start.toISOString();
        const timeMax = end.toISOString();
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.items || [];
        } catch (error) { return []; }
    }

    function updateCardText(id, dateObj) {
        const el = document.getElementById(id);
        if(el && dateObj) {
            const options = { weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
            el.innerText = dateObj.toLocaleString('en-US', options);
        }
    }
    function updateDynamicCardText(id, eventObj, fallback) {
        const el = document.getElementById(id);
        if(el) {
            if(eventObj) {
                const dateObj = new Date(eventObj.start.dateTime || eventObj.start.date);
                const options = { weekday: 'short', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' };
                el.innerText = dateObj.toLocaleString('en-US', options);
            } else {
                el.innerText = fallback;
            }
        }
    }
    function getNextDayOfWeek(date, dayOfWeek, hour, minute) {
        const resultDate = new Date(date.getTime());
        resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
        resultDate.setHours(hour, minute, 0, 0);
        if (resultDate < date) resultDate.setDate(resultDate.getDate() + 7);
        return resultDate;
    }
    function getNextHackathon(date) {
        let d = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        while (d.getDay() !== 6) d.setDate(d.getDate() - 1);
        d.setHours(21, 0, 0, 0);
        if (d < date) {
            d = new Date(date.getFullYear(), date.getMonth() + 2, 0);
            while (d.getDay() !== 6) d.setDate(d.getDate() - 1);
            d.setHours(21, 0, 0, 0);
        }
        return d;
    }
});