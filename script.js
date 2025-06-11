// Smooth scroll
document.querySelectorAll('.nav-links li').forEach(link => {
  link.addEventListener('click', () => {
    const sectionId = link.textContent.trim().toLowerCase();
    const section = document.getElementById(sectionId);
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  });
});

// Hire button
document.querySelector('.hire-btn').addEventListener('click', () => {
  const contact = document.getElementById('contact');
  if (contact) {
    contact.scrollIntoView({ behavior: 'smooth' });
  } else {
    alert("Thanks for your interest! Let's connect.");
  }
});

// Icon ripple effect
document.querySelectorAll('.social-icons i').forEach(icon => {
  icon.addEventListener('click', () => {
    icon.style.transform = 'scale(1.4)';
    setTimeout(() => icon.style.transform = 'scale(1)', 300);
  });
});

// Preloader hide
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    preloader.style.opacity = '0';
    preloader.style.visibility = 'hidden';
  }, 1000);
});

// Theme toggle
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});
