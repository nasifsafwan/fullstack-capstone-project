export default function SearchBar({ filters, onChange, onSubmit, compact = false }) {
  return (
    <form className={compact ? "search-panel compact" : "search-panel"} onSubmit={onSubmit}>
      <input
        name="q"
        onChange={onChange}
        placeholder="Search by keyword"
        value={filters.q}
      />
      <select name="category" onChange={onChange} value={filters.category}>
        <option value="">All categories</option>
        <option value="Furniture">Furniture</option>
        <option value="Kitchen">Kitchen</option>
        <option value="Decor">Decor</option>
        <option value="Electronics">Electronics</option>
        <option value="Storage">Storage</option>
      </select>
      <select name="condition" onChange={onChange} value={filters.condition}>
        <option value="">Any condition</option>
        <option value="Like New">Like New</option>
        <option value="Good">Good</option>
        <option value="Fair">Fair</option>
      </select>
      <input
        name="location"
        onChange={onChange}
        placeholder="Location"
        value={filters.location}
      />
      <button className="primary-button" type="submit">
        Search
      </button>
    </form>
  );
}

