
import MaterialCard from "./MaterialCard";

function MaterialList({ materials = [] }) {
  if (materials.length === 0) {
    return <p>Aucun matériau disponible.</p>;
  }

  return (
    <div className="materials-grid">
      {materials.map((material) => (
        <MaterialCard key={material.id} material={material} />
      ))}
    </div>
  );
}

export default MaterialList;
