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

  // Store original position and size for returning
  let originalRect = null;

  // Duration of travel cycle in ms
  const travelDuration = 8000;

  // Control animation frame and state
  let animationFrameId = null;
  let startTime = null;

  // Current traveling flag
  let isTraveling = false;

  // The travel path function (circular) around the viewport center
  function travelPath(elapsed) {
    const radiusX = window.innerWidth / 3; // horizontal radius
    const radiusY = window.innerHeight / 5; // vertical radius
    const centerX = window.innerWidth / 2 - originalRect.width / 2;
    const centerY = window.innerHeight / 2 - originalRect.height / 2;

    const progress = (elapsed % travelDuration) / travelDuration;
    const angle = progress * 2 * Math.PI;

    const x = centerX + radiusX * Math.cos(angle);
    const y = centerY + radiusY * Math.sin(angle);

    return { x, y };
  }

  // Animate function moving the wrapper along path + rotating profile image
  function animateTravel(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;

    const pos = travelPath(elapsed);

    // Move the graphicWrapper using left/top for fixed position
    graphicWrapper.style.left = `${pos.x}px`;
    graphicWrapper.style.top = `${pos.y}px`;

    // Continue animation
    animationFrameId = requestAnimationFrame(animateTravel);
  }

  // Enter travel mode: fix position and start animation
  function startTravel() {
    if (isTraveling) return;
    isTraveling = true;

    // Capture original rect to return later
    originalRect = graphicWrapper.getBoundingClientRect();

    // Switch to fixed positioning
    graphicWrapper.classList.add('traveling');
    graphicWrapper.style.position = 'fixed';

    // Set initial position at original
    graphicWrapper.style.left = `${originalRect.left}px`;
    graphicWrapper.style.top = `${originalRect.top}px`;

    // Start animation loop
    startTime = null;
    animationFrameId = requestAnimationFrame(animateTravel);
  }

  // Return animation: stop travel, smoothly move back to original position and revert positioning
  function stopTravel() {
    if (!isTraveling) return;
    isTraveling = false;

    // Cancel animation frame
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    // Smoothly move back to original place using transition on left/top
    graphicWrapper.style.left = `${originalRect.left}px`;
    graphicWrapper.style.top = `${originalRect.top}px`;

    // After transition, remove fixed position and traveling class to restore normal flow
    const transitionEndHandler = () => {
      graphicWrapper.style.position = '';
      graphicWrapper.style.left = '';
      graphicWrapper.style.top = '';
      graphicWrapper.classList.remove('traveling');
      graphicWrapper.removeEventListener('transitionend', transitionEndHandler);
      startTime = null;
    };

    graphicWrapper.addEventListener('transitionend', transitionEndHandler);
  }

  colorPickerInput.addEventListener('input', e => {
    updateColors(e.target.value);
  });

  // Remove previous mouseenter/leave handlers if any and add new ones:
  graphicWrapper.addEventListener('mouseenter', () => {
    startTravel();
  });

  graphicWrapper.addEventListener('mouseleave', () => {
    stopTravel();
  });

  // The existing colors update function (unchanged)
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

    selectedColor = newColor;
    colorPickerInput.style.backgroundColor = newColor;
    document.documentElement.style.setProperty('--picked-color', newColor);
  }

  // Preloader fade out (unchanged)
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

  // Smooth scroll navigation (unchanged)
  document.querySelectorAll('.nav-links li').forEach(link => {
    link.addEventListener('click', () => {
      const id = link.textContent.trim().toLowerCase();
      const section = document.getElementById(id);
      if(section) section.scrollIntoView({behavior:'smooth'});
    });
  });

  hireBtn.addEventListener('click', () => {
    const contactSection = document.getElementById('contact');
    if(contactSection){
      contactSection.scrollIntoView({behavior:'smooth'});
    } else {
      alert("Thanks for your interest! Let's connect.");
    }
  });

  socialIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      icon.style.transform = "scale(1.4)";
      setTimeout(() => icon.style.transform = "scale(1)", 300);
    });
  });

  window.addEventListener('DOMContentLoaded', () => {
    updateColors(selectedColor);
  });
})();
