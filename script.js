// Smooth scroll to sections (if IDs are added later)
document.querySelectorAll('.nav-links li').forEach(link => {
  link.addEventListener('click', () => {
    const sectionId = link.textContent.trim().toLowerCase();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Hire Me button click
document.querySelector('.hire-btn').addEventListener('click', () => {
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    alert("Thanks for your interest! Let's connect.");
  }
});

// Ripple animation for social icons
document.querySelectorAll('.social-icons i').forEach(icon => {
  icon.addEventListener('click', () => {
    icon.style.transform = "scale(1.4)";
    setTimeout(() => {
      icon.style.transform = "scale(1)";
    }, 300);
  });
});

// Preloader hide with fade
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.style.opacity = "0";
    preloader.style.visibility = "hidden";
    preloader.setAttribute('aria-busy', 'false');
  }, 1000); // Fade out after ring completes
});

// --- COLOR PALETTE SYSTEM ---

const colors = [
  '#ff1f1f', // original red
  '#1f1fff', 
  '#1fff1f', 
  '#ffae1f', 
  '#9d1fff',
  '#1fffd7',
  '#ff1fb2',
  '#ff551f',
  '#55ff1f',
  '#1f55ff',
  '#d4ff1f'
];

// Dynamically generate color palette items in the navbar
const colorPaletteContainer = document.querySelector('.color-palette');

colors.forEach(color => {
  const colorDiv = document.createElement('div');
  colorDiv.classList.add('color-option');
  colorDiv.setAttribute('tabindex', '0');
  colorDiv.setAttribute('role', 'button');
  colorDiv.setAttribute('aria-label', `Select color ${color}`);
  colorDiv.style.backgroundColor = color;
  colorDiv.dataset.color = color;
  colorPaletteContainer.appendChild(colorDiv);
});

// Keep track of currently selected color
let selectedColor = '#ff1f1f';

// Initialize first color as selected
function markSelectedColor(newColor) {
  document.querySelectorAll('.color-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.color === newColor);
  });
}

markSelectedColor(selectedColor);

// Particle generation utility
function createParticle(x, y, parent, baseColor) {
  const particle = document.createElement('div');
  particle.classList.add('particle');
  particle.style.backgroundColor = baseColor;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  const dx = (Math.random() - 0.5) * 100 + 'px';
  const dy = (Math.random() - 0.5) * 100 + 'px';
  particle.style.setProperty('--dx', dx);
  particle.style.setProperty('--dy', dy);
  parent.appendChild(particle);

  particle.addEventListener('animationend', () => {
    particle.remove();
  });
}

// Color change function with vanish + paint step by step
async function updateHighlightColors(newColor) {
  const allHighlights = [...document.querySelectorAll('.highlight')];
  if (newColor === selectedColor) return; // do nothing if same color

  const nav = document.querySelector('.nav');

  // VANISH PHASE: fade out text color and shadow in sequence with particle effect
  for (const el of allHighlights) {
    // create particles at random positions over the element
    const rect = el.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();

    for(let i = 0; i < 5; i++) {
      // particle position relative to nav container
      const x = rect.left + Math.random() * rect.width - navRect.left;
      const y = rect.top + Math.random() * rect.height - navRect.top;
      createParticle(x, y, nav, selectedColor);
    }

    // fade color out smoothly
    el.style.transition = 'color 0.5s ease, text-shadow 0.5s ease';
    el.style.color = 'transparent';
    el.style.textShadow = 'none';

    // wait for fade out
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // PAINT PHASE: apply new color gradually, one by one with delay
  for (const el of allHighlights) {
    el.style.transition = 'color 0.4s ease, text-shadow 0.4s ease';
    el.style.color = newColor;
    el.style.textShadow = `0 0 6px ${newColor}`;
    await new Promise(resolve => setTimeout(resolve, 150));
  }

  // Update social icons and button colors similarly for consistency
  document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.style.transition = 'color 0.6s ease, text-shadow 0.6s ease';
    icon.style.color = newColor;
    icon.style.textShadow = `0 0 10px ${newColor}`;
  });

  const hireBtn = document.querySelector('.hire-btn');
  hireBtn.style.transition = 'color 0.6s ease, border-color 0.6s ease, background-color 0.6s ease, box-shadow 0.6s ease, text-shadow 0.6s ease';
  if(hireBtn.matches(':hover')) {
    // if hovered, set background to new color and black text
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

  // Update thunder-svg filter and animation shadows dynamically 
  const thunderSvg = document.querySelector('.thunder-svg');
  thunderSvg.style.filter = `drop-shadow(0 0 25px ${newColor})`;
  thunderSvg.style.animation = 'none';
  setTimeout(() => {
    thunderSvg.style.animation = null;
  }, 20);
  
  // Update profile glow background gradient to new color with transparency 
  const profileGlow = document.querySelector('.profile-glow');
  profileGlow.style.background = `radial-gradient(circle, ${hexToRgba(newColor, 0.3)} 0%, transparent 70%)`;

  // Update nav logo color and shadow
  const logo = document.querySelector('.logo');
  logo.style.color = newColor;
  logo.style.textShadow = `0 0 8px ${newColor}`;

  // Update nav links hover color and shadow using CSS custom properties for smooth transitions
  document.documentElement.style.setProperty('--highlight-color', newColor);

  // Save new color as selected
  selectedColor = newColor;
  markSelectedColor(newColor);
}

// Utility: converts hex color to rgba with given alpha (0-1)
function hexToRgba(hex, alpha = 1) {
  const hexClean = hex.replace('#', '');
  const bigint = parseInt(hexClean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// Handle color option clicks + keyboard accessibility
colorPaletteContainer.addEventListener('click', event => {
  if (event.target.classList.contains('color-option')) {
    updateHighlightColors(event.target.dataset.color);
  }
});
colorPaletteContainer.addEventListener('keydown', event => {
  if (event.target.classList.contains('color-option') && (event.key === 'Enter' || event.key === ' ')) {
    event.preventDefault();
    updateHighlightColors(event.target.dataset.color);
  }
});
