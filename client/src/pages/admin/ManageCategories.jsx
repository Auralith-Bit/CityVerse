import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const emptyForm = { name: '', slug: '', description: '' };

export default function ManageCategories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    api
      .getCategories()
      .then((data) => setCategories(data.categories || []))
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
        await api.updateCategory(editingId, form, token);
        window.showToast?.('Category updated', 'success');
      } else {
        await api.createCategory(form, token);
        window.showToast?.('Category created', 'success');
      }
      reset();
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
    });
    setError('');
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete category "${category.name}"?`)) return;
    try {
      await api.deleteCategory(category.id, token);
      window.showToast?.('Category deleted', 'info');
      if (editingId === category.id) reset();
      load();
    } catch (err) {
      window.showToast?.(err.message, 'error');
    }
  };

  return (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>{editingId ? 'Edit Category' : 'Add Category'}</h2>
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
                placeholder="e.g. Recreation"
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
                placeholder="Short description for this category"
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
                  <i className="bx bx-save" /> {editingId ? 'Update Category' : 'Create Category'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="admin-panel">
        <div className="admin-panel-header">
          <h2>Categories</h2>
          <span className="admin-hint">{categories.length} total</span>
        </div>

        {categories.length === 0 ? (
          <p className="admin-hint">No categories yet.</p>
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
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="title-cell">{category.name}</td>
                    <td>/{category.slug}</td>
                    <td>{category._count?.places ?? 0}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          type="button"
                          className="admin-btn admin-btn-outline admin-btn-sm"
                          onClick={() => handleEdit(category)}
                        >
                          <i className="bx bx-edit" /> Edit
                        </button>
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => handleDelete(category)}
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
