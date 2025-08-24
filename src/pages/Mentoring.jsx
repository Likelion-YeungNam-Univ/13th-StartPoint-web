import React, { useState, useEffect } from "react";
import back from "../assets/Back.svg";
import error from "../assets/Error.svg";
import mentorListApi from "../apis/mentorListApi";
import updateMentorApi from "../apis/updateMentorApi";
import { MoonLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import heart from "../assets/Heart.svg";
import heartPush from "../assets/Heart_Push.svg";

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
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [showPreparing, setShowPreparing] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      setLoading(true);
      try {
        const data = await mentorListApi();
        setMentors(data);
      } catch (err) {
        console.error("멘토 불러오기 오류:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  useEffect(() => {
    if (name || role) {
      const fetchMentors = async () => {
        const data = await mentorListApi();
        setMentors(data);
      };
      fetchMentors();
    }
  }, [name, role]);

  const mentoringApply = () => {
    setLoadingPayment(true); // 1초 동안 로딩 표시

    setTimeout(async () => {
      setLoadingPayment(false);
      setShowPayment(true);

      if (selectedDate && selectedTime && selectedMentor) {
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
        } catch (error) {
          console.error("신청 중 오류 발생:", error);
        }
      }
    }, 1000);
  };

  const handlePaymentConfirm = () => {
    setShowPreparing(true); // 결제 서비스 준비중 모달 표시
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
    `px-4 py-1 rounded-[20px] text-sm border transition cursor-pointer
      ${
        active
          ? "bg-white text-[#2E47A4] border-white"
          : "bg-[#B3B3B3] text-white border-white/20 hover:bg-white/20"
      }`;

  const filteredMentors = mentors.filter(
    (mentor) => mentor.area === area && mentor.category === category
  );

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (selectedMentor) {
      setLikeCount(selectedMentor.likeCount || 0);
      setLiked(false); // 모달 열 때 기본값 초기화
    }
  }, [selectedMentor]);

  const toggleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!name || !role) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#121B2A]">
      <div className="mx-auto max-w-screen-xl px-6 py-12">
        <h1 className="text-white text-[33px] pt-5 font-bold flex items-center justify-center">
          멘토 탐색
        </h1>
        <p className="mt-4 text-center text-[22px] text-white">
          관심 동네와 업종에 맞는 멘토를 쉽고 빠르게 찾아드립니다.
        </p>

        {/* 카테고리 선택 바 */}
        <div className="relative mt-10 mx-auto max-w-4xl isolate z-20 w-full">
          <div className="relative z-20 flex items-center justify-between rounded-[20px] bg-[#424242] pl-10 px-6 py-4 text-[17px] text-white w-full">
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
              className="flex h-8 w-8 items-center justify-center rounded-full cursor-pointer"
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
            <div className="absolute mt-4 z-50 rounded-[20px] bg-[#424242] text-white shadow-2xl h-[320px] w-full">
              <div className="grid grid-cols-2 divide-x divide-white/10">
                <div className="p-6">
                  <p className="flex justify-center mb-3 text-[18px] text-white">
                    동네 선택
                  </p>
                  <div className="flex flex-wrap gap-3 mt-10 px-5">
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
                  <p className="flex justify-center mb-3 text-[18px] text-white">
                    업종 선택
                  </p>
                  <div className="flex flex-wrap gap-3 mt-10 px-5">
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

              <div className="flex justify-end p-5">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="absolute bottom-5 right-7 text-[18px] text-[#B2D5F2] cursor-pointer"
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
          className={`relative z-0 mt-15 overflow-hidden grid grid-cols-3 gap-10 px-13 transition duration-100
            ${open ? "blur-xs pointer-events-none select-none" : ""}`}
        >
          {loading ? (
            <div className="col-span-3 flex flex-col items-center justify-center py-20 text-white mt-13">
              <MoonLoader color="#D3D3D3" size={40} />
              <p className="mt-10 text-[#D3D3D3] text-[20px]">
                탐색 및 정렬 중입니다. 잠시만 기다려 주세요.
              </p>
            </div>
          ) : filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => (
              <article
                key={mentor.id}
                className="w-[330px] h-[420px] rounded-[10px] bg-white py-12 transition hover:bg-white/90 cursor-pointer"
                onClick={() => setSelectedMentor(mentor)}
              >
                <div className="mx-auto h-[105px] w-[105px] overflow-hidden rounded-full">
                  <img
                    src={`https://i.pravatar.cc/120?u=${mentor.id}`}
                    alt={`${mentor.name} 프로필 이미지`}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-center text-[24px] font-semibold text-[#464646]">
                  {mentor.name}
                </h3>

                <p className="mt-2 text-center text-[17px] text-[#464646] font-medium px-5 break-words">
                  {mentor.headline}
                </p>
                <p className="mt-2 text-center text-[14px] text-[#464646] font-medium px-5 break-words">
                  {mentor.bio}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  {mentor.keywords.map((k) => (
                    <span
                      key={k}
                      className="rounded-full border-[0.5px] border-[#4D4D4D] px-4 py-1 text-[14px] text-[#616161]"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-3 flex items-center justify-center py-20 text-[#B4B4B4]">
              <p className="text-[18px] text-center">
                아직 해당 카테고리에는 멘토가 준비되지 않았습니다.
                <br />
                다른 카테고리를 탐색해 보세요.
              </p>
            </div>
          )}
        </div>
      </div>

      {loadingPayment && (
        <div className="fixed inset-0 z-[65] flex items-center justify-center backdrop-blur-xs">
          <MoonLoader color="#2E47A4" size={40} />
        </div>
      )}

      {/* 모달창 */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-6">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl flex overflow-hidden">
            {/* 왼쪽 */}
            <div className="w-1/2 p-5 flex flex-col items-center mt-5 ml-5">
              <img
                src={`https://i.pravatar.cc/120?u=${selectedMentor.id}`}
                alt={selectedMentor.name}
                className="h-[90px] w-[90px] rounded-full object-cover"
              />
              <h3 className="mt-4 text-[24px] font-semibold text-[#464646]">
                {selectedMentor.name}
              </h3>
              <p className="mt-1 text-[14px] text-[#464646] font-medium">
                {selectedMentor.headline}
              </p>

              <p className="mt-7 text-[14px] text-[#464646] font-medium">
                날짜와 시간을 선택해 주세요
              </p>

              <div className="mt-4 w-[240px]">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <button onClick={handlePrevMonth} className="cursor-pointer">
                    ◀
                  </button>
                  <span className="font-bold text-[14px]">
                    {year}년 {month + 1}월
                  </span>
                  <button onClick={handleNextMonth} className="cursor-pointer">
                    ▶
                  </button>
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

              {/* 시간 선택 */}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {times.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`px-3.5 py-1 rounded-[10px] border text-[12px] cursor-pointer ${
                      selectedTime === t
                        ? "bg-[#2E47A4] text-white border-[#2E47A4]"
                        : "bg-white text-black border-[#DBDBDB] hover:bg-[#DBDBDB]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <p className="mt-7 mb-7 text-[12px] text-[#464646]">
                상세 일정은 멘토 확정 후 조율될 수 있습니다.
              </p>

              <button
                onClick={mentoringApply}
                disabled={!selectedDate || !selectedTime}
                className={`w-[104px] h-[34px] rounded-[6px] mb-3 px-4 py-4 text-[12px] font-semibold text-white transition flex items-center justify-center
                ${
                  !selectedDate || !selectedTime
                    ? "bg-[#CFCFCF] cursor-not-allowed"
                    : "bg-[#2E47A4] hover:bg-[#1d3180] cursor-pointer"
                }`}
              >
                신청하기
              </button>
            </div>

            {/* 오른쪽 */}
            <div className="w-1/2 p-5 mt-10 mr-10">
              <div className="flex items-center justify-between">
                <h2 className="text-[20px] font-semibold text-[#464646]">
                  프로필
                </h2>
                <div
                  className="flex items-center gap-2 cursor-pointer mr-3"
                  onClick={toggleLike}
                >
                  <img
                    src={liked ? heartPush : heart}
                    alt="좋아요"
                    className="w-6 h-6"
                  />
                  <span className="text-[#2E47A4] font-medium">
                    {likeCount}
                  </span>
                </div>
              </div>
              <hr className="text-[#464646] mt-3" />
              <h3 className="mt-5 text-[16px] font-semibold text-[#464646]">
                소개글
              </h3>
              <p className="mt-3 text-[#464646] text-[14px] font-medium leading-relaxed">
                {selectedMentor.intro}
              </p>

              <hr className="text-[#D7D7D7] mt-5" />
              <h3 className="mt-5 text-[16px] text-[#464646] font-semibold">
                키워드
              </h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {selectedMentor.keywords.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-4 py-1 text-[12px] text-black border-[0.5px] border-[#DBDBDB]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <hr className="text-[#D7D7D7] mt-6" />
              <h3 className="mt-5 text-[16px] text-[#464646] font-semibold">
                대화 가능한 주제
              </h3>
              <ul className="mt-3 list-disc pl-5.5 text-[#464646] text-[14px] font-medium space-y-2">
                {selectedMentor.topics?.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => setSelectedMentor(null)}
              className="absolute top-5 right-5 w-[18px] h-[18px] bg-[#B5B5B5] flex items-center justify-center text-white text-xl font-bold rounded-full cursor-pointer"
            >
              <img src={back} alt="back" className="w-[8px] h-[8px]" />
            </button>
          </div>
        </div>
      )}

      {showPayment && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-xs bg-black/50">
          <div className="bg-white rounded-[6px] shadow-xl w-[700px] h-[250px]">
            <div className="relative flex justify-between items-center px-6 py-3 border-b border-[#2E47A4]">
              <h2 className="text-[17px] font-semibold text-black">
                결제 수단 선택
              </h2>
              <button
                onClick={() => setShowPayment(false)}
                className="absolute right-5 w-[18px] h-[18px] bg-[#B5B5B5] flex items-center justify-center text-white text-xl font-bold rounded-full cursor-pointer"
              >
                <img src={back} alt="back" className="w-[8px] h-[8px]" />
              </button>
            </div>

            <div className="px-5 py-1">
              <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                <tbody>
                  <tr className="border-t border-[#D9D9D9]">
                    <td className="py-2 px-4 font-medium text-[14px] border-r border-[#D9D9D9]">
                      신용카드
                    </td>
                    <td className="py-2 px-2 flex justify-start gap-4 ml-3">
                      <label className="flex items-center gap-2 font-medium text-[14px] text-[#5E5E5E]">
                        <input
                          type="radio"
                          name="payment"
                          value="realtime"
                          className="cursor-pointer"
                        />
                        <span>신용카드</span>
                      </label>
                      <label className="flex items-center gap-2 ml-13.5 font-medium text-[14px] text-[#5E5E5E]">
                        <input
                          type="radio"
                          name="payment"
                          value="virtual"
                          className="cursor-pointer"
                        />
                        <span>해외발급신용카드</span>
                      </label>
                    </td>
                  </tr>

                  <tr className="border-t border-[#D9D9D9]">
                    <td className="py-2 px-4 font-medium text-[14px] border-r border-[#D9D9D9]">
                      계좌이체
                    </td>
                    <td className="py-2 px-2 flex justify-start gap-4 ml-3">
                      <label className="flex items-center gap-2 font-medium text-[14px] text-[#5E5E5E]">
                        <input
                          type="radio"
                          name="payment"
                          value="realtime"
                          className="cursor-pointer"
                        />
                        <span>실시간 계좌이체</span>
                      </label>
                      <label className="flex items-center gap-2 ml-2 font-medium text-[14px] text-[#5E5E5E]">
                        <input
                          type="radio"
                          name="payment"
                          value="virtual"
                          className="cursor-pointer"
                        />
                        <span>무통장입금</span>
                      </label>
                    </td>
                  </tr>

                  <tr className="border-t border-[#D9D9D9]">
                    <td className="py-2 px-4 font-medium text-[14px] border-r border-[#D9D9D9]">
                      기타
                    </td>
                    <td className="py-2 px-2 flex items-center justify-start ml-3 gap-2 font-medium text-[14px] text-[#5E5E5E]">
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        className="cursor-pointer"
                      />
                      <span>휴대폰</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="px-6 py-5 border-t border-[#2E47A4] flex justify-center">
              <button
                onClick={handlePaymentConfirm}
                className="w-[300px] h-[32px] rounded-[5px] bg-[#2E47A4] text-[14px] text-white font-semibold hover:bg-[#1d3180] cursor-pointer"
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreparing && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center backdrop-blur-xs bg-black/50">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl p-15 text-center">
            <button
              onClick={() => setShowPreparing(false)}
              className="absolute top-5 right-5 w-[18px] h-[18px] bg-[#B5B5B5] flex items-center justify-center text-white text-xl font-bold rounded-full cursor-pointer"
            >
              <img src={back} alt="back" className="w-[8px] h-[8px]" />
            </button>
            <img
              src={error}
              alt="error"
              className="w-[90px] h-[90px] mx-auto mb-15 mt-22"
            />
            <h2 className="text-[36px] mb-13">
              <span className="font-bold text-[#2E47A4]">서비스 준비중</span>
              <span className="font-light text-black">입니다.</span>
            </h2>
            <p className="text-[20px] text-black font-medium leading-relaxed mb-22">
              이용에 불편을 드려 죄송합니다.
              <br />
              보다 나은 서비스 제공을 위하여 페이지 준비중에 있습니다.
              <br />
              빠른 시일내에 준비하여 찾아뵙겠습니다.
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Mentoring;
