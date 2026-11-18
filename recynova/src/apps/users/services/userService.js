
import api from "../../../services/api";

const userService = {
  register: async (data) => {
    const response = await api.post("/auth/register/", data);
    return response.data;
  },

  login: async (data) => {
    const response = await api.post("/auth/login/", data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/me/");
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put("/auth/me/", data);
    return response.data;
  },
};

export default userService;
