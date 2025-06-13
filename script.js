document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const pageSections = document.querySelectorAll('.page-section');
    const colorPicker = document.getElementById('color-picker');
    const root = document.documentElement;
    const heroGraphicWrapper = document.querySelector('#home .graphic-wrapper');
    const contactGraphicWrapper = document.querySelector('#contact .graphic-wrapper');
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

    // Preloader and Page Load
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            // Ensure the active section is visible after preloader hides
            document.querySelector('.page-section.active').style.opacity = '1';
            document.querySelector('.page-section.active').style.transform = 'translateY(0)';
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

    // Function to set highlight color
    function setHighlightColor(color) {
        root.style.setProperty('--picked-color', color);
        const hexToRgb = (hex) => {
            let r = 0, g = 0, b = 0;
            // Handle #RGB format
            if (hex.length === 4) {
                r = parseInt(hex[1] + hex[1], 16);
                g = parseInt(hex[2] + hex[2], 16);
                b = parseInt(hex[3] + hex[3], 16);
            }
            // Handle #RRGGBB format
            else if (hex.length === 7) {
                r = parseInt(hex.substring(1, 3), 16);
                g = parseInt(hex.substring(3, 5), 16);
                b = parseInt(hex.substring(5, 7), 16);
            }
            return `${r}, ${g}, ${b}`;
        };
        const rgbColor = hexToRgb(color);
        // console.log(`Setting --picked-color to: ${color}, --picked-color-rgb to: ${rgbColor}`); // Diagnostic log
        root.style.setProperty('--picked-color-rgb', rgbColor);
        localStorage.setItem('highlightColor', color);

        // Update graphics with direct style application for immediate effect
        if (heroGraphicWrapper) {
            heroGraphicWrapper.style.boxShadow = `0 0 30px rgba(${rgbColor}, 0.3)`;
            heroGraphicWrapper.style.background = `rgba(${rgbColor}, 0.1)`;
        }
        if (contactGraphicWrapper) {
            contactGraphicWrapper.style.boxShadow = `0 0 30px rgba(${rgbColor}, 0.3)`;
            contactGraphicWrapper.style.background = `rgba(${rgbColor}, 0.1)`;
        }
        document.querySelectorAll('.highlight').forEach(el => {
            el.style.color = color;
            el.style.textShadow = `0 0 8px ${color}`;
        });
        document.querySelectorAll('.logo, .nav-links li button.nav-btn:hover, .nav-links li button.nav-btn:focus').forEach(el => {
            el.style.color = color;
            el.style.textShadow = `0 0 8px ${color}`;
        });

        // Force browser to re-evaluate styles for elements that use CSS variables in their transitions/animations
        // This is a common trick if color changes don't immediately affect CSS animations/transitions
        document.querySelectorAll(
            '.service-slide, .slide-hire-btn, .skill-card, .education-dot, .education-content, .certificate-item, .contact-icon'
        ).forEach(el => {
            // Read a computed style property to force recalculation
            const computedTransform = getComputedStyle(el).transform;
            // Then immediately set it back (effectively a no-op that forces re-render)
            el.style.transform = computedTransform;
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
            // Update active section states
            pageSections.forEach(section => {
                section.classList.remove('active');
                section.setAttribute('aria-hidden', 'true');
                section.setAttribute('tabindex', '-1');
            });
            navButtons.forEach(btn => btn.setAttribute('aria-expanded', 'false'));

            targetSection.classList.add('active');
            targetSection.setAttribute('aria-hidden', 'false');
            targetSection.setAttribute('tabindex', '0');

            // Set the corresponding nav button to active state
            const targetNavButton = document.querySelector(`.nav-btn[data-target="${targetId}"]`);
            if (targetNavButton) {
                targetNavButton.setAttribute('aria-expanded', 'true');
            }

            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });


    // Hire Me Pop-up functionality
    function openHirePopup(serviceName) {
        popupServiceName.textContent = serviceName;
        hirePopup.classList.add('active');
        hirePopup.setAttribute('aria-hidden', 'false');
        hirePopup.setAttribute('tabindex', '0');
        document.body.style.overflow = 'hidden';
        // Removed document.body.setAttribute('inert', '');
        hirePopup.focus(); // Focus the popup for accessibility
    }

    function closeHirePopup() {
        hirePopup.classList.remove('active');
        hirePopup.setAttribute('aria-hidden', 'true');
        hirePopup.setAttribute('tabindex', '-1');
        document.body.style.overflow = ''; // Restore body scroll
        // Removed document.body.removeAttribute('inert');
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
        // Removed document.body.setAttribute('inert', '');
        enquiryThankYouPopup.focus();
    }

    function closeEnquiryThankYouPopup() {
        enquiryThankYouPopup.classList.remove('active');
        enquiryThankYouPopup.setAttribute('aria-hidden', 'true');
        enquiryThankYouPopup.setAttribute('tabindex', '-1');
        document.body.style.overflow = '';
        // Removed document.body.removeAttribute('inert');
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
            icon.style.filter = `drop-shadow(0 0 10px var(--picked-color))`;
        });
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'translateY(0) scale(1)';
            icon.style.filter = 'none';
        });
    });

    // Initial graphic animation setup
    // These lines are crucial for setting the initial color for the graphic wrappers on load
    if (heroGraphicWrapper) {
        heroGraphicWrapper.style.setProperty('--picked-color-rgb', getComputedStyle(root).getPropertyValue('--picked-color-rgb'));
    }
    if (contactGraphicWrapper) {
        contactGraphicWrapper.style.setProperty('--picked-color-rgb', getComputedStyle(root).getPropertyValue('--picked-color-rgb'));
    }
});
