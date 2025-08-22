// src/api/chatbot.js
console.log("[ENV] VITE_API_BASE =", import.meta.env?.VITE_API_BASE);

const rawBase =
  (import.meta.env && import.meta.env.VITE_API_BASE) ||
  (typeof window !== "undefined" ? window.location.origin : "");
const API_BASE = String(rawBase).replace(/\/$/, "");

function joinUrl(base, path) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

async function request(path, opts = {}) {
  const url = joinUrl(API_BASE, path);
  console.debug("[API]", opts.method || "GET", url);

  const res = await fetch(url, {
    headers: {
      // 🔸 charset과 Accept을 명시
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json",
      ...(opts.headers || {}),
    },
    // credentials: "include", // 세션 쿠키 필요하면 주석 해제
    ...opts,
  });

  const text = await res.text().catch(() => "");
  if (!res.ok) {
    console.error("[API ERROR]", res.status, url, text);
    throw new Error(text || `HTTP ${res.status}`);
  }
  try { return text ? JSON.parse(text) : {}; } catch { return text; }
}

/** 명세 #11: POST /ask -> { answer, contextId } */
// src/api/chatbot.js

export async function postAsk(question) {
  const body = JSON.stringify({ question, message: question });
  const data = await request("/ask", {
    method: "POST",
    body,
  });

  // ✅ 백엔드가 'response' 키로 답변을 주는 케이스를 지원
  return {
    answer:
      typeof data?.answer === "string" && data.answer.trim()
        ? data.answer
        : (typeof data?.response === "string" ? data.response : ""),
    contextId: typeof data?.contextId === "string" ? data.contextId : undefined,
    _raw: data,
  };
}


/** (옵션) 명세 #12: GET /ask?contextId=... -> [{question, answer}, ...] */
export async function getConversation(contextId) {
  const data = await request(`/ask?contextId=${encodeURIComponent(contextId)}`, {
    method: "GET",
  });
  if (typeof data === "string") {
    try { return JSON.parse(data); } catch { return []; }
  }
  return Array.isArray(data) ? data : [];
}