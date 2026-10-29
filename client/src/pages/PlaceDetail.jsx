import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, resolveImage } from '../api/client';
import PlaceCard from '../components/PlaceCard';

const cityLabel = { BUTWAL: 'Butwal', BHAIRAHWA: 'Bhairahawa' };

export default function PlaceDetail() {
  const { slug } = useParams();
  const [place, setPlace] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    setPlace(null);
    setRelated([]);
    api
      .getPlace(slug)
      .then((data) => {
        setPlace(data.place);
        setActiveImage(data.place.coverImage || data.place.images?.[0]?.url || '');
        return api.getPlaces({ city: data.place.city }).catch(() => null);
      })
      .then((data) => {
        setRelated(
          (data?.places || []).filter((item) => item.slug !== slug).slice(0, 3)
        );
      })
      .catch((err) => setError(err.message || 'Place not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!lightbox) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setLightbox(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  const gallery = useMemo(() => {
    if (!place) return [];
    const urls = [place.coverImage, ...(place.images || []).map((image) => image.url)].filter(Boolean);
    return [...new Set(urls)];
  }, [place]);

  if (loading) {
    return (
      <section className="place-detail">
        <div className="container loading-state">
          <i className="bx bx-loader-alt bx-spin" />
          Loading attraction…
        </div>
      </section>
    );
  }

  if (error || !place) {
    return (
      <section className="place-detail">
        <div className="container empty-state">
          <i className="bx bx-error-circle" />
          <p>{error || 'Place not found'}</p>
          <Link to="/places" className="btn btn-primary" style={{ marginTop: 'var(--space-5)' }}>
            Back to Attractions
          </Link>
        </div>
      </section>
    );
  }

  const highlights = Array.isArray(place.highlights) ? place.highlights : [];

  return (
    <>
      <section className="place-detail">
        <div className="container">
          <Link to="/places" className="back-link">
            <i className="bx bx-arrow-back" /> Back to attractions
          </Link>

          <div className="detail-grid">
            <div>
              <button
                type="button"
                className="detail-cover-button"
                onClick={() => setLightbox(true)}
                aria-label="Open image"
              >
                <img
                  src={resolveImage(activeImage) || '/images/places/butwal-city-center-1.jpg'}
                  alt={place.title}
                  className="detail-cover"
                />
                <span className="detail-cover-zoom">
                  <i className="bx bx-zoom-in" /> View photo
                </span>
              </button>

              {gallery.length > 1 && (
                <div className="detail-thumbs">
                  {gallery.map((url) => (
                    <button
                      key={url}
                      type="button"
                      className={`detail-thumb ${url === activeImage ? 'active' : ''}`}
                      onClick={() => setActiveImage(url)}
                    >
                      <img src={resolveImage(url)} alt={place.title} />
                    </button>
                  ))}
                </div>
              )}

              <div className="detail-badges" style={{ marginTop: 'var(--space-6)' }}>
                <span className="detail-badge">
                  <i className="bx bx-category" /> {place.category?.name}
                </span>
                <span className="detail-badge">
                  <i className="bx bx-map-pin" /> {cityLabel[place.city] || place.city}
                </span>
                <span className="detail-badge">
                  <i className="bx bxs-star" /> {Number(place.rating).toFixed(1)} rating
                </span>
                <span className="detail-badge">
                  <i className="bx bx-images" /> {gallery.length} photo{gallery.length === 1 ? '' : 's'}
                </span>
              </div>

              <h1 className="section-title" style={{ marginBottom: 'var(--space-2)' }}>
                {place.title}
              </h1>
              <p className="detail-description">{place.description}</p>

              {highlights.length > 0 && (
                <div className="detail-section">
                  <h3 className="detail-section-title">
                    <i className="bx bx-list-check" /> Highlights
                  </h3>
                  <ul className="detail-highlights">
                    {highlights.map((item) => (
                      <li key={item}>
                        <i className="bx bx-check-circle" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {place.travelTips && (
                <div className="detail-tip">
                  <i className="bx bx-bulb" />
                  <div>
                    <strong>Travel tip</strong>
                    <p>{place.travelTips}</p>
                  </div>
                </div>
              )}
            </div>

            <aside className="detail-side">
              <h3>Visitor Information</h3>
              <div className="detail-row">
                <span>City</span>
                <strong>{cityLabel[place.city] || place.city}</strong>
              </div>
              <div className="detail-row">
                <span>Category</span>
                <strong>{place.category?.name}</strong>
              </div>
              <div className="detail-row">
                <span>Distance</span>
                <strong>{Number(place.distanceKm || 0)} km</strong>
              </div>
              <div className="detail-row">
                <span>Address</span>
                <strong>{place.address || 'Rupandehi, Nepal'}</strong>
              </div>
              {place.bestTime && (
                <div className="detail-row">
                  <span>Best time</span>
                  <strong>{place.bestTime}</strong>
                </div>
              )}
              <div className="detail-row">
                <span>Rating</span>
                <strong>
                  {Number(place.rating).toFixed(1)} / 5 ({Number(place.reviewCount || 0).toLocaleString()} reviews)
                </strong>
              </div>

              {place.gettingThere && (
                <div className="detail-block">
                  <h4>
                    <i className="bx bx-car" /> Getting there
                  </h4>
                  <p>{place.gettingThere}</p>
                </div>
              )}

              <Link
                to={`/places?city=${place.city}`}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 'var(--space-5)' }}
              >
                <i className="bx bx-compass" /> More in {cityLabel[place.city] || place.city}
              </Link>
            </aside>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--bg-secondary)' }}>
          <div className="container">
            <div className="section-header reveal">
              <span className="section-subtitle">Nearby</span>
              <h2 className="section-title">More in {cityLabel[place.city] || place.city}</h2>
            </div>
            <div className="places-grid">
              {related.map((item) => (
                <PlaceCard key={item.id} place={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {lightbox && (
        <div className="detail-lightbox" onClick={() => setLightbox(false)} role="dialog" aria-modal="true">
          <button type="button" className="detail-lightbox-close" aria-label="Close">
            <i className="bx bx-x" />
          </button>
          <img
            src={resolveImage(activeImage)}
            alt={place.title}
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
