(() => {
  const nav = document.querySelector('.nav');
  const colorPickerInput = nav.querySelector('.color-picker');
  let selectedColor = colorPickerInput.value || '#ff1f1f';

  // Utility for hex to rgba conversion
  function hexToRgba(hex, alpha = 1) {
    const hexClean = hex.replace('#', '');
    const bigint = parseInt(hexClean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // Particle creation
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

  // Smooth simultaneous fade out/in animation using opacity and color for all highlight elements
  async function animateColorChange(elems, newColor, oldColor) {
    elems.forEach(el => {
      el.style.transition = 'color 1.2s ease, text-shadow 1.2s ease';
      el.style.color = oldColor;
      el.style.textShadow = `0 0 6px ${oldColor}`;
      el.style.opacity = '1';
    });
    // Fade out + vanish particles simultaneously
    const navRect = nav.getBoundingClientRect();
    elems.forEach(el => {
      const rect = el.getBoundingClientRect();
      for (let i = 0; i < 6; i++) {
        const x = rect.left + Math.random() * rect.width - navRect.left;
        const y = rect.top + Math.random() * rect.height - navRect.top;
        createParticle(x, y, nav, oldColor);
      }
      el.style.opacity = '0';
    });
    // Wait fade out duration
    await new Promise(r => setTimeout(r, 900));

    // Change color while transparent
    elems.forEach(el => {
      el.style.color = newColor;
      el.style.textShadow = `0 0 6px ${newColor}`;
    });

    // Fade in new color
    elems.forEach(el => {
      el.style.opacity = '1';
    });
    // Wait fade in duration
    await new Promise(r => setTimeout(r, 900));
  }

  async function updateColors(newColor) {
    if (newColor === selectedColor) return;
    const highlights = [...document.querySelectorAll('.highlight')];
    const socialIcons = [...document.querySelectorAll('.social-icons i')];
    const hireBtn = document.querySelector('.hire-btn');
    const thunderSvg = document.querySelector('.progress-ring .progress').parentElement.parentElement.querySelector('.thunder-svg');
    const progressCircle = document.querySelector('.progress-ring .progress');
    const profileGlow = document.querySelector('.profile-glow');
    const logo = document.querySelector('.logo');

    await animateColorChange(highlights, newColor, selectedColor);

    socialIcons.forEach(icon => {
      icon.style.transition = 'color 1.2s ease, text-shadow 1.2s ease';
      icon.style.color = newColor;
      icon.style.textShadow = `0 0 10px ${newColor}`;
    });

    hireBtn.style.transition = 'color 1.2s ease, border-color 1.2s ease, background-color 1.2s ease, box-shadow 1.2s ease, text-shadow 1.2s ease';
    if (hireBtn.matches(':hover')) {
      hireBtn.style.background = newColor;
      hireBtn.style.color = '#000';
      hireBtn.style.borderColor = newColor;
      hireBtn.style.textShadow = 'none';
      hireBtn.style.boxShadow = `0 0 15px ${newColor}`;
    } else {
      hireBtn.style.color = newColor;
      hireBtn.style.borderColor = newColor;
      hireBtn.style.background = 'transparent';
      hireBtn.style.textShadow = `0 0 6px ${newColor}`;
      hireBtn.style.boxShadow = 'none';
    }

    if (thunderSvg) {
      thunderSvg.style.filter = `drop-shadow(0 0 25px ${newColor})`;
      thunderSvg.style.transition = 'filter 1.2s ease';
    }

    if (progressCircle) {
      progressCircle.style.stroke = newColor;
      progressCircle.style.transition = 'stroke 1.2s ease';
      progressCircle.style.filter = `drop-shadow(0 0 6px ${newColor})`;
    }

    if (profileGlow) {
      profileGlow.style.background = `radial-gradient(circle, ${hexToRgba(newColor, 0.3)} 0%, transparent 70%)`;
      profileGlow.style.transition = 'background 1.2s ease';
    }

    if (logo) {
      logo.style.color = newColor;
      logo.style.textShadow = `0 0 8px ${newColor}`;
      logo.style.transition = 'color 1.2s ease, text-shadow 1.2s ease';
    }

    selectedColor = newColor;
    colorPickerInput.style.backgroundColor = newColor;
    document.documentElement.style.setProperty('--picked-color', newColor);
  }

  // Handle color picker input
  colorPickerInput.addEventListener('input', e => {
    const val = e.target.value;
    updateColors(val);
  });

  // Preloader fade out
  const preloader = document.getElementById("preloader");
  preloader.style.opacity = "1";
  preloader.style.visibility = "visible";
  preloader.setAttribute('aria-busy', 'true');
  window.addEventListener("load", () => {
    setTimeout(() => {
      preloader.style.transition = "opacity 0.6s ease, visibility 0.5s ease";
      preloader.style.opacity = "0";
      preloader.style.visibility = "hidden";
      preloader.setAttribute('aria-busy', 'false');
    }, 1200);
  });

  // Smooth scroll for nav links
  document.querySelectorAll('.nav-links li').forEach(link => {
    link.addEventListener('click', () => {
      const id = link.textContent.trim().toLowerCase();
      const section = document.getElementById(id);
      if(section) section.scrollIntoView({behavior:'smooth'});
    });
  });

  // Hire me button click
  document.querySelector('.hire-btn').addEventListener('click', () => {
    const contactSection = document.getElementById('contact');
    if(contactSection) contactSection.scrollIntoView({behavior:'smooth'});
    else alert("Thanks for your interest! Let's connect.");
  });

  // Social icons ripple
  document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.addEventListener('click', () => {
      icon.style.transform = "scale(1.4)";
      setTimeout(() => icon.style.transform = "scale(1)", 300);
    });
  });

  // Initialize color on DOM load
  window.addEventListener('DOMContentLoaded', () => {
    updateColors(selectedColor);
  });
})();
