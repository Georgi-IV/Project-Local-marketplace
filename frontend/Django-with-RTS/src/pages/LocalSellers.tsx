import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./local-sellers.css";

interface ServiceForm {
  title: string;
  description: string;
  location: string;
  phone: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  location: string;
  phone: string;
  urgency: "urgent" | "normal";
  icon: string;
  creator: string;
}

export default function LocalSellers() {
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE || "";
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<ServiceForm>({
    title: "",
    description: "",
    location: "",
    phone: "",
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const locationQuery = user?.location
          ? `&location=${encodeURIComponent(user.location)}`
          : "";
        const response = await fetch(
          `${API_BASE}/api/services/?post_type=offer${locationQuery}`,
          {
            credentials: "include",
          },
        );
        if (!response.ok) {
          throw new Error("Unable to load local sellers.");
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setErrorMessage(
          "Unable to load local sellers. Please refresh the page.",
        );
      }
    }

    loadServices();
  }, [user?.location]);

  const handleLoginRedirect = () => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const payload = { ...formData, post_type: "offer", icon: "🛒" };

      const response = await fetch(`${API_BASE}/api/services/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(
          typeof data === "object"
            ? Object.values(data).flat().join(" ")
            : "Unable to create service.",
        );
        return;
      }

      setStatusMessage("Service created successfully.");
      setServices((prev) => [data, ...prev]);
      setFormData({ title: "", description: "", location: "", phone: "" });
      setShowForm(false);
    } catch (error) {
      setErrorMessage("Unable to save service. Please try again later.");
    }
  };

  return (
    <div className="local-sellers-page">
      <div className="local-sellers-container">
        <h1>Local Sellers</h1>
        <p>Explore local sellers and services near you.</p>

        <div className="empty-state">
          {services.length === 0 && (
            <div className="empty-state-bubble">
              There are no local sellers around you
            </div>
          )}
          <button
            className="empty-state-add-button"
            onClick={() => setShowForm(true)}
          >
            +
          </button>
          {statusMessage && (
            <div className="form-status success">{statusMessage}</div>
          )}
          {errorMessage && (
            <div className="form-status error">{errorMessage}</div>
          )}
        </div>

        {showForm && (
          <form className="add-service-form" onSubmit={handleCreateService}>
            <h2>Create a new service</h2>
            <label htmlFor="title">Service Name</label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              required
            />
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Optional contact phone"
            />
            <div className="form-actions">
              <button type="submit" className="submit-service-btn">
                Save Service
              </button>
              <button
                type="button"
                className="cancel-service-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {services.length > 0 && (
          <div className="seller-list">
            {services.map((service) => (
              <div key={service.id} className="seller-card">
                <div className="seller-top-row">
                  <span className="service-icon">{service.icon}</span>
                  <div>
                    <h3>{service.title}</h3>
                    <p className="seller-location">📍 {service.location}</p>
                    <p className="seller-creator">
                      Created by {service.creator}
                    </p>
                    {service.phone && (
                      <p className="seller-phone">📞 {service.phone}</p>
                    )}
                  </div>
                </div>
                <p className="seller-description">{service.description}</p>
                {service.urgency === "urgent" && (
                  <span className="urgency-badge urgent">URGENT</span>
                )}
              </div>
            ))}
          </div>
        )}

        {!isLoggedIn && (
          <button className="local-sellers-login" onClick={handleLoginRedirect}>
            Sign in to see local sellers
          </button>
        )}
      </div>
    </div>
  );
}
