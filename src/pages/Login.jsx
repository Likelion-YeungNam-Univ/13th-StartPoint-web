import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login({ id: id.trim(), password: password.trim() });
      alert("로그인 성공!");
      navigate("/mypage");
    } catch (err) {
      console.error(err?.response || err);
      const msg =
        err?.response?.data?.message ||
        "아이디 또는 비밀번호를 확인해주세요.";
      setError(msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-1/3">
        <h2 className="text-4xl font-bold text-center text-blue-800">Login</h2>
        <div className="p-3 text-center">Log in to your account and see all the details.</div>
        {error && <div className="text-red-600 text-center mb-3">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
          />
          <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded-lg transition duration-200 hover:bg-blue-900">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
