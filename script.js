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

        // Fix for Live Color Sync on Graphic Wrappers: Force restart animation
        allGraphicWrappers.forEach(wrapper => {
            wrapper.style.animation = 'none';
            void wrapper.offsetWidth; // Force reflow
            wrapper.style.animation = 'pulse 2.5s ease-in-out infinite';

            // Explicitly update background and filter if needed (redundant if animation restart works)
            wrapper.style.background = `rgba(${rgbColor}, 0.1)`;
            wrapper.style.filter = `drop-shadow(0 0 30px rgba(${rgbColor}, 0.3))`;
        });

        // Other elements that use --picked-color or --picked-color-rgb
        document.querySelectorAll('.highlight').forEach(el => {
            el.style.color = color;
            el.style.textShadow = `0 0 8px ${color}`;
        });
        document.querySelectorAll('.logo').forEach(el => {
            el.style.color = color;
            el.style.textShadow = `0 0 8px ${color}`;
        });

        // **FIX for Navbar Hover Effect:**
        // Removed the problematic lines that were setting inline styles on .nav-btn.
        // The CSS rules will now correctly handle the :hover and :focus states using --picked-color.
        // No JavaScript needed here for the navbar buttons' dynamic color on hover/focus.
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

                if (targetId === 'services') {
                    // Slight delay to ensure section is active before animating services
                    setTimeout(resetServicesAnimation, 50);
                }

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
                setTimeout(resetServicesAnimation, 50);
            }

            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // Services Section Animation Logic
    function animateServiceGrid() {
        // Ensure the main content container expands to fit the grid
        // Get the actual height of the grid content if it were visible
        servicesGrid.style.transition = 'none'; // Temporarily disable transition for height measurement
        servicesGrid.style.maxHeight = '2000px'; // Set to max to measure
        servicesGrid.style.opacity = '1';
        servicesGrid.style.overflow = 'visible';
        servicesGrid.style.pointerEvents = 'auto';
        servicesGrid.style.transform = 'translateY(0)';
        const gridHeight = servicesGrid.scrollHeight + 100; // Get actual scroll height + some padding
        servicesGrid.style.transition = ''; // Re-enable transition

        servicesMainContent.style.minHeight = `${gridHeight}px`; // Expand container
        
        servicesIntroSlide.classList.add('intro-slide-expanded');
        servicesGrid.classList.add('service-grid-visible');

        individualServiceSlides.forEach((slide, index) => {
            slide.classList.remove('animate-in');
            void slide.offsetWidth; // Force reflow
            setTimeout(() => {
                slide.classList.add('animate-in');
            }, 100 * index + 600); // Stagger by 100ms, start after grid container animates
        });
    }

    function resetServiceGridSlides() {
        individualServiceSlides.forEach(slide => {
            slide.classList.remove('animate-in');
            slide.style.opacity = '0';
            slide.style.transform = 'translateY(20px) scale(0.95)';
        });
    }

    function resetServicesAnimation() {
        // Reset the main content height first or simultaneously
        servicesMainContent.style.minHeight = '400px'; // Revert to initial intro slide height

        servicesIntroSlide.classList.remove('intro-slide-expanded');
        servicesGrid.classList.remove('service-grid-visible'); // This will trigger CSS transition to hide grid

        // Reset individual slides immediately or after a slight delay
        setTimeout(() => {
            resetServiceGridSlides();
            // Ensure the intro slide is fully visible and interactive again
            servicesIntroSlide.style.opacity = '1';
            servicesIntroSlide.style.pointerEvents = 'auto';
            servicesIntroSlide.style.transform = 'translateX(-50%)'; // Reset to initial centered position
        }, 800); // Adjust delay to match CSS transition of services-grid hiding
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

    // Enquiry Form "Thank You" Popup
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

    // Social icon animation (CSS handles most, but ensuring JS doesn't interfere)
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            // CSS handles this now via :hover and --picked-color
        });
        icon.addEventListener('mouseleave', () => {
            // CSS handles this now
        });
    });

    // Initialize services section state on first load
    // Using setTimeout to ensure all DOM elements are rendered and CSS applied
    // before attempting to reset styles that are managed by JS/CSS interaction.
    setTimeout(resetServicesAnimation, 100);
});
