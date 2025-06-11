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

// Color changing system
document.querySelectorAll('.color-option').forEach(option => {
  option.addEventListener('click', () => {
    const newColor = option.getAttribute('data-color');
    const highlightElements = document.querySelectorAll('.highlight');

    highlightElements.forEach(el => {
      el.style.transition = 'color 0.5s ease';
      el.style.color = 'transparent'; // Fade out
      setTimeout(() => {
        el.style.color = newColor; // Change to new color
      }, 500);
    });
  });
});

// Hide preloader after everything loads
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.style.opacity = "0";
    preloader.style.visibility = "hidden";
  }, 1000); // Fade out after ring completes
});
