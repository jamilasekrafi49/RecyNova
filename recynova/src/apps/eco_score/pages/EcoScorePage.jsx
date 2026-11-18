
import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import ecoScoreService from "../services/ecoScoreService";
import EcoScoreCard from "../components/EcoScoreCard";
import EcoStatistics from "../components/EcoStatistics";

function EcoScorePage() {
  const { user } = useAuth();
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

  if (loading) return <p>Chargement du score...</p>;

  return (
    <section className="page-container">
      <h1>Mon impact écologique</h1>

      <EcoScoreCard score={user?.eco_score_total || 0} />
      <EcoStatistics logs={logs} />
    </section>
  );
}

export default EcoScorePage;
