import { Link } from 'react-router-dom';

const why = [
  { icon: 'bx bx-map-pin', title: 'Curated Attractions', text: 'Every spot is reviewed and kept up to date by our team.' },
  { icon: 'bx bx-compass', title: 'Local Knowledge', text: 'Know the best time to visit, how to get there and what to expect.' },
  { icon: 'bx bx-shield-quarter', title: 'Safe Travel', text: 'Practical guidance for a smooth and comfortable trip.' },
  { icon: 'bx bx-dollar-circle', title: 'Best Value', text: 'Honest recommendations with no hidden costs.' },
];

const cities = [
  {
    name: 'Butwal',
    tagline: 'The commercial heartbeat of Rupandehi',
    text: 'A lively city known for its markets, parks and food. Perfect for a city break with easy access to nearby heritage sites like Devdaha.',
    highlights: ['Manimukunda Park', 'Butwal Hill Park', 'Siddhartha Chowk'],
  },
  {
    name: 'Bhairahawa',
    tagline: 'Gateway of the region',
    text: 'Officially Siddharthanagar, this border city connects travelers to the rest of Nepal and offers great shopping and dining.',
    highlights: ['Gautam Buddha Int’l Airport', 'Buddha Park', 'Bhairahawa Market'],
  },
];

export default function About() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>About CityVerse</h1>
          <p>Your trusted guide to Butwal and Bhairahawa — two cities, endless discoveries.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper reveal-left">
              <img src="/images/places/butwal-hill-park-1.jpg" alt="Butwal and Bhairahawa" className="about-image" />
              <div className="about-image-accent" />
              <div className="about-image-badge">
                <i className="bx bxs-star" />
                <div className="about-image-badge-text">
                  <strong>CityVerse</strong>
                  <span>Since 2026</span>
                </div>
              </div>
            </div>

            <div className="about-content reveal-right">
              <span className="section-subtitle">Our Story</span>
              <h2 className="section-title">Helping You Discover Rupandehi</h2>
              <p className="about-text">
                CityVerse was founded with a single mission: to provide travelers seamless, fair
                and memorable journeys throughout Butwal and Bhairahawa.
              </p>
              <p className="about-text">
                Bhairahawa (officially known as Siddharthanagar) is a vibrant city in Rupandehi
                district, while Butwal is another major commercial hub in the region. Together they
                form the perfect base for exploring western Nepal.
              </p>
              <p className="about-text">
                We built a unified tourism portal connecting travelers with accurate information about
                the best spots, local culture and practical travel tips.
              </p>

              <Link to="/places" className="btn btn-primary">
                <i className="bx bx-right-arrow-alt" /> Explore Attractions
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Our Values</span>
            <h2 className="section-title">Why Travel With CityVerse</h2>
          </div>

          <div className="places-grid">
            {why.map((item) => (
              <div className="transport-card reveal" key={item.title}>
                <div className="transport-icon">
                  <i className={item.icon} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">The Region</span>
            <h2 className="section-title">Two Cities, One Experience</h2>
          </div>

          <div className="places-grid">
            {cities.map((city) => (
              <div className="place-card reveal" key={city.name}>
                <div className="place-card-body" style={{ padding: 'var(--space-8)' }}>
                  <span className="section-subtitle">{city.tagline}</span>
                  <h3 className="place-card-title" style={{ marginTop: 'var(--space-2)' }}>
                    {city.name}
                  </h3>
                  <p className="place-card-desc" style={{ marginBottom: 'var(--space-4)' }}>
                    {city.text}
                  </p>
                  <ul style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', display: 'grid', gap: '0.4rem' }}>
                    {city.highlights.map((highlight) => (
                      <li key={highlight} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <i className="bx bx-check-circle" style={{ color: 'var(--primary-500)' }} />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={`/places?city=${city.name === 'Butwal' ? 'BUTWAL' : 'BHAIRAHWA'}`}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: 'var(--space-5)' }}
                  >
                    Explore {city.name}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
