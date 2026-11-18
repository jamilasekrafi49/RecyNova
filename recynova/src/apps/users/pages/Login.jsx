
import LoginForm from "../components/LoginForm";

function Login() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Bienvenue sur RecyNova</h1>
        <p>Connectez-vous pour continuer votre démarche écologique.</p>
        <LoginForm />
      </div>
    </section>
  );
}

export default Login;
