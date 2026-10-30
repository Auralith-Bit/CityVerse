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
    text: 'CityVerse made exploring Nepal so easy. We discovered hidden gems in cities we never knew existed!',
  },
  {
    name: 'Mark Johnson',
    location: 'London, UK',
    initials: 'MJ',
    text: 'From Butwal to Pokhara, CityVerse helped us plan the perfect multi-city trip across Nepal — great value!',
  },
  {
    name: 'Amara Patel',
    location: 'Bangkok, Thailand',
    initials: 'AP',
    text: 'Great experience exploring Nepal\'s cities. Easy to navigate and very convenient for trip planning.',
  },
  {
    name: 'Rachel Lee',
    location: 'Sydney, Australia',
    initials: 'RL',
    text: 'Nepal has so much beyond the mountains. CityVerse helped us discover the vibrant city life and local culture.',
  },
  {
    name: 'David Mueller',
    location: 'Berlin, Germany',
    initials: 'DM',
    text: 'Clear guides and very convenient planning for any city in Nepal. Highly recommend CityVerse!',
  },
  {
    name: 'Yuki Tanaka',
    location: 'Tokyo, Japan',
    initials: 'YT',
    text: 'Nepal surprised me with its warmth and diversity. CityVerse made everything easy!',
  },
];

const features = [
  { icon: 'bx bx-map-pin', title: 'Curated Attractions', text: 'Hand-picked spots across Nepal\'s cities' },
  { icon: 'bx bx-compass', title: 'Local Insights', text: 'Know what to see and where to go' },
  { icon: 'bx bx-shield-quarter', title: 'Trusted Information', text: 'Accurate, up-to-date destination details' },
  { icon: 'bx bx-dollar-circle', title: 'Free to Explore', text: 'Open guides for every traveler' },
];

const transport = [
  { icon: 'bx bx-cycling', title: 'Bike Rental', text: 'Freedom to explore at your own pace. Perfect for short distances and local sightseeing.', price: 'NPR 500' },
  { icon: 'bx bx-bus', title: 'Bus Service', text: 'Affordable group travel to all major destinations. Regular schedules.', price: 'NPR 100' },
  { icon: 'bx bx-car', title: 'Car Rental', text: 'Premium private transport with experienced drivers. Ideal for families.', price: 'NPR 3,000' },
  { icon: 'bx bx-taxi', title: 'E-Rickshaw', text: 'Eco-friendly city rides. Quiet, clean and perfect for short hops.', price: 'NPR 150' },
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
        <i className="bx bx-search" />
        <input
          type="text"
          placeholder="Search cities, attractions, places…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => query.trim() && setOpen(true)}
        />
        <button type="submit" className="hero-search-btn">
          Explore
        </button>
      </div>
      {open && filtered.length > 0 && (
        <ul className="hero-search-dropdown">
          {filtered.map((city) => (
            <li key={city}>
              <button type="button" onClick={() => handleSelect(city)}>
                <i className="bx bx-map-pin" />
                {city}
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
        <img src="/images/places/butwal-city-center-1.jpg" alt="Nepal cityscape" className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-float-1" />
        <div className="hero-float-2" />
        <div className="hero-float-3" />

        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">
              <i className="bx bxs-plane-alt" />
              Discover Every City in Nepal
            </div>

            <h1 className="hero-title">
              Explore
              <br />
              <span className="highlight">Nepal</span>,
              <br />
              City by City
            </h1>

            <p className="hero-description">
              Your journey starts here. Discover vibrant cities, rich culture and hidden
              gems across Nepal — from the Terai plains to the Himalayan foothills.
            </p>

            <CitySearch />

            <div className="hero-cta">
              <Link to="/places" className="btn btn-primary btn-lg">
                <i className="bx bx-compass" />
                Explore All Places
              </Link>
              <Link
                to="/about"
                className="btn btn-outline btn-lg"
                style={{ borderColor: 'white', color: 'white' }}
              >
                <i className="bx bx-info-circle" />
                Learn More
              </Link>
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">50+</div>
              <div className="hero-stat-label">Cities</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">100+</div>
              <div className="hero-stat-label">Attractions</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">5K+</div>
              <div className="hero-stat-label">Happy Travelers</div>
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="scroll-mouse" />
          <span>Scroll to explore</span>
        </div>
      </section>

      <section className="section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper reveal-left">
              <img src="/images/places/manimukunda-park-1.jpg" alt="Nepal attraction" className="about-image" />
              <div className="about-image-accent" />
              <div className="about-image-badge">
                <i className="bx bxs-star" />
                <div className="about-image-badge-text">
                  <strong>All of Nepal</strong>
                  <span>One Platform</span>
                </div>
              </div>
            </div>

            <div className="about-content reveal-right">
              <span className="section-subtitle">About Us</span>
              <h2 className="section-title">Your Gateway to Nepal's Cities</h2>
              <p className="about-text">
                CityVerse is your trusted companion for exploring cities across Nepal. From
                bustling market towns to serene hill stations, we bring you curated
                attractions, local insights and practical travel information for every
                destination.
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
                <i className="bx bx-right-arrow-alt" />
                Discover Places
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="cities">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">City Spotlight</span>
            <h2 className="section-title">Featured Cities</h2>
            <p className="section-description">
              We're building guides for cities all across Nepal. Here are our current
              featured destinations — with many more on the way.
            </p>
          </div>

          <div className="city-spotlight-grid">
            <article className="city-spotlight-card reveal">
              <img src="/images/places/butwal-hill-park-1.jpg" alt="Butwal" />
              <div className="city-spotlight-overlay" />
              <div className="city-spotlight-content">
                <span className="city-spotlight-tag">Rupandehi · Lumbini Province</span>
                <h3>Butwal</h3>
                <p>
                  A lively commercial city wrapped around green hills and the Tinau River, with
                  heritage sites just a short drive away.
                </p>
                <ul className="city-spotlight-list">
                  <li><i className="bx bx-check" /> Butwal Hill Park</li>
                  <li><i className="bx bx-check" /> Manimukunda Park</li>
                  <li><i className="bx bx-check" /> Siddha Baba Temple</li>
                  <li><i className="bx bx-check" /> Devdaha</li>
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
                <span className="city-spotlight-tag">Rupandehi · Lumbini Province</span>
                <h3>Bhairahawa</h3>
                <p>
                  The gateway city for pilgrims and travelers, blending busy bazaars, Buddhist
                  heritage and an international airport.
                </p>
                <ul className="city-spotlight-list">
                  <li><i className="bx bx-check" /> Gautam Buddha International Airport</li>
                  <li><i className="bx bx-check" /> Ramgram Stupa</li>
                  <li><i className="bx bx-check" /> Sunauli Border</li>
                  <li><i className="bx bx-check" /> Bhairahawa Market</li>
                </ul>
                <Link to="/places?city=BHAIRAHWA" className="btn btn-white">
                  Explore Bhairahawa <i className="bx bx-right-arrow-alt" />
                </Link>
              </div>
            </article>
          </div>

          <div className="coming-soon-banner reveal">
            <i className="bx bx-rocket" />
            <div>
              <strong>More cities coming soon!</strong>
              <p>Kathmandu, Pokhara, Chitwan, Janakpur and many more are on the way.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="places" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Explore</span>
            <h2 className="section-title">Popular Attractions</h2>
            <p className="section-description">Discover the best attractions across Nepal's cities.</p>
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
              <i className="bx bx-map-pin" /> View All Attractions
            </Link>
          </div>
        </div>
      </section>

      <section className="section" id="transport">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Getting Around</span>
            <h2 className="section-title">Transportation Options</h2>
            <p className="section-description">
              Choose from a range of transport options to explore cities across Nepal
              comfortably and affordably.
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
                  {item.price} <span>/ base fare</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="testimonials" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Testimonials</span>
            <h2 className="section-title">What Travelers Say</h2>
            <p className="section-description">
              Hear from fellow explorers who have experienced Nepal's vibrant cities.
            </p>
          </div>

          <div className="places-grid">
            {testimonials.map((item) => (
              <div className="testimonial-card reveal" key={item.name}>
                <div className="testimonial-quote">"</div>
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
        <div className="cta-shapes">
          <div className="cta-shape cta-shape-1" />
          <div className="cta-shape cta-shape-2" />
          <div className="cta-shape cta-shape-3" />
        </div>
        <div className="container">
          <div className="cta-banner-content reveal">
            <h2>Ready to Explore Nepal?</h2>
            <p>
              Start planning your next adventure across Nepal's incredible cities. Discover
              attractions, plan routes and create memories that last a lifetime.
            </p>
            <Link to="/places" className="btn btn-white btn-lg">
              <i className="bx bx-map-pin" />
              Start Exploring
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
