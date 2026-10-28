/**
 * EasyTravels - Core UI Interactivity
 * Mobile navigation, preloader, sticky header, scroll reveal, forms, toasts.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Preloader dismissal
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });
    // Fallback in case load already fired or takes too long
    setTimeout(() => {
      if (preloader.style.display !== 'none') {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }
    }, 1500);
  }

  // 2. Sticky & Scrolled Header
  const header = document.getElementById('header');
  function handleScroll() {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3. Mobile Navigation Menu Toggle
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });

    // Close mobile menu on clicking any link
    navMenu.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('no-scroll');
      });
    });
  }

  // 4. Highlight Active Navigation Link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu .nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkPath = href.split('#')[0];
    if (
      linkPath === currentPath ||
      (currentPath === '' && linkPath === 'index.html') ||
      (currentPath === 'landing.html' && linkPath === 'landing.html')
    ) {
      link.classList.add('active');
    } else if (href.includes('#') && currentPath === 'index.html') {
      // Allow section anchors on homepage
    } else {
      link.classList.remove('active');
    }
  });

  // 5. Scroll Reveal Intersection Observer
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('active'));
  }

  // 6. Toast Notification Helper
  window.showToast = function (message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 12px;
        pointer-events: none;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isError = type === 'error';
    const isInfo = type === 'info';
    const iconClass = isError ? 'bx bx-error-circle' : isInfo ? 'bx bx-info-circle' : 'bx bx-check-circle';
    const borderCol = isError ? '#ef4444' : isInfo ? '#3b82f6' : '#10b981';

    toast.style.cssText = `
      min-width: 280px;
      max-width: 380px;
      padding: 14px 18px;
      background: var(--bg-card, #ffffff);
      color: var(--text-primary, #1e293b);
      border-left: 4px solid ${borderCol};
      border-radius: 8px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.9rem;
      font-weight: 500;
      opacity: 0;
      transform: translateY(12px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: auto;
    `;

    toast.innerHTML = `
      <i class="${iconClass}" style="font-size: 1.4rem; color: ${borderCol};"></i>
      <span style="flex:1;">${message}</span>
      <button style="background:none;border:none;color:var(--text-tertiary);cursor:pointer;font-size:1.1rem;padding:0;">
        <i class="bx bx-x"></i>
      </button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => toast.remove(), 300);
    });

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
      if (toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(12px)';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4500);
  };

  // 7. Contact Form Handling
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        window.showToast('Thank you! Your message has been sent to the EasyTravels team.', 'success');
      }, 800);
    });
  }

  // 8. Newsletter Form Handling
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      if (input && input.value) {
        window.showToast('Subscribed! Check your inbox for updates & exclusive deals.', 'success');
        input.value = '';
      }
    });
  }

  // 9. Quick Booking from Transport or Place Cards
  document.querySelectorAll('a[href="bookings.html"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      // If parent card has specific transport type or destination, pass via search params
      const card = link.closest('.transport-card');
      const placeCard = link.closest('.place-card');
      if (card) {
        const title = card.querySelector('h3');
        if (title) {
          const typeMap = {
            'Bike Rental': 'bike',
            'Bus Service': 'bus',
            'Car Rental': 'car',
            'E-Rickshaw': 'rickshaw'
          };
          const transportKey = typeMap[title.textContent.trim()];
          if (transportKey) {
            e.preventDefault();
            window.location.href = `bookings.html?type=${transportKey}`;
          }
        }
      } else if (placeCard) {
        const title = placeCard.querySelector('.place-card-title');
        if (title) {
          const placeText = title.textContent.trim().toLowerCase();
          let destKey = 'lumbini';
          if (placeText.includes('tiger')) destKey = 'tiger-resort';
          else if (placeText.includes('cable')) destKey = 'cable-car';
          else if (placeText.includes('siddha')) destKey = 'siddha-baba';
          else if (placeText.includes('suspension') || placeText.includes('bridge')) destKey = 'baglung-bridge';
          else if (placeText.includes('airport')) destKey = 'lumbini';

          e.preventDefault();
          window.location.href = `bookings.html?destination=${destKey}`;
        }
      }
    });
  });
});
