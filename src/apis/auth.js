import axios from "axios";
import api from "./api";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   withCredentials: true,
//   headers: { "Content-Type": "application/json" },
// });

// api.interceptors.request.use((c) => {
//   console.log("[REQ]", c.method?.toUpperCase(), (c.baseURL || "") + (c.url || ""));
//   console.log("[REQ BODY]", c.data);
//   return c;
// });
// api.interceptors.response.use(
//   (res) => { console.log("[RES]", res.status, res.config.url, res.data); return res; },
//   (err) => { console.log("[ERR]", err?.response?.status, err?.config?.url, err?.response?.data); return Promise.reject(err); }
// );

// 회원가입 그대로
export const signup = (body) =>
  api.post("/users/signup", {
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

export const login = async (body) => {
  try {
    const response = await api.post("/users/login", {
      id: body.userId ?? "",
      userId: body.userId ?? "",
      password: body.password ?? "",
    });
    return response.data;
  } catch (err) {
    if (err.response?.data?.message) {
      throw new Error(err.response.data.message);
    } else if (err.response) {
      throw new Error(`오류 발생 (status: ${err.response.status})`);
    } else if (err.request) {
      throw new Error("서버로부터 응답이 없습니다.");
    } else {
      throw new Error("요청 중 알 수 없는 오류가 발생했습니다.");
    }
  }
};

// export const login = (body) =>
//   api.post("/users/login", {
//     id: String(body.id ?? "").trim(),
//     userId: String(body.id ?? body.userId ?? "").trim(), // ← 추가
//     password: String(body.password ?? "").trim(),
//   });

export const logout = () => api.post("/users/logout");
