import { useEffect, useState, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import PlaceCard from '../components/PlaceCard';

const nepalCities = [
  'Kathmandu', 'Pokhara', 'Lalitpur', 'Bharatpur', 'Biratnagar',
  'Birgunj', 'Dharan', 'Butwal', 'Bhairahawa', 'Hetauda',
  'Janakpur', 'Itahari', 'Dhangadhi', 'Nepalgunj', 'Tulsipur',
  'Damak', 'Ghorahi', 'Lumbini', 'Tansen', 'Palpa',
  'Ilam', 'Dhulikhel', 'Bandipur', 'Nagarkot', 'Chitwan',
  'Bhaktapur', 'Kirtipur', 'Gorkha', 'Namche Bazaar', 'Lukla',
  'Beni', 'Baglung', 'Syangja', 'Kapilvastu', 'Dang',
  'Jumla', 'Dipayal', 'Mahendranagar', 'Rajbiraj', 'Lahan',
  'Siraha', 'Gaur', 'Kalaiya', 'Tribhuwan Nagar', 'Surkhet',
  'Dailekh', 'Jomsom', 'Manang', 'Mustang', 'Taplejung',
];

const testimonials = [
  {
    name: 'Sarah Kim',
    location: 'Seoul, South Korea',
    initials: 'SK',
    text: 'CityVerse made exploring Nepal so straightforward. We found reliable details on destinations across the country.',
  },
  {
    name: 'Mark Johnson',
    location: 'London, UK',
    initials: 'MJ',
    text: 'From Butwal to Pokhara, CityVerse helped us plan our route and city visits with total confidence.',
  },
  {
    name: 'Amara Patel',
    location: 'Bangkok, Thailand',
    initials: 'AP',
    text: 'A clean and practical resource for discovering attractions, transport options, and local spots in Nepal.',
  },
  {
    name: 'Rachel Lee',
    location: 'Sydney, Australia',
    initials: 'RL',
    text: 'Great practical information on city culture, points of interest, and regional travel tips.',
  },
  {
    name: 'David Mueller',
    location: 'Berlin, Germany',
    initials: 'DM',
    text: 'Clear destination details and accurate info. Made city hopping in Nepal hassle-free.',
  },
  {
    name: 'Yuki Tanaka',
    location: 'Tokyo, Japan',
    initials: 'YT',
    text: 'Warm hospitality and beautiful places. CityVerse gave us great guidance on each city we visited.',
  },
];

const features = [
  { icon: 'bx bx-map-pin', title: 'Curated Attractions', text: 'Verified spots and points of interest across Nepal.' },
  { icon: 'bx bx-compass', title: 'Local Insights', text: 'Practical guidance on timing, transit, and culture.' },
  { icon: 'bx bx-check-shield', title: 'Reliable Details', text: 'Accurate, up-to-date travel information.' },
  { icon: 'bx bx-book-open', title: 'Free & Accessible', text: 'Open destination guides for every traveler.' },
];

const transport = [
  { icon: 'bx bx-cycling', title: 'Bicycle & Scooter', text: 'Ideal for local neighborhood exploring and daily commute.', price: 'NPR 500' },
  { icon: 'bx bx-bus', title: 'Local & Express Bus', text: 'Budget-friendly travel connecting major city hubs and stops.', price: 'NPR 100' },
  { icon: 'bx bx-car', title: 'Car & Taxi Hire', text: 'Comfortable private transport suitable for day trips and family.', price: 'NPR 3,000' },
  { icon: 'bx bx-trip', title: 'Local Rickshaw', text: 'Convenient zero-hassle rides for short trips within town.', price: 'NPR 150' },
];

function CitySearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return nepalCities.filter((c) => c.toLowerCase().includes(q)).slice(0, 6);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (city) => {
    setQuery(city);
    setOpen(false);
    navigate(`/places?search=${encodeURIComponent(city)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      navigate(`/places?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form className="hero-search" ref={ref} onSubmit={handleSubmit} autoComplete="off">
      <div className="hero-search-input-wrapper">
        <i className="bx bx-search hero-search-icon" />
        <input
          type="text"
          placeholder="Search cities (e.g. Kathmandu, Butwal, Pokhara)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
        />
        <button type="submit" className="hero-search-btn">
          Search
        </button>
      </div>
      {open && filtered.length > 0 && (
        <ul className="hero-search-dropdown">
          {filtered.map((city) => (
            <li key={city}>
              <button type="button" onClick={() => handleSelect(city)}>
                <i className="bx bx-map-pin" />
                <span>{city}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .getPlaces({ featured: 'true' })
      .then((data) => setPlaces((data.places || []).slice(0, 6)))
      .catch(() => setPlaces([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero" id="hero">
        <img src="/images/hero-lumbini.jpg" alt="Nepal landscape" className="hero-bg" />
        <div className="hero-overlay" />

        <div className="container hero-container">
          <div className="hero-content">
            <div className="hero-tag">
              <i className="bx bx-map" />
              Nepal Travel & City Guide
            </div>

            <h1 className="hero-title">
              Explore <span className="highlight">Nepal</span>,
              <br />
              City by City
            </h1>

            <p className="hero-description">
              Find iconic landmarks, quiet heritage sites, local transport, and city highlights
              all in one reliable place.
            </p>

            <CitySearch />

            <div className="hero-cta">
              <Link to="/places" className="btn btn-primary btn-lg">
                <i className="bx bx-compass" />
                Browse Attractions
              </Link>
              <Link to="/about" className="btn btn-outline-white btn-lg">
                About CityVerse
              </Link>
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">50+</div>
              <div className="hero-stat-label">Cities Covered</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">100+</div>
              <div className="hero-stat-label">Attractions</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">5K+</div>
              <div className="hero-stat-label">Travelers Guided</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper reveal-left">
              <img src="/images/places/manimukunda-park-1.jpg" alt="Manimukunda Park, Nepal" className="about-image" />
              <div className="about-image-accent" />
              <div className="about-image-badge">
                <i className="bx bx-compass" />
                <div className="about-image-badge-text">
                  <strong>Nepal-Wide</strong>
                  <span>City Guide Portal</span>
                </div>
              </div>
            </div>

            <div className="about-content reveal-right">
              <span className="section-subtitle">About CityVerse</span>
              <h2 className="section-title">Your Companion for Exploring Nepal</h2>
              <p className="about-text">
                CityVerse brings together the diverse urban centers, scenic foothills, and cultural capitals
                of Nepal. Whether you are navigating regional commercial centers or historic pilgrimage spots,
                we curate accurate details on destinations, local transit, and top things to do.
              </p>

              <div className="about-features">
                {features.map((feature) => (
                  <div className="about-feature" key={feature.title}>
                    <div className="about-feature-icon">
                      <i className={feature.icon} />
                    </div>
                    <div>
                      <h4>{feature.title}</h4>
                      <p>{feature.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/places" className="btn btn-primary">
                Explore Directory <i className="bx bx-right-arrow-alt" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="cities">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Featured Destinations</span>
            <h2 className="section-title">Spotlight Cities</h2>
            <p className="section-description">
              Explore in-depth guides for our highlighted cities, featuring landmarks, heritage spots, and local transit.
            </p>
          </div>

          <div className="city-spotlight-grid">
            <article className="city-spotlight-card reveal">
              <img src="/images/places/butwal-hill-park-1.jpg" alt="Butwal" />
              <div className="city-spotlight-overlay" />
              <div className="city-spotlight-content">
                <span className="city-spotlight-tag">Lumbini Province · Hills & River</span>
                <h3>Butwal</h3>
                <p>
                  A major commercial crossroads nestled at the base of Chure hills, bordered by the Tinau river
                  with historic parks and scenic valley viewpoints.
                </p>
                <ul className="city-spotlight-list">
                  <li><i className="bx bx-check" /> Butwal Hill Park</li>
                  <li><i className="bx bx-check" /> Manimukunda Park</li>
                  <li><i className="bx bx-check" /> Siddha Baba Temple</li>
                  <li><i className="bx bx-check" /> Devdaha Ancient Sites</li>
                </ul>
                <Link to="/places?city=BUTWAL" className="btn btn-white">
                  Explore Butwal <i className="bx bx-right-arrow-alt" />
                </Link>
              </div>
            </article>

            <article className="city-spotlight-card reveal">
              <img src="/images/places/bhairahawa-1.jpg" alt="Bhairahawa" />
              <div className="city-spotlight-overlay" />
              <div className="city-spotlight-content">
                <span className="city-spotlight-tag">Lumbini Province · Southern Gateway</span>
                <h3>Bhairahawa</h3>
                <p>
                  The bustling southern aviation and trading center (Siddharthanagar), connecting international visitors
                  to Lumbini and surrounding Terai heritage trails.
                </p>
                <ul className="city-spotlight-list">
                  <li><i className="bx bx-check" /> Gautam Buddha Int’l Airport</li>
                  <li><i className="bx bx-check" /> Ramgram Ancient Relic Stupa</li>
                  <li><i className="bx bx-check" /> Sunauli Regional Gateway</li>
                  <li><i className="bx bx-check" /> Bhairahawa Bazaars & Markets</li>
                </ul>
                <Link to="/places?city=BHAIRAHWA" className="btn btn-white">
                  Explore Bhairahawa <i className="bx bx-right-arrow-alt" />
                </Link>
              </div>
            </article>
          </div>

          <div className="cities-directory-banner reveal">
            <div className="cities-directory-content">
              <i className="bx bx-map-alt" />
              <div>
                <strong>Looking for other cities?</strong>
                <p>Search Kathmandu, Pokhara, Chitwan, Dharan, Janakpur and more using the search bar above or directory filters.</p>
              </div>
            </div>
            <Link to="/places" className="btn btn-outline">
              View All Destinations
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="places" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Directory</span>
            <h2 className="section-title">Popular Attractions</h2>
            <p className="section-description">
              Browse top-rated parks, cultural monuments, and viewpoints across Nepal.
            </p>
          </div>

          <div className="places-grid">
            {loading && (
              <div className="loading-state">
                <i className="bx bx-loader-alt bx-spin" />
                Loading attractions…
              </div>
            )}
            {!loading && places.length === 0 && (
              <div className="empty-state">
                <i className="bx bx-map" />
                <p>No attractions published yet.</p>
              </div>
            )}
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
            <Link to="/places" className="btn btn-primary">
              <i className="bx bx-grid-alt" /> View All Attractions
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="transport">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Local Transit</span>
            <h2 className="section-title">Transportation Guide</h2>
            <p className="section-description">
              Common transit options available in major cities across Nepal to help you plan your itinerary.
            </p>
          </div>

          <div className="transport-grid">
            {transport.map((item) => (
              <div className="transport-card reveal" key={item.title}>
                <div className="transport-icon">
                  <i className={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <div className="transport-price">
                  {item.price} <span>/ typical fare</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="testimonials" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Reviews</span>
            <h2 className="section-title">What Travelers Say</h2>
            <p className="section-description">
              Feedback from explorers and tourists using CityVerse for their journey across Nepal.
            </p>
          </div>

          <div className="places-grid">
            {testimonials.map((item) => (
              <div className="testimonial-card reveal" key={item.name}>
                <div className="testimonial-quote">“</div>
                <p className="testimonial-text">{item.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{item.initials}</div>
                  <div>
                    <div className="testimonial-name">{item.name}</div>
                    <div className="testimonial-location">{item.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner">
        <div className="cta-banner-bg" />
        <div className="container">
          <div className="cta-banner-content reveal">
            <h2>Plan Your Trip Across Nepal</h2>
            <p>
              Explore city guides, compare attractions, and discover historical and natural landmarks across Nepal.
            </p>
            <Link to="/places" className="btn btn-white btn-lg">
              <i className="bx bx-compass" />
              Browse Places
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
