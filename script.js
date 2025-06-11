(() => {
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
      const expanded = btn.dataset.target === targetId;
      btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
    // For Services, reset carousel to collapsed state
    if (targetId !== 'services') {
      collapseServicesCarousel();
      // Reset active slide to first slide
      serviceSlides.forEach(s => s.classList.remove('active'));
      if(serviceSlides.length) serviceSlides[0].classList.add('active');
    }
  }

  // Collapse Services carousel (show only first slide)
  function collapseServicesCarousel() {
    servicesCarousel.classList.remove('expanded');
  }

  // Expand Services carousel (fan out)
  function expandServicesCarousel() {
    servicesCarousel.classList.add('expanded');
  }

  // Event listeners for nav buttons
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      showSection(targetId);
      window.history.pushState(null, '', `#${targetId}`);
    });
  });

  // Event listener for hire button — navigates to services
  hireBtn.addEventListener('click', () => {
    showSection('services');
    window.history.pushState(null, '', '#services');
  });

  // Expand carousel on mouse enter and collapse on leave
  servicesCarousel.addEventListener('mouseenter', expandServicesCarousel);
  servicesCarousel.addEventListener('mouseleave', collapseServicesCarousel);

  // Clicking a slide sets it active and collapses carousel
  serviceSlides.forEach(slide => {
    slide.addEventListener('click', () => {
      serviceSlides.forEach(s => s.classList.remove('active'));
      slide.classList.add('active');
      collapseServicesCarousel();
    });
  });

  // Update CSS variable and styles on color picker changes
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

  function hexToRgba(hex, alpha = 1) {
    const hexClean = hex.replace('#', '');
    const bigint = parseInt(hexClean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  colorPickerInput.addEventListener('input', e => {
    updateColors(e.target.value);
  });

  // Initialize page and colors on load based on current URL hash or default to home
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

  // Preloader fade out on window load
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.transition = "opacity 0.5s ease, visibility 0.5s ease";
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      preloader.setAttribute('aria-busy', 'false');
    }, 1200);
  });

  // Social icons scale effect on click
  document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.addEventListener('click', () => {
      icon.style.transform = "scale(1.4)";
      setTimeout(() => icon.style.transform = "scale(1)", 300);
    });
  });

})();
