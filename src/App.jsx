import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import MarketResearch from "./pages/MarketResearch";
import Mentoring from "./pages/Mentoring";
import NotFound from "./pages/NotFound";
import Layout from "./Layout";
import MyPage from "./pages/MyPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="market-research" element={<MarketResearch />} />
          <Route path="mentoring" element={<Mentoring />} />
          <Route path="mypage" element={<MyPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
