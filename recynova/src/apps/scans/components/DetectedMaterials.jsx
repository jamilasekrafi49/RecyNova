
function DetectedMaterials({ materials = [] }) {
  return (
    <section className="detected-materials">
      <h2>Matériaux détectés par l'IA</h2>

      {materials.length === 0 ? (
        <p>Aucun matériau détecté.</p>
      ) : (
        <ul>
          {materials.map((item, index) => {
            const material = item.material || item;
            return (
              <li key={item.id || index}>
                {material.nom || material.name || "Matériau"}
                {item.quantite ? ` — Quantité : ${item.quantite}` : ""}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default DetectedMaterials;
