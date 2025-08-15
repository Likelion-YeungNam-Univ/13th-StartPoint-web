import React, { useState, useRef } from "react";
import SIcon from "../assets/S.png";

export default function ChatBot() {
  const [open, setOpen] = useState(true);
  const [stage, setStage] = useState("main");
  const [input, setInput] = useState("");
  const inputRef = useRef(null);

  const items = [
    { label: "창업 절차 안내", action: "faq" },
    { label: "사업 신고 행정 안내", action: "compose" },
    { label: "사업 행정 정책 안내", action: "compose" }
  ];

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed right-5 bottom-5 w-12 h-12 rounded-full bg-[#5f7fbf] text-white shadow-xl grid place-items-center"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2Z"/></svg>
      </button>
    );
  }

  return (
    <div className="fixed right-6 bottom-6 w-[360px] max-w-[92vw] h-[520px] max-h-[92vh] bg-[#f3f6fb] rounded-[20px] shadow-2xl border border-[#E6ECF3] overflow-hidden flex flex-col">
      <div className="relative h-9 flex items-center">
        {(stage === "faq" || stage === "compose") && (
          <button
            onClick={() => setStage("main")}
            className="absolute left-3 top-1.5 w-6 h-6 grid place-items-center rounded-md hover:bg-white/60"
            aria-label="home"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-slate-500">
              <path d="M12 3l8 7h-3v8h-4v-5H11v5H7v-8H4l8-7z" />
            </svg>
          </button>
        )}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-3 top-1.5 w-7 h-7 grid place-items-center rounded-md hover:bg-white/60"
          aria-label="close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-500">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="px-7 py-1 overflow-y-auto flex-1">
        <div className="flex items-start gap-3">
          <img src={SIcon} alt="S" className="w-9 h-9 rounded-full object-contain" />
          <div>
            <p className="text-[12px] text-[#7A879A] leading-5">안녕하세요, 당신의 창업 비서 스포터입니다</p>
            <h2 className="text-[22px] leading-[28px] font-extrabold text-[#2C3A4B] mt-0.5">무엇을 도와드릴까요?</h2>
          </div>
        </div>

        {stage === "main" && (
          <>
            <p className="mt-5 text-[13px] text-[#7A879A]">아래 목록에서 필요한 행정 안내를 선택해 주세요</p>
            <div className="mt-3 flex flex-col gap-2.5">
              {items.map((it) => (
                <button
                  key={it.label}
                  onClick={() => {
                    if (it.action === "faq") setStage("faq");
                    else {
                      setStage("compose");
                      setInput(it.label);
                      setTimeout(() => inputRef.current?.focus(), 0);
                    }
                  }}
                  className="w-full h-10 rounded-lg bg-[#EEF3F7] text-[#5B6B80] text-[13px] px-3 text-left hover:bg-[#E6EEF6] transition"
                >
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#9AA7B6]">#</span>
                    {it.label}
                  </span>
                </button>
              ))}
            </div>

            <div
              className="mt-7 rounded-[14px] border border-[#C9D3E0] bg-white px-4 py-3 shadow-sm cursor-text"
              onClick={() => {
                setStage("compose");
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
            >
              <p className="text-[12px] text-[#7A879A] leading-5">
                창업 관련 고민이 있나요?
                <br />
                스포터에게 무엇이든 물어보세요.
              </p>
              <div className="mt-2 flex justify-end">
                <div className="w-8 h-8 rounded-full bg-[#5f7fbf] text-white grid place-items-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="m3 11 17-8-8 17-2-6-7-3Z"/></svg>
                </div>
              </div>
            </div>
          </>
        )}

        {stage === "compose" && (
          <div className="mt-8">
            <div className="flex items-end gap-2 bg-white rounded-[14px] border border-[#C9D3E0] px-3 py-2">
              <textarea
                ref={inputRef}
                className="flex-1 outline-none resize-none text-[14px] leading-6 text-[#2C3A4B] placeholder:text-[#9AA7B6]"
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
                className="w-10 h-10 rounded-full bg-[#5f7fbf] text-white grid place-items-center"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="m3 11 17-8-8 17-2-6-7-3Z"/></svg>
              </button>
            </div>
          </div>
        )}

        {stage === "faq" && (
          <div className="mt-4">
            <p className="text-[12px] text-[#7A879A]">Frequently Asked Questions</p>
            <h3 className="text-[18px] font-semibold text-[#2C3A4B] mt-1">창업 절차 안내</h3>
            <ul className="mt-4 rounded-[14px] border border-[#E6ECF3] bg-white divide-y divide-[#EDEFF3]">
              {[
                { q: "Questions 1", a: "여기는 Answer 창입니다." },
                { q: "Questions 2", a: "질문을 열고 닫을 수 있어요. 내용은 바뀌어도 UI는 동일합니다." },
                { q: "Questions 3", a: "샘플 문구입니다. 실제 FAQ 데이터로 교체하세요." },
                { q: "Questions 4", a: "샘플 문구입니다. 실제 FAQ 데이터로 교체하세요." }
              ].map((it, i) => (
                <li key={i} className="px-4">
                  <details className="py-3 group">
                    <summary className="list-none flex items-center justify-between text-[14px] text-[#2C3A4B] cursor-pointer">
                      <span>{it.q}</span>
                      <span className="text-xl leading-none text-[#8FA0B2] group-open:hidden">+</span>
                      <span className="text-xl leading-none text-[#8FA0B2] hidden group-open:inline">−</span>
                    </summary>
                    <p className="mt-2 text-[13px] leading-6 text-[#5B6B80]">{it.a}</p>
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
