// Wait for full page load to hide loading screen
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 500);
  }

  revealSections();
});

// Reveal sections on scroll
function revealSections() {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;
    if (top < windowHeight - 100) {
      section.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', revealSections);

// Sticky header shadow effect
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Optional: Theme switcher
const themeToggle = document.getElementById('theme-toggle');

if (themeToggle) {
  themeToggle.addEventListener('change', () => {
    const theme = themeToggle.value;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  });

  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'blue';
  themeToggle.value = savedTheme;
  document.documentElement.setAttribute('data-theme', savedTheme);
}
