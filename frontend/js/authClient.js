/**
 * EasyTravels - Authentication Client
 * Handles token storage, user state, and UI session sync.
 */

const AuthClient = (function () {
  const AUTH_KEY = 'auth';

  function getAuth() {
    try {
      const data = localStorage.getItem(AUTH_KEY);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading auth state', e);
      return null;
    }
  }

  function setAuth(authData) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
    updateAuthUI();
  }

  function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
    updateAuthUI();
  }

  function isAuthenticated() {
    const auth = getAuth();
    if (!auth || !auth.token) return false;
    if (auth.expiresAt && new Date(auth.expiresAt) < new Date()) {
      clearAuth();
      return false;
    }
    return true;
  }

  function getUser() {
    const auth = getAuth();
    return auth ? auth.user : null;
  }

  function getToken() {
    const auth = getAuth();
    return auth ? auth.token : null;
  }

  function updateAuthUI() {
    const authActions = document.querySelectorAll('.nav-actions');
    const user = getUser();
    const isAuthed = isAuthenticated();

    authActions.forEach((container) => {
      const loginBtn = container.querySelector('.nav-login-btn');
      const signupBtn = container.querySelector('.nav-signup-btn');
      let userMenu = container.querySelector('.nav-user-menu');

      if (isAuthed && user) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';

        if (!userMenu) {
          userMenu = document.createElement('div');
          userMenu.className = 'nav-user-menu';
          userMenu.style.display = 'flex';
          userMenu.style.alignItems = 'center';
          userMenu.style.gap = '8px';

          const initials = (user.fullname || user.email || 'U')
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);

          userMenu.innerHTML = `
            <div class="user-badge" style="display:flex;align-items:center;gap:8px;padding:4px 12px;background:var(--bg-secondary);border:1px solid var(--neutral-200);border-radius:24px;font-size:0.875rem;cursor:pointer;" title="${user.email}">
              <div style="width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--primary-600),var(--primary-400));color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.75rem;">
                ${initials}
              </div>
              <span style="font-weight:600;color:var(--text-primary);max-width:110px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                ${user.fullname ? user.fullname.split(' ')[0] : 'User'}
              </span>
              <button class="logout-btn" style="background:none;border:none;color:var(--text-tertiary);cursor:pointer;display:flex;align-items:center;font-size:1.1rem;padding:2px;" title="Log out">
                <i class="bx bx-log-out"></i>
              </button>
            </div>
          `;

          const toggleEl = container.querySelector('.nav-toggle');
          if (toggleEl) {
            container.insertBefore(userMenu, toggleEl);
          } else {
            container.appendChild(userMenu);
          }

          const logoutBtn = userMenu.querySelector('.logout-btn');
          if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
              e.preventDefault();
              e.stopPropagation();
              AuthClient.logout();
            });
          }
        } else {
          userMenu.style.display = 'flex';
        }
      } else {
        if (loginBtn) loginBtn.style.display = '';
        if (signupBtn) signupBtn.style.display = '';
        if (userMenu) userMenu.style.display = 'none';
      }
    });
  }

  function logout() {
    clearAuth();
    // Redirect if on protected page
    if (window.location.pathname.includes('bookings.html')) {
      window.location.reload();
    } else {
      updateAuthUI();
    }
  }

  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
  });

  return {
    getAuth,
    setAuth,
    clearAuth,
    isAuthenticated,
    getUser,
    getToken,
    logout,
    updateAuthUI
  };
})();

window.AuthClient = AuthClient;
