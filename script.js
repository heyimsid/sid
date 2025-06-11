(() => {
  const nav = document.querySelector('.nav');
  const colorPickerBtn = nav.querySelector('.color-picker-button');
  const colorCircle = colorPickerBtn.querySelector('.color-picker-circle');

  const modalBackdrop = document.querySelector('.color-picker-modal-backdrop');
  const modalColorInput = modalBackdrop.querySelector('input[type="color"]');
  const cancelBtn = modalBackdrop.querySelector('.btn:contains("Cancel"), .btn:nth-child(1)');
  const applyBtn = modalBackdrop.querySelector('.btn:contains("Apply"), .btn:nth-child(2)');

  let selectedColor = '#ff1f1f';

  // Replace :contains fallback with explicit selectors:
  // Because :contains is not standard in document.querySelector, use ids for buttons instead or select by order
  const cancelButton = document.getElementById('cancelPickerButton') || cancelBtn;
  const applyButton = document.getElementById('applyPickerButton') || applyBtn;

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

  // Animate simultaneous fade out/in letter by letter
  async function animateColorChange(elemList, newColor, oldColor) {
    elemList.forEach(el => {
      if (!el.dataset.originalText) {
        el.dataset.originalText = el.textContent;
      }
      const chars = el.dataset.originalText.split('');
      el.innerHTML = '';
      chars.forEach(ch => {
        const span = document.createElement('span');
        span.textContent = ch;
        span.style.color = oldColor;
        el.appendChild(span);
      });
    });

    const spansList = elemList.flatMap(el => Array.from(el.querySelectorAll('span')));
    const totalLetters = spansList.length;

    let delay = 0;

    for(let i=0; i<totalLetters; i++){
      const span = spansList[i];
      setTimeout(() => {
        span.style.transition = 'color 0.4s ease';
        span.style.color = 'transparent';
      }, delay);
      setTimeout(() => {
        span.style.color = newColor;
      }, delay + 400);
      delay += 70;
    }

    await new Promise(r => setTimeout(r, delay + 500));
    elemList.forEach(el => {
      el.textContent = el.dataset.originalText;
      el.style.color = newColor;
      el.style.textShadow = `0 0 6px ${newColor}`;
    });
  }

  async function updateColors(newColor) {
    if(newColor === selectedColor) return;

    const highlightEls = [...document.querySelectorAll('.highlight')];
    const socialIcons = [...document.querySelectorAll('.social-icons i')];
    const hireBtn = document.querySelector('.hire-btn');
    const thunderSvg = document.querySelector('.thunder-svg');
    const progressCircle = document.querySelector('.progress-ring .progress');
    const profileGlow = document.querySelector('.profile-glow');
    const logo = document.querySelector('.logo');

    highlightEls.forEach(el => {
      const rect = el.getBoundingClientRect();
      const navRect = nav.getBoundingClientRect();
      for(let i=0; i<5; i++){
        const x = rect.left + Math.random()*rect.width - navRect.left;
        const y = rect.top + Math.random()*rect.height - navRect.top;
        createParticle(x, y, nav, selectedColor);
      }
    });

    await animateColorChange(highlightEls, newColor, selectedColor);

    socialIcons.forEach(icon=>{
      icon.style.transition = 'color 0.6s ease, text-shadow 0.6s ease';
      icon.style.color = newColor;
      icon.style.textShadow = `0 0 10px ${newColor}`;
    });

    hireBtn.style.transition = 'color 0.6s ease, border-color 0.6s ease, background-color 0.6s ease, box-shadow 0.6s ease, text-shadow 0.6s ease';
    if(hireBtn.matches(':hover')){
      hireBtn.style.background = newColor;
      hireBtn.style.color = '#000';
      hireBtn.style.borderColor = newColor;
      hireBtn.style.textShadow = 'none';
      hireBtn.style.boxShadow = `0 0 15px ${newColor}`;
    } else{
      hireBtn.style.color = newColor;
      hireBtn.style.borderColor = newColor;
      hireBtn.style.background = 'transparent';
      hireBtn.style.textShadow = `0 0 6px ${newColor}`;
      hireBtn.style.boxShadow = 'none';
    }

    thunderSvg.style.filter = `drop-shadow(0 0 25px ${newColor})`;
    thunderSvg.style.animation = 'none';
    setTimeout(() => { thunderSvg.style.animation = null; }, 20);

    if(progressCircle){
      progressCircle.style.stroke = newColor;
      progressCircle.style.filter = `drop-shadow(0 0 6px ${newColor})`;
    }

    profileGlow.style.background = `radial-gradient(circle, ${hexToRgba(newColor, 0.3)} 0%, transparent 70%)`;
    logo.style.color = newColor;
    logo.style.textShadow = `0 0 8px ${newColor}`;

    selectedColor = newColor;
    colorCircle.style.background = newColor;
    document.documentElement.style.setProperty('--picked-color', newColor);
  }

  // Open/close modal
  colorPickerBtn.addEventListener('click', () => {
    modalColorInput.value = selectedColor;
    modalBackdrop.classList.add('show');
    modalBackdrop.focus();
  });

  cancelBtn.addEventListener('click', () => {
    modalBackdrop.classList.remove('show');
  });

  modalBackdrop.addEventListener('click', e => {
    if(e.target === modalBackdrop) {
      modalBackdrop.classList.remove('show');
    }
  });

  applyBtn.addEventListener('click', () => {
    const newColor = modalColorInput.value;
    updateColors(newColor);
    modalBackdrop.classList.remove('show');
  });

  modalColorInput.addEventListener('input', e => {
    colorCircle.style.background = e.target.value;
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

  // Smooth scroll nav links
  document.querySelectorAll('.nav-links li').forEach(link => {
    link.addEventListener('click', () => {
      const id = link.textContent.trim().toLowerCase();
      const section = document.getElementById(id);
      if(section) section.scrollIntoView({behavior: 'smooth'});
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

  // Init color on DOM ready
  window.addEventListener('DOMContentLoaded', () => {
    updateColors(selectedColor);
  });
})();
