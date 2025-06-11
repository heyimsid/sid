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

// Color picker for highlight color

const colorPickerInput = document.querySelector('.color-picker');
const nav = document.querySelector('.nav');
let selectedColor = colorPickerInput.value || '#ff1f1f';

// Set initial colors dynamically to match initial selectedColor
function initializeColors(color) {
  // Highlights
  const highlights = document.querySelectorAll('.highlight');
  highlights.forEach(el => {
    el.style.color = color;
    el.style.textShadow = `0 0 6px ${color}`;
  });

  // Social icons
  document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.style.color = color;
    icon.style.textShadow = `0 0 10px ${color}`;
  });

  // Hire button
  const hireBtn = document.querySelector('.hire-btn');
  hireBtn.style.color = color;
  hireBtn.style.borderColor = color;
  hireBtn.style.textShadow = `0 0 6px ${color}`;
  hireBtn.style.background = 'transparent';
  hireBtn.style.boxShadow = 'none';

  // Thunderbolt glow
  updateThunderAndGlow(color);

  // Update nav logo color and shadow
  const logo = document.querySelector('.logo');
  logo.style.color = color;
  logo.style.textShadow = `0 0 8px ${color}`;

  // Update profile glow
  const profileGlow = document.querySelector('.profile-glow');
  profileGlow.style.background = `radial-gradient(circle, ${hexToRgba(color, 0.3)} 0%, transparent 70%)`;
}

// Utility - hex to rgba with alpha
function hexToRgba(hex, alpha = 1) {
  const hexClean = hex.replace('#', '');
  const bigint = parseInt(hexClean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

// Update thunderbolt and ring colors dynamically
function updateThunderAndGlow(color) {
  const thunderSvg = document.querySelector('.thunder-svg');
  thunderSvg.style.filter = `drop-shadow(0 0 25px ${color})`;
  thunderSvg.style.animation = 'none';
  setTimeout(() => {
    thunderSvg.style.animation = null;
  }, 20);

  // Update progress ring stroke to match color
  const progressCircle = document.querySelector('.progress-ring .progress');
  if(progressCircle){
    progressCircle.style.stroke = color;
    progressCircle.style.filter = `drop-shadow(0 0 6px ${color})`;
  }
}

let animationLock = false;

async function updateHighlightColors(newColor) {
  if(animationLock) return; // prevent overlapping animations
  if(newColor === selectedColor) return;
  animationLock = true;

  const allHighlights = [...document.querySelectorAll('.highlight')];

  // VANISH PHASE: fade out all highlights and create particles
  for(const el of allHighlights) {
    const rect = el.getBoundingClientRect();
    const navRect = nav.getBoundingClientRect();
    // create multiple particles per element
    for(let i=0; i<5; i++){
      const x = rect.left + Math.random()*rect.width - navRect.left;
      const y = rect.top + Math.random()*rect.height - navRect.top;
      createParticle(x, y, nav, selectedColor);
    }
    el.style.transition = 'color 0.5s ease, text-shadow 0.5s ease';
    el.style.color = 'transparent';
    el.style.textShadow = 'none';
    await sleep(100); // small delay to stagger fade start
  }

  // wait for vanish fade duration
  await sleep(600);

  // PAINT PHASE: apply new color one by one with delay
  for(const el of allHighlights){
    el.style.transition = 'color 0.4s ease, text-shadow 0.4s ease';
    el.style.color = newColor;
    el.style.textShadow = `0 0 6px ${newColor}`;
    await sleep(150);
  }

  // Update social icons
  document.querySelectorAll('.social-icons i').forEach(icon => {
    icon.style.transition = 'color 0.6s ease, text-shadow 0.6s ease';
    icon.style.color = newColor;
    icon.style.textShadow = `0 0 10px ${newColor}`;
  });

  // Update hire button
  const hireBtn = document.querySelector('.hire-btn');
  hireBtn.style.transition = 'color 0.6s ease, border-color 0.6s ease, background-color 0.6s ease, box-shadow 0.6s ease, text-shadow 0.6s ease';

  if(hireBtn.matches(':hover')){
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

  // Update thunderbolt and progress ring colors
  updateThunderAndGlow(newColor);

  // Update profile glow
  const profileGlow = document.querySelector('.profile-glow');
  profileGlow.style.background = `radial-gradient(circle, ${hexToRgba(newColor, 0.3)} 0%, transparent 70%)`;

  // Update nav logo color and shadow
  const logo = document.querySelector('.logo');
  logo.style.color = newColor;
  logo.style.textShadow = `0 0 8px ${newColor}`;

  // Save new color
  selectedColor = newColor;
  updateColorPickerValue(newColor);

  animationLock = false;
}

// Update color picker input value visually
function updateColorPickerValue(color){
  if(colorPickerInput.value.toLowerCase()!==color.toLowerCase()){
    colorPickerInput.value = color;
  }
}

// Particle helper
function createParticle(x, y, parent, baseColor){
  const particle = document.createElement('div');
  particle.classList.add('particle');
  particle.style.backgroundColor = baseColor;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;

  // Random direction and distance for animation
  const dx = (Math.random() - 0.5) * 100 + 'px';
  const dy = (Math.random() - 0.5) * 100 + 'px';

  particle.style.setProperty('--dx', dx);
  particle.style.setProperty('--dy', dy);

  parent.appendChild(particle);

  particle.addEventListener('animationend', () => {
    particle.remove();
  });
}

// Sleep helper
function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Listen to color picker changes
colorPickerInput.addEventListener('input', e => {
  const color = e.target.value;
  updateHighlightColors(color);
});

// Initialize colors on page load
window.addEventListener('DOMContentLoaded', () => {
  initializeColors(selectedColor);
});
