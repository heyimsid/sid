(() => {
  const nav = document.querySelector('.nav');
  const colorPickerInput = nav.querySelector('.color-picker');
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

  async function animateColorChange(elems, newColor, oldColor) {
    elems.forEach(el => {
      el.style.transition = 'color 1s ease, text-shadow 1s ease, opacity 1s ease';
      el.style.color = oldColor;
      el.style.textShadow = `0 0 6px ${oldColor}`;
      el.style.opacity = '1';
    });
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
    await new Promise(r => setTimeout(r, 1000));
    elems.forEach(el => {
      el.style.color = newColor;
      el.style.textShadow = `0 0 6px ${newColor}`;
      el.style.opacity = '1';
    });
    await new Promise(r => setTimeout(r, 1000));
  }

  async function updateColors(newColor) {
    if (newColor === selectedColor) return;
    const highlights = [...document.querySelectorAll('.highlight')];
    const socialIcons = [...document.querySelectorAll('.social-icons i')];
    const hireBtn = document.querySelector('.hire-btn');
    const profileGlow = document.querySelector('.profile-glow');
    const logo = document.querySelector('.logo');

    await animateColorChange(highlights, newColor, selectedColor);

    socialIcons.forEach(icon => {
      icon.style.transition = 'color 1s ease, text-shadow 1s ease';
      icon.style.color = newColor;
      icon.style.textShadow = `0 0 10px ${newColor}`;
    });

    hireBtn.style.transition = 'color 1s ease, border-color 1s ease, background-color 1s ease, box-shadow 1s ease, text-shadow 1s ease';

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
    
    if (profileGlow) {
      profileGlow.style.background = `radial-gradient(circle, ${hexToRgba(newColor, 0.3)} 0%, transparent 70%)`;
      profileGlow.style.transition = 'background 1s ease';
    }
    
    if (logo) {
      logo.style.color = newColor;
      logo.style.textShadow = `0 0 8px ${newColor}`;
      logo.style.transition = 'color 1s ease, text-shadow 1s ease';
    }
    
    selectedColor = newColor;
    colorPickerInput.style.backgroundColor = newColor;
    document.documentElement.style.setProperty('--picked-color', newColor);
  }

  colorPickerInput.addEventListener('input', e => {
    updateColors(e.target.value);
  });

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

  document.querySelectorAll('.nav-links li').forEach(link => {
    link.addEventListener('click', () => {
      const id = link.textContent.trim().toLowerCase();
      const section = document.getElementById(id);
      if(section) section.scrollIntoView({behavior:'smooth'});
    });
  });

  document.querySelector('.hire-btn').addEventListener('click', () => {
    const contactSection = document.getElementById('contact');
    if(contactSection) contactSection.scrollIntoView({behavior:'smooth'});
    else alert("Thanks for your interest! Let's connect.");
  });

  document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.addEventListener('click', () => {
      icon.style.transform = "scale(1.4)";
      setTimeout(() => icon.style.transform = "scale(1)", 300);
    });
  });

  window.addEventListener('DOMContentLoaded', () => {
    updateColors(selectedColor);
  });
})();
