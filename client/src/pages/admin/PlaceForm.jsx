import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, resolveImage } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  highlights: '',
  bestTime: '',
  gettingThere: '',
  travelTips: '',
  city: 'BUTWAL',
  address: '',
  distanceKm: 0,
  rating: 4.5,
  reviewCount: 0,
  coverImage: '',
  images: [],
  isFeatured: false,
  isPublished: true,
  categoryId: '',
};

export default function PlaceForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { token } = useAuth();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .getCategories()
      .then((data) => {
        const list = data.categories || [];
        setCategories(list);
        setForm((current) =>
          current.categoryId || list.length === 0
            ? current
            : { ...current, categoryId: String(list[0].id) }
        );
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    setLoading(true);
    api
      .adminPlace(id, token)
      .then(({ place }) => {
        setForm({
          title: place.title,
          slug: place.slug,
          description: place.description,
          highlights: Array.isArray(place.highlights) ? place.highlights.join('\n') : '',
          bestTime: place.bestTime || '',
          gettingThere: place.gettingThere || '',
          travelTips: place.travelTips || '',
          city: place.city,
          address: place.address || '',
          distanceKm: place.distanceKm ?? 0,
          rating: place.rating ?? 4.5,
          reviewCount: place.reviewCount ?? 0,
          coverImage: place.coverImage || '',
          images: (place.images || []).map((image) => image.url),
          isFeatured: place.isFeatured,
          isPublished: place.isPublished,
          categoryId: String(place.categoryId),
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit, token]);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const [galleryUrl, setGalleryUrl] = useState('');

  const handleUpload = async (event, target = 'cover') => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const data = await api.uploadImage(file, token);
      if (target === 'cover') {
        update('coverImage', data.url);
      } else {
        setForm((current) => ({ ...current, images: [...current.images, data.url] }));
      }
      window.showToast?.('Image uploaded', 'success');
    } catch (err) {
      window.showToast?.(err.message, 'error');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const addGalleryUrl = () => {
    const url = galleryUrl.trim();
    if (!url) return;
    setForm((current) =>
      current.images.includes(url) ? current : { ...current, images: [...current.images, url] }
    );
    setGalleryUrl('');
  };

  const removeGalleryImage = (url) => {
    setForm((current) => ({ ...current, images: current.images.filter((item) => item !== url) }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        ...form,
        highlights: form.highlights
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
        bestTime: form.bestTime || null,
        gettingThere: form.gettingThere || null,
        travelTips: form.travelTips || null,
        categoryId: Number(form.categoryId),
        distanceKm: Number(form.distanceKm) || 0,
        rating: Number(form.rating) || 0,
        reviewCount: Number(form.reviewCount) || 0,
        slug: form.slug || undefined,
        address: form.address || null,
        coverImage: form.coverImage || null,
      };

      if (isEdit) {
        await api.updatePlace(id, payload, token);
        window.showToast?.('Place updated', 'success');
      } else {
        await api.createPlace(payload, token);
        window.showToast?.('Place created', 'success');
      }
      navigate('/admin/places');
    } catch (err) {
      setError(err.errors?.length ? err.errors.map((e) => `${e.path}: ${e.message}`).join(', ') : err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="admin-hint">Loading place…</p>;
  }

  return (
    <div className="admin-panel">
      <div className="admin-panel-header">
        <h2>{isEdit ? 'Edit Place' : 'Add New Place'}</h2>
        <Link to="/admin/places" className="admin-btn admin-btn-outline">
          <i className="bx bx-arrow-back" /> Back
        </Link>
      </div>

      {error && <div className="admin-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              value={form.title}
              onChange={(event) => update('title', event.target.value)}
              placeholder="e.g. Manimukunda Park"
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="slug">Slug (optional)</label>
            <input
              id="slug"
              value={form.slug}
              onChange={(event) => update('slug', event.target.value)}
              placeholder="auto-generated from title"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="city">City *</label>
            <select id="city" value={form.city} onChange={(event) => update('city', event.target.value)}>
              <option value="BUTWAL">Butwal</option>
              <option value="BHAIRAHWA">Bhairahawa</option>
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="categoryId">Category *</label>
            <select
              id="categoryId"
              value={form.categoryId}
              onChange={(event) => update('categoryId', event.target.value)}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              value={form.address}
              onChange={(event) => update('address', event.target.value)}
              placeholder="e.g. Butwal-11, Rupandehi"
            />
          </div>

          <div className="admin-field">
            <label htmlFor="distanceKm">Distance (km)</label>
            <input
              id="distanceKm"
              type="number"
              step="0.1"
              min="0"
              value={form.distanceKm}
              onChange={(event) => update('distanceKm', event.target.value)}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="rating">Rating (0–5)</label>
            <input
              id="rating"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={form.rating}
              onChange={(event) => update('rating', event.target.value)}
            />
          </div>

          <div className="admin-field">
            <label htmlFor="reviewCount">Review Count</label>
            <input
              id="reviewCount"
              type="number"
              min="0"
              value={form.reviewCount}
              onChange={(event) => update('reviewCount', event.target.value)}
            />
          </div>

          <div className="admin-field full">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={form.description}
              onChange={(event) => update('description', event.target.value)}
              placeholder="Describe the attraction…"
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="bestTime">Best Time to Visit</label>
            <input
              id="bestTime"
              value={form.bestTime}
              onChange={(event) => update('bestTime', event.target.value)}
              placeholder="e.g. October to March"
            />
          </div>

          <div className="admin-field full">
            <label htmlFor="highlights">Highlights (one per line)</label>
            <textarea
              id="highlights"
              value={form.highlights}
              onChange={(event) => update('highlights', event.target.value)}
              placeholder={'Panoramic city views\nSunset viewpoints\nWalking trails'}
            />
          </div>

          <div className="admin-field full">
            <label htmlFor="gettingThere">Getting There</label>
            <textarea
              id="gettingThere"
              value={form.gettingThere}
              onChange={(event) => update('gettingThere', event.target.value)}
              placeholder="How visitors can reach this attraction…"
            />
          </div>

          <div className="admin-field full">
            <label htmlFor="travelTips">Travel Tips</label>
            <textarea
              id="travelTips"
              value={form.travelTips}
              onChange={(event) => update('travelTips', event.target.value)}
              placeholder="Practical advice for visitors…"
            />
          </div>

          <div className="admin-field full">
            <label htmlFor="coverImage">Cover Image</label>
            <input
              id="coverImage"
              value={form.coverImage}
              onChange={(event) => update('coverImage', event.target.value)}
              placeholder="/images/places/butwal-city-center-1.jpg or upload below"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleUpload(event, 'cover')}
              disabled={uploading}
            />
            <span className="admin-hint">
              {uploading ? 'Uploading…' : 'Upload an image (max 5 MB) or paste an image path.'}
            </span>
            {(form.coverImage || form.slug) && (
              <img
                className="admin-image-preview"
                src={resolveImage(form.coverImage) || '/images/places/butwal-city-center-1.jpg'}
                alt="Cover preview"
              />
            )}
          </div>

          <div className="admin-field full">
            <label>Gallery Images</label>
            {form.images.length > 0 && (
              <div className="admin-gallery-list">
                {form.images.map((url) => (
                  <div className="admin-gallery-item" key={url}>
                    <img src={resolveImage(url)} alt="Gallery" />
                    <button
                      type="button"
                      className="admin-gallery-remove"
                      onClick={() => removeGalleryImage(url)}
                      aria-label="Remove image"
                    >
                      <i className="bx bx-x" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="admin-inline-row">
              <input
                value={galleryUrl}
                onChange={(event) => setGalleryUrl(event.target.value)}
                placeholder="/images/places/… or https://…"
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addGalleryUrl();
                  }
                }}
              />
              <button type="button" className="admin-btn admin-btn-outline" onClick={addGalleryUrl}>
                <i className="bx bx-plus" /> Add
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleUpload(event, 'gallery')}
              disabled={uploading}
            />
            <span className="admin-hint">
              Add multiple photos. The first gallery photo is used when no cover image is set.
            </span>
          </div>

          <div className="admin-field full">
            <div className="admin-check-row">
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(event) => update('isPublished', event.target.checked)}
                />
                Published
              </label>
              <label className="admin-check">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(event) => update('isFeatured', event.target.checked)}
                />
                Featured on homepage
              </label>
            </div>
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
                <i className="bx bx-save" /> {isEdit ? 'Update Place' : 'Create Place'}
              </>
            )}
          </button>
          <Link to="/admin/places" className="admin-btn admin-btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
