// upjongListApi.jsx
import api from "./api";

/**
 * 업종 목록 API 호출
 * 응답은 [{ upjong3cd, largeCategory, mediumCategory, smallCategory }] 형태
 */
const upjongListApi = async () => {
  try {
    const res = await api.get("/upjong");

    // 배열 형태로 정규화 ([], {data:[]}, {rows:[]})
    const raw = res?.data;
    const rows = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.rows)
      ? raw.rows
      : Array.isArray(raw?.data)
      ? raw.data
      : [];

    const normalized = rows
      .map((r) => ({
        upjong3cd: String(r?.upjong3cd ?? "").trim(),
        largeCategory: String(r?.largeCategory ?? "").trim(),
        mediumCategory: String(r?.mediumCategory ?? "").trim(),
        smallCategory: String(r?.smallCategory ?? "").trim(),
      }))
      .filter(
        (r) =>
          /^[A-Z]\d{5}$/.test(r.upjong3cd) &&
          r.largeCategory &&
          r.mediumCategory &&
          r.smallCategory
      );

    return normalized;
  } catch (err) {
    console.error("업종 API 에러:", err);
    return []; // 실패 시 빈 배열
  }
};

export default upjongListApi;
