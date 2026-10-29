import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page-hero" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
      <div className="container">
        <h1>404 — Page Not Found</h1>
        <p style={{ marginBottom: 'var(--space-6)' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/" className="btn btn-white btn-lg">
          <i className="bx bx-home" /> Back to Home
        </Link>
      </div>
    </section>
  );
}
