document.addEventListener('DOMContentLoaded', () => {

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
    // 2. TEAM SECTION: DRAG SCROLL & PROGRESS BAR
    // ==========================================
    const slider = document.querySelector('.team-track');
    const progressBar = document.querySelector('.scroll-thumb');
    const scrollContainer = document.querySelector('.custom-scrollbar');

    if (slider && progressBar && scrollContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Mouse Events for Dragging
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed
            slider.scrollLeft = scrollLeft - walk;
        });

        // Scrollbar Synchronization
        slider.addEventListener('scroll', () => {
            const maxScrollLeft = slider.scrollWidth - slider.clientWidth;
            if (maxScrollLeft === 0) return;

            const scrollRatio = slider.scrollLeft / maxScrollLeft;
            const containerWidth = scrollContainer.clientWidth;
            const barWidth = progressBar.clientWidth;
            const availableSpace = containerWidth - barWidth;
            const movePixels = scrollRatio * availableSpace;
            
            progressBar.style.left = `${movePixels}px`;
        });
    }

    // ==========================================
    // 3. TESTIMONIAL SLIDER BUTTONS
    // ==========================================
    const testiTrack = document.querySelector('.testimonial-track');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (testiTrack && nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            testiTrack.scrollBy({ left: 600, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            testiTrack.scrollBy({ left: -600, behavior: 'smooth' });
        });
    }

    // ==========================================
    // 4. DONATION MODAL LOGIC
    // ==========================================
    const modal = document.getElementById('donationModal');
    const closeBtn = document.getElementById('closeModal');

    // Only run if modal exists on this page
    if (modal) {
        const openModal = (e) => {
            if(e) e.preventDefault(); 
            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; 
        };

        // A. Handle Buttons (Header "Donate")
        const allButtons = document.querySelectorAll('button'); 
        allButtons.forEach(btn => {
            if(btn.innerText.includes('Donate')) {
                btn.addEventListener('click', openModal);
            }
        });

        // B. Handle Links (Footer Link)
        const donateLinks = document.querySelectorAll('a[href="#donationModal"]');
        donateLinks.forEach(link => {
            link.addEventListener('click', openModal);
        });

        // C. Close Logic
        if(closeBtn){
            closeBtn.addEventListener('click', () => {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            }
        });
    }

});

// ==========================================
// 5. GLOBAL FUNCTIONS (Tabs & Copy)
// ==========================================
// These must be outside DOMContentLoaded so HTML onclick="" works

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
            setTimeout(function(){ 
                toast.className = toast.className.replace("show", ""); 
            }, 3000);
        }
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

// ==========================================
// ANIMATIONS
// ==========================================

// Hero bubble smooth entrance animation handler
function initBubbleAnimations() {
    const bubbles = document.querySelectorAll('.bubble');

    bubbles.forEach((bubble, index) => {
        // Add breathing class after smooth entrance animation finishes
        const delay = index * 150; // 0, 0.15s, 0.3s
        const animationDuration = 2000 + delay + 100; // 2s animation + delay + small buffer
        setTimeout(() => {
            bubble.classList.add('breathing');
        }, animationDuration);
    });
}

// ==========================================
// SCROLL-TRIGGERED ANIMATIONS
// ==========================================

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add staggered delay for multiple elements
            setTimeout(() => {
                entry.target.classList.add('scroll-visible');
            }, index * 150);
        }
    });
}, observerOptions);

// Function to initialize scroll animations
function initScrollAnimations() {
    // Add scroll-hidden class to elements that should animate on scroll
    const scrollElements = [
        '#founder-message',
        '#mission',
        '#vision',
        '#team',
        '.values-pills-section',
        '.founder-img',
        '.founder-text',
        '.mission-text',
        '.mission-img',
        '.vision-img',
        '.vision-text',
        '.v-point',
        '.team-header',
        '.team-card',
        '.pill-row'
    ];

    scrollElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            element.classList.add('scroll-hidden');

            // Add specific animation classes based on element type
            if (element.classList.contains('founder-img') || element.classList.contains('mission-text') || element.classList.contains('vision-img')) {
                element.classList.add('scroll-left');
            } else if (element.classList.contains('founder-text') || element.classList.contains('mission-img') || element.classList.contains('vision-text')) {
                element.classList.add('scroll-right');
            } else if (element.classList.contains('team-header') || element.classList.contains('pill-row')) {
                element.classList.add('scroll-scale');
            } else if (element.classList.contains('v-point')) {
                element.classList.add('scroll-stagger', `stagger-${(index % 6) + 1}`);
            } else if (element.classList.contains('team-card')) {
                element.classList.add('scroll-stagger', `stagger-${(index % 6) + 1}`);
            }

            observer.observe(element);
        });
    });
}

// Initialize all animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Call existing initialization functions
    initBubbleAnimations();
    initScrollAnimations();
});

/**
 * scroll-animations.js
 * Targets existing HTML selectors — no markup changes needed.
 * Uses IntersectionObserver to add `.in-view` when elements scroll into view.
 *
 * Include in your HTML:
 *   <link rel="stylesheet" href="scroll-animations.css">   (after about.css)
 *   <script src="scroll-animations.js" defer></script>     (before </body>)
 */

(function () {
  'use strict';

  // Every selector that has a corresponding CSS animation.
  // These match classes/elements already in the HTML.
  var SELECTORS = [
    // Hero
    '.who-text h1',
    '.who-text > p',
    '.who-text > a',        // the <a> wrapping the CTA button
    '.bubble.b1',
    '.bubble.b3',
    '.bubble.b4',

    // Founder
    '.founder-message-card',
    '.founder-text h2',
    '.founder-desc',
    '.founder-img',

    // Mission
    '.mission-text',
    '.mission-img',

    // Vision
    '.vision-img',
    '.vision-text',
    '.v-point',

    // Team
    '.team-header',
    '.team-card',

    // Values Pills
    '.pill-box',

    // Footer
    '.footer-links-area',
    '.footer-banner'
  ];

  function init() {
    var elements = document.querySelectorAll(SELECTORS.join(','));
    if (!elements.length) return;

    // Fallback: show everything immediately if Observer isn't supported
    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target); // Animate only once
          }
        });
      },
      {
        threshold: 0.15,                  // Fire when 15% visible
        rootMargin: '0px 0px -40px 0px'   // Small bottom offset
      }
    );

    elements.forEach(function (el) { observer.observe(el); });
  }

  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();