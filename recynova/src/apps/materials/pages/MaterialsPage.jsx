
import { useEffect, useState } from "react";
import materialService from "../services/materialService";
import MaterialList from "../components/MaterialList";

function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    materialService.getAll()
      .then((data) => {
        setMaterials(Array.isArray(data) ? data : data.results || []);
      })
      .catch(() => setError("Impossible de charger les matériaux."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement des matériaux...</p>;

  return (
    <section className="page-container">
      <h1>Matériaux recyclables</h1>
      <p>Découvrez les matériaux que vous pouvez réutiliser.</p>

      {error && <p className="error-message">{error}</p>}

      <MaterialList materials={materials} />
    </section>
  );
}

export default MaterialsPage;
