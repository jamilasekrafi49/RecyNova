
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import scanService from "../services/scanService";
import ScanForm from "../components/ScanForm";

function ScanPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleScan = async (formData) => {
    setLoading(true);
    setError("");

    try {
      const result = await scanService.create(formData);

      sessionStorage.setItem("lastScanResult", JSON.stringify(result));
      navigate("/scan/result");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Une erreur est survenue pendant l'analyse."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page-container">
      <h1>Scanner mes déchets</h1>
      <p>
        Ajoutez une photo et indiquez votre budget, votre temps disponible
        et la difficulté souhaitée.
      </p>

      {error && <p className="error-message">{error}</p>}

      <ScanForm onSubmit={handleScan} loading={loading} />
    </section>
  );
}

export default ScanPage;
