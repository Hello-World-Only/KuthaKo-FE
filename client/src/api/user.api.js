import api from "./axiosInstance";

export const updateUser = (userId, data) => {
    return api.put(`/update-user/${userId}`, data);
};

export const getCurrentUser = () => {
    return api.get("/me");
};