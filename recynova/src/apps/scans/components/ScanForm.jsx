
import { useState } from "react";
import ImageUploader from "./ImageUploader";

function ScanForm({ onSubmit, loading }) {
  const [image, setImage] = useState(null);
  const [budget, setBudget] = useState("");
  const [temps, setTemps] = useState("");
  const [difficulte, setDifficulte] = useState("facile");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!image) {
      alert("Veuillez sélectionner une image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("budget", budget || "0");
    formData.append("temps_dispo", temps);
    formData.append("difficulte", difficulte);

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="scan-form">
      <ImageUploader image={image} setImage={setImage} />

      <label>Votre budget (DT)</label>
      <input
        type="number"
        min="0"
        value={budget}
        onChange={(e) => setBudget(e.target.value)}
        required
      />

      <label>Temps disponible (minutes)</label>
      <input
        type="number"
        min="1"
        value={temps}
        onChange={(e) => setTemps(e.target.value)}
        required
      />

      <label>Difficulté souhaitée</label>
      <select
        value={difficulte}
        onChange={(e) => setDifficulte(e.target.value)}
      >
        <option value="facile">Facile</option>
        <option value="moyen">Moyen</option>
        <option value="difficile">Difficile</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Analyse en cours..." : "Analyser mon image"}
      </button>
    </form>
  );
}

export default ScanForm;
