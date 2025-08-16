import React, { useState, useRef } from "react";
import SIcon from "../assets/S.png";

export default function ChatBot() {
  const [open, setOpen] = useState(true);
  const [stage, setStage] = useState("main");
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const items = [
    { label: "창업 절차 안내", action: "faq" },
    { label: "사업 신고 행정 안내", action: "faq" },
    { label: "사업 행정 정책 안내", action: "faq" }
  ];

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

  return (
    <div className="fixed right-5 bottom-5 w-[300px] max-w-[92vw] h-[420px] max-h-[90vh] bg-[#EFF3F8] rounded-[20px] shadow-2xl border border-[#E4EBF3] overflow-hidden flex flex-col">
      <div className="relative h-8 flex items-center">
        {(stage === "faq" || stage === "compose") && (
          <button
            onClick={() => setStage("main")}
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

      <div className="px-5 pt-1 pb-4 overflow-y-auto flex-1">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-white grid place-items-center shadow-sm">
            <img src={SIcon} alt="S" className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] leading-[16px] text-[#8D9AA9]">안녕하세요, 스포티입니다</p>
            <h2 className="mt-0.5 text-[18px] leading-[24px] font-extrabold text-[#27384B]">무엇을 도와드릴까요?</h2>
          </div>
        </div>

        {stage === "main" && (
          <>
            <p className="mt-3 text-[12px] text-[#8C9AAA]">아래 목록에서 필요한 행정 안내를 선택해 주세요</p>

            <div className="mt-2 flex flex-col gap-2">
              {items.map((it) => (
                <button
                  key={it.label}
                  onClick={() => setStage("faq")}
                  className="w-full h-[36px] rounded-lg bg-white/80 text-[#526478] text-[12px] pl-4 pr-5 text-left border border-[#E3EAF3] hover:bg-white transition flex items-center gap-3"
                >
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white shadow-sm text-[#8FA0B2] text-[12px]">#</span>
                  <span>{it.label}</span>
                </button>
              ))}
            </div>

            <div
              className="mt-4 rounded-[14px] border border-[#C9D3E0] bg-white px-4 py-3 shadow-sm cursor-text"
              onClick={() => {
                setStage("compose");
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            >
              <p className="text-[11px] leading-[16px] text-[#8697AA]">
                창업 관련 고민이 있나요?
                <br />
                스포티에게 무엇이든 물어보세요.
              </p>
              <div className="mt-2 flex justify-end">
                <div className="w-7 h-7 rounded-full bg-[#5f7fbf] text-white grid place-items-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="m3 11 17-8-8 17-2-6-7-3Z" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}

        {stage === "compose" && (
          <div className="mt-5">
            <div className="flex items-end gap-2 bg-white rounded-[14px] border border-[#C9D3E0] px-3 py-2">
              <textarea
                ref={inputRef}
                className="flex-1 outline-none resize-none text-[12px] leading-[18px] text-[#2C3A4B] placeholder:text-[#9AA7B6]"
                rows={2}
                placeholder=""
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    setStage("faq");
                  }
                }}
              />
              <button
                onClick={() => setStage("faq")}
                className="w-7 h-7 rounded-full bg-[#5f7fbf] text-white grid place-items-center"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="m3 11 17-8-8 17-2-6-7-3Z" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {stage === "faq" && (
          <div className="mt-3">
            <p className="text-[11px] text-[#8D9AA9]">Frequently Asked Questions</p>
            <h3 className="mt-0.5 text-[14px] font-semibold text-[#27384B]">창업 절차 안내</h3>
            <ul className="mt-3 rounded-[14px] border border-[#E4EBF3] bg-white divide-y divide-[#EEF2F6]">
              {[
                { q: "Questions 1", a: "샘플 문구입니다" },
                { q: "Questions 2", a: "샘플 문구입니다" },
                { q: "Questions 3", a: "샘플 문구입니다" },
                { q: "Questions 4", a: "샘플 문구입니다" }
              ].map((it, i) => (
                <li key={i} className="px-3">
                  <details className="py-2 group">
                    <summary className="list-none flex items-center justify-between text-[12px] text-[#2C3A4B] cursor-pointer">
                      <span>{it.q}</span>
                      <span className="text-lg leading-none text-[#8FA0B2] group-open:hidden">+</span>
                      <span className="text-lg leading-none text-[#8FA0B2] hidden group-open:inline">−</span>
                    </summary>
                    <p className="mt-1 text-[11px] leading-[16px] text-[#5B6B80]">{it.a}</p>
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