
import { useEffect, useState } from "react";
import scanService from "../services/scanService";

function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    scanService.getAll()
      .then((data) => {
        setScans(Array.isArray(data) ? data : data.results || []);
      })
      .catch(() => setError("Impossible de charger l'historique."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement de l'historique...</p>;

  return (
    <section className="page-container">
      <h1>Historique des scans</h1>

      {error && <p className="error-message">{error}</p>}

      {scans.length === 0 ? (
        <p>Vous n'avez pas encore effectué de scan.</p>
      ) : (
        <div className="history-list">
          {scans.map((scan) => (
            <article className="history-card" key={scan.id}>
              <h3>Scan #{scan.id}</h3>
              <p>Budget : {scan.budget} DT</p>
              <p>Temps : {scan.temps_dispo} minutes</p>
              <p>Difficulté : {scan.difficulte}</p>
              <p>
                Date : {scan.created_at
                  ? new Date(scan.created_at).toLocaleDateString("fr-FR")
                  : "Non disponible"}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default ScanHistory;
