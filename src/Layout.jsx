import React from "react";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 pt-14">
        <ScrollToTop />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
