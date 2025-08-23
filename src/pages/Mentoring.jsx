import React, { useState, useEffect } from "react";
import back from "../assets/Back.svg";
import mentorListApi from "../apis/mentorListApi";
import updateMentorApi from "../apis/updateMentorApi";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// 선택용 목록 (지금처럼 쓰기 or 멘토 정보에 있는 걸로 나열하기)
const areaList = [
  "서부1동",
  "서부2동",
  "중방동",
  "중앙동",
  "남부동",
  "남천면",
  "동부동",
  "남산면",
  "자인면",
  "용성면",
  "진량읍",
  "압량면",
  "북부동",
  "하양읍",
  "와촌면",
];
const categoryList = [
  "음식",
  "소매",
  "미용",
  "교육",
  "카페",
  "의류",
  "생활서비스",
];

const Mentoring = () => {
  const navigate = useNavigate();
  const { name, role, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !name && !role) {
      navigate("/login");
      return;
    }
  }, [name, role, navigate, isLoading]);

  const [open, setOpen] = useState(false);

  const [area, setArea] = useState("서부1동");
  const [category, setCategory] = useState("음식");

  const [selectedMentor, setSelectedMentor] = useState(null);

  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    if (name || role) {
      const fetchMentors = async () => {
        const data = await mentorListApi();
        setMentors(data);
      };
      fetchMentors();
    }
  }, [name, role]);

  const mentoringApply = async () => {
    if (!selectedDate || !selectedTime) {
      alert("멘토링 받을 날짜와 시간을 모두 선택해주세요.");
      return;
    }

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${selectedTime}:00`;

    try {
      await updateMentorApi({
        mentorId: selectedMentor.id,
        date: formattedDate,
        time: formattedTime,
      });

      alert("신청이 완료되었습니다!");
      setSelectedMentor(null);
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error) {
      alert("신청 중 오류가 발생했습니다.");
    }
  };

  const times = ["10:00", "14:00", "18:00", "22:00"];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= lastDate; d++) days.push(d);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const chipCls = (active) =>
    `px-4 py-1 rounded-full text-sm border transition
      ${
        active
          ? "bg-white text-[#121B2A] font-semibold ring-2 ring-sky-400 border-white"
          : "bg-white/10 text-white border-white/20 hover:bg-white/20"
      }`;

  const filteredMentors = mentors.filter(
    (mentor) => mentor.area === area && mentor.category === category
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!name || !role) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#121B2A]">
      <div className="mx-auto max-w-screen-xl px-6 py-12">
        <h1 className="text-center text-4xl font-extrabold text-white">
          멘토 탐색
        </h1>
        <p className="mt-3 text-center text-white">
          관심 동네와 업종에 맞는 멘토를 쉽고 빠르게 찾아드립니다.
        </p>

        <div className="relative mt-8 mx-auto max-w-3xl isolate z-20">
          <div className="relative z-20 flex items-center justify-between rounded-xl bg-[#424242] px-8 py-3 text-sm text-white">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>동네</span>
              <span>&gt;</span>
              <span className="text-[#8DCAFF] font-semibold">{area}</span>
              <span className="mx-2">|</span>
              <span>업종</span>
              <span>&gt;</span>
              <span className="text-[#8DCAFF] font-semibold">{category}</span>
              <span>
                에 따른 결과입니다. 재탐색은 우측 화살표를 눌러주세요.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex h-8 w-8 items-center justify-center rounded-full"
              aria-label="카테고리 열기"
              title="카테고리 열기"
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 24 24"
                fill="none"
                className={`${open ? "rotate-180" : ""}`}
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {open && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-xl bg-[#595959] text-white shadow-2xl">
              <div className="grid grid-cols-2 divide-x divide-white/10">
                <div className="p-6">
                  <p className="mb-3 text-sm text-white/90">동네 선택</p>
                  <div className="flex flex-wrap gap-3">
                    {areaList.map((a) => (
                      <button
                        key={a}
                        onClick={() => setArea(a)}
                        className={chipCls(area === a)}
                        type="button"
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="p-6">
                  <p className="mb-3 text-sm text-white/90">업종 선택</p>
                  <div className="flex flex-wrap gap-3">
                    {categoryList.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={chipCls(category === c)}
                        type="button"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end p-4">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-[#8DCAFF] hover:underline"
                >
                  선택 완료
                </button>
              </div>
            </div>
          )}
        </div>

        {open && (
          <div
            className="fixed inset-0 z-10"
            onPointerDown={() => setOpen(false)}
            aria-hidden
          />
        )}

        <div
          aria-hidden={open}
          className={`relative z-0 mt-12 overflow-hidden grid grid-cols-3 gap-10 transition duration-100
            ${open ? "blur-xs pointer-events-none select-none" : ""}`}
        >
          {filteredMentors.map((mentor) => (
            <article
              key={mentor.id}
              className="rounded-xl bg-white py-12 transition hover:bg-white/90 cursor-pointer"
              onClick={() => setSelectedMentor(mentor)}
            >
              <div className="mx-auto h-20 w-20 overflow-hidden rounded-full ring-2 ring-gray-200">
                <img
                  src={`https://i.pravatar.cc/120?u=${mentor.id}`}
                  alt={`${mentor.name} 프로필 이미지`}
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-4 text-center text-lg font-semibold text-gray-900">
                {mentor.name}
              </h3>
              <p className="mt-1 text-center text-sm text-gray-500 px-4">
                {mentor.headline}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2 px-4">
                {mentor.keywords.map((k) => (
                  <span
                    key={k}
                    className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {k}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 모달창 */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl flex overflow-hidden">
            {/* 왼쪽 */}
            <div className="w-1/2 p-6 flex flex-col items-center mt-5 ml-5 mr-5">
              <img
                src={`https://i.pravatar.cc/120?u=${selectedMentor.id}`}
                alt={selectedMentor.name}
                className="h-[90px] w-[90px] rounded-full object-cover ring-2 ring-gray-200"
              />
              <h3 className="mt-3 text-[24px] font-semibold text-[#464646]">
                {selectedMentor.name}
              </h3>
              <p className="text-sm text-gray-500">{selectedMentor.headline}</p>

              <div className="mt-6 w-full">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <button onClick={handlePrevMonth}>◀</button>
                  <span className="font-bold text-[14px]">
                    {year}년 {month + 1}월
                  </span>
                  <button onClick={handleNextMonth}>▶</button>
                </div>
                <div className="grid grid-cols-7 text-center text-sm gap-y-2">
                  {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                    <div
                      key={d}
                      className="flex items-center justify-center w-[24px] h-[24px] text-[12px] font-medium text-gray-600"
                    >
                      {d}
                    </div>
                  ))}
                  {days.map((d, i) => (
                    <div
                      key={i}
                      className={`
                        flex items-center justify-center 
                        w-[24px] h-[24px] cursor-pointer text-[12px]
                        ${
                          d
                            ? selectedDate &&
                              selectedDate.getDate() === d &&
                              selectedDate.getMonth() === month
                              ? "bg-[#0047AB] text-white rounded-full"
                              : "hover:bg-gray-100 rounded-full"
                            : ""
                        }
                      `}
                      onClick={() =>
                        d && setSelectedDate(new Date(year, month, d))
                      }
                    >
                      {d || ""}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {times.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`px-4 py-1 rounded-[10px] border text-[12px] cursor-pointer ${
                      selectedTime === t
                        ? "bg-[#2E47A4] text-white border-[#2E47A4]"
                        : "bg-white text-black border-[#DBDBDB] hover:bg-[#DBDBDB]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <p className="mt-5 mb-5 text-[12px] text-[#464646]">
                상세 일정은 멘토 확정 후 조율될 수 있습니다.
              </p>

              <button
                onClick={mentoringApply}
                className="w-[104px] h-[34px] rounded-[6px] bg-[#2E47A4] px-4 py-4 text-white font-[10px] flex items-center justify-center cursor-pointer"
              >
                신청하기
              </button>
            </div>

            <div className="w-1/2 p-8">
              <h2 className="text-[20px] font-semibold text-[#464646]">
                프로필
              </h2>
              <hr className="text-[#464646] mt-4" />
              <h3 className="mt-4 text-[16px] font-semibold text-[#464646]">
                소개글
              </h3>
              <p className="mt-2 text-[#464646] text-14px font-medium leading-relaxed">
                {selectedMentor.bio}
              </p>

              <hr className="text-[#D7D7D7] mt-5" />
              <h3 className="mt-5 text-[16px] text-[#464646] font-semibold">
                키워드
              </h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedMentor.keywords.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-3 py-1 text-[12px] text-black border-[0.5px] border-[#DBDBDB]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <hr className="text-[#D7D7D7] mt-5" />
              <h3 className="mt-5 text-[16px] text-[#464646] font-semibold">
                대화 가능한 주제
              </h3>
              <ul className="mt-2 list-disc pl-5 text-gray-700">
                {selectedMentor.topics?.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setSelectedMentor(null)}
              className="absolute top-4 right-4 w-[27px] h-[27px] bg-[#4C5060] flex items-center justify-center text-white text-xl font-bold rounded-full cursor-pointer"
            >
              <img src={back} alt="back" className="w-[9] h-[9]" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Mentoring;
