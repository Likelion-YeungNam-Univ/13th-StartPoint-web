import api from "./api";

/**
 * 간단 분석 API
 * GET /api/analysis/general/simple-anls?admiCd=...&upjongCd=...&simpleLoc=...
 * @param {{ admiCd: string, upjongCd: string, simpleLoc: string }} params
 * @returns {Promise<any>}
 */
export async function fetchMarketResult({ admiCd, upjongCd, simpleLoc }) {
  try {
    const res = await api.get("/simple-anls", {
      params: { admiCd, upjongCd, simpleLoc },
    });
    console.log(res.data);
    return res?.data ?? null;
  } catch (err) {
    console.error("simple-anls API 에러:", err);
  }
}

export default fetchMarketResult;
