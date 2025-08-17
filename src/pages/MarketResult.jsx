import React, { useState } from "react";
import analysis from "../assets/Analysis.svg";
import sales from "../assets/Sales.svg";
import industry from "../assets/Industry.svg";
import population from "../assets/Population.svg";
import vector from "../assets/Vector.svg";
import check from "../assets/Check.svg";
import icon from "../assets/Icon.svg";
import shop from "../assets/Shop.svg";
import people from "../assets/People.svg";
import down from "../assets/Down.svg";
import up from "../assets/Up.svg";
import back from "../assets/Back.svg";
import location from "../assets/Location.svg";
import { useNavigate } from "react-router-dom";
import { PieChart } from "react-minimal-pie-chart";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  LabelList,
} from "recharts";
import { useEffect } from "react";

const MarketResult = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const six_data = [
    { name: "05-09", percent: 17.9 },
    { name: "09-12", percent: 18.6 },
    { name: "12-14", percent: 11.6 },
    { name: "14-18", percent: 24.1 },
    { name: "18-23", percent: 21.0 },
    { name: "23-05", percent: 6.7 },
  ];

  const weekend_data = [
    { name: "월", percent: 14.8 },
    { name: "화", percent: 14.9 },
    { name: "수", percent: 16.7 },
    { name: "목", percent: 15.6 },
    { name: "금", percent: 15.9 },
    { name: "토", percent: 11.7 },
    { name: "일", percent: 20.7 },
  ];

  // 평일과 주말 퍼센트 합
  const weekdaySum = weekend_data
    .slice(0, 5)
    .reduce((acc, cur) => acc + cur.percent, 0);
  const weekendSum = weekend_data
    .slice(5)
    .reduce((acc, cur) => acc + cur.percent, 0);

  const barData = [
    { name: "평일 합", percent: weekdaySum },
    { name: "주말 합", percent: weekendSum },
  ];

  const compareData1 = [
    { name: "종로구", percent: 845 },
    { name: "서울시", percent: 1682 },
  ];
  const compareData2 = [
    { name: "종로구", percent: 147 },
    { name: "서울시", percent: 1682 },
  ];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-[#121B2A]">
      <div className="text-white text-[36px] pt-20 font-bold flex items-center justify-center">
        상권분석 결과 리포트
      </div>
      <div className="text-white text-[22px] mt-5 flex items-center justify-center font-semibold">
        선택하신 동네
        <span className="text-[#30C0D0] ml-2">‘조영동’</span>과 업종
        <span className="text-[#30C0D0] ml-2">‘음식 &gt; 카페’</span>에 대한
        분석 결과입니다.
      </div>

      <div className="text-white text-[36px] pt-36 font-bold flex flex-col items-center">
        <div className="flex items-center">
          <img src={analysis} alt="analysis" className="mr-4.5" />
          <span>분석 결과 간단 요약</span>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <div className="w-[237px] h-[76px] p-4 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center text-center">
            <span className="text-[18px] text-black font-medium">
              월 평균 매출
            </span>
            <span className="text-[20px] text-[#03B4C8] font-semibold">
              845만원
            </span>
          </div>
          <div className="w-[237px] h-[76px] p-4 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center text-center">
            <span className="text-[18px] text-black font-medium">
              선택 업종 수
            </span>
            <span className="text-[20px] text-[#03B4C8] font-semibold">
              1개
            </span>
          </div>
        </div>
        <div className="mt-8 flex justify-center gap-4">
          <div className="w-[237px] h-[76px] p-4 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center text-center">
            <span className="text-[18px] text-black font-medium">
              일 평균 유동인구
            </span>
            <span className="text-[20px] text-[#03B4C8] font-semibold">
              48,522명
            </span>
          </div>
          <div className="w-[237px] h-[76px] p-4 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center text-center">
            <span className="text-[18px] text-black font-medium">
              유동 인구 많은 요일
            </span>
            <span className="text-[20px] text-[#03B4C8] font-semibold">
              수요일
            </span>
          </div>
          <div className="w-[237px] h-[76px] p-4 bg-[#F5F5F5] rounded-lg flex flex-col items-center justify-center text-center">
            <span className="text-[18px] text-black font-medium">
              유동 인구 많은 시간
            </span>
            <span className="text-[20px] text-[#03B4C8] font-semibold">
              14-16시
            </span>
          </div>
        </div>
      </div>

      <div className="text-white text-[36px] pt-36 font-bold flex flex-col items-center">
        <div className="flex items-center">
          <img src={sales} alt="sales" className="mr-4.5" />
          <span>매출 분석</span>
        </div>

        <div className="mt-8 flex justify-center gap-7">
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <span className="text-[22px] text-[#121B2A] font-semibold">
              월 평균 매출
            </span>
            <span className="text-black">그래프</span>
          </div>

          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <span className="text-[22px] text-[#121B2A] font-semibold mt-10">
              지역 내 다른 동네와의 비교 결과
            </span>
            <div className="flex flex-1 w-full items-center justify-center gap-1 h-full">
              <div className="flex flex-col items-center justify-end h-ful ml-15 mt-28">
                <img
                  src={vector}
                  alt="vector"
                  className="w-[41px] h-[80px] object-contain"
                />
                <span className="text-[#121B2A] font-medium mb-1 text-[16px]">
                  교남동
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center font-medium h-full">
                <ResponsiveContainer width="60%" height="80%">
                  <BarChart
                    data={compareData1}
                    margin={{ top: 50, right: 0, left: 8, bottom: 30 }}
                    barCategoryGap="15%"
                  >
                    <Bar
                      dataKey="percent"
                      fill="#03B4C8"
                      radius={[10, 10, 0, 0]}
                    >
                      <LabelList
                        dataKey="percent"
                        position="top"
                        offset={8}
                        fill="#121B2A"
                        fontSize={14}
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
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <span className="text-[22px] text-[#121B2A] font-semibold mb-1">
              전년동월대비
            </span>
            <div className="flex items-center text-[32px] text-[#D04797] font-semibold mb-15">
              32.9%
              <img src={up} alt="up" className="ml-1 w-6 h-6" />
            </div>

            <span className="text-[22px] text-[#121B2A] font-semibold mb-1">
              전월대비
            </span>
            <div className="flex items-center text-[32px] text-[#D04797] font-semibold">
              8.3%
              <img src={up} alt="up" className="ml-1 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-white text-[36px] pt-36 font-bold flex flex-col items-center">
        <div className="flex items-center">
          <img src={industry} alt="industry" className="mr-4.5" />
          <span>업종 분석</span>
        </div>

        <div className="mt-8 flex justify-center gap-7">
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <span className="text-[22px] text-[#121B2A] font-semibold mb-10">
              선택업종 업종 수
            </span>
            <img src={people} alt="people" />
            <span className="text-[#30C0D0] font-bold">1개</span>
          </div>
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <span className="text-[22px] text-[#121B2A] font-semibold mt-10">
              지역 내 다른 동네와의 비교 결과
            </span>
            <div className="flex flex-1 w-full items-center justify-center gap-1 h-full">
              <div className="flex flex-col items-center justify-end h-ful ml-15 mt-28">
                <img
                  src={vector}
                  alt="vector"
                  className="w-[41px] h-[80px] object-contain"
                />
                <span className="text-[#121B2A] font-medium mb-1 text-[16px]">
                  교남동
                </span>
              </div>

              <div className="flex-1 flex items-center justify-center font-medium h-full">
                <ResponsiveContainer width="60%" height="80%">
                  <BarChart
                    data={compareData2}
                    margin={{ top: 50, right: 0, left: 8, bottom: 30 }}
                    barCategoryGap="15%"
                  >
                    <Bar
                      dataKey="percent"
                      fill="#03B4C8"
                      radius={[10, 10, 0, 0]}
                    >
                      <LabelList
                        dataKey="percent"
                        position="top"
                        offset={8}
                        fill="#121B2A"
                        fontSize={14}
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
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <span className="text-[22px] text-[#121B2A] font-semibold mb-1">
              전년동월대비
            </span>
            <div className="flex items-center text-[32px] text-[#03B4C8] font-semibold mb-15">
              23.1%
              <img src={down} alt="down" className="ml-1 w-6 h-6" />
            </div>

            <span className="text-[22px] text-[#121B2A] font-semibold mb-1">
              전월대비
            </span>
            <div className="flex items-center text-[32px] text-[#D04797] font-semibold">
              5.8%
              <img src={up} alt="up" className="ml-1 w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="text-white text-[36px] pt-36 font-bold flex flex-col items-center">
        <div className="flex items-center">
          <img src={population} alt="population" className="mr-4.5" />
          <span>유동인구 분석</span>
        </div>

        <div className="mt-8 flex justify-center gap-7">
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <span className="text-[22px] text-[#121B2A] font-semibold mb-10">
              일 평균 유동인구
            </span>
            <img src={shop} alt="shop" />
            <span className="text-[#30C0D0] font-bold text-[32px]">
              48,522명
            </span>
          </div>
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <span className="text-[22px] text-[#121B2A] font-semibold mt-10">
              요일별 유동인구 비교 결과
            </span>
            <div className="flex flex-1 w-full">
              <div className="flex-1 flex items-center justify-center">
                <ResponsiveContainer width="90%" height="75%">
                  <BarChart
                    data={barData}
                    margin={{ top: 50, right: 0, left: 8, bottom: 10 }}
                  >
                    <Bar
                      dataKey="percent"
                      fill="#03B4C8"
                      radius={[10, 10, 0, 0]}
                      barSize={30}
                    >
                      <LabelList
                        dataKey="percent"
                        position="top"
                        offset={8}
                        fill="#121B2A"
                        fontSize={16}
                        formatter={(value) => `${value}%`}
                      />
                    </Bar>
                    <XAxis hide />
                    <YAxis hide />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <li className="flex-1 flex flex-col justify-center items-center text-[20px] text-[#121B2A] font-semibold">
                {weekend_data.map((item) => (
                  <li key={item.name}>
                    {item.name}: {item.percent}%
                  </li>
                ))}
              </li>
            </div>
          </div>
          <div className="w-[380px] h-[380px] p-4 bg-[#F5F5F5] rounded-[10px] flex flex-col items-center justify-center text-center">
            <span className="text-[22px] text-[#121B2A] font-semibold mt-10">
              시간대별 유동인구 비교 결과
            </span>
            <div className="flex-1 w-full flex items-center justify-center">
              <ResponsiveContainer width="90%" height="90%">
                <BarChart
                  data={six_data}
                  margin={{ top: 70, right: 0, left: 0, bottom: 20 }}
                >
                  <Bar dataKey="percent" fill="#03B4C8" radius={[10, 10, 0, 0]}>
                    <LabelList
                      dataKey="percent"
                      position="top"
                      offset={10}
                      fill="#121B2A"
                      fontSize={14}
                      formatter={(value) => `${value}%`}
                    />
                  </Bar>

                  <XAxis
                    dataKey="name"
                    axisLine={false} // x축 선 숨기기
                    tickLine={false} // x축 틱선 숨기기
                    tick={{
                      fill: "#121B2A",
                      fontSize: 14,
                      textAnchor: "middle",
                      dy: 5,
                    }}
                  />
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
                    { value: 70, color: "#0047AB" }, // 예시 score=7
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
                  교남동
                </div>
                <div className="flex items-center justify-center w-[100px] h-[100px] bg-[#80849B] rounded-full text-white text-[20px] font-semibold shrink-0">
                  종로구
                </div>
                <div className="flex items-center justify-center w-[100px] h-[100px] bg-[#80849B] rounded-full text-white text-[20px] font-semibold shrink-0">
                  혜화동
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketResult;
