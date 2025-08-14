// src/NavBar.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-scroll";
import Logo from "./assets/SPO_Logo.png";
import useScrollSpy from "./hooks/useScrollSpy";

const NAV_H = 64;
// 실제 존재하는 섹션만!
const SECTION_IDS = ["home", "market-research", "mentoring"];

const SCROLL_DURATION_MS = 600;
const TOP_LOCK_PX = 240; // 최상단 락 구간(px): 이 값 이하에서는 Home 강조 고정

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 상단/투명 전환 (nav-sentinel 기반)
  const [isTop, setIsTop] = useState(true);
  useEffect(() => {
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;
    const io = new IntersectionObserver(([e]) => setIsTop(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // 스크롤 스파이
  const spiedId = useScrollSpy(SECTION_IDS, NAV_H);
  const isHome = location.pathname === "/";

  // 홈 최상단 락: 스크롤이 TOP_LOCK_PX 이하이면 Home으로 고정
  const [lockHome, setLockHome] = useState(true);
  useEffect(() => {
    const onScroll = () => setLockHome((window.scrollY || 0) <= TOP_LOCK_PX);
    onScroll(); // 초기 반영
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 임시 강조(override) — 클릭 직후 강조를 일정시간 유지
  const [overrideId, setOverrideId] = useState(null);
  const timerRef = useRef(null);

  const setTempActive = (id, holdMs = SCROLL_DURATION_MS + 150) => {
    setOverrideId(id);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOverrideId(null), holdMs);
  };

  // 다른 페이지 → 홈으로 라우팅되며 state.scrollTo 전달 시 즉시 임시강조
  useEffect(() => {
    const target = location.state?.scrollTo;
    if (isHome && target) {
      setTempActive(target);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isHome, location.state]);

  // 활성 메뉴 결정: 임시강조 > 최상단락(Home) > 스파이
  const activeId = isHome
    ? overrideId ?? (lockHome ? "home" : spiedId)
    : undefined;

  const getOffset = (id) => (id === "home" ? -65 : -65);

  const goViaRouterState = (id) =>
    navigate("/", { state: { scrollTo: id, offset: getOffset(id) } });

  const getItemClass = (id) => {
    const isActive = activeId === id;
    const color = isActive
      ? "text-blue-500"
      : isTop
      ? "text-black"
      : "text-white";
    return [
      "px-4 py-2 cursor-pointer hover:scale-110",
      "transition-transform transition-colors duration-200",
      color,
      isActive ? "scale-110 font-semibold" : "",
    ]
      .filter(Boolean)
      .join(" ");
  };

  const MenuItem = ({ id, children }) =>
    isHome ? (
      <Link
        to={id}
        smooth="easeInOutQuad"
        duration={SCROLL_DURATION_MS}
        offset={getOffset(id)}
        className={getItemClass(id)}
        onClick={() => setTempActive(id)}
      >
        {children}
      </Link>
    ) : (
      <button
        type="button"
        onClick={() => goViaRouterState(id)}
        className={getItemClass(id)}
      >
        {children}
      </button>
    );

  return (
    <nav
      className={[
        "fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300",
        isTop
          ? "bg-white backdrop-blur-md border-b border-black/10"
          : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-screen-xl h-full flex items-center justify-between px-4">
        {isHome ? (
          <Link
            to="home"
            smooth="easeInOutQuad"
            duration={SCROLL_DURATION_MS}
            offset={getOffset("home")}
            className="cursor-pointer"
            onClick={() => setTempActive("home")}
          >
            <img src={Logo} alt="Logo" className="object-cover h-10" />
          </Link>
        ) : (
          <img
            src={Logo}
            alt="Logo"
            onClick={() => goViaRouterState("home")}
            className="cursor-pointer object-cover h-10"
          />
        )}

        <div className="flex items-center gap-6">
          <MenuItem id="home">Home</MenuItem>
          <MenuItem id="market-research">상권 분석</MenuItem>
          <MenuItem id="mentoring">멘토 탐색</MenuItem>
        </div>

        <div className={isTop ? "px-4 text-gray-900" : "px-4 text-white"}>
          프로필 아이콘
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
