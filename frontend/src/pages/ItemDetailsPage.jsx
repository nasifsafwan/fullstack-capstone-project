import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchListingById } from "../services/api.js";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadItem() {
      try {
        const payload = await fetchListingById(id);

        if (!ignore) {
          setItem(payload);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
        }
      }
    }

    loadItem();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!item) {
    return <p>Loading item details...</p>;
  }

  return (
    <section className="details-layout">
      <img alt={item.title} className="details-image" src={item.imageUrl} />
      <div className="details-copy">
        <p className="eyebrow">{item.category}</p>
        <h1>{item.title}</h1>
        <p>{item.description}</p>
        <div className="detail-list">
          <span>Condition: {item.condition}</span>
          <span>Location: {item.location}</span>
          <span>Owner: {item.ownerName}</span>
          <span>Pickup notes: {item.pickupNotes}</span>
        </div>
        <div className="tag-row">
          {item.tags?.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

