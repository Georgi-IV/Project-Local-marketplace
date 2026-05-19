import { useState } from "react";
import { Link } from "react-router-dom";
import "./signup.css";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sign up data:", formData);
    // Handle sign up logic here
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
            placeholder="John Doe"
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

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login">Click here to sign in</Link>
        </p>
      </div>
    </div>
  );
}
