import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
