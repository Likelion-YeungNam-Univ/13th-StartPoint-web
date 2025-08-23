import api from "./api";

export const getMyPage = () => api.get("/users/me");
export const updateMyPage = (body) => api.patch("/users/me", body);
