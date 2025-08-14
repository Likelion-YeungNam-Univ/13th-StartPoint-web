import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1
        className="text-[160px] font-[700] text-blue-800"
        style={{ color: "#2E47A4" }}
      >
        404
      </h1>
      <h2
        className="text-2xl md:text-3xl font-semibold mb-3"
        style={{ color: "#424242" }}
      >
        Page Not Found.
      </h2>
      <p className="mb-11" style={{ color: "#424242" }}>
        Sorry, we couldn't find the page you were looking for.
      </p>
      <button
        onClick={() => navigate("/")}
        className="px-12 py-2 text-white font-medium rounded-[40px] shadow-md transition cursor-pointer"
        style={{ backgroundColor: "#2E47A4" }}
      >
        Back to home
      </button>
    </div>
  );
};

export default NotFound;
