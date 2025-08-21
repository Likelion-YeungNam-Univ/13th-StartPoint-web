import React, { useState, useRef, useEffect } from "react";
import SIcon from "../assets/S.png";
import SBadge from "../assets/SBadge.png";
import SWhite from "../assets/swhite.png";
import { postAsk } from "../api/chatbot";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [stage, setStage] = useState("main");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [thinking, setThinking] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [contextId, setContextId] = useState(undefined);
  const [badgeHover, setBadgeHover] = useState(false);

  // ✅ FAQ 아코디언 상태
  const [faqList, setFaqList] = useState(null);

  // 🔹 푸터 오버랩 방지
  const [footerBump, setFooterBump] = useState(0);

  const inputRef = useRef(null);
  const thinkTimer = useRef(null);

  useEffect(() => {
    console.log("[ENV] VITE_API_BASE =", import.meta.env?.VITE_API_BASE);
  }, []);

  // 🔹 푸터 감지
  useEffect(() => {
    const footer =
      document.querySelector("footer") ||
      document.querySelector("#footer") ||
      document.querySelector("#site-footer");

    if (!footer) {
      setFooterBump(0);
      return;
    }

    let raf = 0;
    const computeBump = () => {
      const rect = footer.getBoundingClientRect();
      const overlap = Math.max(0, window.innerHeight - rect.top);
      setFooterBump(Math.ceil(overlap));
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(computeBump);
    };

    computeBump();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    const ro = new ResizeObserver(onScrollOrResize);
    ro.observe(footer);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      ro.disconnect();
    };
  }, []);

  const items = [
    { id: "regulation", label: "창업 절차 안내" },
    { id: "report",     label: "사업 법규 정책 안내" },
    { id: "support",    label: "사업 행정 정책 안내" }
  ];

  // ✅ 카테고리별 FAQ 데이터 (모두 닫힘으로 시작)
  const FAQ_DATA = {
    regulation: [
      { q: "개인사업자란 무엇인가요?", a: "개인사업자는 등록된 대표자가 경영의 모든 책임을 지는 형태의 사업자입니다. 창업 시, 해당 업종이 인·허가 대상이라면 관할 관청에 먼저 신고하거나 인·허가를 받은 후, 사업 개시일로부터 20일 이내에 세무서에 사업자등록을 신청해야 합니다.", open: false },
      { q: "사업을 시작하기 전에 인·허가가 필요한 경우는 언제인가요?", a: "일반적으로는 별도의 제한 없이 개인사업자로 대부분의 업종에서 창업이 가능합니다. 다만, 일부 업종은 관련 법령에 따라 사전에 행정기관의 인·허가를 받아야 하며, 등록 또는 신고 절차를 거쳐야 하는 경우도 있습니다.", open: false },
      { q: "사업자등록은 어떻게 하나요?", a: "사업자는 사업 개시일로부터 20일 이내에 사업장 관할 세무서에 관련 서류를 제출해 사업자등록을 신청해야 합니다. 사업장 단위별로 등록할 수 있으며, 하나의 사업자라도 둘 이상의 사업장이 있다면 각각 등록해야 합니다.", open: false },
      { q: "개인사업자는 언제부터 사업을 시작할 수 있나요?", a: "대부분의 업종은 별도의 인·허가 없이도 사업자등록을 마친 후 즉시 사업을 시작할 수 있습니다. 단, 인·허가가 필요한 업종의 경우에는 관련 기관의 허가나 신고 절차를 먼저 완료해야 하며, 이를 마친 후 사업을 개시할 수 있습니다. 이 때 사업 개시일 기준으로 20일 이내에 사업자등록을 반드시 완료해야 합니다.", open: false },
    ],
    report: [
      { q: "정부나 지자체는 창업을 어떻게 지원하나요?", a: "정부와 지자체는 창업 활성화를 위해 재정적·행정적 지원, 인프라 조성, 교육 및 컨설팅 제공 등의 역할을 수행합니다. 또한, 창업기업의 생애주기에 맞춘 다양한 지원 프로그램을 운영하며, 창업 관련 제도 개선에도 힘쓰고 있습니다.", open: false },
      { q: "창업에 필요한 교육이나 훈련도 받을 수 있나요?", a: "네, 창업자는 창업 단계별 맞춤형 교육 프로그램을 받을 수 있습니다. 정부는 대학, 창업교육기관, 민간전문가와 협력해 아이디어 개발, 사업계획 수립, 경영 실무 등에 관한 실질적인 교육 기회를 제공합니다.", open: false },
      { q: "창업할 때 귲나 부담이 너무 많은데, 개선책이 있나요?", a: "정부는 창업을 저해하는 불합리한 규제를 지속적으로 발굴해 개선하고 있으며, 창업 과정에서 발생하는 행정 절차나 비용을 간소화하고 완화하는 정책을 추진하고 있습니다. 예를 들어, 통합창업지원 플랫폼 구축이나, 절차 간소화, 창업비용 절감 등 다양한 제도가 마련돼 있습니다.", open: false },
      { q: "온라인으로 창업 지원 서비스를 받을 수 있나요?", a: "네, 정부는 온라인 창업지원 시스템을 통해 창업자가 지원사업 신청, 교육 수강, 정보 검색, 통합 상담 등을 받을 수 있도록 하고 있습니다. 이 플랫폼을 통해 시간과 장소에 구애받지 않고 편리하게 창업 관련 서비스를 이용할 수 있습니다.", open: false },
    ],
    support: [
      { q: "공공기관에서 창업 자금을 받을 수 있나요?", a: "네, 공공기관에서는 다양한 창업 자금 및 보증 지원을 제공합니다. 예를 들어, 창업자금 및 사업장 임차자금, 소상공인을 위한 자금 지원, 청년 창업자 대상 창업자금 및 시설·운전자금 융자, 청년창업 특례보증 및 단계별 맞춤형 자금 지원 프로그램 등이 마련되어 있습니다.", open: false },
      { q: "특정 계층 창업자도 자금을 지원받을 수 있나요?", a: "네, 여성가장, 사회적 취약계층, 저소득층, 저신용자 등 다양한 계층을 위한 맞춤형 창업 자금 지원 정책이 운영되고 있습니다. 예를 들어, 여성가장 창업자금, 무담보·무보증 소액자금, 경영개선자금, 마이크로크레딧, 한부모 여성 자립 지원 프로그램, 소액대출 및 저금리 정책 대출 등이 있습니다.", open: false },
      { q: "사업자등록을 하지 않으면 어떤 불이익이 있나요?", a: "사업자등록 없이 사업을 운영할 경우 무등록 가산세가 부과될 수 있고, 매출 누락 시 탈세로 처벌받을 수 있습니다. 또한 세금계산서 발행이 불가능해 거래에 제약이 생기며, 정부의 창업지원사업이나 보조금 신청이 제한될 수 있습니다.", open: false },
      { q: "창업 초기 세무 관련 의무사항은 무엇인가요?", a: "사업자등록 후에는 부가가치세 신고(또는 간이과세자 등록), 사업용 계좌 개설, 전자세금계산서 발급 시스템 등록, 지출 증빙자료 보관 등의 세무 절차를 이행해야 합니다. 처음 사업을 시작하는 경우 가까운 세무서나 세무사와 상담하는 것을 권장합니다.", open: false },
    ],
  };

  // ✅ 카테고리 버튼 클릭 → FAQ 화면으로 전환 (메시지 추가 안 함)
  const handleCategoryClick = (categoryId) => {
    const list = FAQ_DATA[categoryId] ? FAQ_DATA[categoryId].map(it => ({ ...it, open: false })) : null;
    setFaqList(list);
    setStage("faq");
  };

  // ✅ 아코디언 토글
  const toggleFaq = (idx) => {
    setFaqList(prev => prev?.map((it, i) => i === idx ? { ...it, open: !it.open } : it));
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text) return;

    setMessages(prev => [...prev, { role: "user", text }]);
    setInput("");
    setThinking(true);
    clearTimeout(thinkTimer.current);

    try {
      const res = await postAsk(text);
      console.log("[/ask response]", res);

      if (res?.contextId && res.contextId !== contextId) setContextId(res.contextId);

      const answer =
        typeof res?.answer === "string" && res.answer.trim().length > 0
          ? res.answer
          : `서버 응답 형식이 예상과 달라요.\n원본: ${JSON.stringify(res?._raw ?? res, null, 2)}`;

      setMessages(prev => [...prev, { role: "bot", text: answer }]);
    } catch (e) {
      console.error("[/ask error catch]", e);
      setMessages(prev => [...prev, { role: "bot", text: "서버와 통신에 실패했습니다. 잠시 후 다시 시도해주세요." }]);
    } finally {
      thinkTimer.current = setTimeout(() => setThinking(false), 200);
    }
  };

  const stopThinking = () => {
    clearTimeout(thinkTimer.current);
    setThinking(false);
  };

  const isChatting = thinking || messages.length > 0;

  const goHome = () => {
    setStage("main");
    setInput("");
    setMessages([]);
    setThinking(false);
    setFaqList(null);
    clearTimeout(thinkTimer.current);
  };

  if (!open) {
    return (
      <div className="fixed right-5 flex flex-col items-end gap-2" style={{ bottom: `${20 + footerBump}px` }}>
        {badgeHover && (
          <div className="max-w-[300px] rounded-2xl px-4 py-3 shadow-xl" style={{ background: "rgba(39,56,75,0.9)" }}>
            <p className="text-white text-[12px] leading-[18px] whitespace-pre-line text-center">
              {"당신의 창업 비서 스포티입니다!\n행정안내, 창업 관련 고민은\n저에게 물어봐주세요."}
            </p>
          </div>
        )}

        <button
          onClick={() => setOpen(true)}
          onMouseEnter={() => setBadgeHover(true)}
          onMouseLeave={() => setBadgeHover(false)}
          onFocus={() => setBadgeHover(true)}
          onBlur={() => setBadgeHover(false)}
          className="w-12 h-12 rounded-full shadow-xl grid place-items-center overflow-hidden bg-transparent
                     transition duration-200 hover:brightness-110 hover:saturate-125 hover:scale-105"
          aria-label="챗봇 열기"
        >
          <img src={SBadge} alt="스포티 아이콘" className="w-12 h-12 object-contain select-none" draggable="false" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className="fixed right-5 w=[378px] w-[378px] h-[465px] rounded-[12px] shadow-2xl overflow-hidden"
        style={{ background: "#ffffff", bottom: `${80 + footerBump}px` }}
      >
        <div className="relative h-8 flex items-center">
          {(isChatting || stage === "faq") && (
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
                <img src={SIcon} alt="S" style={{ width: "28px", height: "28px", objectFit: "contain" }} draggable="false" />
              </div>
            </div>
            <div className="w-full text-left ml-[30px]">
              <p className="text-[11px] leading-[16px] text-[#8D9AA9]">안녕하세요, 당신의 창업 비서 스포티입니다</p>
              <h2 className="mt-0.5 text-[18px] leading-[24px] font-extrabold text-[#27384B]">무엇을 도와드릴까요?</h2>
            </div>
          </div>

          {/* 메인: 카테고리 & 채팅 */}
          {stage === "main" && (
            <>
              {!thinking && messages.length === 0 && (
                <div className="mt-9">
                  <p className="text-[12px] text-[#8C9AAA] mb-2">아래 목록에서 필요한 행정 안내를 선택해 주세요</p>
                  <div className="flex flex-col gap-2">
                    {items.map((it) => (
                      <button
                        key={it.id}
                        onClick={() => handleCategoryClick(it.id)}
                        className="w-full h-[36px] rounded-lg bg-[#EEF3F7] text-[#526478] text-[12px] px-4 text-left border border-[#E3EAF3] hover:bg-[#F9FBFD] transition-colors"
                      >
                        {it.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className={`flex-1 flex flex-col justify-end gap-2 ${thinking || messages.length > 0 ? "mt-4" : "mt-3"}`}>
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={
                      m.role === "user"
                        ? "self-end max-w-[70%] rounded-full px-3 py-1 text-[12px] bg-[#5f7fbf] text-white shadow"
                        : "self-start max-w-[90%] rounded-lg px-3 py-2 text-[12px] bg-white text-[#27384B] border border-[#E4EBF3] whitespace-pre-line"
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
                  placeholder={!isInputFocused && input.length === 0 ? "창업 관련 고민이 있나요? 스포티에게 무엇이든 물어보세요." : ""}
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
                    <button onClick={sendMessage} className="w-7 h-7 rounded-full bg-[#5f7fbf] text-white grid place-items-center" title="보내기">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="m3 11 17-8-8 17-2-6-7-3Z" /></svg>
                    </button>
                  ) : (
                    <button onClick={stopThinking} className="w-7 h-7 rounded-full bg-[#7a8fb6] text-white grid place-items-center" title="정지">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg>
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ✅ FAQ 아코디언 화면 (하단 카테고리 버튼 제거됨) */}
          {stage === "faq" && (
            <div className="mt-2">
              <div className="rounded-xl border border-[#E4EBF3] overflow-hidden">
                <ul className="divide-y divide-[#E4EBF3]">
                  {faqList?.map((item, idx) => (
                    <li key={idx} className="bg-white">
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#F9FBFD]"
                      >
                        <span className="text-[12px] leading-[18px] text-[#27384B]">{item.q}</span>
                        <span className="text-[18px] leading-none text-[#7A879A]">{item.open ? "−" : "+"}</span>
                      </button>
                      {item.open && (
                        <div className="px-4 pb-3 pt-0">
                          <p className="text-[12px] leading-[18px] text-[#526478] whitespace-pre-line">{item.a}</p>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
              {/* ← 요청대로: 여기 있던 카테고리 버튼들은 제거 */}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setOpen(false)}
        className="fixed right-5 w-12 h-12 rounded-full shadow-xl grid place-items-center overflow-hidden bg-transparent"
        style={{ bottom: `${20 + footerBump}px` }}
        aria-label="챗봇 닫기"
      >
        <img src={SWhite} alt="스포티 아이콘 (열림)" className="w-12 h-12 object-contain select-none" draggable="false" />
      </button>
    </>
  );
}
