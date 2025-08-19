// src/pages/Mentoring.jsx
import React, { useState } from "react";

// ----- 더미 데이터 (API로 교체 해야 함) -----
const mentors = [
  {
    id: 1,
    name: "김사자",
    headline: "비둘기는 엄청해보여",
    bio: "카페 업계에서 창업/운영을 경험한 멘토입니다. 상권 분석과 메뉴 구성, 초기 마케팅까지 함께 설계해드립니다.",
    tags: ["대동", "음식"],
    photo: "https://i.pravatar.cc/120?img=47",
  },
  {
    id: 2,
    name: "김사자",
    headline: "비둘기는 엄청해보여",
    bio: "프랜차이즈와 개인 카페 모두 경험 있습니다. 원재료 발주, 인력 운영, 손익 계산 실무 위주로 도와드려요.",
    tags: ["조영동", "카페"],
    photo: "https://i.pravatar.cc/120?img=12",
  },
  {
    id: 3,
    name: "김사자",
    headline: "비둘기는 엄청해보여",
    bio: "초기 창업자 대상 1:1 멘토링. 임대차 계약 체크리스트와 인허가 절차까지 단계별로 안내합니다.",
    tags: ["사동", "창업초기"],
    photo: "https://i.pravatar.cc/120?img=32",
  },
  {
    id: 4,
    name: "김사자",
    headline: "비둘기는 엄청해보여",
    bio: "지역 상권 특성에 맞춘 콘셉트 기획과 포지셔닝을 함께 고민합니다. SNS 채널 운영 가이드 제공.",
    tags: ["대동", "SNS"],
    photo: "https://i.pravatar.cc/120?img=5",
  },
  {
    id: 5,
    name: "김사자",
    headline: "비둘기는 엄청해보여",
    bio: "원두 선택과 추출 세팅, 장비 셋업까지 실무형 코칭. 오픈준비 일정표를 공유해드립니다.",
    tags: ["카페", "장비"],
    photo: "https://i.pravatar.cc/120?img=15",
  },
  {
    id: 6,
    name: "김사자",
    headline: "비둘기는 엄청해보여",
    bio: "손익분기 계산과 비용 구조 점검, 메뉴 엔지니어링으로 객단가를 개선하는 방법을 제안합니다.",
    tags: ["비용관리", "메뉴"],
    photo: "https://i.pravatar.cc/120?img=23",
  },
  {
    id: 7,
    name: "김사자",
    headline: "비둘기는 엄청해보여",
    bio: "손익분기 계산과 비용 구조 점검, 메뉴 엔지니어링으로 객단가를 개선하는 방법을 제안합니다.",
    tags: ["비용관리", "메뉴"],
    photo: "https://i.pravatar.cc/120?img=23",
  },
  {
    id: 8,
    name: "김사자",
    headline: "비둘기는 엄청해보여",
    bio: "손익분기 계산과 비용 구조 점검, 메뉴 엔지니어링으로 객단가를 개선하는 방법을 제안합니다.",
    tags: ["비용관리", "메뉴"],
    photo: "https://i.pravatar.cc/120?img=23",
  },
  {
    id: 9,
    name: "김사자",
    headline: "비둘기는 엄청해보여",
    bio: "손익분기 계산과 비용 구조 점검, 메뉴 엔지니어링으로 객단가를 개선하는 방법을 제안합니다.",
    tags: ["비용관리", "메뉴"],
    photo: "https://i.pravatar.cc/120?img=23",
  },
  {
    id: 10,
    name: "김사자",
    headline: "비둘기는 엄청해보여",
    bio: "손익분기 계산과 비용 구조 점검, 메뉴 엔지니어링으로 객단가를 개선하는 방법을 제안합니다.",
    tags: ["비용관리", "메뉴"],
    photo: "https://i.pravatar.cc/120?img=23",
  },
  {
    id: 11,
    name: "김사자",
    headline: "비둘기는 엄청해보여",
    bio: "손익분기 계산과 비용 구조 점검, 메뉴 엔지니어링으로 객단가를 개선하는 방법을 제안합니다.",
    tags: ["비용관리", "메뉴"],
    photo: "https://i.pravatar.cc/120?img=23",
  },
  {
    id: 12,
    name: "김사자",
    headline: "비둘기는 엄청해보여",
    bio: "손익분기 계산과 비용 구조 점검, 메뉴 엔지니어링으로 객단가를 개선하는 방법을 제안합니다.",
    tags: ["비용관리", "메뉴"],
    photo: "https://i.pravatar.cc/120?img=23",
  },
  {
    id: 13,
    name: "김사자",
    headline: "비둘기는 엄청해보여",
    bio: "손익분기 계산과 비용 구조 점검, 메뉴 엔지니어링으로 객단가를 개선하는 방법을 제안합니다.",
    tags: ["비용관리", "메뉴"],
    photo: "https://i.pravatar.cc/120?img=23",
  },
];

const TOWNS = [
  "조영동",
  "대동",
  "정평동",
  "사동",
  "중방동",
  "옥산동",
  "압량읍",
];
const CATES = ["카페", "음식", "미용", "교육", "소매", "의류", "생활서비스"];

// ----- 여기까지 -----

const Mentoring = () => {
  const [open, setOpen] = useState(false);
  const [town, setTown] = useState("조영동");
  const [cate, setCate] = useState("카페");

  const chipCls = (active) =>
    `px-4 py-1 rounded-full text-sm border transition
     ${
       active
         ? "bg-white text-[#121B2A] font-semibold ring-2 ring-sky-400 border-white"
         : "bg-white/10 text-white border-white/20 hover:bg-white/20"
     }`;

  return (
    <main className="min-h-screen bg-[#121B2A]">
      <div className="mx-auto max-w-screen-xl px-6 py-12">
        <h1 className="text-center text-4xl font-extrabold text-white">
          멘토 탐색
        </h1>
        <p className="mt-3 text-center text-white">
          관심 동네와 업종에 맞는 멘토를 쉽고 빠르게 찾아드립니다.
        </p>

        {/* 카테고리 선택 바 */}
        <div className="relative mt-8 mx-auto max-w-3xl isolate z-20">
          <div className="relative z-20 flex items-center justify-between rounded-xl bg-[#424242] px-8 py-3 text-sm text-white">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>동네</span>
              <span>&gt;</span>
              <span className="text-[#8DCAFF] font-semibold">{town}</span>
              <span className="mx-2">|</span>
              <span>업종</span>
              <span>&gt;</span>
              <span className="text-[#8DCAFF] font-semibold">{cate}</span>
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

          {/* 드롭다운 */}
          {open && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-xl bg-[#595959] text-white shadow-2xl">
              <div className="grid grid-cols-2 divide-x divide-white/10">
                {/* 동네 선택 */}
                <div className="p-6">
                  <p className="mb-3 text-sm text-white/90">동네 선택</p>
                  <div className="flex flex-wrap gap-3">
                    {TOWNS.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTown(t)}
                        className={chipCls(town === t)}
                        type="button"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                {/* 업종 선택 */}
                <div className="p-6">
                  <p className="mb-3 text-sm text-white/90">업종 선택</p>
                  <div className="flex flex-wrap gap-3">
                    {CATES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCate(c)}
                        className={chipCls(cate === c)}
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

        {/* 외부 클릭 시 드롭다운 닫기 */}
        {open && (
          <div
            className="fixed inset-0 z-10"
            onPointerDown={() => setOpen(false)}
            aria-hidden
          />
        )}

        {/* 프로필 카드 */}
        <div
          aria-hidden={open}
          className={`relative z-0 mt-12 overflow-hidden grid grid-cols-3 gap-10 transition duration-100
            ${open ? "blur-xs pointer-events-none select-none" : ""}`}
        >
          {mentors.map((mentor) => (
            <article
              key={mentor.id}
              className="rounded-xl bg-white py-12 transition hover:bg-white/90"
            >
              <div className="mx-auto h-20 w-20 overflow-hidden rounded-full ring-2 ring-gray-200">
                <img
                  src={mentor.photo}
                  alt={`${mentor.name} 프로필 이미지`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="mt-4 text-center text-lg font-semibold text-gray-900">
                {mentor.name}
              </h3>
              <p className="mt-1 text-center text-sm text-gray-500">
                {mentor.headline}
              </p>
              <p className="mt-4 px-12 text-sm leading-relaxed text-gray-700">
                {mentor.bio}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                {mentor.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-600"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Mentoring;
