/**
 * EasyTravels - Testimonials Carousel
 * Responsive slider with touch/drag, auto-advance, navigation buttons, and indicator dots.
 */

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.testimonials-wrapper');
  const track = document.getElementById('testimonialsTrack');
  if (!wrapper || !track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  if (cards.length === 0) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  // Determine cards visible per view based on viewport width
  function getVisibleCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    const visible = getVisibleCount();
    return Math.max(0, cards.length - visible);
  }

  // Update card widths dynamically for responsive cleanliness
  function updateCardDimensions() {
    const visible = getVisibleCount();
    const margin = 12; // 12px each side = 24px total gap
    cards.forEach((card) => {
      card.style.flex = `0 0 calc(${100 / visible}% - ${margin * 2}px)`;
      card.style.margin = `0 ${margin}px`;
    });
    updatePosition();
    updateDots();
  }

  // Create Controls if not present
  let navContainer = wrapper.parentElement.querySelector('.testimonials-nav');
  if (!navContainer) {
    navContainer = document.createElement('div');
    navContainer.className = 'testimonials-nav';
    navContainer.innerHTML = `
      <button id="testiPrev" aria-label="Previous testimonial"><i class="bx bx-chevron-left"></i></button>
      <button id="testiNext" aria-label="Next testimonial"><i class="bx bx-chevron-right"></i></button>
    `;
    wrapper.after(navContainer);
  }

  let dotsContainer = wrapper.parentElement.querySelector('.testimonials-dots');
  if (!dotsContainer) {
    dotsContainer = document.createElement('div');
    dotsContainer.className = 'testimonials-dots';
    navContainer.after(dotsContainer);
  }

  function createDots() {
    dotsContainer.innerHTML = '';
    const max = getMaxIndex();
    for (let i = 0; i <= max; i++) {
      const dot = document.createElement('div');
      dot.className = `dot ${i === currentIndex ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        currentIndex = i;
        updatePosition();
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function updatePosition() {
    const visible = getVisibleCount();
    const cardWidthPercentage = 100 / visible;
    track.style.transform = `translateX(-${currentIndex * cardWidthPercentage}%)`;
    updateDots();
  }

  function nextSlide() {
    const max = getMaxIndex();
    if (currentIndex >= max) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
    updatePosition();
  }

  function prevSlide() {
    const max = getMaxIndex();
    if (currentIndex <= 0) {
      currentIndex = max;
    } else {
      currentIndex--;
    }
    updatePosition();
  }

  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoplay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoplay();
    });
  }

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  wrapper.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  wrapper.addEventListener('mouseleave', () => startAutoplay());

  window.addEventListener('resize', () => {
    if (currentIndex > getMaxIndex()) {
      currentIndex = getMaxIndex();
    }
    updateCardDimensions();
    createDots();
  });

  updateCardDimensions();
  createDots();
  startAutoplay();
});
