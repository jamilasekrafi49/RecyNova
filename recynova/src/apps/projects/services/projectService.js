
import api from "../../../services/api";

const projectService = {
  getAll: async (filters = {}) => {
    const response = await api.get("/projects/", {
      params: filters,
    });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/projects/${id}/`);
    return response.data;
  },
};

export default projectService;
