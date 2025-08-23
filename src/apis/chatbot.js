// src/api/chatbot.js
import api from "./api.jsx";

console.log("[CHATBOT] Using baseURL from api.jsx:", api.defaults.baseURL);

/** 명세 #11: POST /ask -> { answer, contextId } */
export async function postAsk(question) {
  try {
    const response = await api.post("/ask", {
      question,
      message: question,
    });

    const data = response.data;
    console.debug("[CHATBOT] POST /ask response:", data);

    // ✅ 백엔드가 'response' 키로 답변을 주는 케이스를 지원
    return {
      answer:
        typeof data?.answer === "string" && data.answer.trim()
          ? data.answer
          : typeof data?.response === "string"
          ? data.response
          : "",
      contextId:
        typeof data?.contextId === "string" ? data.contextId : undefined,
      _raw: data,
    };
  } catch (error) {
    console.error("[CHATBOT] POST /ask error:", error);
    throw error;
  }
}

/** (옵션) 명세 #12: GET /ask?contextId=... -> [{question, answer}, ...] */
export async function getConversation(contextId) {
  try {
    const response = await api.get("/ask", {
      params: { contextId },
    });

    const data = response.data;

    if (typeof data === "string") {
      try {
        return JSON.parse(data);
      } catch {
        return [];
      }
    }
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("[CHATBOT] GET /ask conversation error:", error);
    return [];
  }
}

// 기본 내보내기 (일관성을 위해)
export default { postAsk, getConversation };
