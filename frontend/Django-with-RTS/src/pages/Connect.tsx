import { useState } from "react";
import "./connect.css";

interface Person {
  id: number;
  name: string;
  location: string;
  rating: number;
  skills: string[];
  avatar: string;
}

export default function Connect() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [people] = useState<Person[]>([
    {
      id: 1,
      name: "Ivo Mihailov",
      location: "New York, NY",
      rating: 4.9,
      skills: [
        "Tire Change",
        "Car Maintenance",
        "Brake Service",
        "Tire Replacement",
      ],
      avatar: "IM",
    },
  ]);

  return (
    <div className="connect-page">
      <div className="connect-container">
        <h1>Connect with Skilled People</h1>
        <p>Find the most popular and trusted professionals in your area</p>

        <div className="people-list">
          {people.map((person) => (
            <div key={person.id} className="person-card">
              <div className="person-main">
                <div className="person-avatar">{person.avatar}</div>
                <div className="person-details">
                  <h3>{person.name}</h3>
                  <p className="location">📍 {person.location}</p>
                  <div className="rating">
                    <span className="stars">⭐ {person.rating}</span>
                  </div>
                </div>
                <button
                  className="expand-btn"
                  onClick={() =>
                    setExpandedId(expandedId === person.id ? null : person.id)
                  }
                >
                  {expandedId === person.id ? "−" : "+"}
                </button>
              </div>

              {expandedId === person.id && (
                <div className="person-skills">
                  <h4>Skills & Services</h4>
                  <div className="skills-list">
                    {person.skills.map((skill) => (
                      <span key={skill} className="skill">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button className="btn-contact">Contact {person.name}</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="placeholder-message">
          <p>More skilled professionals coming soon...</p>
        </div>
      </div>
    </div>
  );
}
