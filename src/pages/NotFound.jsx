import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-white-100 text-center px-4">
      <h1 className="text-8xl font-extrabold text-blue-800 drop-shadow-lg mb-4">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
        페이지를 찾을 수 없습니다.
      </h2>
      <p className="text-gray-700 mb-6">
        요청하신 페이지가 존재하지 않거나, 이동되었을 수 있습니다.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-blue-800 hover:bg-blue-900 text-white font-medium rounded-xl shadow-md transition cursor-pointer"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
};

export default NotFound;
