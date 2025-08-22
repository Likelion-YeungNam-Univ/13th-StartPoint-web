import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const getMyPage = () => api.get("/api/users/me");      // GET
export const updateMyPage = (body) => api.put("/api/users/me", body); // PUT