
export const API_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

export const DIFFICULTIES = [
  { value: "facile", label: "Facile" },
  { value: "moyen", label: "Moyen" },
  { value: "difficile", label: "Difficile" },
];

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  MATERIALS: "/materials",
  PROJECTS: "/projects",
  SCAN: "/scan",
  ECO_SCORE: "/eco-score",
};
