
function MaterialCard({ material }) {
  return (
    <div className="material-card">
      <div className="material-icon">♻️</div>
      <h3>{material.nom}</h3>
      <p>
        Poids moyen : {material.poids_moyen_kg ?? 0} kg
      </p>
    </div>
  );
}

export default MaterialCard;
