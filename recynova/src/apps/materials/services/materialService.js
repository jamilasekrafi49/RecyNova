
import api from "../../../services/api";

const materialService = {
  getAll: async () => {
    const response = await api.get("/materials/");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/materials/${id}/`);
    return response.data;
  },
};

export default materialService;
