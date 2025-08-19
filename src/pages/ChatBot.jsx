import React, { useState, useRef } from "react";
import SIcon from "../assets/S.png";        // 챗봇 내부 상단 로고 (변경 없음)
import SBadge from "../assets/SBadge.png";  // 닫힘 상태 아이콘
import SWhite from "../assets/swhite.png";  // 열림 상태 아이콘

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("main");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false); // 🔹 추가: 포커스 상태
  const inputRef = useRef(null);
  const thinkTimer = useRef(null);

  const items = [
    { label: "창업 절차 안내", action: "faq" },
    { label: "사업 신고 행정 안내", action: "faq" },
    { label: "사업 행정 정책 안내", action: "faq" }
  ];

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setThinking(true);
    clearTimeout(thinkTimer.current);
    thinkTimer.current = setTimeout(() => setThinking(false), 2000);
  };

  const stopThinking = () => {
    clearTimeout(thinkTimer.current);
    setThinking(false);
  };

  // 닫힘 상태: 말풍선 + 기본 아이콘 (호버 효과 추가)
  if (!open) {
    return (
      <div className="fixed right-5 bottom-5 flex flex-col items-end gap-2">
        <div
          className="max-w-[300px] rounded-2xl px-4 py-3 shadow-xl"
          style={{ background: "rgba(39,56,75,0.9)" }}
        >
          <p className="text-white text-[12px] leading-[18px] whitespace-pre-line text-center">
            {"당신의 창업 비서 스포티입니다!\n행정안내, 창업 관련 고민은\n저에게 물어봐주세요."}
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="w-12 h-12 rounded-full shadow-xl grid place-items-center overflow-hidden bg-transparent
                     transition duration-200 hover:brightness-110 hover:saturate-125 hover:scale-105"
          aria-label="챗봇 열기"
        >
          <img
            src={SBadge}
            alt="스포티 아이콘"
            className="w-12 h-12 object-contain select-none"
            draggable="false"
          />
        </button>
      </div>
    );
  }

  // 입력 중에도 메인 유지되도록 input 길이 조건 제거
  const isChatting = thinking || messages.length > 0;
  const showHome = stage === "faq" || (stage === "main" && isChatting);

  const goHome = () => {
    setStage("main");
    setInput("");
    setMessages([]);
    stopThinking();
  };

  // 열림 상태: 챗봇 패널은 아이콘 바로 위(겹치지 않게), 패널 배경은 완전 불투명
  return (
    <>
      <div
        className="fixed right-5 bottom-[80px] w-[378px] h-[465px] rounded-[12px] shadow-2xl overflow-hidden"
        style={{ background: "#ffffff" }}
      >
        <div className="relative h-8 flex items-center">
          {showHome && (
            <button
              onClick={goHome}
              className="absolute left-3 top-1 w-6 h-6 grid place-items-center rounded-md hover:bg-white/60"
              aria-label="home"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#7A879A]">
                <path d="M12 3l8 7h-3v8h-4v-5H11v5H7v-8H4l8-7z" />
              </svg>
            </button>
          )}
          <button
            onClick={() => setOpen(false)}
            className="absolute right-3 top-1 w-6 h-6 grid place-items-center rounded-md hover:bg-white/60"
            aria-label="close"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" className="text-[#7A879A]">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-2rem)] px-5 pt-2 pb-2 overflow-y-auto">
          <div className="flex items-start gap-3 mt-5 mb-3">
            <div className="relative shrink-0">
              <div
                className="rounded-full bg-white shadow-sm grid place-items-center overflow-hidden"
                style={{ width: "36px", height: "36px", transform: "translate(20px, 5px)" }}
              >
                <img
                  src={SIcon}
                  alt="S"
                  style={{ width: "28px", height: "28px", objectFit: "contain" }}
                  draggable="false"
                />
              </div>
            </div>
            <div className="w-full text-left ml-[30px]">
              <p className="text-[11px] leading-[16px] text-[#8D9AA9]">안녕하세요, 당신의 창업 비서 스포티입니다</p>
              <h2 className="mt-0.5 text-[18px] leading-[24px] font-extrabold text-[#27384B]">무엇을 도와드릴까요?</h2>
            </div>
          </div>

          {stage === "main" && (
            <>
              {!isChatting && (
                <div className="mt-9">
                  <p className="text-[12px] text-[#8C9AAA] mb-2">
                    아래 목록에서 필요한 행정 안내를 선택해 주세요
                  </p>
                  <div className="flex flex-col gap-2">
                    {items.map((it) => (
                      <button
                        key={it.label}
                        onClick={() => setStage("faq")}
                        className="w-full h-[36px] rounded-lg bg-[#EEF3F7] text-[#526478] text-[12px] px-4 text-left border border-[#E3EAF3] hover:bg-[#F9FBFD] transition-colors"
                      >
                        {it.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ✅ 아래에서부터 쌓이도록: 컨테이너를 바닥 정렬, 메시지는 원래 순서대로 */}
              <div className={`flex-1 flex flex-col justify-end gap-2 ${isChatting ? "mt-4" : "mt-3"}`}>
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={
                      m.role === "user"
                        ? "self-end max-w-[70%] rounded-full px-3 py-1 text-[12px] bg-[#5f7fbf] text-white shadow"
                        : "self-start max-w-[70%] rounded-full px-3 py-1 text-[12px] bg-white text-[#27384B] border border-[#E4EBF3]"
                    }
                  >
                    {m.text}
                  </div>
                ))}
                {thinking && (
                <div className="text-[12px] text-[#8C9AAA] mt-1 mb-3">생각 중입니다...</div>
                  )}

              </div>

              <div
                className="mt-auto mb-2 rounded-[14px] border border-[#C9D3E0] bg-white px-4 py-3 shadow-sm"
                onClick={() => setTimeout(() => inputRef.current?.focus(), 0)}
              >
                <textarea
                  ref={inputRef}
                  className="w-full outline-none resize-none text-[12px] leading-[18px] text-[#2C3A4B] placeholder:text-[#9AA7B6] bg-transparent"
                  rows={2}
                  placeholder={
                    !isInputFocused && input.length === 0
                      ? "창업 관련 고민이 있나요? 스포티에게 무엇이든 물어보세요."
                      : ""
                  } // 🔹 포커스 중엔 placeholder 숨김
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}   // 🔹 추가
                  onBlur={() => setIsInputFocused(false)}    // 🔹 추가
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <div className="mt-2 flex justify-end">
                  {!thinking ? (
                    <button
                      onClick={sendMessage}
                      className="w-7 h-7 rounded-full bg-[#5f7fbf] text-white grid place-items-center"
                      title="보내기"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="m3 11 17-8-8 17-2-6-7-3Z" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={stopThinking}
                      className="w-7 h-7 rounded-full bg-[#7a8fb6] text-white grid place-items-center"
                      title="정지"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="6" width="12" height="12" rx="1.5" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {stage === "faq" && (
            <div className="flex-1 flex">
              <ul className="my-auto mx-auto w-full max-w-[340px] divide-y divide-[#CBD5E1]">
                {[
                  { q: "Questions 1", a: "" },
                  { q: "Questions 2", a: "여기는 answer 창입니다" },
                  { q: "Questions 3", a: "" },
                  { q: "Questions 4", a: "" }
                ].map((it, i) => (
                  <li key={i} className="py-2">
                    <details className="group">
                      <summary className="list-none flex items-center gap-3 text-[14px] text-[#27384B] font-medium cursor-pointer">
                        <span className="text-lg leading-none text-[#8FA0B2] group-open:hidden">+</span>
                        <span className="text-lg leading-none text-[#8FA0B2] hidden group-open:inline">−</span>
                        <span>{it.q}</span>
                      </summary>
                      {it.a && (
                        <p className="mt-2 mb-2 pl-7 whitespace-pre-line text-[13px] leading-[18px] text-[#334155]">
                          {it.a}
                        </p>
                      )}
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 같은 자리/크기의 상태표시 아이콘: 열림 시 swhite.png (닫기 버튼) */}
      <button
        onClick={() => setOpen(false)}
        className="fixed right-5 bottom-5 w-12 h-12 rounded-full shadow-xl grid place-items-center overflow-hidden bg-transparent"
        aria-label="챗봇 닫기"
      >
        <img
          src={SWhite}
          alt="스포티 아이콘 (열림)"
          className="w-12 h-12 object-contain select-none"
          draggable="false"
        />
      </button>
    </>
  );
}
