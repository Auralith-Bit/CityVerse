import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const emptyForm = { name: '', slug: '', description: '' };

export default function ManageCities() {
  const { token } = useAuth();
  const [cities, setCities] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    api
      .getCities()
      .then((data) => setCities(data.cities || []))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editingId) {
        await api.updateCity(editingId, form, token);
        window.showToast?.('City updated', 'success');
      } else {
        await api.createCity(form, token);
        window.showToast?.('City created', 'success');
      }
      reset();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (city) => {
    setEditingId(city.id);
    setForm({
      name: city.name,
      slug: city.slug,
      description: city.description || '',
    });
    setError('');
  };

  const handleDelete = async (city) => {
    if (!window.confirm(`Delete city "${city.name}"?`)) return;
    try {
      await api.deleteCity(city.id, token);
      window.showToast?.('City deleted', 'info');
      if (editingId === city.id) reset();
      load();
    } catch (err) {
      window.showToast?.(err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>{editingId ? 'Edit City' : 'Add City'}</h2>
          {editingId && (
            <button type="button" className="admin-btn admin-btn-outline" onClick={reset}>
              Cancel edit
            </button>
          )}
        </div>

        {error && <div className="admin-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="name">Name *</label>
              <input
                id="name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                placeholder="e.g. Pokhara"
                required
              />
            </div>
            <div className="admin-field">
              <label htmlFor="slug">Slug (optional)</label>
              <input
                id="slug"
                value={form.slug}
                onChange={(event) => setForm({ ...form, slug: event.target.value })}
                placeholder="auto-generated from name"
              />
            </div>
            <div className="admin-field full">
              <label htmlFor="description">Description</label>
              <input
                id="description"
                value={form.description}
                onChange={(event) => setForm({ ...form, description: event.target.value })}
                placeholder="Short description for this city"
              />
            </div>
          </div>
          <div className="admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" disabled={saving}>
              {saving ? (
                <>
                  <i className="bx bx-loader-alt bx-spin" /> Saving…
                </>
              ) : (
                <>
                  <i className="bx bx-save" /> {editingId ? 'Update City' : 'Create City'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Cities</h2>
          <span className="admin-hint">{cities.length} total</span>
        </div>

        {cities.length === 0 ? (
          <p className="admin-hint">No cities yet.</p>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Places</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cities.map((city) => (
                  <tr key={city.id}>
                    <td className="title-cell">{city.name}</td>
                    <td>/{city.slug}</td>
                    <td>{city._count?.places ?? 0}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-outline admin-btn-sm"
                          onClick={() => handleEdit(city)}
                        >
                          <i className="bx bx-edit" /> Edit
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDelete(city)}
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
    </div>
  );
}
