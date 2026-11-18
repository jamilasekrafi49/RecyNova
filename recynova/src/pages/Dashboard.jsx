
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import EcoScoreCard from "../apps/eco_score/components/EcoScoreCard";

function Dashboard() {
  const { user } = useAuth();

  return (
    <section className="page-container dashboard">
      <h1>
        Bonjour {user?.nom || "Bienvenue"} 👋
      </h1>

      <p>Prêt à donner une nouvelle vie à vos déchets ?</p>

      <EcoScoreCard score={user?.eco_score_total || 0} />

      <div className="dashboard-grid">
        <Link to="/scan" className="dashboard-card">
          <span>📸</span>
          <h3>Scanner mes déchets</h3>
          <p>Identifier mes matériaux avec l'IA.</p>
        </Link>

        <Link to="/projects" className="dashboard-card">
          <span>🛠️</span>
          <h3>Explorer les projets</h3>
          <p>Découvrir les idées de réutilisation.</p>
        </Link>

        <Link to="/eco-history" className="dashboard-card">
          <span>🌱</span>
          <h3>Mon historique écologique</h3>
          <p>Suivre mes réalisations.</p>
        </Link>

        <Link to="/profile" className="dashboard-card">
          <span>👤</span>
          <h3>Mon profil</h3>
          <p>Gérer mes informations personnelles.</p>
        </Link>
      </div>
    </section>
  );
}

export default Dashboard;
