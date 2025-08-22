import api from "./api";

const updateMentorApi = async ({ mentorId, date, time }) => {
  try {
    const res = await api.patch(`/mentor/${mentorId}`, {
      registeredDate: date,
      registeredTime: time,
    });

    console.log("멘토링 신청 완료:", res.data);
    return res.data;
  } catch (err) {
    console.error("멘토링 신청 API 에러 발생:", err);
    throw err;
  }
};

export default updateMentorApi;
