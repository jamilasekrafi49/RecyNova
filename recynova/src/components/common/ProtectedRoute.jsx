
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "./Loader";

function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loader message="Vérification de votre session..." />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
