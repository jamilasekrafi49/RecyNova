
function EcoLogList({ logs = [] }) {
  if (logs.length === 0) {
    return <p>Aucune activité écologique enregistrée.</p>;
  }

  return (
    <div className="eco-log-list">
      {logs.map((log) => (
        <article className="history-card" key={log.id}>
          <h3>
            {log.project_titre ||
              log.project?.titre ||
              `Projet #${log.project}`}
          </h3>

          <p>Matériaux réutilisés : {log.kg_reutilises} kg</p>
          <p>
            Date : {log.date
              ? new Date(log.date).toLocaleDateString("fr-FR")
              : "Non disponible"}
          </p>
        </article>
      ))}
    </div>
  );
}

export default EcoLogList;
