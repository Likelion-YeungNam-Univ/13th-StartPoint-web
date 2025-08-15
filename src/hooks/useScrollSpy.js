// src/hooks/useScrollSpy.js
import { useEffect, useRef, useState } from "react";

/**
 * sectionIds: 상단에서부터의 섹션 id 배열 (["home","market-research","mentoring"])
 * headerOffset: 고정 NavBar 높이(px)
 */
export default function useScrollSpy(sectionIds, headerOffset = 64) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");  // 활성 Id 보관하는 상태
  const rafRef = useRef(null);

  // 최신 activeId와 비교하기 위한 ref (불필요한 setState 호출 줄이기, 선택 사항)
  const activeRef = useRef(activeId); // 현재 활성 Id를 담아둘 ref
  useEffect(() => {
    activeRef.current = activeId;
  }, [activeId]);   // 활성 Id가 바뀔 때마다 ref값도 최신화

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const getSections = () =>
      sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    // 스크롤 위치에 따라 현재 활성 섹션을 계산하는 함수
    const compute = () => {
      try {
        // 현재 DOM에 있는 섹션 목록을 가져오고, 하나도 없으면 계산을 스킵
        const sections = getSections();
        if (sections.length === 0) return;

        // 문서 좌표 기준(페이지 최상단 기준)
        const list = sections
          .map((el) => ({ id: el.id, top: el.offsetTop || 0 }))
          .sort((a, b) => a.top - b.top);

        // 스크롤 기준선(네비 하단)
        const line = window.scrollY + headerOffset;

        let pick = list[0].id;
        for (let i = 0; i < list.length; i += 1) {
          if (list[i].top <= line) {
            pick = list[i].id;
          } else {
            break;
          }
        }

        if (pick !== activeRef.current) setActiveId(pick);
      } catch {
        // 예외 방지
      }
    };

    // 초기 1회 호출
    compute();

    const onScrollOrResize = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScrollOrResize);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [JSON.stringify(sectionIds), headerOffset]);

  return activeId;
}
