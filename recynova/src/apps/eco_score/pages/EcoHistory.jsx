
import { useEffect, useState } from "react";
import ecoScoreService from "../services/ecoScoreService";
import EcoLogList from "../components/EcoLogList";

function EcoHistory() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ecoScoreService.getAll()
      .then((data) => {
        setLogs(Array.isArray(data) ? data : data.results || []);
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Chargement de l'historique...</p>;

  return (
    <section className="page-container">
      <h1>Historique écologique</h1>
      <EcoLogList logs={logs} />
    </section>
  );
}

export default EcoHistory;
