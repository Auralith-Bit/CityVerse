/**
 * EasyTravels - Places & Attractions Filter & Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.places-filter .filter-btn');
  const placeCards = document.querySelectorAll('.places-grid .place-card');

  if (filterBtns.length === 0 || placeCards.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      placeCards.forEach((card) => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.98)';
          card.style.transition = 'all 0.35s ease';

          requestAnimationFrame(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.98)';
          card.style.transition = 'all 0.25s ease';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // Add interactive favorite heart icon on each place card
  placeCards.forEach((card) => {
    const imgWrapper = card.querySelector('.place-card-image');
    if (imgWrapper && !card.querySelector('.place-fav-btn')) {
      const favBtn = document.createElement('button');
      favBtn.className = 'place-fav-btn';
      favBtn.setAttribute('aria-label', 'Save to favorites');
      favBtn.style.cssText = `
        position: absolute;
        top: 14px;
        right: 14px;
        z-index: 5;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.25);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all 0.2s ease;
      `;
      favBtn.innerHTML = '<i class="bx bx-heart"></i>';

      favBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const icon = favBtn.querySelector('i');
        const isFav = icon.classList.contains('bxs-heart');

        if (isFav) {
          icon.className = 'bx bx-heart';
          favBtn.style.color = 'white';
          favBtn.style.background = 'rgba(0, 0, 0, 0.4)';
          if (window.showToast) window.showToast('Removed from saved places', 'info');
        } else {
          icon.className = 'bx bxs-heart';
          favBtn.style.color = '#ef4444';
          favBtn.style.background = 'rgba(255, 255, 255, 0.95)';
          favBtn.style.transform = 'scale(1.15)';
          setTimeout(() => (favBtn.style.transform = 'scale(1)'), 200);
          if (window.showToast) window.showToast('Added to your favorite places! ❤️', 'success');
        }
      });

      imgWrapper.appendChild(favBtn);
    }
  });
});
