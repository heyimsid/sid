document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pageSections = document.querySelectorAll('.page-section');
    const colorPicker = document.getElementById('color-picker');
    const root = document.documentElement;
    const allGraphicWrappers = document.querySelectorAll('.graphic-wrapper');
    const hireMeButton = document.querySelector('.hire-btn');
    const serviceHireButtons = document.querySelectorAll('.slide-hire-btn');
    const hirePopup = document.getElementById('hire-popup');
    const popupServiceName = document.getElementById('popup-service-name');
    const popupCancelBtn = document.getElementById('popup-cancel-btn');
    const hireForm = document.getElementById('hire-form');
    const enquiryForm = document.getElementById('enquiry-form');
    const enquiryThankYouPopup = document.getElementById('enquiry-thankyou-popup');
    const enquiryThankYouOkBtn = document.getElementById('enquiry-thankyou-ok-btn');
    const preloader = document.getElementById('preloader');
    const socialIcons = document.querySelectorAll('.social-icons i');
    const skillCards = document.querySelectorAll('.skill-card');
    const educationItems = document.querySelectorAll('.education-item');

    // Services section specific elements (already correctly selected)
    const servicesMainContent = document.querySelector('.services-main-content');
    const servicesIntroSlide = document.querySelector('.services-intro-slide');
    const servicesGrid = document.querySelector('.services-grid');
    const individualServiceSlides = document.querySelectorAll('.service-slide');
    let serviceGridAnimated = false; // Flag to control service grid animation

    // === Preloader and Page Load ===
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            const activeSection = document.querySelector('.page-section.active');
            if (activeSection) {
                activeSection.style.opacity = '1';
                activeSection.style.transform = 'translateY(0)';
            }
        }, 500);
    });

    // === Set current year in footer ===
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // === Intersection Observer for Education Timeline (Animate on Scroll) ===
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const educationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    educationItems.forEach(item => {
        educationObserver.observe(item);
    });

    // === Skill Card Hover Effect ===
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });
        card.addEventListener('focusin', () => {
            card.classList.add('hovered');
        });
        card.addEventListener('focusout', () => {
            card.classList.remove('hovered');
        });
    });

    // === Function to set highlight color and ensure sync ===
    function setHighlightColor(color) {
        root.style.setProperty('--picked-color', color);
        const hexToRgb = (hex) => {
            let r = 0, g = 0, b = 0;
            if (hex.length === 4) {
                r = parseInt(hex[1] + hex[1], 16);
                g = parseInt(hex[2] + hex[2], 16);
                b = parseInt(hex[3] + hex[3], 16);
            } else if (hex.length === 7) {
                r = parseInt(hex.substring(1, 3), 16);
                g = parseInt(hex.substring(3, 5), 16);
                b = parseInt(hex.substring(5, 7), 16);
            }
            return `${r}, ${g}, ${b}`;
        };
        const rgbColor = hexToRgb(color);
        root.style.setProperty('--picked-color-rgb', rgbColor);
        localStorage.setItem('highlightColor', color);

        allGraphicWrappers.forEach(wrapper => {
            wrapper.style.animation = 'none';
            void wrapper.offsetWidth;
            wrapper.style.animation = 'pulse 2.5s ease-in-out infinite';
            wrapper.style.background = `rgba(${rgbColor}, 0.1)`;
            wrapper.style.filter = `drop-shadow(0 0 30px rgba(${rgbColor}, 0.3))`;
        });

        document.querySelectorAll('.highlight').forEach(el => {
            el.style.color = color;
            el.style.textShadow = `0 0 8px ${color}`;
        });
        document.querySelectorAll('.logo').forEach(el => {
            el.style.color = color;
            el.style.textShadow = `0 0 8px ${color}`;
        });
    }

    // Load saved color or set default
    const savedColor = localStorage.getItem('highlightColor');
    if (savedColor) {
        colorPicker.value = savedColor;
        setHighlightColor(savedColor);
    } else {
        setHighlightColor(colorPicker.value);
    }

    // Color picker change listener
    colorPicker.addEventListener('input', (event) => {
        setHighlightColor(event.target.value);
    });

    // === Page navigation ===
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.dataset.target;
            const targetSection = document.getElementById(targetId);

            pageSections.forEach(section => {
                section.classList.remove('active');
                section.setAttribute('aria-hidden', 'true');
                section.setAttribute('tabindex', '-1');
            });
            navButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));

            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.setAttribute('aria-hidden', 'false');
                targetSection.setAttribute('tabindex', '0');
                button.setAttribute('aria-expanded', 'true');

                // Always reset services animation when navigating to/from the services section
                // This ensures it's in its initial state (intro slide visible)
                // before interaction, or resets it when leaving the section.
                resetServicesAnimation();

                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Smooth scroll for internal links (e.g., "Hire Me" button)
    hireMeButton.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = hireMeButton.dataset.target;
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            pageSections.forEach(section => {
                section.classList.remove('active');
                section.setAttribute('aria-hidden', 'true');
                section.setAttribute('tabindex', '-1');
            });
            navButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));

            targetSection.classList.add('active');
            targetSection.setAttribute('aria-hidden', 'false');
            targetSection.setAttribute('tabindex', '0');

            const targetNavButton = document.querySelector(`.nav-btn[data-target="${targetId}"]`);
            if (targetNavButton) {
                targetNavButton.setAttribute('aria-expanded', 'true');
            }

            // Always reset services animation when navigating to the services section
            resetServicesAnimation();

            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // === Services Section Animation Logic (Modified) ===

    /**
     * Resets the services section to its initial state (intro slide visible, grid hidden).
     */
    function resetServicesAnimation() {
        // Ensure intro slide is visible and interactive
        servicesIntroSlide.classList.remove('hidden-intro');
        servicesIntroSlide.style.display = ''; // Revert display: none if set

        // Ensure grid is hidden
        servicesGrid.classList.remove('visible-grid');

        // Reset individual service slides to their initial hidden state
        individualServiceSlides.forEach(slide => {
            slide.classList.remove('animate-in');
        });

        // Reset the flag
        serviceGridAnimated = false;
    }


    /**
     * Handles the animation sequence when the intro slide is clicked or hovered.
     */
    const activateServiceGridAnimation = () => {
        if (serviceGridAnimated) return; // Prevent multiple activations
        serviceGridAnimated = true; // Set flag to true

        // 1. Animate Intro Slide Disappearance
        servicesIntroSlide.classList.add('hidden-intro');

        // Wait for the intro slide's opacity/transform transition to complete.
        // This is crucial to synchronize with the CSS `transition` on `.services-intro-slide.hidden-intro`.
        // The longest primary transition is 0.5s for transform/opacity.
        const introFadeDuration = 500; // ms, from CSS transition: transform 0.5s, opacity 0.5s

        setTimeout(() => {
            // After intro fades, hide it completely. This also removes it from document flow.
            servicesIntroSlide.style.display = 'none';

            // 2. Animate Services Grid Appearance
            // The servicesGrid is already positioned absolute over the area.
            servicesGrid.classList.add('visible-grid');

            // 3. Stagger individual service slides animation
            const staggerDelay = 100; // ms, delay between each service slide appearing
            individualServiceSlides.forEach((slide, index) => {
                setTimeout(() => {
                    slide.classList.add('animate-in');
                }, index * staggerDelay); // Staggered delay for each slide
            });

        }, introFadeDuration); // Start grid animation after intro slide finishes fading
    };

    // Attach event listeners to the intro slide
    servicesIntroSlide.addEventListener('click', activateServiceGridAnimation);
    servicesIntroSlide.addEventListener('mouseenter', activateServiceGridAnimation); // For hover effect
    servicesIntroSlide.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activateServiceGridAnimation();
        }
    });

    // === Hire Me Pop-up functionality (No changes needed here for core logic) ===
    function openHirePopup(serviceName) {
        popupServiceName.textContent = serviceName;
        hirePopup.classList.add('active');
        hirePopup.setAttribute('aria-hidden', 'false');
        hirePopup.setAttribute('tabindex', '0');
        document.body.style.overflow = 'hidden';
        hirePopup.focus();
    }

    function closeHirePopup() {
        hirePopup.classList.remove('active');
        hirePopup.setAttribute('aria-hidden', 'true');
        hirePopup.setAttribute('tabindex', '-1');
        document.body.style.overflow = '';
        hireForm.reset();
    }

    serviceHireButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = button.dataset.serviceName;
            openHirePopup(serviceName);
        });
    });

    popupCancelBtn.addEventListener('click', closeHirePopup);

    hirePopup.addEventListener('click', (e) => {
        if (e.target === hirePopup) {
            closeHirePopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hirePopup.classList.contains('active')) {
            e.preventDefault(); // Prevent default escape behavior if needed
            closeHirePopup();
        }
    });

    // New Hire Form "Thank You" Popup elements (You need to add this HTML)
    // Assuming a similar structure to enquiry-thankyou-popup exists for this new popup.
    // If not, you'll need to create:
    // <div id="hire-thankyou-popup" class="modal-popup" role="dialog" aria-modal="true" aria-hidden="true" tabindex="-1">
    //   <div class="modal-content">
    //     <h3>Thank You!</h3>
    //     <p>Your inquiry has been received. I will get back to you soon.</p>
    //     <button id="hire-thankyou-ok-btn" class="btn">OK</button>
    //   </div>
    // </div>
    const hireThankYouPopup = document.getElementById('hire-thankyou-popup');
    const hireThankYouOkBtn = document.getElementById('hire-thankyou-ok-btn');

    // Functions for new Hire Form Thank You popup
    function openHireThankYouPopup() {
        if (!hireThankYouPopup) {
            console.error("Hire Thank You Popup HTML not found. Please add it to your page.");
            return;
        }
        hireThankYouPopup.classList.add('active');
        hireThankYouPopup.setAttribute('aria-hidden', 'false');
        hireThankYouPopup.setAttribute('tabindex', '0');
        document.body.style.overflow = 'hidden';
        hireThankYouPopup.focus();
    }

    function closeHireThankYouPopup() {
        if (!hireThankYouPopup) return;
        hireThankYouPopup.classList.remove('active');
        hireThankYouPopup.setAttribute('aria-hidden', 'true');
        hireThankYouPopup.setAttribute('tabindex', '-1');
        document.body.style.overflow = '';
    }

    // Modify hireForm submission to use custom popup
    hireForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Hire Form Submitted:', {
            service: popupServiceName.textContent,
            name: document.getElementById('hire-name').value,
            email: document.getElementById('hire-email').value,
            phone: document.getElementById('hire-phone').value,
            description: document.getElementById('hire-desc').value,
            budget: document.getElementById('hire-budget').value,
            company: document.getElementById('hire-company').value,
            attachment: document.getElementById('hire-attachment').files[0] ? document.getElementById('hire-attachment').files[0].name : 'No attachment'
        });

        closeHirePopup(); // Close the hire form popup
        openEnquiryThankYouPopup(); // Open the new "Thank You" popup
    });

    // Add listener for the new "OK" button in the hire thank you popup
    if (hireThankYouOkBtn) {
        hireThankYouOkBtn.addEventListener('click', closeHireThankYouPopup);
    }
    // Also allow clicking outside to close
    if (hireThankYouPopup) {
        hireThankYouPopup.addEventListener('click', (e) => {
            if (e.target === hireThankYouPopup) {
                closeHireThankYouPopup();
            }
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && hireThankYouPopup.classList.contains('active')) {
                e.preventDefault();
                closeHireThankYouPopup();
            }
        });
    }

    // === Enquiry Form "Thank You" Popup (No changes needed) ===
    function openEnquiryThankYouPopup() {
        enquiryThankYouPopup.classList.add('active');
        enquiryThankYouPopup.setAttribute('aria-hidden', 'false');
        enquiryThankYouPopup.setAttribute('tabindex', '0');
        document.body.style.overflow = 'hidden';
        enquiryThankYouPopup.focus();
    }

    function closeEnquiryThankYouPopup() {
        enquiryThankYouPopup.classList.remove('active');
        enquiryThankYouPopup.setAttribute('aria-hidden', 'true');
        enquiryThankYouPopup.setAttribute('tabindex', '-1');
        document.body.style.overflow = '';
        enquiryForm.reset();
    }

    enquiryForm.addEventListener('submit', (e) => {
        e.preventDefault();
        console.log('Enquiry Form Submitted:', {
            name: document.getElementById('enquiry-name').value,
            email: document.getElementById('enquiry-email').value,
            subject: document.getElementById('enquiry-subject').value,
            message: document.getElementById('enquiry-message').value,
        });

        openEnquiryThankYouPopup();
    });

    enquiryThankYouOkBtn.addEventListener('click', closeEnquiryThankYouPopup);

    enquiryThankYouPopup.addEventListener('click', (e) => {
        if (e.target === enquiryThankYouPopup) {
            closeEnquiryThankYouPopup();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && enquiryThankYouPopup.classList.contains('active')) {
            e.preventDefault();
            closeEnquiryThankYouPopup();
        }
    });

    // === Initialize services section state on first load ===
    // This ensures the services section starts with the intro slide visible
    // and the grid hidden, ready for interaction.
    resetServicesAnimation();
});
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
