import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, resolveImage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const cityLabel = { BUTWAL: 'Butwal', BHAIRAHWA: 'Bhairahawa' };

export default function ManagePlaces() {
  const { token } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);
    api
      .adminPlaces(token)
      .then((data) => setPlaces(data.places || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleDelete = async (place) => {
    if (!window.confirm(`Delete "${place.title}"? This cannot be undone.`)) return;
    try {
      await api.deletePlace(place.id, token);
      setPlaces((current) => current.filter((item) => item.id !== place.id));
      window.showToast?.('Place deleted', 'info');
    } catch (err) {
      window.showToast?.(err.message, 'error');
    }
  };

  const filtered = places.filter((place) =>
    `${place.title} ${place.category?.name || ''} ${cityLabel[place.city] || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>Places</h2>
        <div className="admin-form-actions">
          <input
            type="search"
            placeholder="Search places…"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{
              padding: '0.55rem 0.9rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--neutral-300)',
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
            }}
          />
          <Link to="/admin/places/new" className="admin-btn admin-btn-primary">
            <i className="bx bx-plus" /> Add Place
          </Link>
        </div>
      </div>

      {error && <div className="admin-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

      {loading ? (
        <p className="admin-hint">Loading places…</p>
      ) : filtered.length === 0 ? (
        <p className="admin-hint">No places found.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>City</th>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((place) => (
                <tr key={place.id}>
                  <td>
                    <img
                      className="thumb"
                      src={resolveImage(place.coverImage) || '/images/places/butwal-city-center-1.jpg'}
                      alt={place.title}
                    />
                  </td>
                  <td>
                    <div className="title-cell">{place.title}</div>
                    <span className="admin-hint">/{place.slug}</span>
                  </td>
                  <td>{cityLabel[place.city] || place.city}</td>
                  <td>{place.category?.name}</td>
                  <td>
                    <span className={`admin-pill ${place.isPublished ? 'green' : 'gray'}`}>
                      {place.isPublished ? 'Published' : 'Draft'}
                    </span>{' '}
                    {place.isFeatured && <span className="admin-pill gold">Featured</span>}
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link
                        to={`/places/${place.slug}`}
                        className="admin-btn admin-btn-outline admin-btn-sm"
                        target="_blank"
                        rel="noreferrer"
                      >
                        <i className="bx bx-show" />
                      </Link>
                      <Link
                        to={`/admin/places/${place.id}/edit`}
                        className="admin-btn admin-btn-outline admin-btn-sm"
                      >
                        <i className="bx bx-edit" /> Edit
                      </Link>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDelete(place)}
                      >
                        <i className="bx bx-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
