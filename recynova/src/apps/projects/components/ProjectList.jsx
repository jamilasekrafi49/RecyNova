
import ProjectCard from "./ProjectCard";

function ProjectList({ projects = [] }) {
  if (projects.length === 0) {
    return <p>Aucun projet trouvé.</p>;
  }

  return (
    <div className="projects-grid">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

export default ProjectList;
