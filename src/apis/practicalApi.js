import api from "./api";

const practicalApi = async ({ admiCd, upjongCd }) => {
  try {
    const res = await api.get("/practical", {
      params: { admiCd, startupUpjong: upjongCd },
    });
    // console.log(res.data);

    return res.data;
  } catch (err) {
    console.error("상세 분석 API 에러 발생:", err);
    return [];
  }
};

export default practicalApi;
