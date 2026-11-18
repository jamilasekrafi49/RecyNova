
import { useEffect, useState } from "react";
import projectService from "../services/projectService";
import ProjectList from "../components/ProjectList";
import ProjectFilter from "../components/ProjectFilter";

function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filters, setFilters] = useState({
    difficulte: "",
    budget: "",
    temps: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => value !== "")
    );

    projectService.getAll(activeFilters)
      .then((data) => {
        setProjects(Array.isArray(data) ? data : data.results || []);
      })
      .catch(() => setError("Impossible de charger les projets."))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <section className="page-container">
      <h1>Nos projets de recyclage</h1>
      <p>Transformez vos déchets en objets utiles.</p>

      <ProjectFilter filters={filters} setFilters={setFilters} />

      {error && <p className="error-message">{error}</p>}
      {loading ? <p>Chargement des projets...</p> : (
        <ProjectList projects={projects} />
      )}
    </section>
  );
}

export default ProjectsPage;
