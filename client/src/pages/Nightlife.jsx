const spots = [
  {
    title: 'Food Streets & Cafes',
    text: 'Butwal and Bhairahawa both come alive in the evening with street food stalls, cafes and local restaurants serving momos, chatpate and Nepali thali.',
    icon: 'bx bx-restaurant',
    meta: 'Butwal · Bhairahawa',
  },
  {
    title: 'Night Markets',
    text: 'Browse the bustling evening markets of Bhairahawa for clothing, accessories and local snacks.',
    icon: 'bx bx-store',
    meta: 'Bhairahawa Market',
  },
  {
    title: 'City Walks',
    text: 'Enjoy a relaxed evening walk around Siddhartha Chowk and the parks of Butwal.',
    icon: 'bx bx-walk',
    meta: 'Butwal City Center',
  },
  {
    title: 'Cinemas & Entertainment',
    text: 'Catch a movie or spend the evening at entertainment venues around the city centers.',
    icon: 'bx bx-movie-play',
    meta: 'Butwal · Bhairahawa',
  },
];

export default function Nightlife() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <h1>Evenings in Butwal &amp; Bhairahawa</h1>
          <p>Food, markets and relaxed city evenings after a day of exploring.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">After Dark</span>
            <h2 className="section-title">Where the City Comes Alive</h2>
          </div>

          <div className="places-grid">
            {spots.map((spot) => (
              <div className="transport-card reveal" key={spot.title}>
                <div className="transport-icon">
                  <i className={spot.icon} />
                </div>
                <h3>{spot.title}</h3>
                <p>{spot.text}</p>
                <div className="transport-price" style={{ fontSize: 'var(--font-size-sm)' }}>
                  <i className="bx bx-map-pin" /> {spot.meta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-subtitle">Travel Tip</span>
            <h2 className="section-title">Plan Your Evening</h2>
            <p className="section-description">
              Most cafes and restaurants are busiest between 6 PM and 9 PM. Weekends are livelier,
              so arrive early if you want a good seat.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
