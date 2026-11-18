
import ProjectList from "../../projects/components/ProjectList";

function Recommendations({ projects = [] }) {
  return (
    <section className="recommendations">
      <h2>Projets recommandés</h2>
      <p>Voici les projets qui correspondent à votre scan.</p>
      <ProjectList projects={projects} />
    </section>
  );
}

export default Recommendations;
