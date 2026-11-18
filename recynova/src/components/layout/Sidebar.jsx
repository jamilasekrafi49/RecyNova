
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Mon espace</h3>

      <NavLink to="/dashboard">Tableau de bord</NavLink>
      <NavLink to="/scan">Scanner mes déchets</NavLink>
      <NavLink to="/scan/history">Historique des scans</NavLink>
      <NavLink to="/projects">Projets</NavLink>
      <NavLink to="/materials">Matériaux</NavLink>
      <NavLink to="/eco-score">Mon Eco Score</NavLink>
      <NavLink to="/eco-history">Historique écologique</NavLink>
      <NavLink to="/profile">Mon profil</NavLink>
    </aside>
  );
}

export default Sidebar;
