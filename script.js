document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pageSections = document.querySelectorAll('.page-section');
    const colorPicker = document.getElementById('color-picker');
    const root = document.documentElement;
    // Select ALL graphic-wrapper instances, not just home and contact specifically, for robustness
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

    // Services section specific elements
    const servicesMainContent = document.querySelector('.services-main-content');
    const servicesIntroSlide = document.querySelector('.services-intro-slide');
    const servicesGrid = document.querySelector('.services-grid');
    const individualServiceSlides = document.querySelectorAll('.service-slide');

    // Preloader and Page Load
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            // Ensure the active section is visible after preloader hides
            const activeSection = document.querySelector('.page-section.active');
            if (activeSection) {
                activeSection.style.opacity = '1';
                activeSection.style.transform = 'translateY(0)';
            }
        }, 500); // Wait for fade out
    });

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Intersection Observer for Education Timeline (Animate on Scroll)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    const educationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    educationItems.forEach(item => {
        educationObserver.observe(item);
    });

    // Skill Card Hover Effect (using CSS, but JS for future dynamic content)
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('hovered');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('hovered');
        });
        // For accessibility with keyboard navigation
        card.addEventListener('focusin', () => {
            card.classList.add('hovered');
        });
        card.addEventListener('focusout', () => {
            card.classList.remove('hovered');
        });
    });

    // Function to set highlight color and ensure sync
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

        // **CRITICAL FIX for Live Color Sync on Graphic Wrappers:**
        // Force restart the 'pulse' animation and re-evaluate properties
        allGraphicWrappers.forEach(wrapper => {
            // Remove the animation property
            wrapper.style.animation = 'none';
            // Force a reflow/repaint immediately after removing animation
            void wrapper.offsetWidth;
            // Re-add the animation after a tiny delay
            wrapper.style.animation = 'pulse 2.5s ease-in-out infinite';

            // Also, explicitly update the background and filter properties if they are direct inline styles
            // (though for CSS variables, the animation restart should be sufficient)
            wrapper.style.background = `rgba(${rgbColor}, 0.1)`;
            wrapper.style.filter = `drop-shadow(0 0 30px rgba(${rgbColor}, 0.3))`;
        });


        // Other elements that use --picked-color or --picked-color-rgb
        // These don't have complex animations tied to the color variable,
        // so setting the CSS variable should propagate correctly.
        document.querySelectorAll('.highlight').forEach(el => {
            el.style.color = color;
            el.style.textShadow = `0 0 8px ${color}`;
        });
        document.querySelectorAll('.logo').forEach(el => {
            el.style.color = color;
            el.style.textShadow = `0 0 8px ${color}`;
        });
        document.querySelectorAll('.nav-links li button.nav-btn').forEach(el => {
            el.style.color = getComputedStyle(root).getPropertyValue('--text-color'); // Reset to default unless hovered
        });
        document.querySelectorAll('.nav-links li button.nav-btn:hover, .nav-links li button.nav-btn:focus').forEach(el => {
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
        setHighlightColor(colorPicker.value); // Set default on first load
    }

    // Color picker change listener
    colorPicker.addEventListener('input', (event) => {
        setHighlightColor(event.target.value);
    });

    // Page navigation
    navButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = button.dataset.target;

            pageSections.forEach(section => {
                section.classList.remove('active');
                section.setAttribute('aria-hidden', 'true');
                section.setAttribute('tabindex', '-1');
            });
            navButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));

            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                targetSection.setAttribute('aria-hidden', 'false');
                targetSection.setAttribute('tabindex', '0');
                button.setAttribute('aria-expanded', 'true');

                // If navigating TO services, ensure it's in initial state
                if (targetId === 'services') {
                    resetServicesAnimation();
                }

                // Scroll to top of the new section (optional, depending on desired UX)
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

            // Ensure services is reset if navigating to it
            if (targetId === 'services') {
                resetServicesAnimation();
            }

            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Services Section Animation Logic (from previous update, should be fine)
    function animateServiceGrid() {
        servicesIntroSlide.classList.add('intro-slide-expanded');
        servicesGrid.classList.add('service-grid-visible');

        individualServiceSlides.forEach((slide, index) => {
            // Clear any previous animation classes
            slide.classList.remove('animate-in');
            // Force reflow before applying new animation for reliable re-triggering
            void slide.offsetWidth; 
            
            // Stagger animations
            setTimeout(() => {
                slide.classList.add('animate-in');
            }, 100 * index); // Stagger by 100ms
        });
    }

    function resetServicesAnimation() {
        servicesIntroSlide.classList.remove('intro-slide-expanded');
        servicesGrid.classList.remove('service-grid-visible');
        individualServiceSlides.forEach(slide => {
            slide.classList.remove('animate-in'); // Remove animation class to reset
            // Re-apply initial state explicitly if needed, or rely on CSS defaults
            slide.style.opacity = '0';
            slide.style.transform = 'translateY(20px) scale(0.95)';
        });
    }

    servicesIntroSlide.addEventListener('click', animateServiceGrid);
    servicesIntroSlide.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            animateServiceGrid();
        }
    });

    // Hire Me Pop-up functionality
    function openHirePopup(serviceName) {
        popupServiceName.textContent = serviceName;
        hirePopup.classList.add('active');
        hirePopup.setAttribute('aria-hidden', 'false');
        hirePopup.setAttribute('tabindex', '0');
        document.body.style.overflow = 'hidden'; // Disable body scroll
        hirePopup.focus(); // Focus the popup for accessibility
    }

    function closeHirePopup() {
        hirePopup.classList.remove('active');
        hirePopup.setAttribute('aria-hidden', 'true');
        hirePopup.setAttribute('tabindex', '-1');
        document.body.style.overflow = ''; // Restore body scroll
        hireForm.reset(); // Clear the form
    }

    serviceHireButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const serviceName = button.dataset.serviceName;
            openHirePopup(serviceName);
        });
    });

    popupCancelBtn.addEventListener('click', closeHirePopup);

    // Close popup on outside click
    hirePopup.addEventListener('click', (e) => {
        if (e.target === hirePopup) {
            closeHirePopup();
        }
    });

    // Close popup on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && hirePopup.classList.contains('active')) {
            closeHirePopup();
        }
    });

    // Handle Hire Form Submission (placeholder)
    hireForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real application, you would send this data to a server
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
        alert('Thank you for your inquiry! I will get back to you soon.');
        closeHirePopup();
    });

    // NEW: Enquiry Form "Thank You" Popup
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
        enquiryForm.reset(); // Clear the enquiry form after successful submission
    }

    enquiryForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form submission
        // Here you would typically send the form data to a server using fetch() or XMLHttpRequest
        console.log('Enquiry Form Submitted:', {
            name: document.getElementById('enquiry-name').value,
            email: document.getElementById('enquiry-email').value,
            subject: document.getElementById('enquiry-subject').value,
            message: document.getElementById('enquiry-message').value,
        });

        openEnquiryThankYouPopup(); // Show the thank you popup
    });

    enquiryThankYouOkBtn.addEventListener('click', closeEnquiryThankYouPopup);

    // Close enquiry thank you popup on outside click
    enquiryThankYouPopup.addEventListener('click', (e) => {
        if (e.target === enquiryThankYouPopup) {
            closeEnquiryThankYouPopup();
        }
    });

    // Close enquiry thank you popup on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && enquiryThankYouPopup.classList.contains('active')) {
            closeEnquiryThankYouPopup();
        }
    });

    // Social icon animation (if any, current CSS handles it)
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'translateY(-5px) scale(1.1)';
            // Make sure this uses the CSS variable directly for sync
            icon.style.filter = `drop-shadow(0 0 10px var(--picked-color))`;
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0) scale(1)';
            icon.style.filter = 'none';
        });
    });

    // Initialize services section on page load to ensure correct state
    resetServicesAnimation();
});
