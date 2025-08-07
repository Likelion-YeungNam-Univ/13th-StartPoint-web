import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Layout;
