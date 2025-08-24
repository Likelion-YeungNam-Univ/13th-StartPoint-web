import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-[48px] font-[700] text-[#2E47A4] mb-4">404</h1>
      <h2 className="text-[24px] font-[500] mb-0.5 text-[#424242]">
        Page Not Found.
      </h2>
      <p className="text-[20px] font-[500] text-[#424242] mb-15">
        Sorry, we couldn't find the page you were looking for.
      </p>
      <button
        onClick={() => navigate("/")}
        className="w-[500px] h-[60px] text-[20px] text-white font-semibold rounded-[10px] bg-[#3D489E] transition cursor-pointer"
      >
        Back to home
      </button>
    </div>
  );
};

export default NotFound;
