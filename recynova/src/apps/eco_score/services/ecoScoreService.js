
import api from "../../../services/api";

const ecoScoreService = {
  getAll: async () => {
    const response = await api.get("/eco-score/");
    return response.data;
  },

  completeProject: async (data) => {
    const response = await api.post("/eco-score/", data);
    return response.data;
  },
};

export default ecoScoreService;
