// src/pages/Login.jsx 
import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await login({
        id: form.id.trim(),
        password: form.password.trim(),
      });

      const token =
        res?.accessToken || res?.token || res?.Authorization || res?.authToken || res?.data?.accessToken;
      if (token) localStorage.setItem("accessToken", token);

      const user = res?.user || res?.data?.user || res?.member || res?.profile;
      if (user) localStorage.setItem("user", JSON.stringify(user));

      localStorage.setItem("isLoggedIn", "true");

      alert("로그인 성공!");
      window.dispatchEvent(new Event("auth-changed")); // ← 헤더/아이콘 메뉴 즉시 갱신
      // ✅ 여기만 변경: 마이페이지 → 홈
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err?.response || err);
      const msg =
        err?.response?.data?.message || "아이디 또는 비밀번호를 확인해주세요.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-4xl font-bold text-center text-blue-800">Login</h2>

        <div className="p-3 text-center">
          Log in to your account and see all the details.
        </div>

        <input
          type="text"
          name="id"
          value={form.id}
          onChange={onChange}
          placeholder="Enter your ID"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
          autoComplete="username"
        />

        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          placeholder="Enter your password"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
          autoComplete="current-password"
        />

        {error && <div className="text-red-600 text-center mb-3">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-800 text-white py-2 rounded-lg transition disabled:opacity-60"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
