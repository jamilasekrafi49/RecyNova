
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="not-found">
      <h1>404</h1>
      <h2>Page introuvable</h2>
      <p>La page que vous recherchez n'existe pas.</p>
      <Link to="/" className="btn btn-primary">
        Retour à l'accueil
      </Link>
    </section>
  );
}

export default NotFound;
