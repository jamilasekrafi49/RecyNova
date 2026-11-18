
import { useEffect, useState } from "react";
import userService from "../services/userService";
import { useAuth } from "../../../context/AuthContext";

function ProfileForm() {
  const { user, setUser } = useAuth();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setNom(user?.nom || "");
    setEmail(user?.email || "");
  }, [user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const updatedUser = await userService.updateProfile({ nom, email });
      setUser(updatedUser);
      setMessage("Profil mis à jour avec succès.");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        "Impossible de mettre à jour le profil."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="form-group">
        <label htmlFor="profile-nom">Nom</label>
        <input
          id="profile-nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="profile-email">Email</label>
        <input
          id="profile-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Enregistrement..." : "Enregistrer les modifications"}
      </button>
    </form>
  );
}

export default ProfileForm;
