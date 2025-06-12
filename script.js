(() => {
  const nav = document.querySelector('.nav');
  const colorPickerInput = nav.querySelector('.color-picker');
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.page-section');
  const hireBtn = document.querySelector('.hire-btn');
  const servicesCarousel = document.querySelector('.services-carousel');
  const highlightEls = [...document.querySelectorAll('.highlight')];
  const socialIcons = [...document.querySelectorAll('.social-icons i')];
  const logo = document.querySelector('.logo');

  let selectedColor = colorPickerInput.value || '#ff1f1f';

  // Show one section and hide others
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
    if (targetId !== 'services') {
      collapseServicesCarousel();
    }
  }

  // Expand services carousel (show all slides)
  function expandServicesCarousel() {
    servicesCarousel.classList.add('expanded');
  }

  // Collapse services carousel (show only first slide)
  function collapseServicesCarousel() {
    servicesCarousel.classList.remove('expanded');
  }

  // Nav button click handlers
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      showSection(targetId);
      window.history.pushState(null, '', `#${targetId}`);
    });
  });

  // Hire me button click handler goes to services
  hireBtn.addEventListener('click', () => {
    showSection('services');
    window.history.pushState(null, '', '#services');
  });

  // Expand/collapse carousel on hover for mouse users
  servicesCarousel.addEventListener('mouseenter', expandServicesCarousel);
  servicesCarousel.addEventListener('mouseleave', collapseServicesCarousel);

  // Also expand/collapse on focus/blur for keyboard users
  servicesCarousel.addEventListener('focusin', expandServicesCarousel);
  servicesCarousel.addEventListener('focusout', collapseServicesCarousel);

  // Sync color picker changes dynamically
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

  // Initialize page and colors and show section from URL hash or default to home
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
