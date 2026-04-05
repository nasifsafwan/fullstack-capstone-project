import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <Link className="brand" to="/">
        GiftLink
      </Link>
      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/listings">Listings</NavLink>
        {user ? <NavLink to="/profile">Profile</NavLink> : null}
      </nav>
      <div className="nav-actions">
        {user ? (
          <>
            <span className="welcome-text">Hi, {user.name}</span>
            <button className="secondary-button" onClick={logout} type="button">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink className="secondary-button" to="/login">
              Login
            </NavLink>
            <NavLink className="primary-button" to="/register">
              Get Started
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}

