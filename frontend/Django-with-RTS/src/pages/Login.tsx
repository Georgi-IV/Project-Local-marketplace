import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./login.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn, navigate]);

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

    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 400) {
          setStatusMessage("Wrong email or password!");
        } else {
          const errors = typeof data === "object" ? JSON.stringify(data) : data;
          setStatusMessage(`Login failed: ${errors}`);
        }
        return;
      }

      login(data.user);
      navigate("/home");
    } catch (error) {
      setStatusMessage("Unable to reach the server. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Sign in</button>
        </form>

        {statusMessage ? (
          <div className="login-status">{statusMessage}</div>
        ) : null}

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Click here to sign up</Link>
        </p>
      </div>
    </div>
  );
}
