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

    // Elements for services animation
    const servicesIntro = document.querySelector('.services-intro-slide');
    const servicesGrid = document.querySelector('.services-grid');

    // Preloader and Page Load
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
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

    // Function to convert hex to rgb string
    function hexToRgb(hex) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }
        else if (hex.length === 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return `${r}, ${g}, ${b}`;
    }

    // Function to set highlight color and sync profile backgrounds and colors
    function setHighlightColor(color) {
        root.style.setProperty('--picked-color', color);
        const rgbColor = hexToRgb(color);
        root.style.setProperty('--picked-color-rgb', rgbColor);
        localStorage.setItem('highlightColor', color);

        // Refresh animations and styles for elements using theme color
        const elementsToRefresh = document.querySelectorAll(
            '.graphic-wrapper, .service-slide, .slide-hire-btn, .skill-card, ' +
            '.education-dot, .education-content, .certificate-item, .contact-icon, .profile-background'
        );
        elementsToRefresh.forEach(el => {
            const computedTransform = getComputedStyle(el).transform;
            el.style.transform = computedTransform;
        });

        // Update highlight text color and shadow
        document.querySelectorAll('.highlight').forEach(el => {
            el.style.color = color;
            el.style.textShadow = `0 0 8px ${color}`;
        });
        document.querySelectorAll('.logo, .nav-links li button.nav-btn:hover, .nav-links li button.nav-btn:focus').forEach(el => {
            el.style.color = color;
            el.style.textShadow = `0 0 8px ${color}`;
        });
    }

    // Load saved color or default color
    const savedColor = localStorage.getItem('highlightColor');
    if (savedColor) {
        colorPicker.value = savedColor;
        setHighlightColor(savedColor);
    } else {
        setHighlightColor(colorPicker.value);
    }

    // Color picker change handler
    colorPicker.addEventListener('input', (event) => {
        setHighlightColor(event.target.value);
    });

    // Page navigation handling
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

                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Smooth scroll for "Hire Me" button on home page
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

            targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });


    // Hire Me popup handlers
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

    // Enquiry form "Thank You" popup
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

    // Social icon hover effect
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

    // Initial sync of profile background color variables
    if (heroGraphicWrapper) {
        heroGraphicWrapper.style.setProperty('--picked-color-rgb', getComputedStyle(root).getPropertyValue('--picked-color-rgb'));
    }
    if (contactGraphicWrapper) {
        contactGraphicWrapper.style.setProperty('--picked-color-rgb', getComputedStyle(root).getPropertyValue('--picked-color-rgb'));
    }

    // Services intro slide animation logic
    // Initially show only intro slide, hide grid
    if (servicesIntro && servicesGrid) {
        servicesGrid.classList.remove('visible');
        servicesIntro.classList.remove('hidden');

        // Hover events on intro slide
        servicesIntro.addEventListener('mouseenter', () => {
            servicesIntro.setAttribute('aria-pressed', 'true');
            servicesIntro.classList.add('hidden');
            servicesGrid.classList.add('visible');
        });
        // Mouse leave from grid: revert
        servicesGrid.addEventListener('mouseleave', () => {
            servicesIntro.classList.remove('hidden');
            servicesIntro.setAttribute('aria-pressed', 'false');
            servicesGrid.classList.remove('visible');
        });

        // Click on intro also toggles
        servicesIntro.addEventListener('click', () => {
            servicesIntro.classList.add('hidden');
            servicesIntro.setAttribute('aria-pressed', 'true');
            servicesGrid.classList.add('visible');
        });

        // Optional: click outside grid to revert back
        document.addEventListener('click', (event) => {
            if (!servicesIntro.contains(event.target) && !servicesGrid.contains(event.target)) {
                if (servicesGrid.classList.contains('visible')) {
                    servicesIntro.classList.remove('hidden');
                    servicesIntro.setAttribute('aria-pressed', 'false');
                    servicesGrid.classList.remove('visible');
                }
            }
        });
    }
});

