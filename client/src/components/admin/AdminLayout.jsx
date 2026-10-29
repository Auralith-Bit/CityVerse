import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: 'bx bxs-dashboard', end: true },
  { to: '/admin/places', label: 'Places', icon: 'bx bx-map-pin', end: true },
  { to: '/admin/categories', label: 'Categories', icon: 'bx bx-category' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          <i className="bx bx-globe" />
          <span>
            CityVerse<small>Admin</small>
          </span>
        </Link>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <i className={item.icon} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-link-muted">
            <i className="bx bx-arrow-back" /> View site
          </Link>
          <button type="button" onClick={handleLogout} className="admin-logout">
            <i className="bx bx-log-out" /> Log out
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <h1>Content Manager</h1>
            <p>Signed in as {user?.name}</p>
          </div>
          <span className="admin-role-badge">{user?.role}</span>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
