import "./home.css";

export default function Home() {
  return (
    <div className="home-page">
      <div className="home-container">
        <h1>Welcome to LOMarketplace</h1>
        <p>Discover amazing products and sellers in our local marketplace.</p>
        <div className="home-grid">
          <div className="card">
            <div className="card-icon">🛍️</div>
            <h3>Browse Products</h3>
            <p>Explore a wide variety of items from local sellers.</p>
          </div>
          <div className="card">
            <div className="card-icon">🏪</div>
            <h3>Local Sellers</h3>
            <p>Support local businesses in your community.</p>
          </div>
          <div className="card">
            <div className="card-icon">🤝</div>
            <h3>Connect</h3>
            <p>Meet and connect with sellers near you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
