import axios from "axios";
import api from "./api";

export const signup = async (body) =>
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

export const authLogin = async (body) => {
  try {
    const response = await api.post("/users/login", {
      id: body.userId ?? "",
      userId: body.userId ?? "",
      password: body.password ?? "",
    });
    // console.log(response);
    // console.log(response.status);
    // console.log(response.data);
    // console.log(response.headers);
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

export const authLogout = () => api.post("/users/logout");

export const myPage = async (accessToken) => {
  const result = await api(accessToken).get("users/me");
  console.log(result.data);

  return result.data;
};

export const updateMyPage = async (token, body) => {
  try {
    const result = await api.put();
  } catch (err) {}
};
