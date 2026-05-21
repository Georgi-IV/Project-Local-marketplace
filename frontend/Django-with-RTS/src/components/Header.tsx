import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./header.css";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === "/home";
  const isAbout = location.pathname === "/about";
  const isBrowseServices = location.pathname === "/browse-services";
  const isConnect = location.pathname === "/connect";
  const isLocalSellers = location.pathname === "/local-sellers";

  // Don't show header on login/signup pages
  if (location.pathname === "/login" || location.pathname === "/signup") {
    return null;
  }

  return (
    <header className="header">
      <div className="header-content">
        {/* Logo */}
        <div className="logo">
          <span>LOMarketplace</span>
        </div>

        {/* Navigation */}
        <nav className="nav-bar">
          <Link to="/home" className={`nav-link ${isHome ? "active" : ""}`}>
            Home
          </Link>
          <Link
            to="/browse-services"
            className={`nav-link ${isBrowseServices ? "active" : ""}`}
          >
            Browse Services
          </Link>
          <Link
            to="/connect"
            className={`nav-link ${isConnect ? "active" : ""}`}
          >
            Connect
          </Link>
          <Link
            to="/local-sellers"
            className={`nav-link ${isLocalSellers ? "active" : ""}`}
          >
            Local Sellers
          </Link>
          <Link to="/about" className={`nav-link ${isAbout ? "active" : ""}`}>
            About
          </Link>
        </nav>

        {/* Right side */}
        <div className="header-right">
          {/* Profile or Login Button */}
          {isLoggedIn ? (
            <button
              className="profile-circle"
              onClick={() => navigate("/profile")}
              title={user?.name ? `${user.name}'s profile` : "Go to profile"}
            >
              {user?.name
                ? user.name
                    .split(" ")
                    .filter(Boolean)
                    .map((part) => part[0].toUpperCase())
                    .slice(0, 2)
                    .join("")
                : "P"}
            </button>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
          )}

          {/* Hamburger menu */}
          {isLoggedIn && (
            <>
              <button
                className="hamburger"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>

              {/* Expandable menu */}
              {menuOpen && (
                <div className="menu-dropdown">
                  <a href="#settings">Settings</a>
                  <a href="#advanced">Advanced</a>
                  <a href="#info">Info</a>
                  <a href="#more">More</a>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
