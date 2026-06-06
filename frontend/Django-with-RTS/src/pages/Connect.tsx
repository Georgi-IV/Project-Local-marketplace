import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./connect.css";

interface Profile {
  id: number;
  name: string;
  location: string;
  phone: string;
  date_of_birth: string | null;
  review_count?: number;
  rating_average?: number | null;
}

interface Person {
  id: number;
  name: string;
  location: string;
  rating: number;
  review_count?: number;
  rating_average?: number | null;
  skills: string[];
  avatar: string;
  phone: string;
}

export default function Connect() {
  const { user, isLoggedIn } = useAuth();
  const API_BASE = import.meta.env.VITE_API_BASE || "";
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [selectedContactId, setSelectedContactId] = useState<number | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewInputs, setReviewInputs] = useState<
    Record<number, { rating: number; comment: string }>
  >({});
  const [reviewStatus, setReviewStatus] = useState<
    Record<number, { success?: string; error?: string }>
  >({});

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allProfiles: Person[] = [];

      // If user is logged in, fetch their profile first
      if (user) {
        try {
          const myProfileHeaders: Record<string, string> = {};
          if (user?.token) {
            myProfileHeaders["Authorization"] = `Token ${user.token}`;
          }
          const myProfileResponse = await fetch(
            `${API_BASE}/api/my-profile/`,
            {
              credentials: "include",
              headers: myProfileHeaders,
            },
          );
          if (myProfileResponse.ok) {
            const myProfile: Profile = await myProfileResponse.json();
            allProfiles.push({
              id: myProfile.id,
              name: `${myProfile.name} (You)`,
              location: myProfile.location || "Not specified",
              rating: 5.0, // User's own profile gets highest rating
              review_count: myProfile.review_count || 0,
              rating_average: myProfile.rating_average ?? 5.0,
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
        rating: 4.5,
        review_count: profile.review_count || 0,
        rating_average: profile.rating_average ?? 4.5,
        skills: profile.phone ? ["Contact Available"] : [],
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
  }, [user, API_BASE]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleReviewInputChange = (
    profileId: number,
    field: "rating" | "comment",
    value: string | number,
  ) => {
    setReviewInputs((prev) => ({
      ...prev,
      [profileId]: {
        rating:
          field === "rating"
            ? Number(value)
            : prev[profileId]?.rating || 5,
        comment:
          field === "comment"
            ? String(value)
            : prev[profileId]?.comment || "",
      },
    }));
  };

  const handleSubmitReview = async (profileId: number) => {
    setReviewStatus((prev) => ({
      ...prev,
      [profileId]: {},
    }));

    const reviewData = reviewInputs[profileId] || {
      rating: 5,
      comment: "",
    };

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (user?.token) {
        headers["Authorization"] = `Token ${user.token}`;
      }

      const response = await fetch(
        `${API_BASE}/api/profiles/${profileId}/reviews/`,
        {
          method: "POST",
          headers,
          credentials: "include",
          body: JSON.stringify(reviewData),
        },
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data?.rating?.[0] || data?.error || "Failed to submit review.",
        );
      }

      await response.json();
      await fetchProfiles();
      setReviewStatus((prev) => ({
        ...prev,
        [profileId]: { success: "Rating submitted successfully." },
      }));
      setReviewInputs((prev) => ({
        ...prev,
        [profileId]: { rating: 5, comment: "" },
      }));
    } catch (err) {
      setReviewStatus((prev) => ({
        ...prev,
        [profileId]: {
          error:
            err instanceof Error
              ? err.message
              : "Unable to submit review at this time.",
        },
      }));
    }
  };

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
                      <span className="stars">
                        ⭐ {person.rating_average ?? person.rating}
                      </span>
                      {person.review_count != null && (
                        <span className="review-count">
                          ({person.review_count} reviews)
                        </span>
                      )}
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

                    {isLoggedIn ? (
                      <div className="review-form">
                        <label htmlFor={`rating-${person.id}`}>
                          Rate {person.name}
                        </label>
                        <select
                          id={`rating-${person.id}`}
                          value={reviewInputs[person.id]?.rating ?? 5}
                          onChange={(event) =>
                            handleReviewInputChange(
                              person.id,
                              "rating",
                              event.target.value,
                            )
                          }
                        >
                          <option value={1}>1 star</option>
                          <option value={2}>2 stars</option>
                          <option value={3}>3 stars</option>
                          <option value={4}>4 stars</option>
                          <option value={5}>5 stars</option>
                        </select>

                        <label htmlFor={`comment-${person.id}`}>
                          Why is this person good or bad?
                        </label>
                        <textarea
                          id={`comment-${person.id}`}
                          value={reviewInputs[person.id]?.comment ?? ""}
                          onChange={(event) =>
                            handleReviewInputChange(
                              person.id,
                              "comment",
                              event.target.value,
                            )
                          }
                          placeholder="Add a short comment"
                        />

                        <button
                          type="button"
                          className="btn-submit-review"
                          onClick={() => handleSubmitReview(person.id)}
                        >
                          Submit rating
                        </button>

                        {reviewStatus[person.id]?.success && (
                          <p className="review-status success">
                            {reviewStatus[person.id]?.success}
                          </p>
                        )}
                        {reviewStatus[person.id]?.error && (
                          <p className="review-status error">
                            {reviewStatus[person.id]?.error}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="review-guest-message">
                        <p>
                          You must <Link to="/login">log in</Link> to rate and
                          comment on skilled people.
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
