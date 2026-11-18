
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Vérifier les mots de passe
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // Vérifier la longueur du mot de passe
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        nom: nom.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      };

      await register(userData);

      // Redirection après inscription réussie
      navigate("/dashboard");

    } catch (err) {
      console.error(
        "Erreur Register :",
        err.response?.data || err
      );

      const data = err.response?.data;

      if (data?.nom) {
        setError(data.nom[0]);
      } else if (data?.email) {
        setError(data.email[0]);
      } else if (data?.password) {
        setError(data.password[0]);
      } else if (data?.detail) {
        setError(data.detail);
      } else if (data?.error) {
        setError(data.error);
      } else if (data?.message) {
        setError(data.message);
      } else {
        setError(
          "Impossible de créer le compte. Vérifiez votre connexion au serveur."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {/* Nom complet */}
      <div className="form-group">
        <label htmlFor="register-nom">
          Nom complet
        </label>

        <input
          id="register-nom"
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Votre nom complet"
          required
        />
      </div>

      {/* Email */}
      <div className="form-group">
        <label htmlFor="register-email">
          Adresse email
        </label>

        <input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="exemple@email.com"
          required
        />
      </div>

      {/* Mot de passe */}
      <div className="form-group">
        <label htmlFor="register-password">
          Mot de passe
        </label>

        <input
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          placeholder="Minimum 8 caractères"
          required
        />
      </div>

      {/* Confirmation */}
      <div className="form-group">
        <label htmlFor="register-confirm">
          Confirmer le mot de passe
        </label>

        <input
          id="register-confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          minLength={8}
          placeholder="Confirmez votre mot de passe"
          required
        />
      </div>

      {/* Bouton */}
      <button type="submit" disabled={loading}>
        {loading
          ? "Création du compte..."
          : "Créer mon compte"}
      </button>

      <p>
        Vous avez déjà un compte ?{" "}
        <Link to="/login">
          Se connecter
        </Link>
      </p>

    </form>
  );
}

export default RegisterForm;
