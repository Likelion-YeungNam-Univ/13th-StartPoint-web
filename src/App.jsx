import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MarketResult from "./pages/MarketResult";
import Mentoring from "./pages/Mentoring";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Layout from "./Layout";
import MyPage from "./pages/MyPage";
import Login from "./pages/Login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="market-result" element={<MarketResult />} />
          <Route path="mentoring" element={<Mentoring />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
