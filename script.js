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
  // Scroll to contact section or show a pop-up
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth' });
  } else {
    alert("Thanks for your interest! Let's connect.");
  }
});

// Ripple animation for social icons (optional visual touch)
document.querySelectorAll('.social-icons i').forEach(icon => {
  icon.addEventListener('click', () => {
    icon.style.transform = "scale(1.4)";
    setTimeout(() => {
      icon.style.transform = "scale(1)";
    }, 300);
  });
});

// Optional: Dark mode toggle logic (if you want a button for it later)
let isDark = true;
function toggleTheme() {
  document.body.classList.toggle('dark-mode', isDark);
  isDark = !isDark;
}

// Hide preloader after everything loads
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    preloader.style.opacity = "0";
    preloader.style.visibility = "hidden";
  }, 1000); // Fade out after ring completes
});
