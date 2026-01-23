/* ==========================================
   GLOBAL FUNCTIONS (Available to HTML onclick)
   ========================================== */

// 1. TABS LOGIC (For Donation Modal)
function openTab(evt, tabName) {
	var i, tabcontent, tablinks;

	tabcontent = document.getElementsByClassName("tab-content");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
		tabcontent[i].classList.remove("active-content");
	}

	tablinks = document.getElementsByClassName("tab-btn");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].classList.remove("active");
	}

	const selectedTab = document.getElementById(tabName);
	if (selectedTab) {
		selectedTab.style.display = "block";
		evt.currentTarget.classList.add("active");
	}
}

// 2. COPY TEXT
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

// 3. GALLERY CARD CLICK (Show Details)
function toggleDetails(element) {
	const isActive = element.classList.contains("active");
	document
		.querySelectorAll(".pin-item")
		.forEach((item) => item.classList.remove("active"));
	if (!isActive) element.classList.add("active");
}

// 4. FILTER VIDEOS LOGIC
window.filterVideos = function (category) {
	const items = document.querySelectorAll(".pin-item");
	const buttons = document.querySelectorAll(".gallery-tabs .tab-btn");

	// Update Button Styles
	buttons.forEach((btn) => {
		// Simple check: does the button text match the category?
		// Or we rely on the click event.
		// Since we are calling this manually on load, we just manage the grid classes here.
		btn.classList.remove("active");
		if (btn.getAttribute("onclick").includes(category)) {
			btn.classList.add("active");
		}
	});

	// Filter Items
	items.forEach((item) => {
		const itemCat = item.getAttribute("data-category");
		if (category === "all" || itemCat === category) {
			item.classList.remove("hidden");
		} else {
			item.classList.add("hidden");
		}
	});
};

// 5. SOUND TOGGLE LOGIC
window.toggleSound = function (event, btn) {
	event.stopPropagation(); // Stop clicking the card itself

	const video = btn.closest(".video-wrapper").querySelector("video");
	const icon = btn.querySelector("i");

	if (video.muted) {
		video.muted = false;
		icon.classList.remove("fa-volume-xmark");
		icon.classList.add("fa-volume-high");
	} else {
		video.muted = true;
		icon.classList.remove("fa-volume-high");
		icon.classList.add("fa-volume-xmark");
	}
};

/* ==========================================
   DOM CONTENT LOADED (Runs when page is ready)
   ========================================== */
document.addEventListener("DOMContentLoaded", () => {
	// --- 1. INITIALIZE FILTER (THE FIX) ---
	// This forces the grid to show only Alumni videos immediately on load
	filterVideos("alumni");

	// --- 2. MOBILE MENU ---
	const mobileToggle = document.querySelector(".mobile-toggle");
	const mainNav = document.querySelector(".main-nav");

	if (mobileToggle && mainNav) {
		mobileToggle.addEventListener("click", () => {
			mainNav.classList.toggle("active");
			mobileToggle.classList.toggle("active");
		});
	}

	// --- 3. DONATION MODAL ---
	const modal = document.getElementById("donationModal");
	const closeBtn = document.getElementById("closeModal");

	if (modal) {
		const openModal = (e) => {
			if (e) e.preventDefault();
			modal.classList.add("show");
			document.body.style.overflow = "hidden";
		};

		const allButtons = document.querySelectorAll("button");
		allButtons.forEach((btn) => {
			if (btn.innerText.includes("Donate")) {
				btn.addEventListener("click", openModal);
			}
		});

		const donateLinks = document.querySelectorAll('a[href="#donationModal"]');
		donateLinks.forEach((link) => {
			link.addEventListener("click", openModal);
		});

		if (closeBtn) {
			closeBtn.addEventListener("click", () => {
				modal.classList.remove("show");
				document.body.style.overflow = "auto";
			});
		}

		window.addEventListener("click", (e) => {
			if (e.target === modal) {
				modal.classList.remove("show");
				document.body.style.overflow = "auto";
			}
		});
	}

	// --- 4. SMART VIDEO LOADING & AUTOPLAY ---
	const videos = document.querySelectorAll(".video-wrapper video");

	const videoObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				const video = entry.target;
				const wrapper = video.closest(".video-wrapper");

				if (entry.isIntersecting) {
					// Video entered screen
					video.addEventListener("canplay", () => {
						wrapper.classList.add("loaded");
					});

					const playPromise = video.play();
					if (playPromise !== undefined) {
						playPromise
							.then(() => {
								video.classList.add("is-playing");
								wrapper.classList.add("loaded");
							})
							.catch((err) => console.log("Autoplay blocked"));
					}
				} else {
					// Video left screen
					video.pause();
					video.muted = true; // Auto-mute

					// Reset volume icon
					const btnIcon = wrapper.querySelector(".volume-btn i");
					if (btnIcon) {
						btnIcon.classList.remove("fa-volume-high");
						btnIcon.classList.add("fa-volume-xmark");
					}
				}
			});
		},
		{ threshold: 0.25 },
	);

	videos.forEach((video) => videoObserver.observe(video));
});

/* ==========================================
   See More & See less text Logic
   ========================================== */
const buttons = document.querySelectorAll(".toggle-btn");

buttons.forEach((btn) => {
	btn.addEventListener("click", () => {
		const wrapper = btn.previousElementSibling; // wrapper is before button
		const text = wrapper.querySelector(".testimonial-text");

		wrapper.classList.toggle("expanded");
		text.classList.toggle("expanded");

		btn.textContent = text.classList.contains("expanded")
			? "See less"
			: "See more";
	});
});
