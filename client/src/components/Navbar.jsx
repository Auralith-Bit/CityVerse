import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/places', label: 'Attractions' },
  { to: '/nightlife', label: 'Nightlife' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { isAdmin, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`} id="header">
      <nav className="nav">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">
            <i className="bx bx-globe" />
          </div>
          <span>CityVerse</span>
        </Link>

        <div className={`nav-menu ${open ? 'active' : ''}`} id="navMenu">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            <i className={theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon'} />
          </button>

          {isAdmin ? (
            <>
              <Link to="/admin" className="nav-auth-btn nav-login-btn">
                {user?.name ? user.name.split(' ')[0] : 'Admin'}
              </Link>
              <button className="nav-auth-btn nav-signup-btn" onClick={logout}>
                Log Out
              </button>
            </>
          ) : (
            <Link to="/admin/login" className="nav-auth-btn nav-login-btn">
              Admin
            </Link>
          )}

          <div className={`nav-toggle ${open ? 'active' : ''}`} onClick={() => setOpen((v) => !v)}>
            <span />
            <span />
            <span />
          </div>
        </div>
      </nav>
    </header>
  );
}
