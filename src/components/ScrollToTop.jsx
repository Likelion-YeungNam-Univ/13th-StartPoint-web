import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export default function ScrollToTop({ selector = null }) {
  const location = useLocation();
  const navType = useNavigationType(); // "PUSH" | "POP" | "REPLACE"

  useEffect(() => {
    // 뒤/앞으로(POP)는 기존 스크롤 보존
    if (navType === "POP") return;
    // #hash 이동은 보존
    if (location.hash) return;
    // Home이 state.scrollTo로 섹션 스크롤할 땐 방해하지 않음
    if (location.state && location.state.scrollTo) return;

    const el = selector ? document.querySelector(selector) : null;
    (el ?? window).scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname, location.hash, location.state, navType, selector]);

  return null;
}
