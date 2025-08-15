import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-scroll";
import Logo from "./assets/SPO_Logo.png";
import userIcon from "./assets/User_Icon.svg";
import useScrollSpy from "./hooks/useScrollSpy";

const NAV_H = 64;

const SECTION_IDS = ["home", "market-research", "mentoring"];

const SCROLL_DURATION_MS = 600;
const TOP_LOCK_PX = 450; // 이 값 이하에서는 Home 강조 고정

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const spyId = useScrollSpy(SECTION_IDS, NAV_H);
  const isHome = location.pathname === "/";

  // 홈 최상단 락: 스크롤이 TOP_LOCK_PX 이하이면 Home으로 고정
  const [lockHome, setLockHome] = useState(true);
  useEffect(() => {
    const onScroll = () => setLockHome(window.scrollY <= TOP_LOCK_PX);
    onScroll(); // 초기 반영
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);  // 스크롤이 발생할 때마다 (scrollY <= TOP_LOCK_PX) 조건으로 lockHome 상태를 업데이트
  }, []);   // 마운트 시 1회, 언마운트 시 1회

  // 임시 강조(override) : 클릭 직후 강조를 일정시간 유지
  const [overrideId, setOverrideId] = useState(null);
  const timerRef = useRef(null);    // 임시 강조 지속시간

  const setTempActive = (id, holdMs = SCROLL_DURATION_MS + 100) => {
    setOverrideId(id);
    if (timerRef.current) clearTimeout(timerRef.current);   // 기존에 걸려 있던 타이머가 있으면 제거
    timerRef.current = setTimeout(() => setOverrideId(null), holdMs);
  };

  // 다른 페이지 → 홈으로 라우팅 시 임시강조
  useEffect(() => {
    const target = location.state?.scrollTo;  // 옵셔널 체이닝(?.)으로 state가 없을 때도 안전하게 undefined를 반환
    if (isHome && target) {
      setTempActive(target);    // 현재 경로가 홈이고(isHome) target이 존재하면, 곧바로 setTempActive(target)을 호출해 임시 강조(overrideId)를 설정
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);   // 이 이펙트가 재실행되거나 컴포넌트가 언마운트될 때, 기존에 걸려 있던 임시강조 타이머 제거
    };
  }, [isHome, location.state]);   // isHome이 바뀔 때 또는 location.state가 바뀔 때

  // 활성 메뉴 우선순위 결정
  const activeId = isHome
    ? overrideId ?? (lockHome ? "home" : spyId)   // 임시강조 > 최상단락(Home) > 스파이
    : undefined;

  const getOffset = (id) => (id === "home" ? -(NAV_H + 1) : -(NAV_H));

  const goViaRouterState = (id) =>
    navigate("/", { state: { scrollTo: id, offset: getOffset(id) } });

// 메뉴 공통 디자인
  const menuBase =
  "px-4 py-2 cursor-pointer hover:scale-110 transition-transform transition-colors duration-200";
// 상태별 디자인
  const menuActive = "text-blue-800 scale-110 font-semibold";
  const menuInactive = "text-black";

  const MenuItem = ({ id, children }) =>{
    const isActive = activeId === id;
    const cls = `${menuBase} ${isActive ? menuActive : menuInactive}`;
    return isHome ? (
      // 홈 화면 내부에서는 <Link>로, 바로 스크롤 이동
      <Link
        to={id}
        smooth="easeInOutQuad"
        duration={SCROLL_DURATION_MS}
        offset={getOffset(id)}
        className={cls}
        onClick={() => setTempActive(id)}
      >
        {children}
      </Link>
    ) : (
      // 홈 화면 이외 페이지에서는 <button>으로, 라우팅 후 스크롤 이동
      <button
        type="button"
        onClick={() => goViaRouterState(id)}
        className={cls}
      >
        {children}
      </button>
    );
  };

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 h-16 bg-white">
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

          <img
              src={userIcon}
              alt="User_Icon"
              className="cursor-pointer"
              onClick={() => navigate("/mypage")}
            />
      </div>
    </nav>
  );
};

export default NavBar;
