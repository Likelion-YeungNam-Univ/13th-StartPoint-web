import api from "./api";

/**
 * 업종 목록 API 호출
 * 응답은 [{ upjong3cd, largeCategory, mediumCategory, smallCategory }] 형태
 */
const upjongListApi = async () => {
  try {
    const res = await api.get("/upjong");
    const raw = res.data;
    // console.log(raw); // 확인용

    const filteredList = raw.map((item) => ({
      upjong3cd: String(item.upjong3cd).trim(),
      largeCategory: String(item.largeCategory).trim(),
      mediumCategory: String(item.mediumCategory).trim(),
      smallCategory: String(item.smallCategory).trim(),
    }));

    return filteredList;
  } catch (err) {
    console.error("업종 API 에러 발생:", err);
    return [];
  }
};

export default upjongListApi;
