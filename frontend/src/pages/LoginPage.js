import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`
        },
        body: JSON.stringify(form)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to log in.");
      }

      login(payload.token, payload.user);
      navigate("/profile");
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">Welcome back</p>
      <h1>Login to GiftLink</h1>
      <form className="stack" onSubmit={handleSubmit}>
        <input name="email" onChange={handleChange} placeholder="Email" required type="email" value={form.email} />
        <input
          name="password"
          onChange={handleChange}
          placeholder="Password"
          required
          type="password"
          value={form.password}
        />
        {error ? <p className="error-text">{error}</p> : null}
        <button className="primary-button" type="submit">
          Login
        </button>
      </form>
      <p>
        Need an account? <Link to="/register">Register</Link>
      </p>
    </section>
  );
}

