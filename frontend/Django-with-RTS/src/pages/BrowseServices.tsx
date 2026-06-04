import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./browse-services.css";

interface Service {
  id: number;
  title: string;
  description: string;
  location: string;
  phone: string;
  urgency: "urgent" | "soon" | "whenever" | "normal";
  icon: string;
  creator: string;
}

export default function BrowseServices() {
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_BASE || "";
  const [services, setServices] = useState<Service[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [urgency, setUrgency] = useState<
    "urgent" | "soon" | "whenever" | "normal"
  >("normal");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadServices = async () => {
    try {
      const locationQuery = user?.location
        ? `&location=${encodeURIComponent(user.location)}`
        : "";
      const response = await fetch(
        `${API_BASE}/api/services/?post_type=need${locationQuery}`,
      );
      if (!response.ok) {
        throw new Error("Unable to load services. Please try again later.");
      }
      const data = await response.json();
      setServices(data);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Could not fetch services.",
      );
    }
  };

  useEffect(() => {
    loadServices();
  }, [user?.location]);

  const handleCreate = async () => {
    setSubmitError(null);
    if (!title.trim() || !description.trim() || !location.trim()) {
      setSubmitError("Please fill in title, description, and location.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description,
        location,
        phone,
        urgency,
        icon: "📝",
      };

      const response = await fetch(`${API_BASE}/api/services/`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Could not save your request. Please try again.",
        );
      }

      await loadServices();
      setShowCreate(false);
      setTitle("");
      setDescription("");
      setLocation("");
      setPhone("");
      setUrgency("normal");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Request failed.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="browse-services-page">
      <div className="services-container">
        <div className="services-top-bar">
          <div>
            <h1>Browse Services People Need</h1>
            <p>Find opportunities to help people with your skills.</p>
          </div>
          <button
            type="button"
            className="btn-add-request"
            onClick={() => setShowCreate((value) => !value)}
          >
            + Need something?
          </button>
        </div>

        {showCreate && (
          <div className="create-balloon">
            <h2>What do you need?</h2>
            <label>
              Title
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Fix my garden fence"
              />
            </label>
            <label>
              Description
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Share the details of what you need."
              />
            </label>
            <label>
              Location
              <input
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="City or area"
              />
            </label>
            <label>
              Contact phone
              <input
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Contact phone"
              />
            </label>
            <label>
              How fast do you need it?
              <select
                value={urgency}
                onChange={(event) =>
                  setUrgency(
                    event.target.value as
                      | "urgent"
                      | "soon"
                      | "whenever"
                      | "normal",
                  )
                }
              >
                <option value="urgent">Urgent</option>
                <option value="soon">Soon</option>
                <option value="whenever">Whenever</option>
              </select>
            </label>
            {submitError && <div className="form-error">{submitError}</div>}
            <div className="create-actions">
              <button
                type="button"
                className="btn-submit"
                onClick={handleCreate}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Post your need"}
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {errorMessage ? (
          <div className="placeholder-message">
            <p>{errorMessage}</p>
          </div>
        ) : services.length === 0 ? (
          <div className="placeholder-message">
            <p>More services coming soon as people post their needs...</p>
          </div>
        ) : (
          <div className="services-list">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div className="service-header">
                  <div className="service-icon">{service.icon}</div>
                  <div className="service-title-section">
                    <h3>{service.title}</h3>
                    {service.urgency === "urgent" && (
                      <span className="urgency-badge urgent">URGENT</span>
                    )}
                    {service.urgency === "soon" && (
                      <span className="urgency-badge soon">SOON</span>
                    )}
                    {service.urgency === "whenever" && (
                      <span className="urgency-badge whenever">WHENEVER</span>
                    )}
                  </div>
                </div>
                <p className="service-description">{service.description}</p>
                <div className="service-meta">Posted by {service.creator}</div>
                {expandedId === service.id && (
                  <div className="service-details">
                    <p>
                      <strong>Phone:</strong>{" "}
                      {service.phone ? service.phone : "Not provided"}
                    </p>
                  </div>
                )}
                <div className="service-footer">
                  <span className="location">📍 {service.location}</span>
                  <button
                    className="btn-accept"
                    onClick={() =>
                      setExpandedId(
                        expandedId === service.id ? null : service.id,
                      )
                    }
                  >
                    {expandedId === service.id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
