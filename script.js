(() => {
  const navButtons = document.querySelectorAll('.nav-btn');
  const sections = document.querySelectorAll('.page-section');
  const hireBtnHome = document.querySelector('.hire-btn');
  const servicesCarousel = document.querySelector('.services-carousel');
  const slideHireButtons = document.querySelectorAll('.slide-hire-btn, .hire-btn');
  const highlightEls = [...document.querySelectorAll('.highlight')];
  const socialIcons = [...document.querySelectorAll('.social-icons i')];
  const logo = document.querySelector('.logo');

  const popup = document.getElementById('hire-popup');
  const popupServiceName = document.getElementById('popup-service-name');
  const form = document.getElementById('hire-form');
  const cancelBtn = document.getElementById('popup-cancel-btn');

  const colorPickerInput = document.querySelector('.color-picker');
  let selectedColor = colorPickerInput.value || '#ff1f1f';

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

  function collapseServices() {
    servicesCarousel.classList.remove('expanded');
    const introSlide = servicesCarousel.querySelector('.intro-slide');
    if (introSlide) {
      introSlide.style.opacity = '1';
      introSlide.style.pointerEvents = 'auto';
      introSlide.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      introSlide.style.transform = 'scale(1)';
    }
    servicesCarousel.querySelectorAll('.service-slide:not(.intro-slide)').forEach(slide => {
      slide.style.opacity = '0';
      slide.style.pointerEvents = 'none';
      slide.style.transform = 'scale(0.8)';
      slide.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
  }

  function expandServices() {
    servicesCarousel.classList.add('expanded');
    const introSlide = servicesCarousel.querySelector('.intro-slide');
    if (introSlide) {
      introSlide.style.opacity = '0';
      introSlide.style.pointerEvents = 'none';
      introSlide.style.transform = 'scale(0.8)';
      introSlide.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    }
    servicesCarousel.querySelectorAll('.service-slide:not(.intro-slide)').forEach(slide => {
      slide.style.opacity = '1';
      slide.style.pointerEvents = 'auto';
      slide.style.transform = 'scale(1)';
      slide.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
  }

  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      showSection(btn.dataset.target);
      window.history.pushState(null, '', `#${btn.dataset.target}`);
    });
  });

  hireBtnHome.addEventListener('click', () => {
    showSection('services');
    window.history.pushState(null, '', '#services');
  });

  servicesCarousel.addEventListener('mouseenter', expandServices);
  servicesCarousel.addEventListener('mouseleave', collapseServices);
  servicesCarousel.addEventListener('focusin', expandServices);
  servicesCarousel.addEventListener('focusout', collapseServices);

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
    let initialSection = 'home';
    if (location.hash) {
      const hashSection = location.hash.substring(1);
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
