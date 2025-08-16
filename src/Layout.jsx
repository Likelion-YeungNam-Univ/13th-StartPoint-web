import React from "react";
import NavBar from "./NavBar";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 pt-16">
        <ScrollToTop />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
