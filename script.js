(() => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.page-section');
  const hireBtnHome = document.querySelector('.hire-btn');
  const slideHireButtons = document.querySelectorAll('.slide-hire-btn');
  const highlightEls = [...document.querySelectorAll('.highlight')];
  const socialIcons = [...document.querySelectorAll('.social-icons i')];
  const logo = document.querySelector('.logo');

  const popup = document.getElementById('hire-popup');
  const popupServiceName = document.getElementById('popup-service-name');
  const hireForm = document.getElementById('hire-form');
  const cancelBtn = document.getElementById('popup-cancel-btn');

  const colorPickerInput = document.getElementById('color-picker'); // Changed to ID
  let selectedColor = colorPickerInput.value || '#87CEEB'; // Initial light blue

  const servicesIntroSlide = document.querySelector('.services-intro-slide');
  const servicesGrid = document.querySelector('.services-grid');

  // Education section animation
  const educationItems = document.querySelectorAll('.education-item');

  // Enquiry form
  const enquiryForm = document.getElementById('enquiry-form');


  // --- Helper Functions ---
  function hexToRgba(hex, alpha = 1) {
    const hexClean = hex.replace('#', '');
    const bigint = parseInt(hexClean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function hexToRgbValues(hex) {
    const hexClean = hex.replace('#', '');
    const bigint = parseInt(hexClean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `${r},${g},${b}`;
  }

  function updateColors(newColor) {
    document.documentElement.style.setProperty('--picked-color', newColor);
    document.documentElement.style.setProperty('--picked-color-rgb', hexToRgbValues(newColor));


    highlightEls.forEach(el => {
      el.style.color = newColor;
      el.style.textShadow = `0 0 6px ${newColor}`;
    });

    socialIcons.forEach(icon => {
      icon.style.color = newColor;
      icon.style.textShadow = `0 0 10px ${newColor}`;
    });

    hireBtnHome.style.color = newColor;
    hireBtnHome.style.borderColor = newColor;
    hireBtnHome.style.textShadow = `0 0 6px ${newColor}`;

    logo.style.color = newColor;
    logo.style.textShadow = `0 0 8px ${newColor}`;

    // Update box-shadow for service slides, skill cards, and certificate items
    const allGlowingElements = document.querySelectorAll('.service-slide, .skill-card, .certificate-item, .contact-link, .graphic-wrapper');
    allGlowingElements.forEach(el => {
      el.style.boxShadow = `0 0 20px ${hexToRgba(newColor, 0.15)}`;
    });

    // Update specific colors for the skills section elements
    document.querySelectorAll('.skill-card h3, .skill-card h3 i').forEach(el => {
        el.style.color = newColor;
        el.style.textShadow = `0 0 8px ${newColor}`;
    });
    document.querySelectorAll('.skill-details').forEach(el => {
        el.style.borderTopColor = hexToRgba(newColor, 0.3);
    });

    // Update colors for Education section elements
    document.querySelectorAll('.education-dot').forEach(el => {
        el.style.background = newColor;
        el.style.boxShadow = `0 0 10px ${newColor}`;
    });
    document.querySelectorAll('.education-content h3').forEach(el => {
        el.style.color = newColor;
        el.style.textShadow = `0 0 6px ${newColor}`;
    });
    document.querySelectorAll('.education-image-container img').forEach(el => {
        el.style.boxShadow = `0 0 15px ${hexToRgba(newColor, 0.2)}`;
    });

    // Update colors for Achievements section elements
    document.querySelectorAll('.certificate-info h3').forEach(el => {
        el.style.color = newColor;
        el.style.textShadow = `0 0 6px ${newColor}`;
    });

    // Update enquiry form button
    document.querySelectorAll('#enquiry-form .submit-btn').forEach(btn => {
        btn.style.background = newColor;
        btn.style.borderColor = newColor;
        btn.style.boxShadow = `0 0 15px ${newColor}`;
    });

    // Update contact links icon color
    document.querySelectorAll('.contact-link i').forEach(icon => {
        icon.style.color = newColor;
    });


    // Update hover effects for all elements that use --picked-color
    // This is handled via CSS `:hover` selectors using `var(--picked-color)` directly,
    // so forcing style here is redundant unless the specific property is not using CSS variables.
    // For direct JS manipulation for hover, you would need to add mouseover/mouseout listeners
    // which is less efficient than pure CSS with variables.
    // The current setup allows CSS to handle hover transitions using the updated --picked-color.

    selectedColor = newColor;
    // The color picker input itself will visually update
  }

  // --- Section Navigation ---
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      showSection(targetId);
      // Optional: Smooth scroll to the top of the new section if needed
      // document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
    });
  });

  function showSection(targetId) {
    sections.forEach(section => {
      if (section.id === targetId) {
        section.classList.add('active');
        section.setAttribute('tabindex', '-1');
        // Only trigger service animation if navigating to services
        if (targetId === 'services') {
            resetServicesAnimation();
        }
      } else {
        section.classList.remove('active');
        section.setAttribute('tabindex', '-1');
      }
    });
    navButtons.forEach(btn => {
      btn.setAttribute('aria-expanded', btn.dataset.target === targetId ? 'true' : 'false');
    });
  }

  // --- Home Hire Button ---
  hireBtnHome.addEventListener('click', e => {
    e.preventDefault();
    showSection('services');
  });

  // --- Popup Functionality (Hire Form) ---
  slideHireButtons.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service-name') || 'Service';
      openPopup(serviceName);
    });
  });

  function openPopup(serviceName) {
    popupServiceName.textContent = serviceName;
    popup.style.display = 'flex';
    popup.setAttribute('aria-hidden', 'false');
    hireForm.elements['hire-name'].focus();
    document.body.style.overflow = 'hidden';
  }

  function closePopup() {
    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');
    hireForm.reset();
    document.body.style.overflow = '';
  }

  cancelBtn.addEventListener('click', closePopup);

  popup.addEventListener('click', e => {
    if (e.target === popup) {
      closePopup();
    }
  });

  hireForm.addEventListener('submit', e => {
    e.preventDefault();
    alert(`Thank you for your interest in ${popupServiceName.textContent}! Your message has been sent.`);
    closePopup();
  });

  // --- Color Picker Functionality ---
  colorPickerInput.addEventListener('input', e => {
    updateColors(e.target.value);
  });

  // --- Initial Load & Preloader ---
  window.addEventListener('DOMContentLoaded', () => {
    // Set initial color using JS for consistency and to apply CSS variables
    updateColors(selectedColor);

    let initialSection = 'home';
    if (location.hash) {
      const hashSection = location.hash.substring(1);
      if (document.getElementById(hashSection)) {
        initialSection = hashSection;
      }
    }
    showSection(initialSection);

    // Set current year for copyright
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }
  });

  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.transition = "opacity 0.5s ease, visibility 0.5s ease";
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      preloader.setAttribute('aria-busy', 'false');
      // Remove preloader element from DOM after transition to ensure no hidden white box
      preloader.remove();
    }, 1200);
  });

  // --- Social Icons Animation (Home Section) ---
  document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.addEventListener('click', () => {
      icon.style.transform = "scale(1.4)";
      setTimeout(() => icon.style.transform = "scale(1)", 300);
    });
  });

  // --- Skills Section Interactive Details ---
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('active');
    });
  });

  // --- Services Section Animation Logic ---
  function showServicesGrid() {
    servicesIntroSlide.classList.add('hidden'); // Hide intro slide
    servicesGrid.classList.add('visible'); // Show grid
  }

  function resetServicesAnimation() {
      servicesIntroSlide.classList.remove('hidden'); // Show intro slide
      servicesGrid.classList.remove('visible'); // Hide grid
  }

  servicesIntroSlide.addEventListener('click', showServicesGrid);
  servicesIntroSlide.addEventListener('mouseenter', showServicesGrid); // Also trigger on hover

  // --- Education Section Scroll Animation ---
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.2 // Trigger when 20% of the item is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, observerOptions);

  educationItems.forEach(item => {
    observer.observe(item);
  });

  // --- Enquiry Form Submission (Placeholder) ---
  enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault(); // Prevent actual form submission

      const name = document.getElementById('enquiry-name').value;
      const email = document.getElementById('enquiry-email').value;
      const subject = document.getElementById('enquiry-subject').value;
      const message = document.getElementById('enquiry-message').value;

      // In a real application, you would send this data to a server
      console.log('Enquiry Details:', { name, email, subject, message });
      alert(`Thank you, ${name}! Your enquiry about "${subject}" has been received. I will get back to you at ${email} soon.`);

      enquiryForm.reset(); // Clear the form
  });


})(); // End of IIFE
