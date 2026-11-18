
function ProjectFilter({ filters, setFilters }) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFilters((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      difficulte: "",
      budget: "",
      temps: "",
    });
  };

  return (
    <div className="filters">
      <select
        name="difficulte"
        value={filters.difficulte}
        onChange={handleChange}
      >
        <option value="">Toutes les difficultés</option>
        <option value="facile">Facile</option>
        <option value="moyen">Moyen</option>
        <option value="difficile">Difficile</option>
      </select>

      <input
        type="number"
        name="budget"
        placeholder="Budget maximum (DT)"
        min="0"
        value={filters.budget}
        onChange={handleChange}
      />

      <input
        type="number"
        name="temps"
        placeholder="Temps disponible (minutes)"
        min="0"
        value={filters.temps}
        onChange={handleChange}
      />

      <button type="button" onClick={resetFilters}>
        Réinitialiser
      </button>
    </div>
  );
}

export default ProjectFilter;
