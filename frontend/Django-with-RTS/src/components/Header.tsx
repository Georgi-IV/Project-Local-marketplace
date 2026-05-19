import { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import "./header.css";

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = location.pathname === "/home";
  const isAbout = location.pathname === "/about";

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
          <Link to="/about" className={`nav-link ${isAbout ? "active" : ""}`}>
            About
          </Link>
        </nav>

        {/* Right side */}
        <div className="header-right">
          {/* Profile circle */}
          <div className="profile-circle"></div>

          {/* Hamburger menu */}
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
        </div>
      </div>
    </header>
  );
}
