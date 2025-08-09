import React from "react";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-1/3">
        <h2 className="text-4xl font-bold text-center text-blue-800">Login</h2>

        <div className="p-3 text-center">
          Log in to your account and see all the details.
        </div>

        <input
          type="text"
          placeholder="Enter your ID"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800"
        />

        <button className="w-full bg-blue-800 text-white py-2 rounded-lg transition duration-200">
          로그인
        </button>
      </div>
    </div>
  );
};

export default Login;
