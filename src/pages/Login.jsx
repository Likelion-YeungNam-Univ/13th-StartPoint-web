import React, { useState } from "react";
import { login } from "../apis/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faKey,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const body = {
      userId: userName,
      password: password,
    };

    try {
      // 백엔드 요구 필드명에 맞춰 전송
      const res = await login(body);

      // 토큰/유저 저장 (여러 응답 케이스 커버)
      const token =
        res?.accessToken ||
        res?.token ||
        res?.Authorization ||
        res?.authToken ||
        res?.data?.accessToken;
      if (token) localStorage.setItem("accessToken", token);

      const user = res?.user || res?.data?.user || res?.member || res?.profile;
      if (user) localStorage.setItem("user", JSON.stringify(user));

      alert("로그인 성공!");
      navigate("/");
    } catch (err) {
      console.error(err?.response || err);
      const msg =
        err?.response?.data?.message || "아이디 또는 비밀번호를 확인해주세요.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleUserIdChange = (e) => {
    setUserName(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-5 rounded-2xl w-1/2">
        <h2 className="text-[48px] font-bold text-center text-[#2E47A4]">
          Login
        </h2>

        <div className="text-[20px] font-medium p-3 text-center mb-10">
          계정에 로그인하면 모든 정보를 볼 수 있습니다.
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <div className="relative w-[500px]">
            <FontAwesomeIcon
              icon={faUser}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 p-2.5"
            />
            <input
              type="text"
              value={userName}
              onChange={handleUserIdChange}
              placeholder="아이디를 입력하세요"
              className="w-full h-[67px] text-[16px] pl-14 border border-[#7E7E7E] rounded-[10px] focus:outline-none"
            />
          </div>

          <div className="relative w-[500px]">
            <FontAwesomeIcon
              icon={faKey}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 p-2.5"
            />
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="비밀번호를 입력하세요"
              className="w-full h-[67px] text-[16px] pl-14 border border-[#7E7E7E] rounded-[10px] focus:outline-none"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-[#FF0000] text-[16px] font-medium">
              <FontAwesomeIcon icon={faCircleExclamation} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            onClick={handleLogin}
            className="flex items-center justify-center bg-[#3D489E] gap-2 w-[500px] h-[50px] text-white py-2 rounded-[10px] transition cursor-pointer duration-200 hover:brightness-90"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
