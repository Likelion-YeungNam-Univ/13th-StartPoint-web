import React from "react";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-8 rounded-2xl w-1/2">
        <h2
          className="text-[100px] font-[700] text-center"
          style={{ color: "#2E47A4" }}
        >
          Login
        </h2>

        <div className="text-[32px] font-[400] p-3 text-center">
          계정에 로그인하면 모든 정보를 볼 수 있습니다.
        </div>

        <input
          type="text"
          placeholder="아이디를 입력하세요"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
        />

        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
        />

        <button
          className="w-full text-white py-2 rounded-lg transition duration-200"
          style={{ backgroundColor: "#2E47A4" }}
        >
          로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
