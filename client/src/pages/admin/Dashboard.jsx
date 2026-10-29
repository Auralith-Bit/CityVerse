import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .adminStats(token)
      .then((data) => setStats(data.stats))
      .catch((err) => setError(err.message));
  }, [token]);

  const cards = [
    { key: 'places', label: 'Total Places', icon: 'bx bx-map-pin' },
    { key: 'published', label: 'Published', icon: 'bx bx-check-circle' },
    { key: 'featured', label: 'Featured', icon: 'bx bxs-star' },
    { key: 'categories', label: 'Categories', icon: 'bx bx-category' },
  ];

  return (
    <>
      {error && <div className="admin-error" style={{ marginBottom: 'var(--space-5)' }}>{error}</div>}

      <div className="admin-stats">
        {cards.map((card) => (
          <div className="admin-stat-card" key={card.key}>
            <i className={card.icon} />
            <div className="value">{stats ? stats[card.key] : '—'}</div>
            <div className="label">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Quick Actions</h2>
        </div>
        <div className="admin-form-actions">
          <Link to="/admin/places/new" className="admin-btn admin-btn-primary">
            <i className="bx bx-plus" /> Add New Place
          </Link>
          <Link to="/admin/places" className="admin-btn admin-btn-outline">
            <i className="bx bx-list-ul" /> Manage Places
          </Link>
          <Link to="/admin/categories" className="admin-btn admin-btn-outline">
            <i className="bx bx-category" /> Manage Categories
          </Link>
        </div>
      </div>
    </>
  );
}
