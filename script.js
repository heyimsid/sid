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
  const graphicWrapper = document.querySelector('.graphic-wrapper');
  const profileImage = graphicWrapper.querySelector('.profile-image');
  const logo = document.querySelector('.logo');

  let selectedColor = colorPickerInput.value || '#ff1f1f';

  // Section switching logic: only one visible at a time
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
    // Collapse expanded slides view if any
    collapseServicesCarousel();
  }

  // Collapse slides to show only active slide
  function collapseServicesCarousel() {
    servicesCarousel.classList.remove('expanded');
  }

  // Expand slides fan out effect on hover
  function expandServicesCarousel() {
    servicesCarousel.classList.add('expanded');
  }

  // Setup event listeners:

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      showSection(targetId);
      window.history.pushState(null, '', `#${targetId}`); // Update URL hash
    });
  });

  hireBtn.addEventListener('click', () => {
    showSection('services');
    window.history.pushState(null, '', '#services');
  });

  // Services carousel hover to expand, leave to collapse
  servicesCarousel.addEventListener('mouseenter', expandServicesCarousel);
  servicesCarousel.addEventListener('mouseleave', collapseServicesCarousel);

  // Services slide click: make that slide active and collapse
  serviceSlides.forEach((slide, idx) => {
    slide.addEventListener('click', () => {
      // Remove active from all
      serviceSlides.forEach(s => s.classList.remove('active'));
      slide.classList.add('active');
      collapseServicesCarousel();
    });
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

    hireBtn.style.color = newColor;
    hireBtn.style.borderColor = newColor;
    hireBtn.style.textShadow = `0 0 6px ${newColor}`;

    logo.style.color = newColor;
    logo.style.textShadow = `0 0 8px ${newColor}`;

    serviceSlides.forEach(slide => {
      slide.style.boxShadow = `0 16px 40px ${hexToRgba(newColor, 0.25)}`;
    });

    profileImage.style.boxShadow = `0 0 40px 4px ${newColor}`;

    colorPickerInput.style.backgroundColor = newColor;

    selectedColor = newColor;
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

  // Smooth scroll handled by CSS scroll-behavior but added fallback:
  document.querySelectorAll('.nav-btn, .hire-btn, .slide-hire-btn').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const href = el.getAttribute('href') || el.dataset.target;
      if (!href) return;
      const id = href.startsWith('#') ? href.substring(1) : href;
      const section = document.getElementById(id);
      if (section) {
        showSection(id);
        window.history.pushState(null, '', '#'+id);
      }
    });
  });

  // Social icons scale ripple on click
  document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.addEventListener('click', () => {
      icon.style.transform = "scale(1.4)";
      setTimeout(() => icon.style.transform = "scale(1)", 300);
    });
  });

})();
