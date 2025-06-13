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
            const activeSection = document.querySelector('.page-section.active');
            if (activeSection) {
                activeSection.style.opacity = '1';
                activeSection.style.transform = 'translateY(0)';
            }
        }, 500);
    });

    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Intersection Observer for Education Timeline (Animate on Scroll)
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

    // Skill Card Hover Effect
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

    // Page navigation
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

                if (targetId === 'services') {
                    resetServicesAnimation(); // Ensure services is reset *before* activating it
                } else {
                    // If navigating away from services, ensure it's reset
                    resetServicesAnimation(); // Call unconditionally, CSS handles initial state
                }

                // Scroll to top of the new section with offset
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

            if (targetId === 'services') {
                resetServicesAnimation();
            } else {
                resetServicesAnimation();
            }

            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Services Section Animation Logic
    function animateServiceGrid() {
        // First, ensure intro slide moves out and grid transitions properties
        servicesIntroSlide.classList.add('intro-slide-expanded');
        servicesGrid.classList.add('service-grid-visible');

        // Calculate and set min-height for servicesMainContent to fit the grid
        // This needs to happen after servicesGrid.classList.add('service-grid-visible')
        // to allow its max-height to apply for scrollHeight calculation.
        // Temporarily set max-height to a large value to measure true scrollHeight
        const originalMaxHeight = servicesGrid.style.maxHeight;
        servicesGrid.style.maxHeight = '2000px'; // Temporarily expand
        const gridHeight = servicesGrid.scrollHeight + 100; // Get actual scroll height + some padding
        servicesGrid.style.maxHeight = originalMaxHeight; // Revert to original (CSS controlled)
        
        servicesMainContent.style.minHeight = `${gridHeight}px`; // Expand container

        // Stagger individual service slide animations after the grid container starts appearing
        individualServiceSlides.forEach((slide, index) => {
            slide.classList.remove('animate-in');
            void slide.offsetWidth; // Force reflow
            setTimeout(() => {
                slide.classList.add('animate-in');
            }, 600 + (100 * index)); // Start after grid becomes visible (0.5s CSS delay + 0.1s buffer)
        });
    }

    function resetServiceGridSlides() {
        individualServiceSlides.forEach(slide => {
            slide.classList.remove('animate-in');
            slide.style.opacity = '0'; // Explicitly set initial state
            slide.style.transform = 'translateY(20px) scale(0.95)'; // Explicitly set initial state
        });
    }

    function resetServicesAnimation() {
        // Reset the main content height first
        servicesMainContent.style.minHeight = '400px'; // Revert to initial intro slide height

        // This will trigger the CSS transition to hide the grid
        servicesGrid.classList.remove('service-grid-visible'); 
        
        // This will trigger the CSS transition to show the intro slide
        servicesIntroSlide.classList.remove('intro-slide-expanded');

        // Reset individual slides after grid has visually hidden
        setTimeout(() => {
            resetServiceGridSlides();
            // Ensure the intro slide is fully visible and interactive again
            // CSS transitions should handle opacity/pointer-events on removing intro-slide-expanded
            // No need to explicitly set style properties here unless CSS fails.
        }, 800); // Delay matches CSS transition duration for grid hiding
    }

    servicesIntroSlide.addEventListener('click', animateServiceGrid);
    servicesIntroSlide.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            animateServiceGrid();
        }
    });

    // Hire Me Pop-up functionality (no changes needed, should be working vertically)
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
            closeHirePopup();
        }
    });

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
        alert('Thank you for your inquiry! I will get back to you soon.');
        closeHirePopup();
    });

    // Enquiry Form "Thank You" Popup (no changes needed)
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
            closeEnquiryThankYouPopup();
        }
    });

    // Initialize services section state on first load
    setTimeout(resetServicesAnimation, 100);
});
