
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // États du formulaire
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // États de gestion
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    // Vérifier le nom
    if (!nom.trim()) {
      setError("Veuillez saisir votre nom complet.");
      return;
    }

    // Vérifier l'email
    if (!email.trim()) {
      setError("Veuillez saisir votre adresse email.");
      return;
    }

    // Vérifier la longueur du mot de passe
    if (password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    // Vérifier la confirmation
    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      // Préparer les données à envoyer à Django
      const userData = {
        nom: nom.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      };

      // Appeler l'API Register
      await register(userData);

      // Redirection après inscription réussie
      navigate("/dashboard");

    } catch (err) {
      console.error(
        "Erreur lors de l'inscription :",
        err.response?.data || err
      );

      const data = err.response?.data;

      // Afficher les erreurs retournées par Django
      if (typeof data === "string") {
        setError(data);
      } else if (data?.nom) {
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

      {/* Message d'erreur */}
      {error && (
        <p className="error-message" role="alert">
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
          autoComplete="name"
          required
        />
      </div>

      {/* Adresse email */}
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
          autoComplete="email"
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
          placeholder="Minimum 8 caractères"
          minLength={8}
          autoComplete="new-password"
          required
        />
      </div>

      {/* Confirmation du mot de passe */}
      <div className="form-group">
        <label htmlFor="register-confirm">
          Confirmer le mot de passe
        </label>

        <input
          id="register-confirm"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Répétez votre mot de passe"
          minLength={8}
          autoComplete="new-password"
          required
        />
      </div>

      {/* Bouton d'inscription */}
      <button type="submit" disabled={loading}>
        {loading
          ? "Création du compte..."
          : "Créer mon compte"}
      </button>

      {/* Lien vers Login */}
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
