document.addEventListener("DOMContentLoaded", () => {
function openRegistrationModal() {
    const modal = document.getElementById("registrationModal");
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
}

function closeRegistrationModal() {
    const modal = document.getElementById("registrationModal");
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
}


window.addEventListener("load", () => {
    setTimeout(openRegistrationModal, 10000);
});

document.getElementById("registrationModal").addEventListener("click", function(e) {
    if (e.target === this) closeRegistrationModal();
});

// Optional: close modal if you click outside the modal-box
document.getElementById("registrationModal").addEventListener("click", function(e) {
    if (e.target === this) { // click outside modal-box
        closeModal();
    }
});

  // ==========================================
  // 1. MOBILE MENU LOGIC (PRIORITY)
  // ==========================================
  // We put this first so it always works, even if other parts fail.
  const mobileToggle = document.querySelector(".mobile-toggle");
  const mainNav = document.querySelector(".main-nav");

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener("click", () => {
      mainNav.classList.toggle("active");
      mobileToggle.classList.toggle("active");
    });
  }

  // ==========================================
  // 2. MODAL LOGIC
  // ==========================================
  const modal = document.getElementById("donationModal");
  const closeBtn = document.getElementById("closeModal");

  // SAFETY CHECK: If the modal HTML is missing on this page, stop here.
  // This prevents the script from crashing.
  if (!modal) {
    return;
  }

  // Helper function to open the modal
  const openModal = (e) => {
    if (e) e.preventDefault();
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  };

  // A. Handle Buttons (Checks for any button with text "Donate")
  const allButtons = document.querySelectorAll("button");
  allButtons.forEach((btn) => {
    // Use includes() instead of trim()=== to be safer with icons/spaces
    if (btn.innerText.includes("Donate")) {
      btn.addEventListener("click", openModal);
    }
  });

  // B. Handle Links (Footer links pointing to #donationModal)
  const donateLinks = document.querySelectorAll('a[href="#donationModal"]');
  donateLinks.forEach((link) => {
    link.addEventListener("click", openModal);
  });

  // C. Close on X button
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("show");
      document.body.style.overflow = "auto";
    });
  }

  // D. Close on Outside Click
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show");
      document.body.style.overflow = "auto";
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
// 5. VIDEO MODAL LOGIC (Updated)
// ==========================================
const videoModal = document.getElementById("videoModal");
const linkedinBtn = document.querySelector("#linkedinBtn"); // The trigger button
const closeVideoBtn = document.getElementById("closeVideo");
const iframe = document.getElementById("youtubeFrame");
const videoCover = document.getElementById("videoCover");
const startVideoBtn = document.getElementById("startVideoBtn");

// Your Video ID
const videoID = "JC9A8bvJMWQ";

if (videoModal && linkedinBtn) {
  // 1. OPEN MODAL
  linkedinBtn.addEventListener("click", (e) => {
    e.preventDefault();
    videoModal.classList.add("show");
    document.body.style.overflow = "hidden";

    // Reset state: Show cover, remove iframe src
    videoCover.classList.remove("hidden");
    iframe.setAttribute("src", "");
  });

  // 2. PLAY VIDEO (Clicking Green Button)
  const playVideo = () => {
    // Hide the cover
    videoCover.classList.add("hidden");

    // Start YouTube with Autoplay
    // rel=0 hides related videos from others
    // modestbranding=1 tries to hide logos
    const autoPlayUrl = `https://www.youtube.com/embed/${videoID}?autoplay=1&rel=0&modestbranding=1&showinfo=0`;
    iframe.setAttribute("src", autoPlayUrl);
  };

  if (startVideoBtn) startVideoBtn.addEventListener("click", playVideo);
  if (videoCover) videoCover.addEventListener("click", playVideo);

  // 3. CLOSE MODAL
  const closeVideo = () => {
    videoModal.classList.remove("show");
    // Stop video
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
