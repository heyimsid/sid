(() => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.page-section');
  const hireBtnHome = document.querySelector('.hire-btn');
  const servicesCarousel = document.querySelector('.services-carousel');
  const highlightEls = [...document.querySelectorAll('.highlight')];
  const socialIcons = [...document.querySelectorAll('.social-icons i')];
  const logo = document.querySelector('.logo');

  const popup = document.getElementById('hire-popup');
  const popupServiceName = document.getElementById('popup-service-name');
  const form = document.getElementById('hire-form');
  const cancelBtn = document.getElementById('popup-cancel-btn');

  const colorPickerInput = document.querySelector('.color-picker');
  let selectedColor = colorPickerInput.value || '#ff1f1f';

  // Manage sections display
  function showSection(id) {
    sections.forEach(sec => {
      if (sec.id === id) sec.classList.add('active');
      else sec.classList.remove('active');
    });
    navButtons.forEach(btn => {
      btn.setAttribute('aria-expanded', btn.dataset.target === id ? 'true' : 'false');
    });
    if (id === 'services') {
      collapseServices();
    } else {
      collapseServices();
    }
  }

  // Services carousel collapse & expand
  function collapseServices() {
    // Show only the intro slide, fade in
    const introSlide = servicesCarousel.querySelector('.intro-slide');
    servicesCarousel.classList.remove('expanded');
    servicesCarousel.querySelectorAll('.service-slide:not(.intro-slide)').forEach(slide => {
      slide.style.opacity = '0';
      slide.style.pointerEvents = 'none';
      slide.style.transition = 'opacity 0.5s ease';
    });
    introSlide.style.opacity = '1';
    introSlide.style.pointerEvents = 'auto';
    introSlide.style.transition = 'opacity 0.5s ease';
  }

  function expandServices() {
    // Fade out and hide intro slide
    const introSlide = servicesCarousel.querySelector('.intro-slide');
    introSlide.style.opacity = '0';
    introSlide.style.pointerEvents = 'none';

    // Animate other slides in
    servicesCarousel.classList.add('expanded');
    servicesCarousel.querySelectorAll('.service-slide:not(.intro-slide)').forEach(slide => {
      slide.style.opacity = '1';
      slide.style.pointerEvents = 'auto';
      slide.style.transition = 'opacity 0.5s ease';
    });
  }

  // Nav buttons handler
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      showSection(btn.dataset.target);
      window.history.pushState(null, '', `#${btn.dataset.target}`);
    });
  });

  // Home Hire me button scrolls to services
  hireBtnHome.addEventListener('click', () => {
    showSection('services');
    window.history.pushState(null, '', '#services');
  });

  // Services carousel expand/collapse on hover and focus
  servicesCarousel.addEventListener('mouseenter', expandServices);
  servicesCarousel.addEventListener('mouseleave', collapseServices);
  servicesCarousel.addEventListener('focusin', expandServices);
  servicesCarousel.addEventListener('focusout', collapseServices);

  // Hide popup on load
  popup.style.display = 'none';
  popup.setAttribute('aria-hidden', 'true');

  // Show popup with service name person clicked
  document.querySelectorAll('.slide-hire-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const serviceName = btn.getAttribute('data-service-name') || 'Service';
      popupServiceName.textContent = serviceName;
      popup.style.display = 'flex';
      popup.setAttribute('aria-hidden', 'false');
      form.elements['name'].focus();
    });
  });

  // Cancel popup
  cancelBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');
    form.reset();
  });

  // Clicking outside popup content closes popup
  popup.addEventListener('click', e => {
    if (e.target === popup) {
      popup.style.display = 'none';
      popup.setAttribute('aria-hidden', 'true');
      form.reset();
    }
  });

  // Form submission - configure this to send email via EmailJS or server
  form.addEventListener('submit', e => {
    e.preventDefault();
    // Here you put your email sending logic
    alert(`Request submitted for ${popupServiceName.textContent}! Thank you.`);
    popup.style.display = 'none';
    popup.setAttribute('aria-hidden', 'true');
    form.reset();
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

    hireBtnHome.style.color = newColor;
    hireBtnHome.style.borderColor = newColor;
    hireBtnHome.style.textShadow = `0 0 6px ${newColor}`;

    logo.style.color = newColor;
    logo.style.textShadow = `0 0 8px ${newColor}`;

    const serviceSlides = document.querySelectorAll('.service-slide');
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
    // Default to home section on load
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

  // Social icons ripple click
  document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.addEventListener('click', () => {
      icon.style.transform = "scale(1.4)";
      setTimeout(() => icon.style.transform = "scale(1)", 300);
    });
  });

})();
