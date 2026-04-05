import { Link } from "react-router-dom";

export default function ListingCard({ item }) {
  return (
    <article className="card">
      <div className="card-media">
        <img alt={item.title} src={item.imageUrl} />
      </div>
      <div className="card-body">
        <p className="eyebrow">{item.category}</p>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <div className="card-meta">
          <span>{item.condition}</span>
          <span>{item.location}</span>
        </div>
        <Link className="text-link" to={`/items/${item._id}`}>
          View details
        </Link>
      </div>
    </article>
  );
}

