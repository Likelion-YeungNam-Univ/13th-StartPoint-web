// src/hooks/useScrollSpy.js
import { useEffect, useRef, useState } from "react";

/**
 * sectionIds: 상단에서부터의 섹션 id 배열 (예: ["home","market-research","mentoring"])
 * headerOffset: 고정 네비 높이(px)
 */
export default function useScrollSpy(sectionIds, headerOffset = 64) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");
  const rafRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const getSections = () =>
      sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    let sections = getSections();
    if (sections.length === 0) return;

    const compute = () => {
      try {
        sections = getSections();
        if (sections.length === 0) return;

        // 문서 좌표(페이지 최상단 기준)로 계산 → 레이아웃 변화에 가장 안정적
        const list = sections
          .map((el) => ({ id: el.id, top: el.offsetTop || 0 }))
          .sort((a, b) => a.top - b.top);

        // 스크롤 기준선(네비 하단) + 약간의 스냅 버퍼
        const SNAP_PX = 120; // 이 안에서는 이전 섹션을 유지
        const line = (window.scrollY || 0) + headerOffset + 1;

        // line + SNAP_PX 이하인 것들 중 "가장 아래" 섹션을 활성으로 선택
        let pick = list[0].id;
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].top <= line + SNAP_PX) {
            pick = list[i].id;
          } else {
            break;
          }
        }

        if (pick !== activeId) setActiveId(pick);
      } catch {
        // 방어: 크래시 방지
      }
    };

    // 최초 1회
    compute();

    const onScrollOrResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [JSON.stringify(sectionIds), headerOffset]);

  return activeId;
}
