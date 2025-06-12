(() => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.page-section');
  const hireBtnHome = document.querySelector('.hire-btn');
  const servicesCarousel = document.querySelector('.services-carousel');
  const slideHireButtons = document.querySelectorAll('.slide-hire-btn');
  const highlightEls = [...document.querySelectorAll('.highlight')];
  const socialIcons = [...document.querySelectorAll('.social-icons i')];
  const logo = document.querySelector('.logo');

  const popup = document.getElementById('hire-popup');
  const popupServiceName = document.getElementById('popup-service-name');
  const form = document.getElementById('hire-form');
  const cancelBtn = document.getElementById('popup-cancel-btn');

  const colorPickerInput = document.querySelector('.color-picker');
  let selectedColor = colorPickerInput.value || '#ff1f1f';

  // Show only the specified section, hide others
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
      btn.setAttribute('aria-expanded', btn.dataset.target === targetId ? 'true' : 'false');
    });

    if (targetId !== 'services') {
      collapseServices();
    } else {
      collapseServices();
    }
  }

  // Collapse services carousel to default state (show only intro slide)
  function collapseServices() {
    servicesCarousel.classList.remove('expanded');
    const introSlide = servicesCarousel.querySelector('.intro-slide');
    if (introSlide) {
      introSlide.style.opacity = '1';
      introSlide.style.pointerEvents = 'auto';
      introSlide.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      introSlide.style.transform = 'scale(1)';
    }
    // Reset other slides
    servicesCarousel.querySelectorAll('.service-slide:not(.intro-slide)').forEach(slide => {
      slide.style.opacity = '0';
      slide.style.pointerEvents = 'none';
      slide.style.transform = 'scale(0.5)';
      slide.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
  }

  // Expand services carousel to show all slides
  function expandServices() {
    servicesCarousel.classList.add('expanded');
    const introSlide = servicesCarousel.querySelector('.intro-slide');
    if (introSlide) {
      introSlide.style.opacity = '0';
      introSlide.style.pointerEvents = 'none';
      introSlide.style.transform = 'scale(0)';
      introSlide.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    }
    servicesCarousel.querySelectorAll('.service-slide:not(.intro-slide)').forEach(slide => {
      slide.style.opacity = '1';
      slide.style.pointerEvents = 'auto';
      slide.style.transform = 'scale(1)';
      slide.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
  }

  // Setup nav button click listeners
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      showSection(btn.dataset.target);
      window.history.pushState(null, '', `#${btn.dataset.target}`);
    });
  });

  // Home Hire Me button navigates to services
  hireBtnHome.addEventListener('click', () => {
    showSection('services');
    window.history.pushState(null, '', '#services');
  });

  // Hover/focus events on services carousel to expand/collapse slides
  servicesCarousel.addEventListener('mouseenter', expandServices);
  servicesCarousel.addEventListener('mouseleave', collapseServices);
  servicesCarousel.addEventListener('focusin', expandServices);
  servicesCarousel.addEventListener('focusout', collapseServices);

  // Show popup form on clicking "Hire Me" buttons inside slides
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
    form.elements['name'].focus();
  }

  function closePopup() {
    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');
    form.reset();
  }

  cancelBtn.addEventListener('click', () => {
    closePopup();
  });

  popup.addEventListener('click', e => {
    if (e.target === popup) {
      closePopup();
    }
  });

  // Handle form submission (you need to configure email sending via EmailJS or backend)
  form.addEventListener('submit', e => {
    e.preventDefault();
    // Replace the following with your email sending logic or integration:
    alert(`Thank you, your request for ${popupServiceName.textContent} has been submitted!`);
    closePopup();
  });

  // Dynamic color syncing with color picker
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

    hireBtnHome.style.color = newColor;
    hireBtnHome.style.borderColor = newColor;
    hireBtnHome.style.textShadow = `0 0 6px ${newColor}`;

    logo.style.color = newColor;
    logo.style.textShadow = `0 0 8px ${newColor}`;

    const allServiceSlides = document.querySelectorAll('.service-slide');
    allServiceSlides.forEach(slide => {
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
    let initialSection = 'home'; // Default to home
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

  // Social icons ripple effect
  document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.addEventListener('click', () => {
      icon.style.transform = "scale(1.4)";
      setTimeout(() => icon.style.transform = "scale(1)", 300);
    });
  });

})();
