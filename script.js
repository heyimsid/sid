(() => {
  const nav = document.querySelector('.nav');
  const colorPickerInput = nav.querySelector('.color-picker');
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.page-section');
  const hireBtn = document.querySelector('.hire-btn');
  const servicesCarousel = document.querySelector('.services-carousel');
  const serviceSlides = document.querySelectorAll('.service-slide');
  const highlightEls = [...document.querySelectorAll('.highlight')];
  const socialIcons = [...document.querySelectorAll('.social-icons i')];
  const logo = document.querySelector('.logo');

  const popup = document.getElementById('hire-popup');
  const popupTitle = document.getElementById('service-name');
  const form = document.getElementById('hire-form');
  const cancelBtn = document.getElementById('cancel-btn');

  let selectedColor = colorPickerInput.value || '#ff1f1f';

  // Show one section only
  function showSection(targetId) {
    sections.forEach(section => {
      if (section.id === targetId) {
        section.classList.add('active');
        section.setAttribute('tabindex', '-1');
        section.focus();
      } else {
        section.classList.remove('active');
        section.setAttribute('tabindex', '-1');
      }
    });
    navButtons.forEach(btn => {
      const expanded = btn.dataset.target === targetId;
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });

    if(targetId !== 'services') {
      collapseServices();
    }
  }

  // Collapse services carousel to show only first slide
  function collapseServices() {
    servicesCarousel.classList.remove('expanded');
    // Show first slide with full opacity; reset animation on intro slide
    const introSlide = servicesCarousel.querySelector('.intro-slide');
    if (introSlide) {
      introSlide.style.opacity = '1';
      introSlide.style.pointerEvents = 'auto';
      introSlide.style.transition = 'opacity 0.5s ease';
    }
  }

  // Expand services carousel: fan out grid and fade out first slide
  function expandServices() {
    servicesCarousel.classList.add('expanded');
    // Fade out intro slide smoothly
    const introSlide = servicesCarousel.querySelector('.intro-slide');
    if (introSlide) {
      introSlide.style.opacity = '0';
      introSlide.style.pointerEvents = 'none';
      introSlide.style.transition = 'opacity 0.5s ease';
    }
  }

  // Nav buttons click to show sections
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      showSection(btn.dataset.target);
      window.history.pushState(null, '', `#${btn.dataset.target}`);
    });
  });

  // Hire me button on home links to services
  hireBtn.addEventListener('click', () => {
    showSection('services');
    window.history.pushState(null, '', '#services');
  });

  // Services hover/focus events
  servicesCarousel.addEventListener('mouseenter', expandServices);
  servicesCarousel.addEventListener('mouseleave', collapseServices);
  servicesCarousel.addEventListener('focusin', expandServices);
  servicesCarousel.addEventListener('focusout', collapseServices);

  // Hire Now buttons open popup with service name
  servicesCarousel.querySelectorAll('.slide-hire-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service-name') || 'Service';
      openPopup(serviceName);
    });
  });

  // Open popup with service name
  function openPopup(serviceName) {
    popupTitle.textContent = serviceName;
    popup.setAttribute('aria-hidden', 'false');
    popup.style.display = 'flex';
    // Focus first input for accessibility
    form.elements['name'].focus();
  }

  // Close popup function
  function closePopup() {
    popup.setAttribute('aria-hidden', 'true');
    popup.style.display = 'none';
    form.reset();
  }

  cancelBtn.addEventListener('click', () => {
    closePopup();
  });

  // Close popup when clicking outside the content
  popup.addEventListener('click', e => {
    if (e.target === popup) {
      closePopup();
    }
  });

  // Handle form submission - uses EmailJS for sending email
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Basic form validation done by HTML required attributes

    // Collect form data
    const formData = new FormData(form);
    const emailParams = {};
    formData.forEach((value, key) => {
      // For file attachment get filename or base64 if you prefer
      if(key === 'attachment' && value instanceof File && value.name) {
        emailParams.attachmentName = value.name;
      } else {
        emailParams[key] = value;
      }
    });
    emailParams.serviceName = popupTitle.textContent;

    // Example using EmailJS: you must configure your own EmailJS service & template
    // TODO: Replace with your own EmailJS userID, serviceID, templateID
    if (typeof emailjs !== "undefined") {
      emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', emailParams, 'YOUR_USER_ID')
        .then(() => {
          alert('Your request has been sent successfully!');
          closePopup();
        }, (error) => {
          alert('Failed to send your request. Please try again later.');
          console.error(error);
        });
    } else {
      alert('Email service not configured. Please contact manually.');
      closePopup();
    }
  });

  // Color syncing
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

    hireBtn.style.color = newColor;
    hireBtn.style.borderColor = newColor;
    hireBtn.style.textShadow = `0 0 6px ${newColor}`;

    logo.style.color = newColor;
    logo.style.textShadow = `0 0 8px ${newColor}`;

    serviceSlides.forEach(slide => {
      slide.style.boxShadow = `0 16px 40px ${hexToRgba(newColor, 0.25)}`;
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
  });

  // Preloader fade out
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.transition = "opacity 0.5s ease, visibility 0.5s ease";
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      preloader.setAttribute('aria-busy', 'false');
    }, 1200);
  });

  // Social icons scale ripple on click
  document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.addEventListener('click', () => {
      icon.style.transform = "scale(1.4)";
      setTimeout(() => icon.style.transform = "scale(1)", 300);
    });
  });

})();
