
import { useEffect, useState } from "react";
import DetectedMaterials from "../components/DetectedMaterials";
import Recommendations from "../components/Recommendations";

function ScanResult() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const savedResult = sessionStorage.getItem("lastScanResult");

    if (savedResult) {
      setResult(JSON.parse(savedResult));
    }
  }, []);

  if (!result) {
    return (
      <section className="page-container">
        <h1>Aucun résultat disponible</h1>
        <p>Veuillez effectuer un nouveau scan.</p>
      </section>
    );
  }

  const materials =
    result.materials ||
    result.materiaux ||
    result.detected_materials ||
    [];

  const projects =
    result.recommendations ||
    result.recommandations ||
    result.projects ||
    result.projets ||
    [];

  return (
    <section className="page-container">
      <h1>Résultat de votre analyse</h1>

      <DetectedMaterials materials={materials} />
      <Recommendations projects={projects} />
    </section>
  );
}

export default ScanResult;
