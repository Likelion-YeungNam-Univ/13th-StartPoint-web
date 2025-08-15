import React, { useEffect, useState } from "react";
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
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-white text-[80px] font-extrabold">
            Start Pointer &gt;&gt; <span>SPO</span>
          </h1>
          <div>
            <p className="text-white text-[29.5px]">
              경산시에서 어떻게 창업해야 할지 모르겠을 땐 스포하세요!
            </p>
            <p className="text-white text-[29.5px]">
              상권분석부터 지원금, 멘토까지 창업의 A to Z를 한 번에
            </p>
          </div>
        </div>
      </div>
    </Element>
  );
}

function Section2() {
  // 왼쪽 버튼 기본, 조건부 스타일
  const leftBtnBase =
    "w-120 h-30 rounded-xl text-xl font-semibold border border-3 transition";
  const leftBtnActive =
    "bg-white text-[#121B2A] border-[#121B2A] hover:brightness-95";
  const leftBtnInactive = "bg-[#121B2A] text-white border-white";

  // 패널 상태: 'none' | 'area' | 'major' | 'middle' | 'sub'
  //            선택X     동네     대분류     중분류    소분류
  const [panel, setPanel] = useState("none");

  // 선택 상태
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedMiddle, setSelectedMiddle] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  const navigate = useNavigate();

  // ------- 여기부터 API로 변경해야 됨 -------

  // 지금은 더미 데이터
  const AREA_OPTIONS = Array.from({ length: 15 }, (_, i) => `#${i + 1}`); // 동네 15개
  const MAJORS = Array.from({ length: 10 }, (_, i) => `#${i + 1}`); // 대분류 10개

  // 대분류별 중분류 8개
  const MIDDLES_BY_MAJOR = Object.fromEntries(
    MAJORS.map((m) => [m, Array.from({ length: 8 }, (_, i) => `#${i + 1}`)])
  );

  // 중분류별 소분류 12개
  const SUB_BY_MIDDLE = Object.fromEntries(
    MAJORS.flatMap((m) =>
      MIDDLES_BY_MAJOR[m].map((mid) => [
        `${m}/${mid}`,
        Array.from({ length: 12 }, (_, i) => `#${i + 1}`),
      ])
    )
  );

  // ------- 여기까지 -------

  const openPanel = (type) => {
    if (type === "area") {
      setPanel("area");
    } else {
      setSelectedMajor(null);
      setSelectedMiddle(null);
      setSelectedSub(null);
      setPanel("major");
    }
  };

  // 버튼 활성 조건
  const canNextFromArea = !!selectedArea;
  const canNextFromMajor = !!selectedMajor;
  const canNextFromMiddle = !!selectedMiddle;
  const canAnalyzeFromSub = !!selectedSub;

  const areaActive = panel === "area";
  const industryActive =
    panel === "major" || panel === "middle" || panel === "sub";

  return (
    <Element
      name="market-research"
      id="market-research"
      className="flex items-center justify-center relative isolate min-h-[calc(100vh-64px)] bg-[#0d1620]"
    >
      {/* 배경 이미지 */}
      <img
        src={imgSection2}
        alt="상권 분석 섹션 배경"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0d1620] via-transparent to-[#0d1620]" />

      <div className="flex flex-col justify-center mb-20">
        {/* 좌측 상단 텍스트 */}
        <div className="flex flex-col text-white">
          <h3 className="mb-1 text-[20px] font-bold">상권분석</h3>
          <div className="mb-6 text-[14px]">
            상권부터 유동인구, 가능성 예측까지 한 번에 분석하기
          </div>
        </div>
        {/*버튼 및 패널*/}
        <div className="grid grid-cols-12 gap-7 items-start">
          {/*좌측 버튼*/}
          <div className="col-span-6 flex flex-col">
            <button
              type="button"
              onClick={() => openPanel("area")}
              className={`mb-20 cursor-pointer ${leftBtnBase} ${
                areaActive ? leftBtnActive : leftBtnInactive
              }`}
            >
              동네 선택하기
            </button>

            <button
              type="button"
              onClick={() => openPanel("industry")}
              className={`cursor-pointer ${leftBtnBase} ${
                industryActive ? leftBtnActive : leftBtnInactive
              }`}
            >
              업종 선택하기
            </button>
          </div>

          {/*우측 패널*/}
          <div
            className={[
              "col-span-6 bg-white border-3 border-black rounded-2xl",
              "transition-all duration-300",
              "w-full h-80",
              "flex flex-col",
              panel === "none"
                ? "opacity-0 translate-y-2 pointer-events-none"
                : "opacity-100 translate-y-0",
            ].join(" ")}
          >
            <div className="px-6 py-7">
              {/* 동네 선택 패널 */}
              {panel === "area" && (
                <div className="grid grid-cols-4 gap-2">
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
                          "h-11 w-25 rounded-lg text-[14px] border transition-colors cursor-pointer",
                          active
                            ? "bg-[#547DA0] text-[#FDFDFD] border-[#D4EBFF]"
                            : "bg-white text-[#547DA0] border-[#547DA0] border-dashed hover:border-sky-500 hover:text-sky-700",
                        ].join(" ")}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 대분류 선택 패널 */}
              {panel === "major" && (
                <div className="grid grid-cols-4 gap-2">
                  {MAJORS.map((m) => {
                    const active = selectedMajor === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setSelectedMajor((prev) => (prev === m ? null : m));
                          setSelectedMiddle(null);
                          setSelectedSub(null);
                        }}
                        className={[
                          "h-11 w-25 rounded-lg text-[14px] border transition-colors cursor-pointer",
                          active
                            ? "bg-[#547DA0] text-[#FDFDFD] border-[#D4EBFF]"
                            : "bg-white text-[#547DA0] border-[#547DA0] border-dashed hover:border-sky-500 hover:text-sky-700",
                        ].join(" ")}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 중분류 선택 패널 */}
              {panel === "middle" && (
                <div className="grid grid-cols-4 gap-2">
                  {(selectedMajor ? MIDDLES_BY_MAJOR[selectedMajor] : []).map(
                    (mid) => {
                      const active = selectedMiddle === mid;
                      return (
                        <button
                          key={mid}
                          type="button"
                          onClick={() => {
                            setSelectedMiddle((prev) =>
                              prev === mid ? null : mid
                            );
                            setSelectedSub(null);
                          }}
                          className={[
                            "h-11 w-25 rounded-lg text-[14px] border transition-colors cursor-pointer",
                            active
                              ? "bg-[#547DA0] text-[#FDFDFD] border-[#D4EBFF]"
                              : "bg-white text-[#547DA0] border-[#547DA0] border-dashed hover:border-sky-500 hover:text-sky-700",
                          ].join(" ")}
                        >
                          {mid}
                        </button>
                      );
                    }
                  )}
                </div>
              )}

              {/* 소분류 선택 패널 */}
              {panel === "sub" && (
                <div className="grid grid-cols-4 gap-2">
                  {(selectedMajor && selectedMiddle
                    ? SUB_BY_MIDDLE[`${selectedMajor}/${selectedMiddle}`]
                    : []
                  ).map((s, i) => {
                    const active = selectedSub === s;
                    return (
                      <button
                        key={`${selectedMajor}-${selectedMiddle}-${i}`}
                        type="button"
                        onClick={() =>
                          setSelectedSub((prev) => (prev === s ? null : s))
                        }
                        className={[
                          "h-11 w-25 rounded-lg text-[14px] border transition-colors cursor-pointer",
                          active
                            ? "bg-[#547DA0] text-[#FDFDFD] border-[#D4EBFF]"
                            : "bg-white text-[#547DA0] border-[#547DA0] border-dashed hover:border-sky-500 hover:text-sky-700",
                        ].join(" ")}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 하단 CTA 버튼 */}
            <div className="mt-auto shrink-0 px-6 pb-5.5 flex items-center justify-center">
              {panel === "area" && (
                <button
                  type="button"
                  disabled={!canNextFromArea}
                  onClick={() => {
                    setSelectedMajor(null);
                    setSelectedMiddle(null);
                    setSelectedSub(null);
                    setPanel("major");
                  }}
                  className={[
                    "rounded-lg w-30 h-9 text-sm font-semibold transition-colors",
                    canNextFromArea
                      ? "bg-[#547DA0] text-white cursor-pointer hover:brightness-95"
                      : "bg-[#CFCFCF] text-white cursor-not-allowed",
                  ].join(" ")}
                >
                  다음
                </button>
              )}

              {panel === "major" && (
                <button
                  type="button"
                  disabled={!canNextFromMajor}
                  onClick={() => setPanel("middle")}
                  className={[
                    "rounded-lg w-30 h-9 text-sm font-semibold transition-colors",
                    canNextFromMajor
                      ? "bg-[#547DA0] text-white cursor-pointer hover:brightness-95"
                      : "bg-[#CFCFCF] text-white cursor-not-allowed",
                  ].join(" ")}
                >
                  다음
                </button>
              )}

              {panel === "middle" && (
                <button
                  type="button"
                  disabled={!canNextFromMiddle}
                  onClick={() => setPanel("sub")}
                  className={[
                    "rounded-lg w-30 h-9 text-sm font-semibold transition-colors",
                    canNextFromMiddle
                      ? "bg-[#547DA0] text-white cursor-pointer hover:brightness-95"
                      : "bg-[#CFCFCF] text-white cursor-not-allowed",
                  ].join(" ")}
                >
                  다음
                </button>
              )}

              {panel === "sub" && (
                <button
                  type="button"
                  disabled={!canAnalyzeFromSub}
                  onClick={() => navigate("/market-result")}
                  className={[
                    "rounded-lg w-30 h-9 text-sm font-semibold transition-colors",
                    canAnalyzeFromSub
                      ? "bg-[#547DA0] text-white cursor-pointer hover:brightness-95"
                      : "bg-[#CFCFCF] text-white cursor-not-allowed",
                  ].join(" ")}
                >
                  분석하기
                </button>
              )}
            </div>
          </div>
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
