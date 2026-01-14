document.addEventListener('DOMContentLoaded', function() {

    // =================================================================
    // PASTE YOUR API KEY HERE
    const API_KEY = 'AIzaSyBJJPQlzSUbkDmurD-AlVUaitq7wvB7WjU'; 
    const CALENDAR_ID = 'b1204900a8b4caf3d89cc594f4f312759934df605f22373ecea3fe986315b694@group.calendar.google.com';
    // =================================================================

    const calendarDays = document.getElementById('calendarDays');
    const monthYearDisplay = document.getElementById('currentMonthYear');
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    let currentDate = new Date(); 

    // Initialize
    renderCalendar();

    prevBtn.addEventListener('click', () => changeMonth(-1));
    nextBtn.addEventListener('click', () => changeMonth(1));

    function changeMonth(step) {
        currentDate.setMonth(currentDate.getMonth() + step);
        renderCalendar();
    }

    async function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        const monthName = currentDate.toLocaleString('default', { month: 'long' });
        monthYearDisplay.innerHTML = `<span class="calendar-month">${monthName}</span> <span class="calendar-year">${year}</span>`;

        calendarDays.innerHTML = '<div class="calendar-loading">Loading schedule...</div>';

        const events = await fetchGoogleEvents(year, month);
        calendarDays.innerHTML = ''; 
        
        const firstDayIndex = new Date(year, month, 1).getDay(); 
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Empty Slots
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = 'calendar-date empty';
            calendarDays.appendChild(emptyDiv);
        }

        // Render Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dateCell = document.createElement('div');
            dateCell.className = 'calendar-date active';

            const dateNum = document.createElement('div');
            dateNum.className = 'date-number';
            dateNum.innerText = day;
            dateCell.appendChild(dateNum);

            const daysEvents = events.filter(event => {
                const start = event.start.dateTime || event.start.date;
                return new Date(start).getDate() === day;
            });

            daysEvents.forEach(event => {
                const rawTitle = event.summary || "No Title";
                let displayTitle = rawTitle;
                let displayTime = "";

                // Extract Time
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

                // Create Element
                const eventDiv = document.createElement('div');
                eventDiv.className = 'event'; 
                eventDiv.title = `${displayTime} - ${displayTitle}`;

                // =======================================================
                // COLOR LOGIC (With 3rd Light Green Color)
                // =======================================================
                const t = displayTitle.toLowerCase();
                
                let bgColor, borderColor;

                if (t.includes('duolingo') || t.includes('dsa') || t.includes('leetcode')) {
                    // DARK GREEN
                    bgColor = '#2f855a';
                    borderColor = '#225c3e';
                } 
                else if (t.includes('gram') || t.includes('english') || t.includes('writing')) {
                    // LIGHT GREEN (New!)
                    // I included "writing" here, but you can move it to purple if you prefer
                    bgColor = '#6fab65'; 
                    borderColor = '#487a42';
                } 
                else if (t.includes('ielts')) {
                    // PURPLE
                    bgColor = '#6b46c1';
                    borderColor = '#442a82';
                } 
                else {
                    // FALLBACK (Machine Learning etc) -> Purple
                    bgColor = '#6b46c1';
                    borderColor = '#442a82';
                }

                // Apply Colors
                eventDiv.style.backgroundColor = bgColor;
                eventDiv.style.borderLeft = `3px solid ${borderColor}`;
                // =======================================================

                const timeSpan = document.createElement('span');
                timeSpan.className = 'event-time';
                timeSpan.innerText = displayTime;

                const titleSpan = document.createElement('span');
                titleSpan.className = 'event-title';
                titleSpan.innerText = displayTitle; 

                eventDiv.appendChild(timeSpan);
                eventDiv.appendChild(titleSpan);
                dateCell.appendChild(eventDiv);
            });

            calendarDays.appendChild(dateCell);
        }
    }

    async function fetchGoogleEvents(year, month) {
        if (!API_KEY || API_KEY.includes('PASTE_')) {
            console.error("Missing API Key");
            return [];
        }
        const startDate = new Date(year, month, 1);
        const endDate = new Date(year, month + 1, 1);
        const timeMin = startDate.toISOString();
        const timeMax = endDate.toISOString();

        const url = `https://www.googleapis.com/calendar/v3/calendars/${CALENDAR_ID}/events?key=${API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.items || [];
        } catch (error) {
            console.error(error);
            return [];
        }
    }
});