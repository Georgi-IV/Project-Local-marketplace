import "./about.css";

export default function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1>About LOMarketplace</h1>
        <div className="about-content">
          <section>
            <h2>Our Mission</h2>
            <p>
              LOMarketplace is a skills-based community platform where people
              can offer their services and find help from skilled individuals.
              Whether you can build a PC, change a tire, repair a fridge, or
              have any other skill to offer, you can sign up and connect with
              people who need your expertise. At the same time, if you need
              something done, you can browse and find qualified people ready to
              help.
            </p>
          </section>

          <section>
            <h2>How It Works</h2>
            <p>
              <strong>Offer Your Skills:</strong> Sign up and showcase what you
              can do. From handyman work to technical services, there's always
              someone looking for your expertise.
            </p>
            <p>
              <strong>Find Help:</strong> Need something fixed or built? Browse
              skilled professionals in your area and connect with them directly.
            </p>
            <p>
              <strong>Real Example:</strong> You needs a tire changed ASAP and
              can't do it yourself, so you post a request, and someone with the
              right skills responds and helps you out.
            </p>
          </section>

          <section>
            <h2>Why Choose Us?</h2>
            <ul>
              <li>Share your skills and earn on your own terms</li>
              <li>Find reliable, skilled people in your local community</li>
              <li>Direct connections with no middleman</li>
              <li>Simple, transparent platform for everyone</li>
            </ul>
          </section>

          <section>
            <h2>Get Started</h2>
            <p>
              Join our community today! Sign up to offer your skills or find
              someone to help with that project you've been putting off.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
