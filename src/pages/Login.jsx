import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faKey,
  faCircleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // 입력값 아무거나 넣어놔서 변경해야함
  const handleLogin = () => {
    if (userId !== "testuser" || password !== "1234") {
      setErrorMessage("회원정보가 존재하지 않습니다. 다시 입력해주세요.");
    } else {
      setErrorMessage("");
      navigate("/");
    }
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
    if (errorMessage) setErrorMessage("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errorMessage) setErrorMessage("");
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
              value={userId}
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

          {errorMessage && (
            <div className="flex items-center gap-2 text-[#FF0000] text-[16px] font-medium">
              <FontAwesomeIcon icon={faCircleExclamation} />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            onClick={handleLogin}
            className="flex items-center justify-center gap-2 w-[500px] h-[50px] text-white py-2 rounded-[10px] transition duration-200"
            style={{ backgroundColor: "#3D489E" }}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
