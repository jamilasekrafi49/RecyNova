
function EcoScoreCard({ score = 0 }) {
  return (
    <div className="eco-score-card">
      <div className="eco-score-icon">🌱</div>
      <h2>Mon Eco Score</h2>
      <p className="eco-score-value">{score} points</p>
      <p>Continuez à recycler pour protéger notre planète !</p>
    </div>
  );
}

export default EcoScoreCard;
