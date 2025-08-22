import api from "./api";

const mentorListApi = async () => {
  try {
    const res = await api.get("/mentor");
    const raw = res.data;
    // console.log(raw); // 확인용

    return raw;
  } catch (err) {
    console.error("멘토 목록 API 에러 발생:", err);
    return [];
  }
};

export default mentorListApi;
