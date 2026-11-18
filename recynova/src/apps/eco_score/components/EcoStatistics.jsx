
function EcoStatistics({ logs = [] }) {
  const totalKg = logs.reduce(
    (total, log) => total + Number(log.kg_reutilises || 0),
    0
  );

  return (
    <div className="eco-statistics">
      <div className="stat-card">
        <h3>{logs.length}</h3>
        <p>Projets réalisés</p>
      </div>

      <div className="stat-card">
        <h3>{totalKg.toFixed(2)} kg</h3>
        <p>Matériaux réutilisés</p>
      </div>
    </div>
  );
}

export default EcoStatistics;
