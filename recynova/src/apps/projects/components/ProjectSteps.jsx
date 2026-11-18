
function ProjectSteps({ steps = [] }) {
  if (!steps.length) {
    return <p>Les étapes ne sont pas encore disponibles.</p>;
  }

  return (
    <div className="project-steps">
      <h2>Étapes de réalisation</h2>

      <ol>
        {steps.map((step, index) => (
          <li key={index}>
            {typeof step === "string"
              ? step
              : step.description || step.titre || JSON.stringify(step)}
          </li>
        ))}
      </ol>
    </div>
  );
}

export default ProjectSteps;
