import React, { useState, useRef } from "react";
import SIcon from "../assets/S.png";

export default function ChatBot() {
  const [open, setOpen] = useState(true);
  const [stage, setStage] = useState("main");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
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

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-5 w-12 h-12 rounded-full bg-[#5f7fbf] text-white shadow-xl grid place-items-center"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z" />
        </svg>
      </button>
    );
  }

  const isChatting = thinking || messages.length > 0 || input.length > 0;
  const showHome = stage === "faq" || (stage === "main" && isChatting);

  const goHome = () => {
    setStage("main");
    setInput("");
    setMessages([]);
    stopThinking();
  };

  return (
    <div
      className="fixed right-5 bottom-5 w-[378px] h-[465px] rounded-[12px] shadow-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.9)" }}
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

            <div className={`flex flex-col gap-2 ${isChatting ? "mt-4" : "mt-3"}`}>
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
              {thinking && <div className="text-[12px] text-[#8C9AAA]">생각 중입니다...</div>}
            </div>

            <div
              className="mt-auto mb-2 rounded-[14px] border border-[#C9D3E0] bg-white px-4 py-3 shadow-sm"
              onClick={() => setTimeout(() => inputRef.current?.focus(), 0)}
            >
              <textarea
                ref={inputRef}
                className="w-full outline-none resize-none text-[12px] leading-[18px] text-[#2C3A4B] placeholder:text-[#9AA7B6] bg-transparent"
                rows={2}
                placeholder="창업 관련 고민이 있나요? 스포티에게 무엇이든 물어보세요."
                value={input}
                onChange={(e) => setInput(e.target.value)}
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
                {
                  q: "Questions 1",
                  a: ""
                },
                {
                  q: "Questions 2",
                  a: "여기는 answer 창입니다"
                },
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
  );
}
