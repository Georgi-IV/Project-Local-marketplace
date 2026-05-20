import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./home.css";

export default function Home() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <h1>Welcome to LOMarketplace</h1>
        <p>Share your skills and connect with people who need your help.</p>
        <div className="home-grid">
          <div
            className="card clickable"
            onClick={() => handleCardClick("/browse-services")}
          >
            <div className="card-icon">🛠️</div>
            <h3>Browse Services</h3>
            <p>See what skills and services people are looking for.</p>
          </div>
          <div
            className="card clickable"
            onClick={() => handleCardClick("/connect")}
          >
            <div className="card-icon">🤝</div>
            <h3>Connect</h3>
            <p>Meet and connect with skilled people near you.</p>
          </div>
          <div className="card">
            <div className="card-icon">🏪</div>
            <h3>Local Sellers</h3>
            <p>Coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
