import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-main">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <i className="bx bx-globe" />
                </div>
                <span>CityVerse</span>
              </div>
              <p>
                Your trusted companion for exploring cities across Nepal. We make travel
                easy, affordable and unforgettable.
              </p>
              <div className="footer-social">
                <a href="#" aria-label="Facebook">
                  <i className="bx bxl-facebook" />
                </a>
                <a href="#" aria-label="Instagram">
                  <i className="bx bxl-instagram" />
                </a>
                <a href="#" aria-label="Twitter">
                  <i className="bx bxl-twitter" />
                </a>
                <a href="#" aria-label="YouTube">
                  <i className="bx bxl-youtube" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/places">Attractions</Link>
                </li>
                <li>
                  <Link to="/nightlife">Nightlife</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-heading">Explore</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/places">All Cities</Link>
                </li>
                <li>
                  <Link to="/places?city=BUTWAL">Butwal</Link>
                </li>
                <li>
                  <Link to="/places?city=BHAIRAHWA">Bhairahawa</Link>
                </li>
                <li>
                  <Link to="/places?category=nature">Nature &amp; Parks</Link>
                </li>
                <li>
                  <Link to="/places?category=religious">Heritage Sites</Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="footer-heading">Newsletter</h4>
              <p
                className="footer-newsletter-text"
                style={{
                  color: 'var(--neutral-500)',
                  fontSize: 'var(--font-size-sm)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Subscribe for travel tips, deals and updates about Nepal's cities.
              </p>
              <form
                className="footer-newsletter-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  event.currentTarget.reset();
                  window.showToast?.('Subscribed! Thanks for joining CityVerse.', 'success');
                }}
              >
                <input type="email" placeholder="Enter your email" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CityVerse. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
