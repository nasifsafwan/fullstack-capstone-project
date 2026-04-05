import { useEffect, useState } from "react";
import { fetchProfile, updateProfile } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.js";

export default function ProfilePage() {
  const { token, user, updateProfile: persistProfile } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    city: user?.city || "",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || ""
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      try {
        const payload = await fetchProfile(token);

        if (!ignore) {
          setForm({
            name: payload.user.name || "",
            city: payload.user.city || "",
            bio: payload.user.bio || "",
            avatarUrl: payload.user.avatarUrl || ""
          });
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
        }
      }
    }

    if (token) {
      loadProfile();
    }

    return () => {
      ignore = true;
    };
  }, [token]);

  function handleChange(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = await updateProfile(form, token);
      persistProfile(payload.token, payload.user);
      setMessage("Profile updated.");
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <section className="profile-layout">
      <div className="profile-summary">
        <img
          alt={form.name}
          className="avatar"
          src={form.avatarUrl || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80"}
        />
        <h1>{form.name}</h1>
        <p>{form.city}</p>
      </div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Editable profile</p>
        <h2>Update your details</h2>
        <input name="name" onChange={handleChange} placeholder="Name" value={form.name} />
        <input name="city" onChange={handleChange} placeholder="City" value={form.city} />
        <input
          name="avatarUrl"
          onChange={handleChange}
          placeholder="Avatar image URL"
          value={form.avatarUrl}
        />
        <textarea name="bio" onChange={handleChange} placeholder="Short bio" rows="5" value={form.bio} />
        {message ? <p className="success-text">{message}</p> : null}
        {error ? <p className="error-text">{error}</p> : null}
        <button className="primary-button" type="submit">
          Save profile
        </button>
      </form>
    </section>
  );
}

