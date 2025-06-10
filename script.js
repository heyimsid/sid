// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const carViewer = document.querySelector('.car-viewer');
  const carButtons = document.querySelectorAll('.car-categories button');
  const carModel = document.getElementById('car-model');
  const carName = document.getElementById('car-name');
  const carSpecs = document.getElementById('car-specs');

  // Example car data
  const cars = {
    sedan: {
      name: "Sedan Model",
      src: "models/sedan.glb",
      specs: [
        "Engine: 2.0L Turbo",
        "Horsepower: 250 HP",
        "Price: $25,000"
      ]
    },
    sports: {
      name: "Sports Model",
      src: "models/sports.glb",
      specs: [
        "Engine: 3.5L V6",
        "Horsepower: 420 HP",
        "Price: $55,000"
      ]
    },
    pickup: {
      name: "Pickup Model",
      src: "models/pickup.glb",
      specs: [
        "Engine: 5.0L V8",
        "Horsepower: 320 HP",
        "Price: $40,000"
      ]
    },
    suv: {
      name: "SUV Model",
      src: "models/suv.glb",
      specs: [
        "Engine: 3.0L Turbo Diesel",
        "Horsepower: 280 HP",
        "Price: $45,000"
      ]
    }
  };

  // Scroll fade-in observer
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.2
  });

  sections.forEach(section => observer.observe(section));

  // Also observe car viewer separately for fade in
  if(carViewer) observer.observe(carViewer);

  // Car category buttons click
  carButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all buttons
      carButtons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');

      const category = button.dataset.category;
      if (cars[category]) {
        // Update 3D model src
        carModel.src = cars[category].src;
        // Update car name
        carName.textContent = cars[category].name;
        // Update specs list
        carSpecs.innerHTML = '';
        cars[category].specs.forEach(spec => {
          const li = document.createElement('li');
          li.textContent = spec;
          carSpecs.appendChild(li);
        });
      }
    });
  });

  // Parallax effect for header background on scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.body.style.backgroundPosition = `center ${scrollY * 0.5}px`;
  });
});
