import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./profile.css";

export default function Profile() {
  const { user, isLoggedIn, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    location: "",
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth || "",
        phone: user.phone || "",
        location: user.location || "",
      });
    }
  }, [user]);

  if (!user) {
    return null;
  }

  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase())
    .slice(0, 2)
    .join("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setStatusMessage("Profile updated successfully.");
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="location">{user.email}</p>
            <p className="location">📍 {user.location || "Location not set"}</p>
            <div className="rating">
              <span className="stars">🎂 {user.dateOfBirth || "Birthday not set"}</span>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <section className="profile-section">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit} className="profile-form">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label htmlFor="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
              />

              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />

              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
              />

              <div className="profile-actions">
                <button type="submit" className="btn-secondary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Logout
                </button>
              </div>
            </form>
            {statusMessage ? (
              <p className="profile-status">{statusMessage}</p>
            ) : null}
          </section>
        </div>
      </div>
    </div>
  );
}
