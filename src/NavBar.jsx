
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "./assets/SPO_Logo.png";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveLink = (path) =>
    `p-4 cursor-pointer ${
      location.pathname === path ? "text-blue-600" : "text-gray-900"
    }`;

  return (
    <nav className="flex justify-between min-h-18 px-4 py-2 border-b overflow-hidden">
      <img
        src={Logo}
        alt="Logo"
        onClick={() => navigate("/")}
        className="cursor-pointer object-cover h-14"
      />

      <span className="flex justify-center">
        <Link to="/" className={getActiveLink("/")}>Home</Link>
        <Link to="/market-research" className={getActiveLink("/market-research")}>상권 분석</Link>
        <Link to="/mentoring" className={getActiveLink("/mentoring")}>멘토 탐색</Link>
      </span>

      <Link to="/mypage" className={getActiveLink("/mypage")} aria-label="마이페이지">
        프로필 아이콘
      </Link>
    </nav>
  );
};

export default NavBar;
