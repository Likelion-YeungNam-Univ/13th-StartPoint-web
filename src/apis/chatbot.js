import api from "./api.jsx";

console.log("[CHATBOT] Using baseURL from api.jsx:", api.defaults.baseURL);

export async function postAsk(question) {
  try {
    const response = await api.post("/ask", {
      question,
      message: question,
    });

    const data = response.data;
    console.debug("[CHATBOT] POST /ask response:", data);

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

export default { postAsk, getConversation };
