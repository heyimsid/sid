(() => {
  const nav = document.querySelector('.nav');
  const colorPickerInput = nav.querySelector('.color-picker');
  const graphicWrapper = document.querySelector('.graphic-wrapper');
  const profileImage = graphicWrapper.querySelector('.profile-image');
  const heroText = document.querySelector('.hero-text');
  const hireBtn = document.querySelector('.hire-btn');
  const logo = document.querySelector('.logo');
  const highlightEls = [...document.querySelectorAll('.highlight')];
  const socialIcons = [...document.querySelectorAll('.social-icons i')];

  let selectedColor = colorPickerInput.value || '#ff1f1f';

  function hexToRgba(hex, alpha = 1) {
    const hexClean = hex.replace('#', '');
    const bigint = parseInt(hexClean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function createParticle(x, y, parent, baseColor) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.backgroundColor = baseColor;
    p.style.left = `${x}px`;
    p.style.top = `${y}px`;
    const dx = (Math.random() - 0.5) * 100 + 'px';
    const dy = (Math.random() - 0.5) * 100 + 'px';
    p.style.setProperty('--dx', dx);
    p.style.setProperty('--dy', dy);
    parent.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }

  async function animateColorChange(elements, newColor, oldColor) {
    elements.forEach(el => {
      el.style.transition = 'color 1s ease, text-shadow 1s ease, opacity 1s ease';
      el.style.color = oldColor;
      el.style.textShadow = `0 0 6px ${oldColor}`;
      el.style.opacity = '1';
    });
    const navRect = nav.getBoundingClientRect();
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        const x = rect.left + Math.random() * rect.width - navRect.left;
        const y = rect.top + Math.random() * rect.height - navRect.top;
        createParticle(x, y, nav, oldColor);
      }
      el.style.opacity = '0';
    });
    await new Promise(r => setTimeout(r, 1000));
    elements.forEach(el => {
      el.style.color = newColor;
      el.style.textShadow = `0 0 6px ${newColor}`;
      el.style.opacity = '1';
    });
    await new Promise(r => setTimeout(r, 1000));
  }

  async function updateColors(newColor) {
    if (newColor === selectedColor) return;

    await animateColorChange(highlightEls, newColor, selectedColor);

    socialIcons.forEach(icon => {
      icon.style.transition = 'color 1s ease, text-shadow 1s ease';
      icon.style.color = newColor;
      icon.style.textShadow = `0 0 10px ${newColor}`;
    });

    hireBtn.style.transition = 'color 1s ease, border-color 1s ease, background-color 1s ease, box-shadow 1s ease, text-shadow 1s ease';
    hireBtn.style.color = newColor;
    hireBtn.style.borderColor = newColor;
    hireBtn.style.textShadow = `0 0 6px ${newColor}`;
    hireBtn.style.background = 'transparent';
    hireBtn.style.boxShadow = 'none';

    logo.style.color = newColor;
    logo.style.textShadow = `0 0 8px ${newColor}`;

    profileImage.style.transition = 'box-shadow 1s ease';
    profileImage.style.boxShadow = `0 0 40px 4px ${newColor}`;

    graphicWrapper.style.transition = 'box-shadow 1s ease, background 1s ease';
    graphicWrapper.style.boxShadow = `0 0 30px ${newColor}66`;
    graphicWrapper.style.background = newColor + '1A';

    document.documentElement.style.setProperty('--picked-color', newColor);

    selectedColor = newColor;
    colorPickerInput.style.backgroundColor = newColor;
  }

  colorPickerInput.addEventListener('input', e => {
    updateColors(e.target.value);
  });

  // Preloader fade out
  const preloader = document.getElementById("preloader");
  preloader.style.opacity = "1";
  preloader.style.visibility = "visible";
  preloader.setAttribute('aria-busy', 'true');
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.transition = "opacity 0.5s ease, visibility 0.5s ease";
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      preloader.setAttribute('aria-busy', 'false');
    }, 1200);
  });

  // Smooth scroll navigation
  document.querySelectorAll('.nav-links li').forEach(link => {
    link.addEventListener('click', () => {
      const id = link.textContent.trim().toLowerCase();
      const section = document.getElementById(id);
      if(section) section.scrollIntoView({behavior:'smooth'});
    });
  });

  // Hire me button smooth scroll or alert
  hireBtn.addEventListener('click', () => {
    const contactSection = document.getElementById('contact');
    if(contactSection){
      contactSection.scrollIntoView({behavior:'smooth'});
    } else {
      alert("Thanks for your interest! Let's connect.");
    }
  });

  // Social icons scale ripple
  socialIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      icon.style.transform = "scale(1.4)";
      setTimeout(() => icon.style.transform = "scale(1)", 300);
    });
  });

  // Initialize theme color on load
  window.addEventListener('DOMContentLoaded', () => {
    updateColors(selectedColor);
  });
})();
