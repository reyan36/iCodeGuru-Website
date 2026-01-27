document.addEventListener("DOMContentLoaded", () => {
  
  // ==========================================
  // NEW JOIN MODAL LOGIC - FIXED VERSION
  // ==========================================
  function openJoinModal() {
    const modal = document.getElementById("joinModal");
    if (modal) {
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }

  function closeJoinModal() {
    const modal = document.getElementById("joinModal");
    if (modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  }

  // Make closeJoinModal globally accessible
  window.closeJoinModal = closeJoinModal;

  // Open modal after 5 seconds
  window.addEventListener("load", () => {
    setTimeout(openJoinModal, 3000);
  });

  // Close modal when clicking outside
  const joinModal = document.getElementById("joinModal");
  if (joinModal) {
    joinModal.addEventListener("click", function(e) {
      if (e.target === this) {
        closeJoinModal();
      }
    });
  }

  // Handle form submission
  const joinForm = document.getElementById("joinForm");
  if (joinForm) {
    joinForm.addEventListener("submit", function(e) {
      e.preventDefault();
      // Redirect to join page
      window.location.href = "Join/join.html";
    });
  }

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