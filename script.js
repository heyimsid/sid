(() => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.page-section');
  const hireBtn = document.querySelector('.hire-btn');
  const servicesCarousel = document.querySelector('.services-carousel');
  const singleSlide = servicesCarousel.querySelector('.single-slide');
  const expandedCards = servicesCarousel.querySelector('.expanded-cards');
  const serviceSlides = servicesCarousel.querySelectorAll('.service-slide.card');
  const highlightEls = [...document.querySelectorAll('.highlight')];
  const socialIcons = [...document.querySelectorAll('.social-icons i')];
  const graphicWrapper = document.querySelector('.graphic-wrapper');
  const profileImage = graphicWrapper.querySelector('.profile-image');
  const logo = document.querySelector('.logo');
  const colorPickerInput = document.querySelector('.color-picker');

  let selectedColor = colorPickerInput.value || '#ff1f1f';

  // Show only the target section, hide others
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
      collapseServicesCarousel();
      serviceSlides.forEach(s => s.classList.remove('active'));
      if (serviceSlides.length) serviceSlides[0].classList.add('active');
    }
  }

  // Collapse services carousel to single slide
  function collapseServicesCarousel() {
    servicesCarousel.classList.remove('expanded');
    singleSlide.style.pointerEvents = 'auto';
  }

  // Expand services carousel to show cards
  function expandServicesCarousel() {
    servicesCarousel.classList.add('expanded');
    singleSlide.style.pointerEvents = 'none';
  }

  // Nav buttons click
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      showSection(targetId);
      history.pushState(null, '', `#${targetId}`);
    });
  });

  // Hire me button click to go services
  hireBtn.addEventListener('click', () => {
    showSection('services');
    history.pushState(null, '', '#services');
  });

  // On hover over single slide expand cards
  singleSlide.addEventListener('mouseenter', expandServicesCarousel);

  // Collapse on mouse leave of entire carousel
  servicesCarousel.addEventListener('mouseleave', collapseServicesCarousel);

  // Allow clicking card to highlight it and collapse carousel
  serviceSlides.forEach(slide => {
    slide.addEventListener('click', () => {
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

  window.addEventListener('DOMContentLoaded', () => {
    updateColors(selectedColor);

    let initialSection = 'home';
    if (location.hash) {
      let hashSection = location.hash.substring(1);
      if (document.getElementById(hashSection)) {
        initialSection = hashSection;
      }
    }
    showSection(initialSection);
  });

  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.transition = "opacity 0.5s ease, visibility 0.5s ease";
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      preloader.setAttribute('aria-busy', 'false');
    }, 1200);
  });

  document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.addEventListener('click', () => {
      icon.style.transform = "scale(1.4)";
      setTimeout(() => icon.style.transform = "scale(1)", 300);
    });
  });
})();
