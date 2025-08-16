import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Element, scroller } from "react-scroll";
import imgSection1 from "../assets/Home_Section1.png";
import imgSection2 from "../assets/Home_Section2.png";
import imgSection3 from "../assets/Home_Section3.png";
import ChatBot from "./ChatBot";

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
  const leftBtnBase =
    "w-118 h-30 rounded-xl text-xl font-semibold border border-3 transition";
  const leftBtnActive = "bg-white text-[#121B2A] border-[#121B2A] hover:brightness-95";
  const leftBtnInactive = "bg-[#121B2A] text-white border-white";
  const [panel, setPanel] = useState("none");
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedMiddle, setSelectedMiddle] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);
  const navigate = useNavigate();
  const AREA_OPTIONS = Array.from({ length: 15 }, (_, i) => `#${i + 1}`);
  const MAJORS = Array.from({ length: 10 }, (_, i) => `#${i + 1}`);
  const MIDDLES_BY_MAJOR = Object.fromEntries(
    MAJORS.map((m) => [m, Array.from({ length: 8 }, (_, i) => `#${i + 1}`)])
  );
  const SUB_BY_MIDDLE = Object.fromEntries(
    MAJORS.flatMap((m) =>
      MIDDLES_BY_MAJOR[m].map((mid) => [
        `${m}/${mid}`,
        Array.from({ length: 12 }, (_, i) => `#${i + 1}`),
      ])
    )
  );

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

  const canNextFromArea = !!selectedArea;
  const canNextFromMajor = !!selectedMajor;
  const canNextFromMiddle = !!selectedMiddle;
  const canAnalyzeFromSub = !!selectedSub;
  const areaActive = panel === "area";
  const industryActive = panel === "major" || panel === "middle" || panel === "sub";

  return (
    <Element
      name="market-research"
      id="market-research"
      className="relative isolate min-h-[calc(100vh-64px)] bg-[#0d1620]"
    >
      <img
        src={imgSection2}
        alt="상권 분석 섹션 배경"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#0d1620] via-transparent to-[#0d1620]" />

      <div className="flex flex-col absolute top-60 left-114 text-white">
        <h3 className="text-[20px] font-bold">상권분석</h3>
        <div className="mt-1 text-[14px]">상권부터 유동인구, 가능성 예측까지 한 번에 분석하기</div>
        
        <button
          type="button"
          onClick={() => openPanel("area")}
          className={`mt-6 ${leftBtnBase} ${areaActive ? leftBtnActive : leftBtnInactive}`}
        >
          동네 선택하기
        </button>

        <button
          type="button"
          onClick={() => openPanel("industry")}
          className={`mt-19.5 ${leftBtnBase} ${industryActive ? leftBtnActive : leftBtnInactive}`}
        >
          업종 선택하기
        </button>
      </div>

      <div
        className={[
          "absolute",
          "bg-white border-3 border-black rounded-2xl",
          "transition-all duration-300",
          "top-79.5 right-113 w-122 h-80",
          panel === "none" ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100 translate-y-0",
        ].join(" ")}
      >
        <div className="px-6 py-7">
          {panel === "area" && (
            <div className="grid grid-cols-4 gap-2">
              {AREA_OPTIONS.map((a) => {
                const active = selectedArea === a;
                return (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setSelectedArea((prev) => (prev === a ? null : a))}
                    className={[
                      "h-11 w-25 rounded-lg text-[14px] border transition-colors",
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
                      "h-11 w-25 rounded-lg text-[14px] border transition-colors",
                      active
                        ? "bg-sky-100 border-sky-300 text-sky-800"
                        : "bg-white border-slate-300 text-slate-700 hover:border-sky-400",
                    ].join(" ")}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          )}

          {panel === "middle" && (
            <div className="grid grid-cols-4 gap-2">
              {(selectedMajor ? MIDDLES_BY_MAJOR[selectedMajor] : []).map((mid) => {
                const active = selectedMiddle === mid;
                return (
                  <button
                    key={mid}
                    type="button"
                    onClick={() => {
                      setSelectedMiddle((prev) => (prev === mid ? null : mid));
                      setSelectedSub(null);
                    }}
                    className={[
                      "h-11 w-25 rounded-lg text-[14px] border transition-colors",
                      active
                        ? "bg-indigo-100 border-indigo-300 text-indigo-800"
                        : "bg-white border-slate-300 text-slate-700 hover:border-indigo-400",
                    ].join(" ")}
                  >
                    {mid}
                  </button>
                );
              })}
            </div>
          )}

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
                    onClick={() => setSelectedSub((prev) => (prev === s ? null : s))}
                    className={[
                      "h-11 w-25 rounded-lg text-[14px] border transition-colors",
                      active
                        ? "bg-sky-600 border-sky-500 text-white"
                        : "bg-white border-slate-300 text-slate-700 hover:border-sky-400",
                    ].join(" ")}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex items-center justify-center">
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
                  ? "bg-[#547DA0] text-white hover:brightness-95"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed",
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
                  ? "bg-[#547DA0] text-white hover:brightness-95"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed",
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
                  ? "bg-[#547DA0] text-white hover:brightness-95"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed",
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
                  ? "bg-[#547DA0] text-white hover:brightness-95"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed",
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
    { t: "탐색(Discover)", lines: ["나와 비슷한 길을 먼저 걸은 사람을 찾는 시간", "분야별, 경험별 멘토 프로필을 한눈에"] },
    { t: "연결(Connect)", lines: ["단순한 매칭이 아닌,", "진짜 대화가 시작되는 연결", "SPO와 함께하는 멘토와의 1:1 창업 컨설팅"] },
    { t: "도약(Grow)", lines: ["멘토링 그 이후를 고민하는 당신에게", "현실적인 조언과 방향성으로", "나만의 창업 여정, 한 걸음 더 나아가기"] }
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
        <h2 className="text-white text-3xl font-extrabold text-center leading-tight [text-wrap:balance]">
          SPO에서 당신의 멘토를 만나보세요!
        </h2>
        <div className="mt-6 grid grid-cols-9 gap-1">
          {CARDS.map((it) => (
            <div key={it.t} className="col-span-3 py-20 text-white text-center rounded-sm">
              <h3 className="text-xl font-semibold">{it.t}</h3>
              <p className="mt-4 text-white text-sm leading-7">
                {it.lines.map((line, i) => (
                  <span key={i} className="block">{line}</span>
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

  useEffect(() => {
    const id = location.state?.scrollTo;
    if (!id) return;
    const offset = typeof location.state?.offset === "number"
      ? location.state.offset
      : id === "home"
      ? 0
      : -8;

    scroller.scrollTo(id, {
      smooth: "easeInOutQuad",
      duration: SCROLL_DURATION_MS,
      offset,
    });
    navigate(".", { replace: true, state: null });
  }, [location.state, navigate]);

  return (
    <div>
      <Section1 />
      <Section2 />
      <Section3 />
      <ChatBot />
    </div>
  );
}
