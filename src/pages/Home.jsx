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
    "w-100 h-17 rounded-lg text-[19px] font-[PretendardSemiB] font-semibold transition";
  const leftBtnActive = "bg-white text-[#121B2A]";
  const leftBtnInactive = "bg-[#B3B3B3] text-white";

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

  // --- 페이지 넘기기 상태 ---
  const PAGE_SIZE = 16;
  const [areaPage, setAreaPage] = useState(1);
  const [majorPage, setMajorPage] = useState(1);
  const [middlePage, setMiddlePage] = useState(1);
  const [subPage, setSubPage] = useState(1);

  const slicePage = (arr, page) =>
    arr.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageCount = (arr) =>
    Math.max(1, Math.ceil((arr?.length || 0) / PAGE_SIZE));

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
    const majorMap = new Map();
    const middleMap = {};
    const subMap = {};

    for (const item of rows) {
      const parts = splitUpjong(item.upjong3cd);

      const { major, middle } = parts;
      const largeName = String(item.largeCategory).trim();
      const mediumName = String(item.mediumCategory).trim();
      const smallName = String(item.smallCategory).trim();
      const fullCode = String(item.upjong3cd).trim();

      if (!largeName || !mediumName || !smallName || !fullCode) continue;

      if (!majorMap.has(major)) majorMap.set(major, largeName);

      if (!middleMap[major]) middleMap[major] = [];
      if (!middleMap[major].some((m) => m.code === middle)) {
        middleMap[major].push({ code: middle, name: mediumName });
      }

      const key = `${major}/${middle}`;
      if (!subMap[key]) subMap[key] = [];
      if (!subMap[key].some((s) => s.code === fullCode)) {
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
      setAreaPage(1); // 페이지 리셋
    } else {
      setSelectedMajor(null);
      setSelectedMiddle(null);
      setSelectedSub(null);
      setPanel("major");
      setMajorPage(1);
      setMiddlePage(1);
      setSubPage(1);
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

  // --- 페이지 넘기기 ---
  const middleSource = selectedMajor ? middlesByMajor[selectedMajor] || [] : [];
  const subSource =
    selectedMajor && selectedMiddle
      ? subsByMiddle[`${selectedMajor}/${selectedMiddle}`] || []
      : [];

  const areaTotal = pageCount(areaList);
  const majorTotal = pageCount(majors);
  const middleTotal = pageCount(middleSource);
  const subTotal = pageCount(subSource);

  const areaPageItems = slicePage(areaList, Math.min(areaPage, areaTotal));
  const majorPageItems = slicePage(majors, Math.min(majorPage, majorTotal));
  const middlePageItems = slicePage(
    middleSource,
    Math.min(middlePage, middleTotal)
  );
  const subPageItems = slicePage(subSource, Math.min(subPage, subTotal));

  // 선택 변경 시 페이지 보정/리셋
  useEffect(() => {
    setMiddlePage(1);
    setSubPage(1);
  }, [selectedMajor]);

  useEffect(() => {
    setSubPage(1);
  }, [selectedMiddle]);

  // 범위 초과 보정
  useEffect(() => {
    if (majorPage > majorTotal) setMajorPage(majorTotal);
  }, [majorTotal, majorPage]);
  useEffect(() => {
    if (middlePage > middleTotal) setMiddlePage(middleTotal);
  }, [middleTotal, middlePage]);
  useEffect(() => {
    if (subPage > subTotal) setSubPage(subTotal);
  }, [subTotal, subPage]);

  // 하단 페이지 네비 컴포넌트
  const PageNav = ({ page, total, onPrev, onNext }) => {
    if (total <= 1) return null;
    const off = "opacity-0";
    const on = "cursor-pointer";
    return (
      <div className="flex items-center gap-1 text-sm select-none">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1}
          className={`px-1 text-[#547DA0] text-[16px] ${page <= 1 ? off : on}`}
          aria-label="이전 페이지"
        >
          &lt;
        </button>
        <span className="text-[#547DA0] text-[16px]">
          {page} / {total}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= total}
          className={`px-1 text-[#547DA0] text-[16px] ${
            page >= total ? off : on
          }`}
          aria-label="다음 페이지"
        >
          &gt;
        </button>
      </div>
    );
  };

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

      <div className="flex flex-col justify-center">
        {/* 좌측 상단 텍스트 */}
        <div className="flex flex-col text-white">
          <h3 className="mb-4 text-[28px] font-[PretendardB] font-bold">
            상권분석
          </h3>
          <div className="mb-16 text-[19px] font-[PretendardSemiB]">
            상권부터 유동인구, 가능성 예측까지 한 번에 분석하기
          </div>
        </div>

        {/* 버튼 및 패널 */}
        <div className="grid grid-cols-11 gap-10 items-start">
          {/* 좌측 버튼 */}
          <div className="col-span-5 flex flex-col">
            <button
              type="button"
              onClick={() => openPanel("area")}
              className={`mb-2 cursor-pointer ${leftBtnBase} ${
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
              "col-span-6 bg-white rounded-xl",
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
                  {areaPageItems.map(({ areaName, areaCode }) => {
                    const active = selectedArea === areaCode;
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
                          "h-11 w-26 rounded-lg text-[14px] text-white font-[PretendardR] transition-colors cursor-pointer",
                          active ? "bg-[#547DA0]" : "bg-[#CFCFCF]",
                        ].join(" ")}
                      >
                        {areaName}
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
                      {majorPageItems.map((major) => {
                        const active = selectedMajor === major.prefix;
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
                              setMiddlePage(1);
                              setSubPage(1);
                            }}
                            className={[
                              "h-11 w-26 rounded-lg text-[14px] text-white font-[PretendardR] transition-colors cursor-pointer",
                              active ? "bg-[#547DA0]" : "bg-[#CFCFCF]",
                            ].join(" ")}
                          >
                            {major.name}
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
                  {middlePageItems.map((mid) => {
                    const active = selectedMiddle === mid.code;
                    return (
                      <button
                        key={`${selectedMajor}-${mid.code}`}
                        type="button"
                        onClick={() => {
                          setSelectedMiddle((prev) =>
                            prev === mid.code ? null : mid.code
                          );
                          setSelectedSub(null);
                          setSubPage(1);
                        }}
                        className={[
                          "h-11 w-26 rounded-lg text-[14px] text-white font-[PretendardR] transition-colors cursor-pointer",
                          active ? "bg-[#547DA0]" : "bg-[#CFCFCF]",
                        ].join(" ")}
                      >
                        {mid.name}
                      </button>
                    );
                  })}
                  {selectedMajor && !middleSource?.length && (
                    <div className="col-span-4 text-sm text-gray-500">
                      이 대분류에 해당하는 중분류가 없습니다.
                    </div>
                  )}
                </div>
              )}

              {/* 소분류 선택 패널 */}
              {panel === "sub" && (
                <div className="grid grid-cols-4 gap-2">
                  {subPageItems.map((sub) => {
                    const active = selectedSub?.code === sub.code;
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
                          "h-11 w-26 rounded-lg text-[14px] text-white font-[PretendardR] transition-colors cursor-pointer",
                          active ? "bg-[#547DA0]" : "bg-[#CFCFCF]",
                        ].join(" ")}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                  {selectedMajor && selectedMiddle && !subSource?.length && (
                    <div className="col-span-4 text-sm text-gray-500">
                      이 중분류에 해당하는 소분류가 없습니다.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 하단 CTA + 페이지 네비 */}
            <div className="mt-auto shrink-0 px-6 pb-7 relative flex items-center justify-center">
              {panel === "area" && (
                <button
                  type="button"
                  disabled={!canNextFromArea}
                  onClick={() => {
                    setSelectedMajor(null);
                    setSelectedMiddle(null);
                    setSelectedSub(null);
                    setPanel("major");
                    setMajorPage(1);
                    setMiddlePage(1);
                    setSubPage(1);
                    if (!majors.length && !UpjongLoading) loadUpjong();
                  }}
                  className={[
                    "rounded-lg w-30 h-9 text-sm font-[PretendardR] transition-colors",
                    canNextFromArea
                      ? "bg-[#547DA0] text-white cursor-pointer "
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
                    "rounded-lg w-30 h-9 text-sm font-[PretendardR] transition-colors",
                    canNextFromMajor
                      ? "bg-[#547DA0] text-white cursor-pointer"
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
                    "rounded-lg w-30 h-9 text-sm font-[PretendardR] transition-colors",
                    canNextFromMiddle
                      ? "bg-[#547DA0] text-white cursor-pointer"
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
                    const areaCode = picked?.areaCode ?? null;
                    const areaName = picked?.areaName ?? null;
                    const upjong3cd = selectedSub?.code ?? null;
                    if (!areaCode || !areaName || !upjong3cd) return;

                    navigate("/market-result", {
                      state: { areaCode, upjong3cd, areaName },
                    });
                  }}
                  className={[
                    "rounded-lg w-30 h-9 text-sm font-[PretendardR] transition-colors",
                    canAnalyzeFromSub
                      ? "bg-[#547DA0] text-white cursor-pointer"
                      : "bg-[#CFCFCF] text-white cursor-not-allowed",
                  ].join(" ")}
                >
                  분석하기
                </button>
              )}

              {/* CTA 우측 페이지 네비(패널별) */}
              <div className="absolute right-6">
                {panel === "area" && (
                  <PageNav
                    page={areaPage}
                    total={areaTotal}
                    onPrev={() => setAreaPage((p) => Math.max(1, p - 1))}
                    onNext={() =>
                      setAreaPage((p) => Math.min(areaTotal, p + 1))
                    }
                  />
                )}
                {panel === "major" && !UpjongLoading && !UpjongError && (
                  <PageNav
                    page={majorPage}
                    total={majorTotal}
                    onPrev={() => setMajorPage((p) => Math.max(1, p - 1))}
                    onNext={() =>
                      setMajorPage((p) => Math.min(majorTotal, p + 1))
                    }
                  />
                )}
                {panel === "middle" && (
                  <PageNav
                    page={middlePage}
                    total={middleTotal}
                    onPrev={() => setMiddlePage((p) => Math.max(1, p - 1))}
                    onNext={() =>
                      setMiddlePage((p) => Math.min(middleTotal, p + 1))
                    }
                  />
                )}
                {panel === "sub" && (
                  <PageNav
                    page={subPage}
                    total={subTotal}
                    onPrev={() => setSubPage((p) => Math.max(1, p - 1))}
                    onNext={() => setSubPage((p) => Math.min(subTotal, p + 1))}
                  />
                )}
              </div>
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
            className="rounded-sm bg-[#547DA0] px-8 py-3 text-[15px] font-[PretendardB] text-white"
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
