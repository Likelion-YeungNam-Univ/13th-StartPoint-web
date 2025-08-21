import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((c) => {
  console.log("[REQ]", c.method?.toUpperCase(), (c.baseURL || "") + (c.url || ""));
  console.log("[REQ BODY]", c.data);
  return c;
});
api.interceptors.response.use(
  (res) => { console.log("[RES]", res.status, res.config.url, res.data); return res; },
  (err) => { console.log("[ERR]", err?.response?.status, err?.config?.url, err?.response?.data); return Promise.reject(err); }
);

// 회원가입 그대로
export const signup = (body) =>
  api.post("/api/users/signup", {
    name: String(body.name ?? ""),
    birth: String(body.birth ?? ""),
    email: String(body.email ?? ""),
    id: body.id ?? body.userId ?? "",
    userId: body.userId ?? body.id ?? "",
    password: String(body.password ?? ""),
    role: String(body.role ?? "").toUpperCase(),
    phone: String(body.phone ?? ""),
  });

// ✅ 로그인: id와 userId를 함께 전송
export const login = (body) =>
  api.post("/api/users/login", {
    id: String(body.id ?? "").trim(),
    userId: String(body.id ?? body.userId ?? "").trim(), // ← 추가
    password: String(body.password ?? "").trim(),
  });

export const logout = () => api.post("/api/users/logout");
