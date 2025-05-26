// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Header Scroll Effect
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > lastScroll && currentScroll > 100) {
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }

  lastScroll = currentScroll;
});

// Gallery Slider
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
const dotsContainer = document.querySelector('.slider-dots');
let currentSlide = 0;

// Create dots
slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
  dot.addEventListener('click', () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = dotsContainer.querySelectorAll('button');
dots[0].classList.add('active');

function updateSlides() {
  slides.forEach((slide, index) => {
    slide.classList.remove('active');
    dots[index].classList.remove('active');
  });

  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  updateSlides();
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  updateSlides();
}

function goToSlide(index) {
  currentSlide = index;
  updateSlides();
}

prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Auto advance slides
setInterval(nextSlide, 5000);

// Animated Stars Background
function createStar() {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: white;
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: twinkle ${2 + Math.random() * 3}s infinite;
        opacity: ${Math.random()};
    `;
  return star;
}

const starsContainer = document.querySelector('.stars');
for (let i = 0; i < 100; i++) {
  starsContainer.appendChild(createStar());
}

// Newsletter Form
const newsletterForm = document.getElementById('newsletter-form');
const formMessage = document.querySelector('.form-message');

newsletterForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = e.target.querySelector('input').value;

  // Simulate form submission
  formMessage.textContent = "Thanks for subscribing! We'll keep you updated.";
  formMessage.style.color = '#10b981'; // Success color
  e.target.reset();
});
