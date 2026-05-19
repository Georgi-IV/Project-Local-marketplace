import "./login.css";

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>
        <form>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@example.com" />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
          />
          <button type="submit">Sign in</button>
        </form>
      </div>
    </div>
  );
}
