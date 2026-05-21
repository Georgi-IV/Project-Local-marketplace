import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./local-sellers.css";

export default function LocalSellers() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [sellers] = useState<Array<unknown>>([]);

  const handleLoginRedirect = () => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  };

  return (
    <div className="local-sellers-page">
      <div className="local-sellers-container">
        <h1>Local Sellers</h1>
        <p>Explore local sellers and services near you.</p>

        {sellers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-bubble">
              There are no local sellers around you
            </div>
            {!isLoggedIn && (
              <button className="local-sellers-login" onClick={handleLoginRedirect}>
                Sign in to see local sellers
              </button>
            )}
          </div>
        ) : (
          <div className="seller-list">
            {sellers.map((_, index) => (
              <div key={index} className="seller-card">
                <h3>Seller {index + 1}</h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
