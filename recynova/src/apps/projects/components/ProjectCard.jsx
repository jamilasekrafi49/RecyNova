
import { Link } from "react-router-dom";

function ProjectCard({ project }) {
  const imageUrl = project.image
    ? project.image.startsWith("http")
      ? project.image
      : `http://127.0.0.1:8000${project.image}`
    : null;

  return (
    <article className="project-card">
      {imageUrl ? (
        <img src={imageUrl} alt={project.titre} />
      ) : (
        <div className="project-placeholder">♻️</div>
      )}

      <div className="project-card-content">
        <h3>{project.titre}</h3>
        <p>{project.description}</p>

        <div className="project-meta">
          <span>{project.cout_estime} DT</span>
          <span>{project.duree_minutes} min</span>
          <span>{project.difficulte}</span>
        </div>

        <Link to={`/projects/${project.id}`} className="btn btn-primary">
          Voir le projet
        </Link>
      </div>
    </article>
  );
}

export default ProjectCard;
