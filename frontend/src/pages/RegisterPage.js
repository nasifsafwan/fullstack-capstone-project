import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", city: "" });
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
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || "Unable to create account.");
      }

      login(payload.token, payload.user);
      navigate("/profile");
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">Create account</p>
      <h1>Join GiftLink</h1>
      <form className="stack" onSubmit={handleSubmit}>
        <input name="name" onChange={handleChange} placeholder="Name" required value={form.name} />
        <input name="email" onChange={handleChange} placeholder="Email" required type="email" value={form.email} />
        <input
          name="password"
          onChange={handleChange}
          placeholder="Password"
          required
          type="password"
          value={form.password}
        />
        <input name="city" onChange={handleChange} placeholder="City" value={form.city} />
        {error ? <p className="error-text">{error}</p> : null}
        <button className="primary-button" type="submit">
          Register
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}

