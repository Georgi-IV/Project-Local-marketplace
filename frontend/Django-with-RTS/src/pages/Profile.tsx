import "./profile.css";

export default function Profile() {
  // Placeholder user data
  const user = {
    name: "John Doe",
    email: "john@example.com",
    location: "New York, NY",
    skills: ["PC Building", "Tire Change", "Appliance Repair"],
    rating: 4.8,
    reviews: 42,
    joinDate: "January 2024",
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar"></div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="location">📍 {user.location}</p>
            <div className="rating">
              <span className="stars">⭐ {user.rating}</span>
              <span className="reviews">({user.reviews} reviews)</span>
            </div>
          </div>
        </div>

        <div className="profile-content">
          <section className="profile-section">
            <h2>Contact Information</h2>
            <p>Email: {user.email}</p>
            <p>Member Since: {user.joinDate}</p>
          </section>

          <section className="profile-section">
            <h2>Skills & Services</h2>
            <div className="skills-list">
              {user.skills.map((skill) => (
                <div key={skill} className="skill-tag">
                  {skill}
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <h2>Account Settings</h2>
            <button className="btn-secondary">Edit Profile</button>
            <button className="btn-secondary">Change Password</button>
            <button className="btn-danger">Logout</button>
          </section>
        </div>
      </div>
    </div>
  );
}
