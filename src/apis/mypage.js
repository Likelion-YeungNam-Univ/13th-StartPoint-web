import api from "./api";

export const getMyPage = () => api.get("/users/me"); // GET
export const updateMyPage = (body) => api.put("/users/me", body); // PUT
