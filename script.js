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

// Preloader show immediately on script load
const preloader = document.getElementById("preloader");
if(preloader){
  preloader.style.opacity = "1";
  preloader.style.visibility = "visible";
  preloader.setAttribute('aria-busy', 'true');
}

// Preloader hide with fade after content load
window.addEventListener("load", () => {
  if(!preloader) return;
  // For debugging:
  console.log("Page fully loaded, starting preloader fade out.");
  setTimeout(() => {
    preloader.style.transition = "opacity 0.6s ease, visibility 0.6s ease";
    preloader.style.opacity = "0";
    preloader.style.visibility = "hidden";
    preloader.setAttribute('aria-busy', 'false');
    console.log("Preloader hidden");
  }, 1200); // Delay 1.2s to ensure visible during loading
});

// Color picker and color changing related code unchanged here...
// (Rest of code from previous script.js implementation)

