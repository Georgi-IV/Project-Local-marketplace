import { useEffect, useState } from "react";
import "./browse-services.css";

interface Service {
  id: number;
  title: string;
  description: string;
  location: string;
  urgency: "urgent" | "normal";
  icon: string;
}

export default function BrowseServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/services/");
        if (!response.ok) {
          throw new Error("Unable to load services. Please try again later.");
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Could not fetch services."
        );
      }
    }

    loadServices();
  }, []);

  return (
    <div className="browse-services-page">
      <div className="services-container">
        <h1>Browse Services People Need</h1>
        <p>Find opportunities to help people with your skills</p>

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
                  </div>
                </div>
                <p className="service-description">{service.description}</p>
                <div className="service-footer">
                  <span className="location">📍 {service.location}</span>
                  <button className="btn-accept">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
