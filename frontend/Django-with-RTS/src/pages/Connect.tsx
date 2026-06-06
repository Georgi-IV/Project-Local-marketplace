import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "./connect.css";

interface Profile {
  id: number;
  name: string;
  location: string;
  phone: string;
  date_of_birth: string | null;
}

interface Person {
  id: number;
  name: string;
  location: string;
  rating: number;
  skills: string[];
  avatar: string;
  phone: string;
}

export default function Connect() {
  const { user } = useAuth();
  const API_BASE = import.meta.env.VITE_API_BASE || "";
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch profiles from backend when component mounts
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        setError(null);
        const allProfiles: Person[] = [];

        // If user is logged in, fetch their profile first
        if (user) {
          try {
            const myProfileResponse = await fetch(
              `${API_BASE}/api/my-profile/`,
              {
                credentials: "include", // Send cookies for authentication
              },
            );
            if (myProfileResponse.ok) {
              const myProfile: Profile = await myProfileResponse.json();
              allProfiles.push({
                id: myProfile.id,
                name: `${myProfile.name} (You)`,
                location: myProfile.location || "Not specified",
                rating: 5.0, // User's own profile gets highest rating
                skills: ["Your Profile"],
                avatar: (myProfile.name + " You")
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2),
                phone: myProfile.phone || "",
              });
            }
          } catch (err) {
            console.log("Could not fetch user profile:", err);
          }
        }

        // Build URL with location filter if user has a location
        const url = user?.location
          ? `${API_BASE}/api/profiles/?location=${encodeURIComponent(
              user.location,
            )}`
          : `${API_BASE}/api/profiles/`;

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch profiles: ${response.statusText}`);
        }

        const profiles: Profile[] = await response.json();

        // Transform backend profiles to display format
        const transformedPeople: Person[] = profiles.map((profile) => ({
          id: profile.id,
          name: profile.name || "Unknown",
          location: profile.location || "Not specified",
          rating: 4.5, // Default rating (can be updated later with actual ratings)
          skills: profile.phone ? ["Contact Available"] : [], // Placeholder skills
          avatar: profile.name
            ? profile.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)
            : "??",
          phone: profile.phone || "",
        }));

        // Combine user's profile with other profiles (avoiding duplicates)
        const userProfileIds = new Set(allProfiles.map((p) => p.id));
        const otherProfiles = transformedPeople.filter(
          (p) => !userProfileIds.has(p.id),
        );
        setPeople([...allProfiles, ...otherProfiles]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        console.error("Error fetching profiles:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [user?.location, user, API_BASE]);

  const visiblePeople = user?.location
    ? people.filter((person) => person.location.includes(user.location || ""))
    : people;

  if (loading) {
    return (
      <div className="connect-page">
        <div className="connect-container">
          <h1>Connect with Skilled People</h1>
          <p>Loading professionals in your area...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="connect-page">
        <div className="connect-container">
          <h1>Connect with Skilled People</h1>
          <p style={{ color: "red" }}>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="connect-page">
      <div className="connect-container">
        <h1>Connect with Skilled People</h1>
        <p>Find the most popular and trusted professionals in your area</p>

        <div className="people-list">
          {visiblePeople.length > 0 ? (
            visiblePeople.map((person) => (
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
                      {person.skills.length > 0 ? (
                        person.skills.map((skill) => (
                          <span key={skill} className="skill">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="skill">Professional available</span>
                      )}
                    </div>
                    <button
                      className="btn-contact"
                      onClick={() =>
                        setSelectedContactId(
                          selectedContactId === person.id ? null : person.id,
                        )
                      }
                    >
                      {selectedContactId === person.id
                        ? "Hide contact info"
                        : `Contact ${person.name}`}
                    </button>

                    {selectedContactId === person.id && (
                      <div className="contact-info">
                        <p>
                          <strong>Phone:</strong>{" "}
                          {person.phone
                            ? person.phone
                            : "Phone number not available"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="placeholder-message">
              <p>No professionals were found in your location.</p>
            </div>
          )}
        </div>

        {people.length > 0 && (
          <div className="placeholder-message">
            <p>Total professionals: {people.length}</p>
          </div>
        )}
      </div>
    </div>
  );
}
