
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import projectService from "../services/projectService";
import ProjectSteps from "../components/ProjectSteps";

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    projectService.getById(id)
      .then(setProject)
      .catch(() => setError("Projet introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Chargement du projet...</p>;
  if (error || !project) return <p>{error || "Projet introuvable."}</p>;

  return (
    <section className="page-container">
      <h1>{project.titre}</h1>
      <p>{project.description}</p>

      <div className="project-meta">
        <span>Budget : {project.cout_estime} DT</span>
        <span>Durée : {project.duree_minutes} minutes</span>
        <span>Difficulté : {project.difficulte}</span>
      </div>

      <h2>Matériaux nécessaires</h2>
      <ul>
        {(project.materiaux || []).map((material) => (
          <li key={material.id}>{material.nom}</li>
        ))}
      </ul>

      <ProjectSteps steps={project.etapes || []} />
    </section>
  );
}

export default ProjectDetails;
