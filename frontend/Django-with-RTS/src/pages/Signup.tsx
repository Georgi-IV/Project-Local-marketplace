import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./signup.css";

const BACKEND_URL = "http://127.0.0.1:8000/api/register/";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    password: "",
    phone: "",
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setIsError(false);

    try {
      const response = await fetch(BACKEND_URL, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        const errors = typeof data === "object" ? JSON.stringify(data) : data;
        setStatusMessage(`Registration failed: ${errors}`);
        setIsError(true);
        return;
      }

      login(data.user);
      navigate("/home");
    } catch (error) {
      setStatusMessage("Unable to reach the server. Please try again later.");
      setIsError(true);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter text here..."
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone">Phone Number (Optional)</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={formData.phone}
            onChange={handleChange}
          />

          <button type="submit">Sign Up</button>
        </form>

        {statusMessage ? (
          <div className={`signup-status ${isError ? "error" : "success"}`}>
            {statusMessage}
          </div>
        ) : null}

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login">Click here to sign in</Link>
        </p>
      </div>
    </div>
  );
}
