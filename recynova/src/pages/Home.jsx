
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-label">♻️ RecyNova — Recyclage intelligent</span>

          <h1>
            Donnez une deuxième vie
            <span> à vos déchets.</span>
          </h1>

          <p>
            Prenez une photo de vos déchets. Notre intelligence artificielle
            identifie les matériaux et vous propose des projets créatifs
            adaptés à votre budget et à votre temps.
          </p>

          <div className="hero-actions">
            <Link
              to={user ? "/scan" : "/register"}
              className="btn btn-primary"
            >
              Commencer maintenant
            </Link>

            <Link to="/projects" className="btn btn-secondary">
              Découvrir les projets
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="/images/hero-recycling.png"
            alt="Illustration du recyclage"
          />
        </div>
      </section>

      <section className="features-section page-container">
        <h2>Comment fonctionne RecyNova ?</h2>

        <div className="features-grid">
          <article className="feature-card">
            <span>📸</span>
            <h3>1. Photographiez</h3>
            <p>Importez une photo de vos déchets.</p>
          </article>

          <article className="feature-card">
            <span>🤖</span>
            <h3>2. Analyse intelligente</h3>
            <p>L'IA identifie les matériaux présents dans votre photo.</p>
          </article>

          <article className="feature-card">
            <span>🛠️</span>
            <h3>3. Créez</h3>
            <p>Découvrez des projets adaptés à vos moyens.</p>
          </article>

          <article className="feature-card">
            <span>🌱</span>
            <h3>4. Gagnez des points</h3>
            <p>Enregistrez vos réalisations et augmentez votre Eco Score.</p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default Home;
