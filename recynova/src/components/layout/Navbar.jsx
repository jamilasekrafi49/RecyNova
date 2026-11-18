
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <span>♻️</span> RecyNova
      </Link>

      <nav>
        <NavLink to="/">Accueil</NavLink>
        <NavLink to="/projects">Projets</NavLink>
        <NavLink to="/materials">Matériaux</NavLink>

        {user && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/scan">Scanner</NavLink>
            <NavLink to="/eco-score">Eco Score</NavLink>
            <NavLink to="/profile">Profil</NavLink>
            <button onClick={handleLogout}>Déconnexion</button>
          </>
        )}

        {!user && (
          <>
            <NavLink to="/login">Connexion</NavLink>
            <NavLink to="/register">Inscription</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
