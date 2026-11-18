
import { useAuth } from "../../../context/AuthContext";
import ProfileForm from "../components/ProfileForm";

function Profile() {
  const { user } = useAuth();

  return (
    <section className="page-container">
      <h1>Mon profil</h1>
      <p>Bonjour {user?.nom || user?.email} !</p>
      <ProfileForm />
    </section>
  );
}

export default Profile;
