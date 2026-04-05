import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ListingCard from "../components/ListingCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { fetchListings, searchListings } from "../services/api.js";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function ListingsPage() {
  const query = useQuery();
  const [filters, setFilters] = useState({
    q: query.get("q") || "",
    category: query.get("category") || "",
    condition: query.get("condition") || "",
    location: query.get("location") || ""
  });
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadListings() {
      setLoading(true);
      setError("");

      try {
        const hasFilters = Object.values(filters).some(Boolean);
        const payload = hasFilters ? await searchListings(filters) : await fetchListings();
        const nextItems = Array.isArray(payload) ? payload : payload.results;

        if (!ignore) {
          setItems(nextItems);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadListings();
    return () => {
      ignore = true;
    };
  }, [filters]);

  function handleChange(event) {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFilters((current) => ({ ...current }));
  }

  return (
    <section className="stack">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Listings</p>
          <h1>Free items shared by the GiftLink community</h1>
        </div>
      </div>
      <SearchBar compact filters={filters} onChange={handleChange} onSubmit={handleSubmit} />
      {loading ? <p>Loading listings...</p> : null}
      {error ? <p className="error-text">{error}</p> : null}
      <div className="grid">
        {items.map((item) => (
          <ListingCard item={item} key={item._id} />
        ))}
      </div>
    </section>
  );
}

