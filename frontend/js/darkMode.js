/**
 * EasyTravels - Dark Mode Handler
 * Persists theme preference in localStorage and handles smooth switching.
 */

(function () {
  const THEME_KEY = 'easytravels_theme';
  const html = document.documentElement;

  // Initialize theme from storage or system preference
  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    updateToggleIcons(theme);
  }

  function updateToggleIcons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle, #themeToggle');
    toggleBtns.forEach((btn) => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bx bx-sun';
        } else {
          icon.className = 'bx bx-moon';
        }
      }
    });
  }

  // Apply on initial load
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  // Bind to buttons once DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    updateToggleIcons(html.getAttribute('data-theme') || currentTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle, #themeToggle');
    toggleBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const activeTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(activeTheme);
      });
    });
  });

  // Expose toggle globally if needed
  window.toggleTheme = function () {
    const activeTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(activeTheme);
  };
})();
