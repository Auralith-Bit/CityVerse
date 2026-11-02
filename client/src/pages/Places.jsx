import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import PlaceCard from '../components/PlaceCard';

export default function Places() {
  const [searchParams, setSearchParams] = useSearchParams();
  const city = (searchParams.get('city') || '').toLowerCase();
  const category = searchParams.get('category') || '';
  const urlSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(urlSearch);
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then((data) => setCategories(data.categories || [])).catch(() => {});
    api.getCities().then((data) => setCities(data.cities || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setSearch(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      api
        .getPlaces({ city, category, search })
        .then((data) => setPlaces(data.places || []))
        .catch(() => setPlaces([]))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timer);
  }, [city, category, search]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next, { replace: true });
  };

  const activeFilters = useMemo(() => [city, category, search].filter(Boolean).length, [
    city,
    category,
    search,
  ]);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Attractions Across Nepal</h1>
          <p>Browse famous spots, parks, markets and heritage sites across Nepal's cities.</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="filter-search">
            <input
              type="search"
              placeholder="Search cities, attractions, parks…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                updateParam('search', event.target.value);
              }}
            />
          </div>

          <div className="filter-reset-row">
            <button
              type="button"
              className={`filter-btn ${city === '' ? 'active' : ''}`}
              onClick={() => updateParam('city', '')}
            >
              All Cities
            </button>
            <button
              type="button"
              className={`filter-btn ${category === '' ? 'active' : ''}`}
              onClick={() => updateParam('category', '')}
            >
              All Categories
            </button>
          </div>

          <div className="filter-group">
            {cities.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`filter-btn ${city === item.slug ? 'active' : ''}`}
                onClick={() => updateParam('city', item.slug)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="filter-group">
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`filter-btn ${category === item.slug ? 'active' : ''}`}
                onClick={() => updateParam('category', item.slug)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', marginBottom: 'var(--space-8)' }}>
            {loading
              ? 'Loading attractions…'
              : `${places.length} attraction${places.length === 1 ? '' : 's'} found${
                  activeFilters ? ' with the selected filters' : ''
                }`}
          </p>

          <div className="places-grid">
            {loading && (
              <div className="loading-state">
                <i className="bx bx-loader-alt bx-spin" />
                Loading attractions…
              </div>
            )}

            {!loading && places.length === 0 && (
              <div className="empty-state">
                <i className="bx bx-search-alt" />
                <p>No attractions match your filters. Try a different city or category.</p>
              </div>
            )}

            {!loading && places.map((place) => <PlaceCard key={place.id} place={place} />)}
          </div>
        </div>
      </section>
    </>
  );
}
