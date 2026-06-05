import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./local-sellers.css";

function getCsrfToken(): string {
  const name = "csrftoken";
  let cookieValue = "";
  if (document.cookie && document.cookie !== "") {
    document.cookie.split(";").forEach((c) => {
      const cookie = c.trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
      }
    });
  }
  return cookieValue;
}

interface ServiceForm {
  title: string;
  description: string;
  location: string;
  phone: string;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  location: string;
  phone: string;
  urgency: string;
  icon: string;
  creator: string;
  review_count?: number;
  rating_average?: number | null;
  reviews: Review[];
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
  const [reviewInputs, setReviewInputs] = useState<
    Record<number, { rating: number; comment: string }>
  >({});
  const [reviewStatus, setReviewStatus] = useState<
    Record<number, { success?: string; error?: string }>
  >({});

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

  const handleReviewInputChange = (
    serviceId: number,
    field: "rating" | "comment",
    value: string,
  ) => {
    setReviewInputs((prev) => ({
      ...prev,
      [serviceId]: {
        rating:
          field === "rating"
            ? Number(value) || 1
            : prev[serviceId]?.rating || 5,
        comment:
          field === "comment"
            ? value
            : prev[serviceId]?.comment || "",
      },
    }));
  };

  const handleSubmitReview = async (serviceId: number) => {
    setReviewStatus((prev) => ({
      ...prev,
      [serviceId]: { success: undefined, error: undefined },
    }));

    const reviewData = reviewInputs[serviceId] || { rating: 5, comment: "" };

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (user?.token) {
        headers["Authorization"] = `Token ${user.token}`;
      } else {
        const csrfToken = getCsrfToken();
        if (csrfToken) {
          headers["X-CSRFToken"] = csrfToken;
        }
      }

      const response = await fetch(
        `${API_BASE}/api/services/${serviceId}/reviews/`,
        {
          method: "POST",
          credentials: "include",
          headers,
          body: JSON.stringify(reviewData),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        setReviewStatus((prev) => ({
          ...prev,
          [serviceId]: {
            error:
              typeof data === "object"
                ? Object.values(data).flat().join(" ")
                : "Unable to submit review.",
          },
        }));
        return;
      }

      setServices((prev) =>
        prev.map((service) => {
          if (service.id !== serviceId) return service;
          const updatedReviews = [...(service.reviews || []), data];
          const totalRating = updatedReviews.reduce(
            (sum, review) => sum + review.rating,
            0,
          );
          const average = updatedReviews.length
            ? totalRating / updatedReviews.length
            : null;
          return {
            ...service,
            reviews: updatedReviews,
            review_count: updatedReviews.length,
            rating_average: average,
          };
        }),
      );
      setReviewInputs((prev) => ({
        ...prev,
        [serviceId]: { rating: 5, comment: "" },
      }));
      setReviewStatus((prev) => ({
        ...prev,
        [serviceId]: {
          success: "Review submitted successfully.",
        },
      }));
    } catch (error) {
      setReviewStatus((prev) => ({
        ...prev,
        [serviceId]: {
          error: "Unable to submit review. Please try again later.",
        },
      }));
    }
  };

  const formatStars = (rating: number) => "⭐".repeat(Math.max(1, Math.min(5, rating)));

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
                {service.rating_average != null && (
                  <p className="seller-rating">
                    ⭐ {service.rating_average.toFixed(1)} / 5 
                    {service.review_count ? `(${service.review_count} reviews)` : ""}
                  </p>
                )}
                {service.urgency === "urgent" && (
                  <span className="urgency-badge urgent">URGENT</span>
                )}

                {service.reviews && service.reviews.length > 0 && (
                  <div className="review-list">
                    <h4>Reviews</h4>
                    {service.reviews.map((review) => (
                      <div key={review.id} className="review-card">
                        <div className="review-meta">
                          <strong>{review.author}</strong>
                          <span>{formatStars(review.rating)} {review.rating}</span>
                        </div>
                        <p>{review.comment || "No comment provided."}</p>
                      </div>
                    ))}
                  </div>
                )}

                {isLoggedIn ? (
                  <div className="review-form">
                    <h4>Leave a review</h4>
                    <label htmlFor={`rating-${service.id}`}>Rating</label>
                    <select
                      id={`rating-${service.id}`}
                      value={reviewInputs[service.id]?.rating ?? 5}
                      onChange={(e) =>
                        handleReviewInputChange(service.id, "rating", e.target.value)
                      }
                    >
                      {[5, 4, 3, 2, 1].map((score) => (
                        <option key={score} value={score}>
                          {score} star{score !== 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                    <label htmlFor={`comment-${service.id}`}>Comment</label>
                    <textarea
                      id={`comment-${service.id}`}
                      value={reviewInputs[service.id]?.comment ?? ""}
                      onChange={(e) =>
                        handleReviewInputChange(service.id, "comment", e.target.value)
                      }
                      placeholder="Describe your experience"
                    />
                    <button
                      type="button"
                      className="submit-service-btn"
                      onClick={() => handleSubmitReview(service.id)}
                    >
                      Submit Review
                    </button>
                    {reviewStatus[service.id]?.success && (
                      <div className="form-status success">
                        {reviewStatus[service.id]?.success}
                      </div>
                    )}
                    {reviewStatus[service.id]?.error && (
                      <div className="form-status error">
                        {reviewStatus[service.id]?.error}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="review-login-prompt">
                    Sign in to leave a review for this seller.
                  </p>
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
