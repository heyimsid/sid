(() => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.page-section');
  const hireBtnHome = document.querySelector('.hire-btn');
  const servicesCarousel = document.querySelector('.services-carousel'); // Still needed for color updates
  const slideHireButtons = document.querySelectorAll('.slide-hire-btn'); // Only these should open popup
  const highlightEls = [...document.querySelectorAll('.highlight')];
  const socialIcons = [...document.querySelectorAll('.social-icons i')];
  const logo = document.querySelector('.logo');

  const popup = document.getElementById('hire-popup');
  const popupServiceName = document.getElementById('popup-service-name');
  const form = document.getElementById('hire-form');
  const cancelBtn = document.getElementById('popup-cancel-btn');

  const colorPickerInput = document.querySelector('.color-picker');
  let selectedColor = colorPickerInput.value || '#ff1f1f';

  // --- FIX: Add event listeners for navigation buttons ---
  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target;
      showSection(targetId);
    });
  });
  // --- END FIX ---

  function showSection(targetId) {
    sections.forEach(section => {
      if (section.id === targetId) {
        section.classList.add('active');
        section.setAttribute('tabindex', '-1');
        // section.focus(); // Removed focus to prevent unwanted scroll on section change
      } else {
        section.classList.remove('active');
        section.setAttribute('tabindex', '-1');
      }
    });
    navButtons.forEach(btn => {
      btn.setAttribute('aria-expanded', btn.dataset.target === targetId ? 'true' : 'false');
    });
  }

  // Hire button on home page (needs to trigger section change AND popup)
  hireBtnHome.addEventListener('click', e => {
    e.preventDefault();
    showSection('services'); // Go to services section first
    // Optional: If you want to open popup directly from home hire button, pass a default service name
    // openPopup('General Inquiry');
  });


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
    form.elements['hire-name'].focus(); // Focus on the first form element
    document.body.style.overflow = 'hidden'; // Disable page scroll
  }

  function closePopup() {
    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');
    form.reset();
    document.body.style.overflow = ''; // Re-enable scroll
  }

  cancelBtn.addEventListener('click', closePopup);

  popup.addEventListener('click', e => {
    if (e.target === popup) {
      closePopup();
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    alert(`Thank you, your request for ${popupServiceName.textContent} has been submitted!`);
    closePopup();
  });

  function hexToRgba(hex, alpha = 1) {
    const hexClean = hex.replace('#', '');
    const bigint = parseInt(hexClean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function updateColors(newColor) {
    document.documentElement.style.setProperty('--picked-color', newColor);

    highlightEls.forEach(el => {
      el.style.color = newColor;
      el.style.textShadow = `0 0 6px ${newColor}`;
    });

    socialIcons.forEach(icon => {
      icon.style.color = newColor;
      icon.style.textShadow = `0 0 10px ${newColor}`;
    });

    // Ensure home hire button updates color dynamically
    hireBtnHome.style.color = newColor;
    hireBtnHome.style.borderColor = newColor;
    hireBtnHome.style.textShadow = `0 0 6px ${newColor}`;

    logo.style.color = newColor;
    logo.style.textShadow = `0 0 8px ${newColor}`;

    // Update box-shadow for service slides, skill cards, and certificate items
    const allGlowingElements = document.querySelectorAll('.service-slide, .skill-card, .certificate-item');
    allGlowingElements.forEach(el => {
      el.style.boxShadow = `0 0 20px ${hexToRgba(newColor, 0.15)}`; // Default subtle glow
    });

    // Specific hover effects for glowing elements (ensure they pick up the new color)
    document.querySelectorAll('.service-slide:hover, .skill-card:hover, .certificate-item:hover').forEach(el => {
        el.style.boxShadow = `0 0 30px ${newColor}`; // Stronger glow on hover
    });
    // This part requires re-applying the box-shadow property on hover or transition
    // A better approach would be to manage this purely in CSS using `var(--picked-color)`
    // but the JS here will force an update.

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
    // Ensure the hover state also updates the specific color
    document.querySelectorAll('.education-image-container img:hover').forEach(el => {
      el.style.boxShadow = `0 0 25px ${newColor}`;
    });


    // Update colors for Achievements section elements
    document.querySelectorAll('.certificate-info h3').forEach(el => {
        el.style.color = newColor;
        el.style.textShadow = `0 0 6px ${newColor}`;
    });

    selectedColor = newColor;
    colorPickerInput.style.backgroundColor = newColor;
  }

  colorPickerInput.addEventListener('input', e => {
    updateColors(e.target.value);
  });

  window.addEventListener('DOMContentLoaded', () => {
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
      // --- FIX: Remove preloader element from DOM after transition to ensure no hidden white box ---
      preloader.remove(); // Removes the element completely
      // --- END FIX ---
    }, 1200);
  });


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

})(); // End of IIFE
