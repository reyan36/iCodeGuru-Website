document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // 1. MOBILE MENU LOGIC (PRIORITY)
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
    // 2. DONATION FORM VARIABLES & LOGIC
    // ==========================================

    // --- STEP 1 ELEMENTS ---
    const step1 = document.getElementById("step-1");
    const amountBtns = document.querySelectorAll(".amount-btn");
    const customAmountBox = document.getElementById("custom-amount-box");
    const customInput = document.getElementById("custom-input");
    // Removed feeCheckbox
    const toStep2Btn = document.getElementById("to-step-2");
    const freqBtns = document.querySelectorAll(".freq-btn");
    const designationSelect = document.getElementById("designation-select");

    // --- STEP 2 ELEMENTS ---
    const step2 = document.getElementById("step-2");
    const backToStep1Btn = document.getElementById("back-to-step-1");
    const finalDonateBtn = document.getElementById("final-amount-text");
    const countrySelect = document.getElementById("country-select");

    // Payment Toggles
    const payMethodBtns = document.querySelectorAll(".pm-btn[data-method]");
    const bankToggleBtn = document.getElementById("btn-bank-toggle");
    const fieldsCard = document.getElementById("fields-card");
    const fieldsBank = document.getElementById("fields-bank");

    // Billing Toggles
    const billIndivBtn = document.getElementById("bill-indiv");
    const billOrgBtn = document.getElementById("bill-org");
    const inputsIndiv = document.getElementById("inputs-indiv");
    const inputsOrg = document.getElementById("inputs-org");

    // State Data
    let currentAmount = 0;
    // Removed isFeeCovered and processingRate variables
    let currentFreq = "One Time"; // Default

    // --- CALCULATION LOGIC ---
    // Simplified: Just ensures amount is a valid number
    function getCleanAmount() {
        let amount = parseFloat(currentAmount);
        if (isNaN(amount) || amount < 0) {
            amount = 0;
        }
        return amount;
    }

    // --- EVENT LISTENERS: STEP 1 ---

    // 1. Preset Amount Buttons
    amountBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            amountBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            if (btn.id === "btn-other") {
                customAmountBox.style.display = "block";
                customInput.focus();
                // Check if user already typed something
                if(customInput.value) {
                    currentAmount = parseFloat(customInput.value);
                } else {
                    currentAmount = 0;
                }
            } else {
                customAmountBox.style.display = "none";
                currentAmount = parseFloat(btn.dataset.amount);
            }
        });
    });

    // 2. Custom Input Field
    if(customInput) {
        customInput.addEventListener("input", (e) => {
            currentAmount = e.target.value;
        });
    }

    // 3. (Fee Checkbox Listener REMOVED)

    // 4. Frequency Toggles
    freqBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            freqBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentFreq = btn.dataset.freq; // Store frequency
        });
    });

    // 5. Designation Change Listener (Real-time validation)
    if(designationSelect) {
        designationSelect.addEventListener("change", () => {
            const errorMsg = document.getElementById("designation-error");
            
            // If user selects something valid, hide error
            if(designationSelect.value !== "No Selection") {
                designationSelect.classList.remove("input-error"); // Remove red border
                if(errorMsg) errorMsg.style.display = "none"; // Hide text
            }
        });
    }

    // --- NAVIGATION LOGIC ---

    if(toStep2Btn) {
        toStep2Btn.addEventListener("click", () => {
            
            // VALIDATION 1: Amount
            if (getCleanAmount() <= 0) {
                alert("Please enter a valid donation amount."); 
                if(customInput && customAmountBox.style.display !== 'none') customInput.focus();
                return;
            }

            // VALIDATION 2: Designation Check (Inline Error)
            const errorMsg = document.getElementById("designation-error");

            if (designationSelect && designationSelect.value === "No Selection") {
                designationSelect.classList.add("input-error");
                if(errorMsg) errorMsg.style.display = "block";
                return; // STOP HERE
            } 

            // If we get here, everything is valid
            
            // Switch View
            step1.style.display = "none";
            step2.style.display = "block";
            
            // Update Donate Button Text
            const total = getCleanAmount().toFixed(2);
            let freqText = currentFreq === "Monthly" ? " Monthly" : ""; 
            if(finalDonateBtn) finalDonateBtn.textContent = `$${total}${freqText}`;
            
            // Scroll to top of form
            step2.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    }

    if(backToStep1Btn) {
        backToStep1Btn.addEventListener("click", () => {
            step2.style.display = "none";
            step1.style.display = "block";
        });
    }

    // --- STEP 2 LOGIC ---

    // 1. Payment Methods (Debit/Credit vs Bank)
    payMethodBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // Reset Bank
            if(bankToggleBtn) bankToggleBtn.classList.remove("active");
            if(fieldsBank) fieldsBank.style.display = "none";
            
            // Activate Card
            payMethodBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            if(fieldsCard) fieldsCard.style.display = "block";
        });
    });

    if(bankToggleBtn) {
        bankToggleBtn.addEventListener("click", () => {
            // Deactivate Cards
            payMethodBtns.forEach(b => b.classList.remove("active"));
            if(fieldsCard) fieldsCard.style.display = "none";

            // Activate Bank
            bankToggleBtn.classList.add("active");
            if(fieldsBank) fieldsBank.style.display = "block";
        });
    }

    // 2. Billing Details (Individual vs Organization)
    if(billIndivBtn && billOrgBtn) {
        billIndivBtn.addEventListener("click", () => {
            billIndivBtn.classList.add("active");
            billOrgBtn.classList.remove("active");
            if(inputsIndiv) inputsIndiv.style.display = "grid"; 
            if(inputsOrg) inputsOrg.style.display = "none";
        });

        billOrgBtn.addEventListener("click", () => {
            billOrgBtn.classList.add("active");
            billIndivBtn.classList.remove("active");
            if(inputsIndiv) inputsIndiv.style.display = "none";
            if(inputsOrg) inputsOrg.style.display = "block";
        });
    }

    // --- 3. POPULATE COUNTRIES ---
    if(countrySelect) {
        const countriesList = [
            "United States", "Canada", "United Kingdom", "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
        ];

        countrySelect.innerHTML = '<option value="" disabled selected>Select Country</option>';

        countriesList.forEach(country => {
            const option = document.createElement("option");
            option.value = country;
            option.textContent = country;
            if (country === "United States") {
                option.selected = true;
            }
            countrySelect.appendChild(option);
        });
    }

    // --- ACCORDION LOGIC ---
    const accordions = document.querySelectorAll(".accordion-header");
    accordions.forEach(acc => {
        acc.addEventListener("click", function() {
            const currentItem = this.parentElement;
            const isActive = currentItem.classList.contains("active");
            document.querySelectorAll(".accordion-item").forEach(item => {
                item.classList.remove("active");
                item.querySelector(".accordion-content").style.maxHeight = null;
            });
            if (!isActive) {
                currentItem.classList.add("active");
                const panel = this.nextElementSibling;
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    });

});

// --- GLOBAL COPY FUNCTION ---
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById("copyToast");
        if(toast) {
            toast.className = "toast show";
            setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
        }
    }).catch(err => {
        console.error('Failed to copy: ', err);
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        const toast = document.getElementById("copyToast");
        if(toast) {
            toast.className = "toast show";
            setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 3000);
        }
    });
};