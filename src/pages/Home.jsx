import React, { useEffect, useState } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import { Element, scroller } from "react-scroll";
import imgSection1 from "../assets/Home_Section1.png";
import imgSection2 from "../assets/Home_Section2.png";
import imgSection3 from "../assets/Home_Section3.png";
import upjongListApi from "../apis/upjongListApi";

const SCROLL_DURATION_MS = 500;

function Section1() {
  return (
    <Element
      name="home"
      id="home"
      className="relative isolate min-h-[100vh] scroll-mt-14 bg-[#121B2A]"
    >
      <img
        src={imgSection1}
        alt="홈 섹션 배경"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        loading="eager"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent from-10% to-[#121B2A] to-85%" />
      <div className="min-h-[100vh] flex items-center justify-center">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-white text-[62px] font-[PretendardB] font-bold">
            Start Pointer &gt;&gt; <span>SPO</span>
          </h1>
          <div>
            <p className="text-white text-[25.5px] font-[PretendardR]">
              경산시에서 어떻게 창업해야 할지 모르겠을 땐 스포하세요!
            </p>
            <p className="text-white text-[25.5px] font-[PretendardR]">
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
  const [panel, setPanel] = useState("none");

  // 선택 상태
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const [selectedMiddle, setSelectedMiddle] = useState(null);
  const [selectedSub, setSelectedSub] = useState(null);

  const navigate = useNavigate();

  // ------- 동네 이름 코드 -------
  const areaList = [
    { areaName: "서부1동", areaCode: "47290541" },
    { areaName: "서부2동", areaCode: "47290542" },
    { areaName: "중방동", areaCode: "47290510" },
    { areaName: "중앙동", areaCode: "47290520" },
    { areaName: "남부동", areaCode: "47290530" },
    { areaName: "남천면", areaCode: "47290370" },
    { areaName: "동부동", areaCode: "47290560" },
    { areaName: "남산면", areaCode: "47290350" },
    { areaName: "자인면", areaCode: "47290330" },
    { areaName: "용성면", areaCode: "47290340" },
    { areaName: "진량읍", areaCode: "47290253" },
    { areaName: "압량면", areaCode: "47290256" },
    { areaName: "북부동", areaCode: "47290550" },
    { areaName: "하양읍", areaCode: "47290250" },
    { areaName: "와촌면", areaCode: "47290310" },
  ];

  // ------- 업종 코드 -------
  // 대분류: 앞에 두 자리
  const [majors, setMajors] = useState([]);
  // 중분류: 가운데 두 자리
  const [middlesByMajor, setMiddlesByMajor] = useState({});
  // 소분류: 끝에 두 자리
  const [subsByMiddle, setSubsByMiddle] = useState({});

  const [UpjongLoading, setUpjongLoading] = useState(false);
  const [UpjongError, setUpjongError] = useState(null);

  // 예시: 'N10805' → { major:'N1', middle:'08', small:'05' }
  const splitUpjong = (code) => {
    const split = String(code).trim();
    return {
      major: split.slice(0, 2),
      middle: split.slice(2, 4),
      small: split.slice(4, 6),
    };
  };

  // API 배열 → 대/중/소 분류
  const categorization = (rows) => {
    const majorMap = new Map(); // 대분류 코드와 이름을 맵핑
    const middleMap = {}; // 대분류 코드에 해당하는 중분류 목록을 저장
    const subMap = {}; // 대분류와 중분류 코드를 합친 key값에 해당하는 소분류 목록을 저장

    for (const item of rows) {
      const parts = splitUpjong(item.upjong3cd);

      const { major, middle } = parts;
      const largeName = String(item.largeCategory).trim();
      const mediumName = String(item.mediumCategory).trim();
      const smallName = String(item.smallCategory).trim();
      const fullCode = String(item.upjong3cd).trim();

      if (!largeName || !mediumName || !smallName || !fullCode) continue;

      // 데이터들을 순회하면서 대분류가 이미 추가되었는지 확인하고, 추가되지 않았을 경우에만 majorMap에 새로운 대분류로 등록
      if (!majorMap.has(major)) majorMap.set(major, largeName);

      if (!middleMap[major]) middleMap[major] = [];
      if (!middleMap[major].some((major) => major.code === middle)) {
        middleMap[major].push({ code: middle, name: mediumName });
      }

      const key = `${major}/${middle}`;
      if (!subMap[key]) subMap[key] = [];
      if (!subMap[key].some((sub) => sub.code === fullCode)) {
        subMap[key].push({ code: fullCode, name: smallName });
      }
    }

    const majors = Array.from(majorMap, ([prefix, name]) => ({ prefix, name }));
    return { majors, middlesByMajor: middleMap, subsByMiddle: subMap };
  };

  const loadUpjong = async () => {
    if (UpjongLoading) return;
    setUpjongLoading(true);
    setUpjongError(null);
    try {
      const data = await upjongListApi();
      const categorizedData = categorization(data);
      setMajors(categorizedData.majors);
      setMiddlesByMajor(categorizedData.middlesByMajor);
      setSubsByMiddle(categorizedData.subsByMiddle);
    } catch (e) {
      console.error(e);
      setUpjongError("업종 목록을 불러오지 못했습니다.");
    } finally {
      setUpjongLoading(false);
    }
  };

  // 패널 열기 (업종은 첫 진입 때만 로드)
  const openPanel = (type) => {
    if (type === "area") {
      setPanel("area");
    } else {
      setSelectedMajor(null);
      setSelectedMiddle(null);
      setSelectedSub(null);
      setPanel("major");
      if (!majors.length && !UpjongLoading) loadUpjong();
    }
  };

  // 버튼 활성 조건
  const canNextFromArea = !!selectedArea;
  const canNextFromMajor = !!selectedMajor;
  const canNextFromMiddle = !!selectedMiddle;
  const canAnalyzeFromSub = !!selectedSub;

  const areaActive = panel === "area";
  const UpjongActive =
    panel === "major" || panel === "middle" || panel === "sub";

  return (
    <Element
      name="market-research"
      id="market-research"
      className="flex items-center justify-center relative isolate min-h-[calc(100vh-56px)] bg-[#121B2A]"
    >
      {/* 배경 이미지 */}
      <img
        src={imgSection2}
        alt="상권 분석 섹션 배경"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#121B2A] from-10% via-transparent via-50% to-[#121B2A] to-90%" />

      <div className="flex flex-col justify-center mb-20">
        {/* 좌측 상단 텍스트 */}
        <div className="flex flex-col text-white">
          <h3 className="mb-1 text-[20px] font-bold">상권분석</h3>
          <div className="mb-6 text-[14px]">
            상권부터 유동인구, 가능성 예측까지 한 번에 분석하기
          </div>
        </div>

        {/* 버튼 및 패널 */}
        <div className="grid grid-cols-12 gap-7 items-start">
          {/* 좌측 버튼 */}
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
              onClick={() => openPanel("Upjong")}
              className={`cursor-pointer ${leftBtnBase} ${
                UpjongActive ? leftBtnActive : leftBtnInactive
              }`}
            >
              업종 선택하기
            </button>
          </div>

          {/* 우측 패널 */}
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
                  {areaList.map(({ areaName, areaCode }) => {
                    const active = selectedArea === areaCode; // 선택값은 areaCode로 저장
                    return (
                      <button
                        key={areaCode}
                        type="button"
                        onClick={() =>
                          setSelectedArea((prev) =>
                            prev === areaCode ? null : areaCode
                          )
                        }
                        className={[
                          "h-11 w-25 rounded-lg text-[14px] border transition-colors cursor-pointer",
                          active
                            ? "bg-[#547DA0] text-[#FDFDFD] border-[#D4EBFF]"
                            : "bg-white text-[#547DA0] border-[#547DA0] border-dashed hover:border-sky-500 hover:text-sky-700",
                        ].join(" ")}
                      >
                        {areaName} {/* 화면엔 이름 표시 */}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 대분류 선택 패널 */}
              {panel === "major" && (
                <>
                  {UpjongLoading && (
                    <div className="text-sm text-gray-500">
                      업종 불러오는 중…
                    </div>
                  )}
                  {UpjongError && (
                    <div className="text-sm text-red-600">{UpjongError}</div>
                  )}
                  {!UpjongLoading && !UpjongError && (
                    <div className="grid grid-cols-4 gap-2">
                      {majors.map((major) => {
                        const active = selectedMajor === major.prefix; // "N1" 등
                        return (
                          <button
                            key={major.prefix}
                            type="button"
                            onClick={() => {
                              setSelectedMajor((prev) =>
                                prev === major.prefix ? null : major.prefix
                              );
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
                            {major.name} {/* 대분류명 */}
                          </button>
                        );
                      })}
                      {!majors.length && (
                        <div className="col-span-4 text-sm text-gray-500">
                          표시할 대분류가 없습니다.
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* 중분류 선택 패널 */}
              {panel === "middle" && (
                <div className="grid grid-cols-4 gap-2">
                  {(selectedMajor ? middlesByMajor[selectedMajor] : []).map(
                    (mid) => {
                      const active = selectedMiddle === mid.code; // "08" 등
                      return (
                        <button
                          key={`${selectedMajor}-${mid.code}`}
                          type="button"
                          onClick={() => {
                            setSelectedMiddle((prev) =>
                              prev === mid.code ? null : mid.code
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
                          {mid.name}
                        </button>
                      );
                    }
                  )}
                  {selectedMajor && !middlesByMajor[selectedMajor]?.length && (
                    <div className="col-span-4 text-sm text-gray-500">
                      이 대분류에 해당하는 중분류가 없습니다.
                    </div>
                  )}
                </div>
              )}

              {/* 소분류 선택 패널 */}
              {panel === "sub" && (
                <div className="grid grid-cols-4 gap-2">
                  {(selectedMajor && selectedMiddle
                    ? subsByMiddle[`${selectedMajor}/${selectedMiddle}`]
                    : []
                  ).map((sub) => {
                    const active = selectedSub?.code === sub.code; // "N10805"
                    return (
                      <button
                        key={sub.code}
                        type="button"
                        onClick={() =>
                          setSelectedSub((prev) =>
                            prev?.code === sub.code ? null : sub
                          )
                        }
                        className={[
                          "h-11 w-25 rounded-lg text-[14px] border transition-colors cursor-pointer",
                          active
                            ? "bg-[#547DA0] text-[#FDFDFD] border-[#D4EBFF]"
                            : "bg-white text-[#547DA0] border-[#547DA0] border-dashed hover:border-sky-500 hover:text-sky-700",
                        ].join(" ")}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                  {selectedMajor &&
                    selectedMiddle &&
                    !subsByMiddle[`${selectedMajor}/${selectedMiddle}`]
                      ?.length && (
                      <div className="col-span-4 text-sm text-gray-500">
                        이 중분류에 해당하는 소분류가 없습니다.
                      </div>
                    )}
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
                    if (!majors.length && !UpjongLoading) loadUpjong();
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
                  onClick={() => {
                    const picked = areaList.find(
                      (area) => area.areaCode === selectedArea
                    );
                    const areaCode = picked?.areaCode ?? null; // 8자리 코드
                    const areaName = picked?.areaName ?? null;
                    const upjong3cd = selectedSub?.code ?? null; // 예: "N10805"

                    if (!areaCode || !areaName || !upjong3cd) return;

                    // areaCode, areaName, upjong3cd 전달
                    navigate("/market-result", {
                      state: {
                        areaCode: areaCode,
                        upjong3cd: upjong3cd,
                        areaName: areaName,
                      },
                    });
                  }}
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
        "나와 비슷한 길을",
        "먼저 걸은 사람을 찾는 시간",
        "분야별, 경험별 멘토 프로필을 한눈에",
      ],
    },
    {
      t: "연결(Connect)",
      lines: [
        "단순한 매칭이 아닌,",
        "진짜 대화가 시작되는 연결",
        "멘토와의 1:1 창업 컨설팅",
      ],
    },
    {
      t: "도약(Grow)",
      lines: [
        "시작 그 이후를 고민하는 당신에게",
        "현실적인 조언으로 나만의 창업,",
        "한 걸음 더 나아가기",
      ],
    },
  ];

  return (
    <Element
      name="mentoring"
      id="mentoring"
      className="relative isolate flex items-center min-h-[calc(100vh-56px)] scroll-mt-14 bg-[#121B2A]"
    >
      <img
        src={imgSection3}
        alt="멘토 탐색 섹션 배경"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
        loading="lazy"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#121B2A] from-10% via-transparent via-50% to-[#121B2A] to-90%" />

      <div className="flex flex-col justify-center items-center mx-auto max-w-screen-xl px-6 py-12">
        {/* 큰 제목 */}
        <h2 className="text-white text-[47px] font-[PretendardB] font-bold text-center leading-tight [text-wrap:balance]">
          SPO에서 당신의 멘토를 만나보세요!
        </h2>

        {/* 카드 3개 내용 */}
        <div className="mt-4 grid grid-cols-9 gap-14">
          {CARDS.map((it) => (
            <div
              key={it.t}
              className="col-span-3 py-20 text-white text-center rounded-sm"
            >
              <h3 className="text-[28px] font-[PretendardB] font-bold">
                {it.t}
              </h3>

              <p className="mt-10 text-[19px] font-[PretendardSemiB] leading-7">
                {it.lines.map((line, i) => (
                  <span key={i} className="block">
                    {line}
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-2 flex justify-center">
          <button
            type="button"
            onClick={() => navigate("/mentoring")}
            className="rounded-sm bg-[#547DA0] px-8 py-3 text-[15px] font-[PretendardB] text-white hover:bg-[#547DA0]/80 transition"
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
