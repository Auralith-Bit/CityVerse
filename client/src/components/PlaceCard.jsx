import { Link } from 'react-router-dom';
import { resolveImage } from '../api/client';

function Stars({ rating }) {
  const rounded = Math.round(Number(rating) * 2) / 2;
  return (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, index) => {
        const position = index + 1;
        let className = 'bx bxs-star empty';
        if (rounded >= position) className = 'bx bxs-star';
        else if (rounded >= position - 0.5) className = 'bx bxs-star-half';
        return <i key={position} className={className} />;
      })}
    </div>
  );
}

export default function PlaceCard({ place }) {
  return (
    <div className="place-card reveal">
      <div className="place-card-image">
        <img src={resolveImage(place.coverImage) || '/images/places/butwal-city-center-1.jpg'} alt={place.title} />
        <div className="place-card-overlay" />
        <span className="place-card-category">{place.category?.name || 'Attraction'}</span>
        <span className="place-card-distance">
          <i className="bx bx-map-pin" /> {Number(place.distanceKm || 0)} km
        </span>
        <span className="place-card-city">
          <i className="bx bx-buildings" /> {place.city === 'BHAIRAHWA' ? 'Bhairahawa' : 'Butwal'}
        </span>
      </div>
      <div className="place-card-body">
        <h3 className="place-card-title">{place.title}</h3>
        <p className="place-card-desc">{place.description}</p>
        <div className="place-card-meta">
          <div className="place-card-rating">
            <Stars rating={place.rating} />
            <span>({Number(place.reviewCount || 0).toLocaleString()} reviews)</span>
          </div>
          <Link to={`/places/${place.slug}`} className="place-card-action">
            View Details <i className="bx bx-right-arrow-alt" />
          </Link>
        </div>
      </div>
    </div>
  );
}
