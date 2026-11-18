
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

import Login from "./apps/users/pages/Login";
import Register from "./apps/users/pages/Register";
import Profile from "./apps/users/pages/Profile";

import MaterialsPage from "./apps/materials/pages/MaterialsPage";

import ProjectsPage from "./apps/projects/pages/ProjectsPage";
import ProjectDetails from "./apps/projects/pages/ProjectDetails";

import ScanPage from "./apps/scans/pages/ScanPage";
import ScanResult from "./apps/scans/pages/ScanResult";
import ScanHistory from "./apps/scans/pages/ScanHistory";

import EcoScorePage from "./apps/eco_score/pages/EcoScorePage";
import EcoHistory from "./apps/eco_score/pages/EcoHistory";

import ProtectedRoute from "./components/common/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/scan/result" element={<ScanResult />} />
          <Route path="/scan/history" element={<ScanHistory />} />
          <Route path="/eco-score" element={<EcoScorePage />} />
          <Route path="/eco-history" element={<EcoHistory />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
