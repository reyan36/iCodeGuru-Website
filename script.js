document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // NEW JOIN MODAL LOGIC - FIXED VERSION
  // ==========================================
// ==========================================
//   JOIN MODAL — PERFORMANCE-OPTIMIZED
//   Replace your existing modal JS with this
// ==========================================

function openJoinModal() {
    var modal = document.getElementById("joinModal");
    if (modal) {
        // Just add the class — CSS handles the rest
        // No display toggling, no requestAnimationFrame needed
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeJoinModal() {
    var modal = document.getElementById("joinModal");
    if (modal) {
        // Just remove the class — CSS transition handles fade out
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
    }
}

// Make globally accessible
window.openJoinModal = openJoinModal;
window.closeJoinModal = closeJoinModal;

// Open modal after 3 seconds
window.addEventListener("load", function () {
    setTimeout(openJoinModal, 3000);
});

// Close when clicking the dark overlay (not the modal box)
var joinModal = document.getElementById("joinModal");
if (joinModal) {
    joinModal.addEventListener("click", function (e) {
        if (e.target === this) {
            closeJoinModal();
        }
    });
}

// Close on Escape key
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
        var modal = document.getElementById("joinModal");
        if (modal && modal.classList.contains("active")) {
            closeJoinModal();
        }
    }
});
  // ==========================================
  // 1. MOBILE MENU LOGIC (PRIORITY)
  // ==========================================
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active");
      mobileToggle.classList.toggle("active");
    });
  }

  // ==========================================
  // 2. DONATION MODAL LOGIC
  // ==========================================
  const donationModal = document.getElementById("donationModal");
  const closeBtn = document.getElementById("closeModal");

  if (donationModal) {
    // Helper function to open the modal
    const openModal = (e) => {
      if (e) e.preventDefault();
      donationModal.classList.add("show");
      document.body.style.overflow = "hidden";
    };

    // A. Handle Buttons (Checks for any button with text "Donate")
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach((btn) => {
      if (btn.innerText.includes("Donate")) {
        btn.addEventListener("click", openModal);
      }
    });

    // B. Handle Links
    const donateLinks = document.querySelectorAll('a[href="#donationModal"]');
    donateLinks.forEach((link) => {
      link.addEventListener("click", openModal);
    });

    // C. Close on X button
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        donationModal.classList.remove("show");
        document.body.style.overflow = "auto";
      });
    }

    // D. Close on Outside Click
    window.addEventListener("click", (e) => {
      if (e.target === donationModal) {
        donationModal.classList.remove("show");
        document.body.style.overflow = "auto";
      }
    });
  }
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
    tabcontent[i].classList.remove("active-content");
  }

  // Remove active class from buttons
  tablinks = document.getElementsByClassName("tab-btn");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].classList.remove("active");
  }

  // Show selected content
  const selectedTab = document.getElementById(tabName);
  if (selectedTab) {
    selectedTab.style.display = "block";
    evt.currentTarget.classList.add("active");
  }
}

function copyText(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const toast = document.getElementById("customToast");
      if (toast) {
        toast.innerText = "Copied successfully";
        toast.className = "show";
        setTimeout(function () {
          toast.className = toast.className.replace("show", "");
        }, 3000);
      }
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

// ==========================================
// 5. VIDEO MODAL LOGIC
// ==========================================
const videoModal = document.getElementById("videoModal");
const linkedinBtn = document.querySelector("#linkedinBtn");
const closeVideoBtn = document.getElementById("closeVideo");
const iframe = document.getElementById("youtubeFrame");
const videoCover = document.getElementById("videoCover");
const startVideoBtn = document.getElementById("startVideoBtn");

const videoID = "JC9A8bvJMWQ";

if (videoModal && linkedinBtn) {
  // 1. OPEN MODAL
  linkedinBtn.addEventListener("click", (e) => {
    e.preventDefault();
    videoModal.classList.add("show");
    document.body.style.overflow = "hidden";

    videoCover.classList.remove("hidden");
    iframe.setAttribute("src", "");
  });

  // 2. PLAY VIDEO
  const playVideo = () => {
    videoCover.classList.add("hidden");
    const autoPlayUrl = `https://www.youtube.com/embed/${videoID}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
    iframe.setAttribute("src", autoPlayUrl);
  };

  if (startVideoBtn) startVideoBtn.addEventListener("click", playVideo);
  if (videoCover) videoCover.addEventListener("click", playVideo);

  // 3. CLOSE MODAL
  const closeVideo = () => {
    videoModal.classList.remove("show");
    iframe.setAttribute("src", "");
    document.body.style.overflow = "auto";
  };

  if (closeVideoBtn) closeVideoBtn.addEventListener("click", closeVideo);

  window.addEventListener("click", (e) => {
    if (e.target === videoModal) {
      closeVideo();
    }
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
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('scroll-visible');
    }
  });
}, observerOptions);

// Function to initialize scroll animations
function initScrollAnimations() {
  // Add scroll-hidden class to elements that should animate on scroll
  const scrollElements = document.querySelectorAll('#who-are-we-new, #enrichment, #mission, .values-pills-section');
  scrollElements.forEach(el => {
    el.classList.add('scroll-hidden');
    observer.observe(el);
  });

  // Add specific animation classes to child elements
  // Who Are We section
  const whoHeader = document.querySelector('#who-are-we-new .who-header-center');
  const galleryItems = document.querySelectorAll('#who-are-we-new .gallery-item');
  const whoButton = document.querySelector('#who-are-we-new .who-footer-btn');

  if (whoHeader) {
    whoHeader.classList.add('scroll-hidden', 'scroll-left');
    observer.observe(whoHeader);
  }

  galleryItems.forEach((item, index) => {
    item.classList.add('scroll-hidden', 'scroll-scale');
    item.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(item);
  });

  if (whoButton) {
    whoButton.classList.add('scroll-hidden');
    observer.observe(whoButton);
  }

  // Enrichment section
  const enrichmentTitle = document.querySelector('#enrichment h2');
  const featureCards = document.querySelectorAll('.feature-card');

  if (enrichmentTitle) {
    enrichmentTitle.classList.add('scroll-hidden', 'scroll-left');
    observer.observe(enrichmentTitle);
  }

  featureCards.forEach((card, index) => {
    card.classList.add('scroll-hidden', 'scroll-stagger', `stagger-${(index % 6) + 1}`);
    observer.observe(card);
  });

  // Mission section
  const missionImage = document.querySelector('#mission .mission-image');
  const missionContent = document.querySelector('#mission .mission-content');
  const statItems = document.querySelectorAll('.stat-item');

  if (missionImage) {
    missionImage.classList.add('scroll-hidden', 'scroll-left');
    observer.observe(missionImage);
  }

  if (missionContent) {
    missionContent.classList.add('scroll-hidden', 'scroll-right');
    observer.observe(missionContent);
  }

  statItems.forEach((item, index) => {
    item.classList.add('scroll-hidden', 'scroll-stagger', `stagger-${(index % 4) + 1}`);
    observer.observe(item);
  });

  // Values pills section
  const pillRows = document.querySelectorAll('.values-pills-section .pill-row');
  pillRows.forEach((row, index) => {
    row.classList.add('scroll-hidden', 'scroll-scale');
    row.style.transitionDelay = `${index * 0.2}s`;
    observer.observe(row);
  });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', initScrollAnimations);