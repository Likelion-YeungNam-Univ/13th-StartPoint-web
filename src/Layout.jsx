import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <div id="nav-sentinel" />
      <main className="flex-1 pt-16 bg-[#0d1620]">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
