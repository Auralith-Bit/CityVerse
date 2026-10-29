import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import PlaceCard from '../components/PlaceCard';

const testimonials = [
  {
    name: 'Sarah Kim',
    location: 'Seoul, South Korea',
    initials: 'SK',
    text: 'Visiting Butwal was a great experience. The city has a lot to offer, and CityVerse made the logistics so smooth!',
  },
  {
    name: 'Mark Johnson',
    location: 'London, UK',
    initials: 'MJ',
    text: 'The local guides were fantastic. We explored Butwal and Bhairahawa in one trip — great value for money!',
  },
  {
    name: 'Amara Patel',
    location: 'Bangkok, Thailand',
    initials: 'AP',
    text: 'Great experience exploring both cities. Easy to navigate and very convenient.',
  },
  {
    name: 'Rachel Lee',
    location: 'Sydney, Australia',
    initials: 'RL',
    text: 'Manimukunda Park was a highlight of our trip. Peaceful, green and full of local life. Will definitely return.',
  },
  {
    name: 'David Mueller',
    location: 'Berlin, Germany',
    initials: 'DM',
    text: 'Clear guides and very convenient planning. Highly recommend CityVerse!',
  },
  {
    name: 'Yuki Tanaka',
    location: 'Tokyo, Japan',
    initials: 'YT',
    text: 'Nepal surprised me with its warmth. CityVerse made everything easy!',
  },
];

const features = [
  { icon: 'bx bx-map-pin', title: 'Curated Attractions', text: 'Hand-picked spots in Butwal & Bhairahawa' },
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
        <img src="/images/places/butwal-city-center-1.jpg" alt="Butwal city" className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-float-1" />
        <div className="hero-float-2" />
        <div className="hero-float-3" />

        <div className="container">
          <div className="hero-content">
            <div className="hero-tag">
              <i className="bx bxs-plane-alt" />
              Gateway to Butwal &amp; Bhairahawa
            </div>

            <h1 className="hero-title">
              Explore
              <br />
              <span className="highlight">Butwal</span>
              <br />
              &amp; Bhairahawa
            </h1>

            <p className="hero-description">
              Your journey starts here. Discover vibrant cities, local culture and the best of
              Rupandehi, Nepal.
            </p>

            <div className="hero-cta">
              <Link to="/places" className="btn btn-primary btn-lg">
                <i className="bx bx-compass" />
                Explore Places
              </Link>
              <Link
                to="/places?city=BHAIRAHWA"
                className="btn btn-outline btn-lg"
                style={{ borderColor: 'white', color: 'white' }}
              >
                <i className="bx bx-map" />
                Explore Bhairahawa
              </Link>
            </div>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-number">2</div>
              <div className="hero-stat-label">Cities</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-number">12+</div>
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
              <img src="/images/places/manimukunda-park-1.jpg" alt="Manimukunda Park, Butwal" className="about-image" />
              <div className="about-image-accent" />
              <div className="about-image-badge">
                <i className="bx bxs-star" />
                <div className="about-image-badge-text">
                  <strong>2 Cities</strong>
                  <span>One Destination</span>
                </div>
              </div>
            </div>

            <div className="about-content reveal-right">
              <span className="section-subtitle">About Us</span>
              <h2 className="section-title">Your Gateway to Butwal &amp; Bhairahawa</h2>
              <p className="about-text">
                CityVerse brings you the authentic experience of Butwal and Bhairahawa
                (Siddharthanagar). Located in Rupandehi, Nepal, these vibrant cities offer a blend
                of culture, commerce and modern amenities.
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
            <h2 className="section-title">Two Cities, Endless Stories</h2>
            <p className="section-description">
              From hilltop sunsets to sacred stupas, each city has its own rhythm. Pick a city and
              start exploring.
            </p>
          </div>

          <div className="city-spotlight-grid">
            <article className="city-spotlight-card reveal">
              <img src="/images/places/butwal-hill-park-1.jpg" alt="Butwal" />
              <div className="city-spotlight-overlay" />
              <div className="city-spotlight-content">
                <span className="city-spotlight-tag">Rupandehi · West</span>
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
                <span className="city-spotlight-tag">Rupandehi · South</span>
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
        </div>
      </section>

      <section className="section" id="places" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Explore</span>
            <h2 className="section-title">Popular Attractions</h2>
            <p className="section-description">Discover the best attractions in Butwal and Bhairahawa.</p>
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
              Choose from our range of transport options to explore Butwal and Bhairahawa
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
              Hear from fellow explorers who have experienced Butwal and Bhairahawa.
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
            <h2>Ready for Your Journey?</h2>
            <p>
              Start planning your trip to Butwal &amp; Bhairahawa today. Explore attractions and
              create memories that last a lifetime.
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
