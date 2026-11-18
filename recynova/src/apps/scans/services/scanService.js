
import api from "../../../services/api";

const scanService = {
  getAll: async () => {
    const response = await api.get("/scans/");
    return response.data;
  },

  create: async (formData) => {
    const response = await api.post("/scans/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};

export default scanService;
