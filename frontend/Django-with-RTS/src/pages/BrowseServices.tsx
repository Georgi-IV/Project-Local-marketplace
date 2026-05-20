import { useState } from "react";
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
  const [services] = useState<Service[]>([
    {
      id: 1,
      title: "Need Tire Changed ASAP",
      description:
        "My car has a flat tire and I need it changed urgently. I cannot do it myself.",
      location: "New York, NY",
      urgency: "urgent",
      icon: "🚗",
    },
  ]);

  return (
    <div className="browse-services-page">
      <div className="services-container">
        <h1>Browse Services People Need</h1>
        <p>Find opportunities to help people with your skills</p>

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

        <div className="placeholder-message">
          <p>More services coming soon as people post their needs...</p>
        </div>
      </div>
    </div>
  );
}
