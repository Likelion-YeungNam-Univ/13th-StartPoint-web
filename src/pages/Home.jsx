import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Element, scroller } from "react-scroll";
import imgSection1 from "../assets/Home_Section1.png";
import imgSection2 from "../assets/Home_Section2.png";
import imgSection3 from "../assets/Home_Section3.png";

const SCROLL_DURATION_MS = 500;

function Section1() {
  return (
    <Element
      name="home"
      id="home"
      className="relative isolate min-h-[100vh] scroll-mt-16 bg-[#0d1620]"
    >
      <img
        src={imgSection1}
        alt="홈 섹션 배경"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent to-[#0d1620]" />
      <div className="min-h-[100vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-white text-4xl font-extrabold">
            Start Pointer &gt;&gt; <span>SPO</span>
          </h1>
          <div>
            <p className="text-white/90 text-base ">
              경산시에서 어떻게 창업해야 할지 모르겠을 땐 스포하세요!
            </p>
            <p className="text-white/90 text-base ">
              상권분석부터 지원금, 멘토까지 창업의 A to Z를 한 번에
            </p>
          </div>
        </div>
      </div>
    </Element>
  );
}

function Section2() {
  // ===== 디자인 토큰 =====
  const LEFT = { top: "18%", left: "10%", w: 480 };
  const RIGHT = { top: "12%", right: "10%", w: 620, minH: 360 };
  const GLASS = "bg-white/12 backdrop-blur border border-white/25";
  // =======================

  // 패널 단계: 'none' | 'area' | 'major' | 'sub'
  const [panel, setPanel] = React.useState("none");

  // 선택 상태
  const [selectedArea, setSelectedArea] = React.useState(null); // 단일
  const [selectedMajor, setSelectedMajor] = React.useState(null); // 단일
  const [selectedSubs, setSelectedSubs] = React.useState([]); // 다중

  const navigate = useNavigate();

  // --- 더미 데이터 ---
  const AREA_OPTIONS = Array.from({ length: 15 }, (_, i) => `#${i + 1}`); // 동네 15
  const MAJORS = Array.from({ length: 10 }, (_, i) => `#${i + 1}`); // 대분류 10
  const SUB_BY_MAJOR = Object.fromEntries(
    MAJORS.map((m) => [m, Array.from({ length: 15 }, (_, i) => `#${i + 1}`)]) // 각 15
  );

  const toggleMulti = (list, setter, v) =>
    setter(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const openPanel = (type) => {
    if (type === "area") {
      setPanel("area");
    } else {
      setSelectedMajor(null);
      setSelectedSubs([]);
      setPanel("major");
    }
    requestAnimationFrame(() =>
      scroller.scrollTo("market-research", {
        smooth: "easeInOutQuad",
        duration: 300,
        offset: -8,
      })
    );
  };

  // 버튼 활성 조건
  const canNextFromArea = !!selectedArea;
  const canNextFromMajor = !!selectedMajor;
  const canAnalyzeFromSub = selectedSubs.length > 0;

  // 왼쪽 버튼 스타일 (기본: 어둡게, 활성: 흰색)
  const leftBtnBase =
    "w-full h-[72px] rounded-xl font-semibold transition shadow-[0_8px_20px_rgba(0,0,0,0.25)] border";
  const leftBtnActive =
    "bg-white text-gray-900 border-white/70 hover:brightness-95";
  const leftBtnInactive =
    "bg-slate-900/85 text-white border-white/20 hover:bg-slate-900";

  const areaActive = panel === "area";
  const industryActive = panel === "major" || panel === "sub";

  return (
    <Element
      name="market-research"
      id="market-research"
      className="relative isolate min-h-[calc(100vh-64px)] bg-[#0d1620]"
    >
      {/* 배경 */}
      <img
        src={imgSection2}
        alt="상권 분석 섹션 배경"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0d1620] via-transparent to-[#0d1620]" />

      {/* 좌측: 제목 + 두 버튼 */}
      <div
        className="absolute text-white"
        style={{ top: LEFT.top, left: LEFT.left, width: LEFT.w }}
      >
        <div className="mb-4">
          <div className="text-[20px] font-bold">상권분석</div>
          <div className="mt-1 text-[12px] text-white/85">
            상권부터 유동인구, 가능성 예측까지 한 번에 분석하기
          </div>
        </div>

        {/* 동네 선택 (활성 시 흰색) */}
        <button
          type="button"
          onClick={() => openPanel("area")}
          className={`${leftBtnBase} ${
            areaActive ? leftBtnActive : leftBtnInactive
          }`}
        >
          동네 선택하기
        </button>

        {/* 업종 선택 (활성 시 흰색) */}
        <button
          type="button"
          onClick={() => openPanel("industry")}
          className={`mt-6 ${leftBtnBase} ${
            industryActive ? leftBtnActive : leftBtnInactive
          }`}
        >
          업종 선택하기
        </button>
      </div>

      {/* 우측 패널 */}
      <div
        className={[
          "absolute text-white rounded-2xl shadow-xl",
          GLASS,
          "transition-all duration-300",
          panel === "none"
            ? "opacity-0 translate-y-2 pointer-events-none"
            : "opacity-100 translate-y-0",
        ].join(" ")}
        style={{
          top: RIGHT.top,
          right: RIGHT.right,
          width: RIGHT.w,
          minHeight: RIGHT.minH,
        }}
      >
        {/* ===== 내용 ===== */}
        <div className="p-5">
          {/* 동네: 15개 / 5열 / 단일 선택 토글 */}
          {panel === "area" && (
            <div className="grid grid-cols-5 gap-2">
              {AREA_OPTIONS.map((a) => {
                const active = selectedArea === a;
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() =>
                      setSelectedArea((prev) => (prev === a ? null : a))
                    }
                    className={[
                      "h-10 rounded-lg text-[14px] border",
                      active
                        ? "bg-[#547DA0] text-[#FDFDFD] border-[#D4EBFF]  "
                        : "bg-[#FDFDFD] text-[#547DA0] border-[#547DA0] border-dashed",
                      "hover:bg-[#547DA0]/70 hover:text-[#FDFDFD] hover:border-[#D4EBFF] hover:border-solid",
                    ].join(" ")}
                  >
                    {a}
                  </button>
                );
              })}
            </div>
          )}

          {/* 업종 - 대분류: 10개 / 5열 / 단일 선택 토글 */}
          {panel === "major" && (
            <div className="grid grid-cols-5 gap-2">
              {MAJORS.map((m) => {
                const active = selectedMajor === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() =>
                      setSelectedMajor((prev) => (prev === m ? null : m))
                    }
                    className={[
                      "h-10 rounded-lg text-[14px] border",
                      active
                        ? "bg-white/25 border-white/40"
                        : "bg-white/10 border-white/20 hover:bg-white/15",
                    ].join(" ")}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          )}

          {/* 업종 - 중분류: 15개 / 5열 / 다중 선택 토글 */}
          {panel === "sub" && (
            <div className="grid grid-cols-5 gap-2">
              {(selectedMajor ? SUB_BY_MAJOR[selectedMajor] : []).map((s) => {
                const active = selectedSubs.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() =>
                      toggleMulti(selectedSubs, setSelectedSubs, s)
                    }
                    className={[
                      "h-10 rounded-lg text-[14px] border",
                      active
                        ? "bg-sky-600/85 border-sky-400 text-white"
                        : "bg-white/8 border-white/20 hover:bg-white/12 text-white",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ===== 푸터 (가운데 정렬, 닫기 제거) ===== */}
        <div className="px-5 pb-5 flex items-center justify-center">
          {/* 동네 → 다음 (선택 전 비활성) */}
          {panel === "area" && (
            <button
              type="button"
              disabled={!canNextFromArea}
              onClick={() => {
                setSelectedMajor(null);
                setSelectedSubs([]);
                setPanel("major");
              }}
              className={[
                "rounded-lg px-6 py-2 text-sm font-semibold",
                canNextFromArea
                  ? "bg-sky-600 hover:bg-sky-500"
                  : "bg-white/10 text-white/50 cursor-not-allowed",
              ].join(" ")}
            >
              다음
            </button>
          )}

          {/* 대분류 → 다음 (선택 전 비활성) */}
          {panel === "major" && (
            <button
              type="button"
              disabled={!canNextFromMajor}
              onClick={() => setPanel("sub")}
              className={[
                "rounded-lg px-6 py-2 text-sm font-semibold",
                canNextFromMajor
                  ? "bg-sky-600 hover:bg-sky-500"
                  : "bg-white/10 text-white/50 cursor-not-allowed",
              ].join(" ")}
            >
              다음
            </button>
          )}

          {/* 중분류 → 분석하기 (선택 전 비활성) */}
          {panel === "sub" && (
            <button
              type="button"
              disabled={!canAnalyzeFromSub}
              onClick={() => navigate("/market-result")}
              className={[
                "rounded-lg px-6 py-2 text-sm font-semibold",
                canAnalyzeFromSub
                  ? "bg-sky-600 hover:bg-sky-500"
                  : "bg-white/10 text-white/50 cursor-not-allowed",
              ].join(" ")}
            >
              분석하기
            </button>
          )}
        </div>
      </div>
    </Element>
  );
}

function Section3() {
  const navigate = useNavigate();

  const CARDS = [
    {
      t: "탐색(Discover)",
      lines: [
        "나와 비슷한 길을 먼저 걸은 사람을 찾는 시간",
        "분야별, 경험별 멘토 프로필을 한눈에",
      ],
    },
    {
      t: "연결(Connect)",
      lines: [
        "단순한 매칭이 아닌,",
        "진짜 대화가 시작되는 연결",
        "SPO와 함께하는 멘토와의 1:1 창업 컨설팅",
      ],
    },
    {
      t: "도약(Grow)",
      lines: [
        "멘토링 그 이후를 고민하는 당신에게",
        "현실적인 조언과 방향성으로",
        "나만의 창업 여정, 한 걸음 더 나아가기",
      ],
    },
  ];

  return (
    <Element
      name="mentoring"
      id="mentoring"
      className="relative isolate min-h-[calc(100vh-64px)] scroll-mt-16 bg-[#0d1620]"
    >
      <img
        src={imgSection3}
        alt="멘토 탐색 섹션 배경"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0d1620] via-transparent to-[#0d1620]" />

      <div className="mx-auto max-w-screen-xl px-6 py-24">
        {/* 제목은 균형 잡힌 줄바꿈 */}
        <h2 className="text-white text-3xl font-extrabold text-center leading-tight [text-wrap:balance]">
          SPO에서 당신의 멘토를 만나보세요!
        </h2>

        {/* 카드 3개 */}
        <div className="mt-6 grid grid-cols-9 gap-1">
          {CARDS.map((it) => (
            <div
              key={it.t}
              className="col-span-3 py-20 text-white text-center rounded-sm"
            >
              <h3 className="text-xl font-semibold">{it.t}</h3>

              <p className="mt-4 text-white text-sm leading-7">
                {it.lines.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/mentoring")}
            className="rounded-lg bg-[#547DA0] px-7 py-3 text-base font-semibold text-white hover:bg-[#547DA0]/80 transition"
          >
            멘토 탐색 바로가기
          </button>
        </div>
      </div>
    </Element>
  );
}

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  // 다른 페이지 → 네비 클릭: state.scrollTo 로 목적지 전달 받으면 스크롤
  useEffect(() => {
    const id = location.state?.scrollTo;
    if (!id) return;
    const offset =
      typeof location.state?.offset === "number"
        ? location.state.offset
        : id === "home"
        ? 0
        : -8;

    scroller.scrollTo(id, {
      smooth: "easeInOutQuad",
      duration: SCROLL_DURATION_MS,
      offset,
    });

    // state 초기화 (뒤로가기 오염 방지)
    navigate(".", { replace: true, state: null });
  }, [location.state, navigate]);

  return (
    <div>
      <Section1 />
      <Section2 />
      <Section3 />
    </div>
  );
}
