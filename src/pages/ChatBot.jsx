import React, { useState, useRef, useEffect } from "react";
import SIcon from "../assets/S.png";        // 챗봇 내부 상단 로고
import SBadge from "../assets/SBadge.png";  // 닫힘 상태 아이콘
import SWhite from "../assets/swhite.png";  // 열림 상태 아이콘
import { postAsk, /* getConversation */ } from "../api/chatbot"; // FAQ는 보류

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("main");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [contextId, setContextId] = useState(undefined); // 🔹 명세: contextId 저장
  const inputRef = useRef(null);
  const thinkTimer = useRef(null);

  useEffect(() => {
    console.log("[ENV] VITE_API_BASE =", import.meta.env?.VITE_API_BASE);
  }, []);

  // (선택) 열 때 기존 대화 불러오기 — 서버가 세션+contextId를 필요로 할 때만 사용
  // useEffect(() => {
  //   if (open && contextId) {
  //     getConversation(contextId)
  //       .then((arr) => {
  //         if (Array.isArray(arr)) {
  //           const restored = arr.map((it) => [
  //             { role: "user", text: it.question },
  //             { role: "bot", text: it.answer },
  //           ]).flat();
  //           setMessages(restored);
  //         }
  //       })
  //       .catch(() => {});
  //   }
  // }, [open, contextId]);

  const items = [
    { id: "regulation", label: "창업 절차 안내" },
    { id: "report",     label: "사업 법규 정책 안내" },
    { id: "support",    label: "사업 행정 정책 안내" }
  ];
  const handleCategoryClick = () => {
    alert("해당 FAQ는 준비 중입니다.");
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setThinking(true);
    clearTimeout(thinkTimer.current);

    try {
      const res = await postAsk(text); // { answer, contextId, _raw }
      console.log("[/ask response]", res);

      if (res?.contextId && res.contextId !== contextId) {
        setContextId(res.contextId); // 최초 대화면 서버가 내려준 contextId 저장
      }

      const answer =
        typeof res?.answer === "string" && res.answer.trim().length > 0
          ? res.answer
          : // 백엔드가 형식을 지키지 않았을 때 원본 가드
            `서버 응답 형식이 예상과 달라요.\n원본: ${JSON.stringify(res?._raw ?? res, null, 2)}`;

      setMessages((prev) => [...prev, { role: "bot", text: answer }]);
    } catch (e) {
      console.error("[/ask error catch]", e);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "서버와 통신에 실패했습니다. 잠시 후 다시 시도해주세요." },
      ]);
    } finally {
      thinkTimer.current = setTimeout(() => setThinking(false), 200);
    }
  };

  const stopThinking = () => {
    clearTimeout(thinkTimer.current);
    setThinking(false);
  };

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

  const isChatting = thinking || messages.length > 0;
  const showHome = stage === "faq" || (stage === "main" && isChatting);

  const goHome = () => {
    setStage("main");
    setInput("");
    setMessages([]);
    setThinking(false);
    clearTimeout(thinkTimer.current);
    // contextId는 유지/초기화 선택 가능. 유지하면 같은 세션 계속.
    // setContextId(undefined);
  };

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
                        key={it.id}
                        onClick={handleCategoryClick}
                        className="w-full h-[36px] rounded-lg bg-[#EEF3F7] text-[#526478] text-[12px] px-4 text-left border border-[#E3EAF3] hover:bg-[#F9FBFD] transition-colors"
                      >
                        {it.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 입력창 바로 위부터 쌓이도록 하단 정렬 */}
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
                {thinking && <div className="text-[12px] text-[#8C9AAA] mt-1 mb-3">생각 중입니다...</div>}
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
                  }
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
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
