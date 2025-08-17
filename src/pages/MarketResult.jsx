import React, { useEffect, useMemo, useState } from "react";
import analysis from "../assets/Analysis.svg";
import sales from "../assets/Sales.svg";
import industry from "../assets/Industry.svg";
import population from "../assets/Population.svg";
import vector from "../assets/Vector.svg";
import check from "../assets/Check.svg";
import icon from "../assets/Icon.svg";
import shop from "../assets/Shop.svg";
import people from "../assets/People.svg";
import downIcon from "../assets/Down.svg";
import upIcon from "../assets/Up.svg";
import back from "../assets/Back.svg";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { PieChart } from "react-minimal-pie-chart";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import fetchMarketResult from "../apis/marketResultApi";

// --- 필요한 최소 헬퍼만 유지: 요일/시간 최댓값 ---
const getMaxDay = (p) => {
  if (!p) return { label: "—", value: null };
  const dayMap = [
    ["mon", "월"],
    ["tues", "화"],
    ["wed", "수"],
    ["thur", "목"],
    ["fri", "금"],
    ["sat", "토"],
    ["sun", "일"],
  ];
  let best = { label: "—", value: -Infinity };
  for (const [k, label] of dayMap) {
    const v = Number(p?.[k]);
    if (!Number.isNaN(v) && v > best.value) best = { label, value: v };
  }
  return best.value === -Infinity ? { label: "—", value: null } : best;
};

const getMaxHour = (p) => {
  if (!p) return { label: "—", value: null };
  const hourMap = [
    ["firstHour", "05-09"],
    ["secondHour", "09-12"],
    ["thirdHour", "12-14"],
    ["fourthHour", "14-18"],
    ["fifthHour", "18-23"],
    ["sixthHour", "23-05"],
  ];
  let best = { label: "—", value: -Infinity };
  for (const [k, label] of hourMap) {
    const v = Number(p?.[k]);
    if (!Number.isNaN(v) && v > best.value) best = { label, value: v };
  }
  return best.value === -Infinity ? { label: "—", value: null } : best;
};

const MarketResult = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // --- 파라미터 수집(쿼리 우선, state 폴백), simpleLoc 인라인 디코드(+ -> 공백 포함) ---
  const locationObj = useLocation();
  const [sp] = useSearchParams();

  const rawLoc =
    sp.get("simpleLoc") ||
    (typeof locationObj.state?.areaName === "string"
      ? locationObj.state.areaName
      : "") ||
    "";

  const params = useMemo(() => {
    const admiCd = sp.get("admiCd") || locationObj.state?.areaCode || "";
    const upjongCd = sp.get("upjongCd") || locationObj.state?.upjong3cd || "";
    const simpleLoc = rawLoc
      ? decodeURIComponent(String(rawLoc)).replace(/\+/g, " ")
      : "";
    return { admiCd, upjongCd, simpleLoc };
  }, [sp, locationObj.state, rawLoc]);

  // --- API 상태 ---
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // 모달 열림 시 스크롤 제어
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  // 데이터 로드
  useEffect(() => {
    if (!params.admiCd || !params.upjongCd || !params.simpleLoc) {
      setLoading(false);
      setErrMsg("필수 파라미터가 누락되었습니다. 홈에서 다시 선택해 주세요.");
      return;
    }
    let alive = true;
    setLoading(true);
    setErrMsg("");

    fetchMarketResult({
      admiCd: params.admiCd,
      upjongCd: params.upjongCd,
      simpleLoc: params.simpleLoc,
    })
      .then((res) => {
        if (!alive) return;
        setData(res ?? null);
      })
      .catch(() => {
        if (!alive) return;
        setErrMsg("분석 데이터를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [params.admiCd, params.upjongCd, params.simpleLoc]);

  // --- 표시용 파생값(최소) ---
  const tokens = (params.simpleLoc || "").trim().split(/\s+/);
  const provName = tokens[0] || "도(시)";
  const cityName = tokens[1] || "시(구)";
  const dongName = tokens[tokens.length - 1] || "동";

  const upjongName =
    data?.upjongTypeMap?.upjong3nm ||
    data?.upjongTypeMap?.upjong2nm ||
    data?.upjongTypeMap?.upjong1nm ||
    params.upjongCd ||
    "—";

  const pop = data?.population;
  const maxDay = getMaxDay(pop);
  const maxHour = getMaxHour(pop);

  // --- 차트용 간단 숫자 변환(필요한 곳만) ---
  const salesTriple = [
    { name: "최저", value: Number(data?.minAmt) || 0 },
    { name: "평균", value: Number(data?.saleAmt) || 0 },
    { name: "최고", value: Number(data?.maxAmt) || 0 },
  ];

  const compareSalesCity = Number(data?.guAmt) || 0;
  const compareSalesProv = Number(data?.siAmt) || 0;

  // 도(시) 업종수: storeCnt 배열에서 최신 yymm의 storeCnt를 인라인 계산
  const industryCntProv =
    Array.isArray(data?.storeCnt) && data.storeCnt.length
      ? Number(
          data.storeCnt.reduce((a, c) =>
            Number(c?.yymm) > Number(a?.yymm) ? c : a
          ).storeCnt
        ) || 0
      : 0;

  const industryCntDong = Number(data?.saleCnt) || 0;
  const industryCntCity = Number(data?.saleGuCnt) || 0;

  const weekdayTotal = Number(pop?.day) || 0;
  const weekendTotal = Number(pop?.weekend) || 0;

  const dayBreakdown = [
    { name: "월", value: Number(pop?.mon) || 0 },
    { name: "화", value: Number(pop?.tues) || 0 },
    { name: "수", value: Number(pop?.wed) || 0 },
    { name: "목", value: Number(pop?.thur) || 0 },
    { name: "금", value: Number(pop?.fri) || 0 },
    { name: "토", value: Number(pop?.sat) || 0 },
    { name: "일", value: Number(pop?.sun) || 0 },
  ];

  const hourBars = [
    { name: "05-09", value: Number(pop?.firstHour) || 0 },
    { name: "09-12", value: Number(pop?.secondHour) || 0 },
    { name: "12-14", value: Number(pop?.thirdHour) || 0 },
    { name: "14-18", value: Number(pop?.fourthHour) || 0 },
    { name: "18-23", value: Number(pop?.fifthHour) || 0 },
    { name: "23-05", value: Number(pop?.sixthHour) || 0 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#121B2A] text-white flex items-center justify-center">
        로딩 중…
      </div>
    );
  }
  if (errMsg) {
    return (
      <div className="min-h-screen bg-[#121B2A] text-white flex flex-col items-center justify-center p-6">
        <div className="text-red-400 text-sm mb-4">{errMsg}</div>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-700 text-white text-sm"
        >
          홈으로
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121B2A]">
      <div className="text-white text-[36px] pt-20 font-bold flex items-center justify-center">
        상권분석 결과 리포트
      </div>

      <div className="text-white text-[22px] mt-5 flex items-center justify-center font-semibold">
        선택하신 동네
        <span className="text-[#30C0D0] ml-2">‘{dongName}’</span>과 업종
        <span className="text-[#30C0D0] ml-2">‘{upjongName}’</span>에 대한 분석
        결과입니다.
      </div>

      {/* 1. 간단 요약 (div에 값 그대로 표시) */}
      <div className="text-white text-[36px] pt-36 font-bold flex flex-col items-center">
        <div className="flex items-center">
          <img src={analysis} alt="analysis" className="mr-4.5" />
          <span>분석 결과 간단 요약</span>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <div className="w-[237px] h-[76px] p-4 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center text-center">
            <div className="text-[18px] text-black font-medium">
              월 평균 매출
            </div>
            <div className="text-[20px] text-[#03B4C8] font-semibold">
              {data?.saleAmt ? `${data.saleAmt}만원` : "—"}
            </div>
          </div>
          <div className="w-[237px] h-[76px] p-4 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center text-center">
            <div className="text-[18px] text-black font-medium">
              선택 업종 수
            </div>
            <div className="text-[20px] text-[#03B4C8] font-semibold">
              {data?.saleCnt ?? "—"}개
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <div className="w-[237px] h-[76px] p-4 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center text-center">
            <div className="text-[18px] text-black font-medium">
              일 평균 유동인구
            </div>
            <div className="text-[20px] text-[#03B4C8] font-semibold">
              {data?.population?.dayAvg ?? "—"}명
            </div>
          </div>
          <div className="w-[237px] h-[76px] p-4 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center text-center">
            <div className="text-[18px] text-black font-medium">
              유동 인구 많은 요일
            </div>
            <div className="text-[20px] text-[#03B4C8] font-semibold">
              {maxDay.label}
            </div>
          </div>
          <div className="w-[237px] h-[76px] p-4 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center text-center">
            <div className="text-[18px] text-black font-medium">
              유동 인구 많은 시간
            </div>
            <div className="text-[20px] text-[#03B4C8] font-semibold">
              {maxHour.label}
            </div>
          </div>
        </div>
      </div>

      {/* 1. 매출 분석 (차트 라벨도 단순 문자열) */}
      <div className="text-white text-[36px] pt-36 font-bold flex flex-col items-center">
        <div className="flex items-center">
          <img src={sales} alt="sales" className="mr-4.5" />
          <span>매출 분석</span>
        </div>

        <div className="mt-8 flex justify-center gap-7">
          {/* 1-1 월 평균/최고/최저 */}
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center text-center">
            <div className="text-[22px] text-[#121B2A] font-semibold mb-4">
              월 평균/최고/최저
            </div>
            <div className="flex-1 w-full flex items-center justify-center">
              <ResponsiveContainer width="90%" height="80%">
                <BarChart
                  data={salesTriple}
                  margin={{ top: 20, right: 0, left: 0, bottom: 10 }}
                >
                  <Bar
                    dataKey="value"
                    fill="#03B4C8"
                    radius={[10, 10, 0, 0]}
                    barSize={35}
                  >
                    <LabelList
                      dataKey="value"
                      position="top"
                      offset={8}
                      fill="#121B2A"
                      fontSize={14}
                      formatter={(v) => `${v}만원`}
                    />
                    <LabelList
                      dataKey="name"
                      position="bottom"
                      offset={10}
                      fill="#121B2A"
                      fontSize={16}
                    />
                  </Bar>
                  <XAxis hide />
                  <YAxis hide />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 1-2 지역 비교(매출) */}
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center text-center">
            <div className="text-[22px] text-[#121B2A] font-semibold mt-10">
              지역 내 다른 동네와의 비교 결과
            </div>
            <div className="flex flex-1 w-full items-center justify-center gap-1 h-full">
              <div className="flex flex-col items-center justify-end h-full ml-6 mt-16">
                <img
                  src={vector}
                  alt="vector"
                  className="w-[41px] h-[80px] object-contain"
                />
                <div className="text-[#121B2A] font-medium mt-2 text-[14px]">
                  {dongName} / {data?.saleAmt ? `${data.saleAmt}만원` : "—"}
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center font-medium h-full">
                <ResponsiveContainer width="70%" height="80%">
                  <BarChart
                    data={[
                      { name: cityName, value: compareSalesCity },
                      { name: provName, value: compareSalesProv },
                    ]}
                    margin={{ top: 50, right: 0, left: 8, bottom: 30 }}
                    barCategoryGap="15%"
                  >
                    <Bar dataKey="value" fill="#03B4C8" radius={[10, 10, 0, 0]}>
                      <LabelList
                        dataKey="value"
                        position="top"
                        offset={8}
                        fill="#121B2A"
                        fontSize={14}
                        formatter={(v) => `${v}만원`}
                      />
                      <LabelList
                        dataKey="name"
                        position="bottom"
                        offset={8}
                        fill="#121B2A"
                        fontSize={16}
                      />
                    </Bar>
                    <XAxis hide />
                    <YAxis hide />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 1-3 증감률(그대로 출력) */}
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <div className="text-[22px] text-[#121B2A] font-semibold mb-1">
              전년동월대비
            </div>
            <div
              className={`flex items-center text-[32px] font-semibold mb-12 ${
                (Number(data?.prevYearRate) || 0) >= 0
                  ? "text-[#D04797]"
                  : "text-[#03B4C8]"
              }`}
            >
              {data?.prevYearRate ?? "—"}%
              <img
                src={(Number(data?.prevYearRate) || 0) >= 0 ? upIcon : downIcon}
                alt="trend"
                className="ml-1 w-6 h-6"
              />
            </div>

            <div className="text-[22px] text-[#121B2A] font-semibold mb-1">
              전월대비
            </div>
            <div
              className={`flex items-center text-[32px] font-semibold ${
                (Number(data?.prevMonRate) || 0) >= 0
                  ? "text-[#D04797]"
                  : "text-[#03B4C8]"
              }`}
            >
              {data?.prevMonRate ?? "—"}%
              <img
                src={(Number(data?.prevMonRate) || 0) >= 0 ? upIcon : downIcon}
                alt="trend"
                className="ml-1 w-6 h-6"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. 업종 분석 */}
      <div className="text-white text-[36px] pt-36 font-bold flex flex-col items-center">
        <div className="flex items-center">
          <img src={industry} alt="industry" className="mr-4.5" />
          <span>업종 분석</span>
        </div>

        <div className="mt-8 flex justify-center gap-7">
          {/* 2-1 선택업종 업종 수 */}
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <div className="text-[22px] text-[#121B2A] font-semibold mb-10">
              선택업종 업종 수
            </div>
            <img src={people} alt="people" />
            <div className="text-[#30C0D0] font-bold">
              {data?.saleCnt ?? "—"}개
            </div>
          </div>

          {/* 2-2 지역 비교(업종 수) */}
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center text-center">
            <div className="text-[22px] text-[#121B2A] font-semibold mt-10">
              지역 내 다른 동네와의 비교 결과
            </div>
            <div className="flex flex-1 w-full items-center justify-center gap-1 h-full">
              <div className="flex flex-col items-center justify-end h-full ml-6 mt-16">
                <img
                  src={vector}
                  alt="vector"
                  className="w-[41px] h-[80px] object-contain"
                />
                <div className="text-[#121B2A] font-medium mt-2 text-[14px]">
                  {dongName} / {data?.saleCnt ?? "—"}개
                </div>
              </div>

              <div className="flex-1 flex items-center justify-center font-medium h-full">
                <ResponsiveContainer width="70%" height="80%">
                  <BarChart
                    data={[
                      { name: cityName, value: industryCntCity },
                      { name: provName, value: industryCntProv },
                    ]}
                    margin={{ top: 50, right: 0, left: 8, bottom: 30 }}
                    barCategoryGap="15%"
                  >
                    <Bar dataKey="value" fill="#03B4C8" radius={[10, 10, 0, 0]}>
                      <LabelList
                        dataKey="value"
                        position="top"
                        offset={8}
                        fill="#121B2A"
                        fontSize={14}
                        formatter={(v) => `${v}개`}
                      />
                      <LabelList
                        dataKey="name"
                        position="bottom"
                        offset={8}
                        fill="#121B2A"
                        fontSize={16}
                      />
                    </Bar>
                    <XAxis hide />
                    <YAxis hide />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* 2-3 증감률(업종 수) */}
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <div className="text-[22px] text-[#121B2A] font-semibold mb-1">
              전년동월대비
            </div>
            <div
              className={`flex items-center text-[32px] font-semibold mb-12 ${
                (Number(data?.prevYearCntRate) || 0) >= 0
                  ? "text-[#D04797]"
                  : "text-[#03B4C8]"
              }`}
            >
              {data?.prevYearCntRate ?? "—"}%
              <img
                src={
                  (Number(data?.prevYearCntRate) || 0) >= 0 ? upIcon : downIcon
                }
                alt="trend"
                className="ml-1 w-6 h-6"
              />
            </div>

            <div className="text-[22px] text-[#121B2A] font-semibold mb-1">
              전월대비
            </div>
            <div
              className={`flex items-center text-[32px] font-semibold ${
                (Number(data?.prevMonCntRate) || 0) >= 0
                  ? "text-[#D04797]"
                  : "text-[#03B4C8]"
              }`}
            >
              {data?.prevMonCntRate ?? "—"}%
              <img
                src={
                  (Number(data?.prevMonCntRate) || 0) >= 0 ? upIcon : downIcon
                }
                alt="trend"
                className="ml-1 w-6 h-6"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. 유동인구 분석 */}
      <div className="text-white text-[36px] pt-36 font-bold flex flex-col items-center">
        <div className="flex items-center">
          <img src={population} alt="population" className="mr-4.5" />
          <span>유동인구 분석</span>
        </div>

        <div className="mt-8 flex justify-center gap-7">
          {/* 3-1 일 평균 유동인구 */}
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <div className="text-[22px] text-[#121B2A] font-semibold mb-10">
              일 평균 유동인구
            </div>
            <img src={shop} alt="shop" />
            <div className="text-[#30C0D0] font-bold text-[32px]">
              {data?.population?.dayAvg ?? "—"}명
            </div>
          </div>

          {/* 3-2 요일별 유동인구: 주중/주말 + 리스트 */}
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <div className="text-[22px] text-[#121B2A] font-semibold mt-4">
              요일별 유동인구 비교 결과
            </div>
            <div className="flex flex-1 w-full">
              <div className="flex-1 flex items-center justify-center">
                <ResponsiveContainer width="90%" height="75%">
                  <BarChart
                    data={[
                      { name: "주중", value: weekdayTotal },
                      { name: "주말", value: weekendTotal },
                    ]}
                    margin={{ top: 40, right: 0, left: 8, bottom: 10 }}
                  >
                    <Bar
                      dataKey="value"
                      fill="#03B4C8"
                      radius={[10, 10, 0, 0]}
                      barSize={30}
                    >
                      <LabelList
                        dataKey="value"
                        position="top"
                        offset={8}
                        fill="#121B2A"
                        fontSize={16}
                        formatter={(v) => `${v}명`}
                      />
                      <LabelList
                        dataKey="name"
                        position="bottom"
                        offset={8}
                        fill="#121B2A"
                        fontSize={16}
                      />
                    </Bar>
                    <XAxis hide />
                    <YAxis hide />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <ul className="flex-1 flex flex-col justify-center items-start text-[16px] text-[#121B2A] font-semibold pl-6">
                {dayBreakdown.map((d) => (
                  <li key={d.name} className="mb-1">
                    {d.name}: {d.value}명
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3-3 시간대별 유동인구 */}
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <div className="text-[22px] text-[#121B2A] font-semibold mt-4">
              시간대별 유동인구 비교 결과
            </div>
            <div className="flex-1 w-full flex items-center justify-center">
              <ResponsiveContainer width="90%" height="85%">
                <BarChart
                  data={hourBars}
                  margin={{ top: 40, right: 0, left: 0, bottom: 20 }}
                >
                  <Bar dataKey="value" fill="#03B4C8" radius={[10, 10, 0, 0]}>
                    <LabelList
                      dataKey="value"
                      position="top"
                      offset={10}
                      fill="#121B2A"
                      fontSize={14}
                      formatter={(v) => `${v}명`}
                    />
                    <LabelList
                      dataKey="name"
                      position="bottom"
                      offset={10}
                      fill="#121B2A"
                      fontSize={14}
                    />
                  </Bar>
                  <XAxis hide />
                  <YAxis hide />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* 푸터 & 모달 (그대로) */}
      <div className="text-white text-[24px] pt-36 font-semibold flex flex-col items-center">
        창업 가능성 및 상위 동네 추천은 상세분석에서 확인할 수 있습니다.
      </div>

      <div className="pt-36 pb-20 flex justify-center gap-4 text-[24px]">
        <div
          onClick={() => setOpen(true)}
          className="w-[224px] h-[60px] p-8 bg-[#32C376] rounded-[6px] flex flex-col items-center justify-center text-center text-[18px] text-white font-semibold cursor-pointer hover:bg-[#28a866] transition"
        >
          상세 분석
        </div>

        <div
          onClick={() => navigate("/mentoring")}
          className="w-[224px] h-[60px] p-8 bg-[#03B4C8] rounded-[6px] flex flex-col items-center justify-center text-center text-[18px] text-white font-semibold cursor-pointer hover:bg-[#0290a3] transition"
        >
          멘토 탐색 바로가기
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-80"></div>
          <div className="bg-white w-[450px] p-15 rounded-xl shadow-lg text-center relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-[27px] h-[27px] bg-[#4C5060] flex items-center justify-center text-white text-xl font-bold rounded-full"
            >
              <img src={back} alt="back" className="w-[9] h-[9]" />
            </button>

            <h2 className="text-[24px] font-bold mb-6 text-[#333]">
              상세분석 결과 리포트
            </h2>

            <div className="flex items-center mb-3">
              <img src={check} alt="check" className="mr-3" />
              <span className="text-[20px] text-[#42437D] font-semibold">
                창업 가능성 점수
              </span>
            </div>

            <div className="flex justify-center items-center relative w-full">
              <div className="relative w-[500px] h-[250px]">
                <PieChart
                  data={[
                    { value: 30, color: "#FFFFFF" },
                    { value: 70, color: "#0047AB" },
                  ]}
                  startAngle={180}
                  lengthAngle={180}
                  lineWidth={15}
                  rounded
                  animate
                  animationDuration={500}
                  style={{ height: "250px", width: "100%" }}
                />
                <img
                  src={icon}
                  alt="icon"
                  className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12"
                />

                <div className="absolute top-[65%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-[293px] h-[82px] bg-gray-700 rounded-[20px] flex flex-col items-center justify-center">
                  <div className="relative w-[180px] flex justify-between items-center text-sm">
                    <span className="text-[15px] text-[#A0AEC0]">0점</span>
                    <span className="text-[28px] text-white font-bold">
                      7점
                    </span>
                    <span className="text-[15px] text-[#A0AEC0]">10점</span>
                  </div>
                  <div className="mt-2 text-center text-[15px] text-[#A0AEC0]">
                    창업 가능성
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center mb-3">
              <img src={check} alt="check" className="mr-3" />
              <span className="text-[20px] text-[#42437D] font-semibold">
                창업 추천 동네
              </span>
            </div>

            <span className="text-[15px] text-[#42437D] font-semibold">
              업종별 매출, 점포 수, 상권·유동인구, 창업 가능성 등을 종합해 상위
              3개 동네를 추천합니다.
            </span>

            <div className="mt-6">
              <div className="flex justify-center gap-8">
                <div className="flex items-center justify-center w-[100px] h-[100px] bg-[#80849B] rounded-full text-white text-[20px] font-semibold shrink-0">
                  {dongName}
                </div>
                <div className="flex items-center justify-center w-[100px] h-[100px] bg-[#80849B] rounded-full text-white text-[20px] font-semibold shrink-0">
                  {cityName}
                </div>
                <div className="flex items-center justify-center w-[100px] h-[100px] bg-[#80849B] rounded-full text-white text-[20px] font-semibold shrink-0">
                  {provName}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 디버그용
      <pre className="text-xs text-white/70 p-4 overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
      */}
    </div>
  );
};

export default MarketResult;
