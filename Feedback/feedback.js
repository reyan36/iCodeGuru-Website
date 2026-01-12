/* --- 4. FAQ ACCORDION LOGIC --- */
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Check if currently active
            const isActive = item.classList.contains('active');
            
            // Optional: Close all others first (Accordion behavior)
            // accordionItems.forEach(i => i.classList.remove('active'));
            // accordionItems.forEach(i => i.querySelector('.fa-minus')?.classList.replace('fa-minus', 'fa-plus'));

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
    });