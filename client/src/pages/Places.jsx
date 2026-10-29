import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import PlaceCard from '../components/PlaceCard';

const cities = [
  { value: '', label: 'All Cities' },
  { value: 'BUTWAL', label: 'Butwal' },
  { value: 'BHAIRAHWA', label: 'Bhairahawa' },
];

export default function Places() {
  const [searchParams, setSearchParams] = useSearchParams();
  const city = searchParams.get('city') || '';
  const category = searchParams.get('category') || '';
  const urlSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(urlSearch);
  const [places, setPlaces] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCategories().then((data) => setCategories(data.categories || [])).catch(() => {});
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
          <h1>Attractions in Butwal &amp; Bhairahawa</h1>
          <p>Browse famous spots, parks, markets and heritage sites across the two cities.</p>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="filter-search">
            <input
              type="search"
              placeholder="Search attractions, markets, parks…"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                updateParam('search', event.target.value);
              }}
            />
          </div>

          <div className="filter-group">
            {cities.map((item) => (
              <button
                key={item.value || 'all-cities'}
                type="button"
                className={`filter-btn ${city === item.value ? 'active' : ''}`}
                onClick={() => updateParam('city', item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="filter-group">
            <button
              type="button"
              className={`filter-btn ${category === '' ? 'active' : ''}`}
              onClick={() => updateParam('category', '')}
            >
              All Categories
            </button>
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
