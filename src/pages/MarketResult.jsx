import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { PieChart } from "react-minimal-pie-chart";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";

import marketResultApi from "../apis/marketResultApi";

import analysis from "../assets/Analysis.svg";
import sales from "../assets/Sales.svg";
import industry from "../assets/Industry.svg";
import population from "../assets/Population.svg";
import dongIcon from "../assets/dongIcon.svg";
import check from "../assets/Check.svg";
import icon from "../assets/Icon.svg";
import sadIcon from "../assets/SadIcon.svg";
import shop from "../assets/Shop.svg";
import people from "../assets/People.svg";
import downIcon from "../assets/Down.svg";
import upIcon from "../assets/Up.svg";
import back from "../assets/Back.svg";
import notandum from "../assets/Notandum.svg";

import practicalApi from "../apis/practicalApi";

// ----- 동네 코드 -> 이름 -----
const codeToName = {
  47290541: "서부1동",
  47290542: "서부2동",
  47290510: "중방동",
  47290520: "중앙동",
  47290530: "남부동",
  47290370: "남천면",
  47290560: "동부동",
  47290350: "남산면",
  47290330: "자인면",
  47290340: "용성면",
  47290253: "진량읍",
  47290256: "압량면",
  47290550: "북부동",
  47290250: "하양읍",
  47290310: "와촌면",
};

// --- 요일/시간대 최댓값 ---
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
  const locationObj = useLocation(); // /market-result는 소포의 겉면에 적힌 주소, state 객체는 소포 상자 안에 몰래 넣어둔 편지나 물건이라고

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const [pracData, setPracData] = useState(null);
  const [pracLoading, setPracLoading] = useState(true);
  const [pracErrMsg, setPracErrMsg] = useState("");

  const params = useMemo(() => {
    const state = locationObj.state || {}; // 소포 안에 있던 데이터(areaCode, areaName 등)를 꺼내 쓸 수 있는 것이라고 하는데 ..
    return {
      admiCd: state.areaCode || "",
      upjongCd: state.upjong3cd || "",
      simpleLoc: state.areaName || "",
    };
  }, [locationObj.state]);

  // 간단 분석 API
  useEffect(() => {
    if (!params.admiCd || !params.upjongCd || !params.simpleLoc) {
      setLoading(false);
      setErrMsg("필수 파라미터가 누락되었습니다. 홈에서 다시 선택해 주세요.");
      return;
    }
    let alive = true; // 비동기 처리 시 안전 스위치
    setLoading(true);
    setErrMsg("");

    // API 호출
    marketResultApi({
      admiCd: params.admiCd,
      upjongCd: params.upjongCd,
      simpleLoc: params.simpleLoc,
    })
      .then((res) => {
        if (!alive) return;
        setData(res ?? null); // 응답을 data에 저장
      })
      .catch(() => {
        if (!alive) return;
        setErrMsg("간단 분석 데이터를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!alive) return;
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [params.admiCd, params.upjongCd, params.simpleLoc]);

  // 상세 분석 API
  useEffect(() => {
    if (!open) return;

    let alive = true;
    setPracLoading(true);
    setPracErrMsg("");

    practicalApi({
      admiCd: params.admiCd,
      upjongCd: params.upjongCd,
    })
      .then((res) => {
        if (!alive) return;
        setPracData(res ?? null); // 응답을 data에 저장
      })
      .catch(() => {
        if (!alive) return;
        setPracErrMsg("상세 분석 데이터를 불러오지 못했습니다.");
      })
      .finally(() => {
        if (!alive) return;
        setPracLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [open, params.admiCd, params.upjongCd]);

  // 상세분석 모달 창이 떴을 때 배경 페이지의 스크롤을 막는 역할
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  const siName = "경상북도";
  const guName = "경산시";
  const dongName = params.simpleLoc || "동";

  const upjongName = data?.upjongTypeMap?.upjong3nm || "—";

  const pop = data?.population;
  const maxDay = getMaxDay(pop);
  const maxHour = getMaxHour(pop);

  const minAvgMax = [
    { name: "최저", value: Number(data?.minAmt) || 0 },
    { name: "평균", value: Number(data?.saleAmt) || 0 },
    { name: "최고", value: Number(data?.maxAmt) || 0 },
  ];

  const saleSiCnt = Number(data?.storeCnt[0].storeCnt) || 0;

  const eachDay = [
    { name: "월", value: Number(pop?.mon) || 0 }, // pop에서 옵셔널 체이닝(?)이 빠지면 터짐
    { name: "화", value: Number(pop?.tues) || 0 }, // 왜 ?
    { name: "수", value: Number(pop?.wed) || 0 }, // ?를 빼면 데이터가 도착하기 전에 pop이 없으니까 터져버리고
    { name: "목", value: Number(pop?.thur) || 0 }, // ?를 넣으면 데이터가 도착하기 전엔 0으로,
    { name: "금", value: Number(pop?.fri) || 0 }, // 도착한 뒤엔 실제 값으로 바뀐다고 ..
    { name: "토", value: Number(pop?.sat) || 0 },
    { name: "일", value: Number(pop?.sun) || 0 },
  ];

  const eachHour = [
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
        간단 분석 결과를 불러오는 중...
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
      <div className="flex items-center justify-center text-[16px] text-white font-medium mt-4">
        <img src={notandum} alt="notandum" className="mr-2" />
        상권분석에 필요한 데이터가 충분하지 않은 경우, 일부 항목은 0으로
        표시됩니다.
      </div>
      {/* 0. 간단 요약 */}
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
              {data?.saleAmt
                ? Number(data.saleAmt) != 0
                  ? `${data.saleAmt} 만 원`
                  : `${data.guAmt} 만 원`
                : "—"}
            </div>
          </div>
           
          <div className="w-[237px] h-[76px] p-4 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center text-center">
            <div className="text-[18px] text-black font-medium">
              선택 업종 수
            </div>
            <div className="text-[20px] text-[#03B4C8] font-semibold">
              {data?.saleCnt
                ? Number(data.saleCnt) != 0
                  ? `${data.saleCnt} 개`
                  : `${data.saleGuCnt} 개`
                : "—"}
            </div>
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-4">
           
          <div className="w-[237px] h-[76px] p-4 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center text-center">
            <div className="text-[18px] text-black font-medium">
              일 평균 유동인구
            </div>
            <div className="text-[20px] text-[#03B4C8] font-semibold">
              {data?.population?.dayAvg ?? "—"} 명
            </div>
          </div>
           
          <div className="w-[237px] h-[76px] p-4 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center text-center">
            <div className="text-[18px] text-black font-medium">
              유동 인구 많은 요일
            </div>
            <div className="text-[20px] text-[#03B4C8] font-semibold">
              {maxDay.label}요일
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
      {/* 1. 매출 분석 */}
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
                  data={minAvgMax}
                  margin={{ top: 10, right: 0, left: 0, bottom: 30 }}
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
          {/* 1-2 지역 매출 비교 */} 
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center text-center">
            <div className="text-[22px] text-[#121B2A] font-semibold mt-10">
              지역 내 다른 동네와의 비교 결과
            </div>
            <div className="flex flex-1 w-full items-center justify-center gap-1 h-full">
              <div className="flex flex-col items-center justify-center h-full ml-6 mt-16">
                <div className="text-[#121B2A] font-semibold mt-2 text-[14px]">
                  {dongName}
                  {data?.saleAmt
                    ? data.saleAmt != 0
                      ? `${data.saleAmt}만원`
                      : ""
                    : ""}
                </div>
                <img
                  src={dongIcon}
                  alt="dongIcon"
                  className="w-[41px] h-[80px] object-contain"
                />
              </div>

              <div className="flex-1 flex items-center justify-center font-medium h-full">
                <ResponsiveContainer width="70%" height="80%">
                  <BarChart
                    data={[
                      { name: guName, value: Number(data?.guAmt) || 0 },
                      { name: siName, value: Number(data?.siAmt) || 0 },
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
          {/* 1-3 전년동월, 전월 대비 매출 증감률 */} 
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <div className="text-[22px] text-[#121B2A] font-semibold mb-1">
              전년동월대비
            </div>
            <div
              className={`flex items-center text-[32px] font-semibold mb-12 ${
                (Number(data?.prevYearRate) || 0) > 0
                  ? "text-[#D04797]"
                  : (Number(data?.prevYearRate) || 0) < 0
                  ? "text-[#03B4C8]"
                  : "text-gray-500"
              }`}
            >
              {Math.abs(data?.prevYearRate)?.toFixed(1) ?? "—"}%
              <div alt="trend" className="ml-2">
                {(Number(data?.prevYearRate) || 0) > 0
                  ? "↑"
                  : (Number(data?.prevYearRate) || 0) < 0
                  ? "↓"
                  : "-"}
              </div>
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
              {Math.abs(data?.prevMonRate)?.toFixed(1) ?? "—"}%
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
              {data?.saleCnt
                ? Number(data.saleCnt) != 0
                  ? `${data.saleCnt} 개`
                  : `${data.saleGuCnt} 개`
                : "—"}
            </div>
          </div>
          {/* 2-2 지역 업종 수 비교 */} 
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center text-center">
            <div className="text-[22px] text-[#121B2A] font-semibold mt-10">
              지역 내 다른 동네와의 비교 결과
            </div>
            <div className="flex flex-1 w-full items-center justify-center gap-1 h-full">
              <div className="flex flex-col items-center justify-center h-full ml-6 mt-16">
                <div className="text-[#121B2A] font-semibold text-[15px]">
                  {dongName}
                </div>
                <img
                  src={dongIcon}
                  alt="dongIcon"
                  className="w-[41px] h-[80px] object-contain"
                />
              </div>

              <div className="flex-1 flex items-center justify-center font-medium h-full">
                <ResponsiveContainer width="70%" height="80%">
                  <BarChart
                    data={[
                      { name: guName, value: Number(data?.saleGuCnt) || 0 },
                      { name: siName, value: saleSiCnt },
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
          {/* 2-3 전년동월, 전월 대비 업종 수 증감률 */} 
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
              {Math.abs(data?.prevYearCntRate)?.toFixed(1) ?? "—"}%
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
              {Math.abs(data?.prevMonCntRate)?.toFixed(1) ?? "—"}%
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
          {/* 3-2 요일별 유동인구 */} 
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <div className="text-[22px] text-[#121B2A] font-semibold mt-4">
              요일별 유동인구 비교 결과
            </div>
            <div className="flex flex-1 w-full">
              <div className="flex-1 flex items-center justify-center">
                <ResponsiveContainer width="90%" height="75%">
                  <BarChart
                    data={[
                      { name: "주중", value: Number(pop?.day) || 0 },
                      { name: "주말", value: Number(pop?.weekend) || 0 },
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
                        formatter={(v) => `${v}%`}
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
                {eachDay.map((day) => (
                  <li key={day.name} className="mb-1">
                    {day.name}: {day.value}%
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
                  data={eachHour}
                  margin={{ top: 40, right: 0, left: 0, bottom: 20 }}
                >
                  <Bar dataKey="value" fill="#03B4C8" radius={[10, 10, 0, 0]}>
                    <LabelList
                      dataKey="value"
                      position="top"
                      offset={10}
                      fill="#121B2A"
                      fontSize={14}
                      formatter={(v) => `${v}%`}
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
      <div className="text-white text-[24px] pt-36 font-semibold flex flex-col items-center">
        창업 가능성 및 상위 동네 추천은 상세분석에서 확인할 수 있습니다.
      </div>
      <div className="pt-36 pb-25 flex justify-center gap-4 text-[24px]">
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
          <div className="bg-white w-[550px] p-12 rounded-xl shadow-lg text-center relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-[27px] h-[27px] bg-[#42437D] flex items-center justify-center text-white text-xl font-bold rounded-full cursor-pointer"
            >
              <img src={back} alt="back" className="w-[9] h-[9]" />
            </button>
            {pracLoading ? (
              <div className="py-20 text-gray-500">
                상세 분석 결과를 불러오는 중...
              </div>
            ) : pracErrMsg ? (
              <div>
                <div className="py-20 text-red-500">{pracErrMsg}</div>
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm"
                >
                  닫기
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-[24px] font-bold mb-8 text-[#42437D]">
                  상세분석 결과 리포트
                </h2>
                <div className="flex items-center mb-5">
                  <img src={check} alt="check" className="mr-3" />
                  <span className="text-[20px] text-[#42437D] font-semibold">
                    창업 가능성 점수
                  </span>
                </div>
                <div className="flex justify-center items-center relative w-full">
                  <div className="relative w-[500px] h-[250px]">
                    <PieChart
                      data={[
                        {
                          value: pracData?.feasibilityScore
                            ? Number(pracData.feasibilityScore)
                            : 0,
                          color: "#0047AB",
                        },
                        {
                          value: pracData?.feasibilityScore
                            ? 10 - Number(pracData.feasibilityScore)
                            : 10,
                          color: "#22234B",
                        },
                      ]}
                      startAngle={180}
                      lengthAngle={180}
                      lineWidth={15}
                      lineCap="round"
                      animate
                      animationDuration={500}
                      style={{ height: "250px", width: "100%" }}
                    />

                    <img
                      src={
                        pracData?.feasibilityScore !== undefined &&
                        pracData.feasibilityScore < 5
                          ? sadIcon
                          : icon
                      }
                      alt="icon"
                      className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12"
                    />

                    <div className="absolute top-[66.5%] -translate-y-1/2 left-1/2 -translate-x-1/2 w-[320px] h-[85px] bg-gray-700 rounded-[20px] flex flex-col items-center justify-center">
                      <div className="relative w-[250px] flex items-center justify-between mt-3">
                        <span className="text-[15px] text-[#A0AEC0]">0점</span>
                        <span className="absolute left-1/2 transform -translate-x-1/2 text-[28px] text-white font-bold">
                          {pracData?.feasibilityScore
                            ? `${pracData?.feasibilityScore}점`
                            : "-"}
                        </span>
                        <span className="text-[15px] text-[#A0AEC0]">10점</span>
                      </div>

                      <div className="mt-2.5 mb-1 text-center text-[15px] text-[#A0AEC0]">
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

                <div className="text-left ml-7.5">
                  <span className="block text-[15px] text-[#42437D] font-semibold">
                    업종별 매출, 점포 수, 상권·유동인구, 창업 가능성 등을 종합해
                  </span>
                  <span className="block text-[15px] text-[#42437D] font-semibold">
                    상위 3개 동네를 추천합니다.
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex justify-center gap-8">
                    <div className="flex items-center justify-center w-[100px] h-[100px] bg-[#80849B] rounded-full text-white text-[20px] font-semibold shrink-0">
                      {pracData?.top3
                        ? codeToName[pracData.top3[0].admiCd] ||
                          pracData.top3[0].admiCd
                        : "-"}
                    </div>

                    <div className="flex items-center justify-center w-[100px] h-[100px] bg-[#80849B] rounded-full text-white text-[20px] font-semibold shrink-0">
                      {pracData?.top3
                        ? codeToName[pracData.top3[1].admiCd] ||
                          pracData.top3[1].admiCd
                        : "-"}
                    </div>

                    <div className="flex items-center justify-center w-[100px] h-[100px] bg-[#80849B] rounded-full text-white text-[20px] font-semibold shrink-0">
                      {pracData?.top3
                        ? codeToName[pracData.top3[2].admiCd] ||
                          pracData.top3[2].admiCd
                        : "-"}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
         
    </div>
  );
};

export default MarketResult;
