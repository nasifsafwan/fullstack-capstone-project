import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import SearchBar from "../components/SearchBar.jsx";

const initialFilters = {
  q: "",
  category: "",
  condition: "",
  location: ""
};

export default function HomePage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);

  function handleChange(event) {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    navigate(`/listings?${params.toString()}`);
  }

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Reuse locally. Gift thoughtfully.</p>
        <h1>GiftLink</h1>
        <p className="hero-text">
          A community marketplace for giving away free household items and finding useful second-life goods nearby.
        </p>
        <p className="hero-text">
          Browse listings, search by category and location, and connect with neighbors who would rather reuse than rebuy.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/register">
            Get Started
          </Link>
          <Link className="secondary-button" to="/listings">
            Explore Listings
          </Link>
        </div>
      </div>
      <div className="hero-panel">
        <h2>Find what fits your home</h2>
        <SearchBar filters={filters} onChange={handleChange} onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
