import React, { useEffect, useState, useMemo } from "react";
import { getMyPage, updateMyPage } from "../apis/mypage";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const navigate = useNavigate();
  const [myInfo, setMyInfo] = useState({});
  const [newPassword, setNewPassword] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("");

  const { name, role, isLoading } = useAuth();

  const disabledInputClass =
    "h-10 w-full border rounded-md px-4 bg-gray-100 text-gray-500 cursor-not-allowed";

  const inputClass =
    "h-10 w-full border rounded-md px-4 bg-white focus:shadow-inner caret-[#2E47A4] focus:outline-[#2E47A4]";

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  useEffect(() => {
    if (!isLoading && !name && !role) {
      navigate("/login");
      return;
    }
  }, [name, role, navigate, isLoading]);

  const fetchMyPage = async () => {
    try {
      const result = await getMyPage();
      console.log(result.data);
      setMyInfo(result.data);
    } catch (err) {
      console.error("사용자 정보 조회 에러:", err);
    }
  };

  useEffect(() => {
    if (name || role) {
      fetchMyPage();
    }
  }, [name, role]);

  useEffect(() => {
    if (myInfo) {
      setNewPassword(myInfo.password || "");
      setNewPhone(myInfo.phone || "");
      setNewEmail(myInfo.email || "");
      setNewRole(myInfo.role || "");
    }
  }, [myInfo]);

  const handleSaveClick = async (e) => {
    e.preventDefault();

    if (newRole === "MENTOR") {
      alert("멘토 전환은 추후 지원 예정입니다.");
      return;
    }

    try {
      await updateMyPage({
        password: newPassword,
        phone: newPhone,
        email: newEmail,
        role: newRole,
      });

      setMyInfo({
        ...myInfo,
        password: newPassword.trim(),
        phone: newPhone.trim(),
        email: newEmail.trim(),
        role: newRole.trim(),
      });

      alert("정보가 성공적으로 수정되었습니다!");
    } catch (err) {
      console.error("변경 에러:", err);
      alert("정보 수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!name || !role) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 min-h-[calc(100vh-56px)]">
      <h1 className="w-full max-w-5xl mx-auto text-[30px] text-[#2E47A4] font-bold px-3 pt-3 py-2 border-b-2 border-[#2E47A4]">
        마이페이지
      </h1>

      <div className="w-full max-w-3xl place-self-center">
        <form onSubmit={handleSaveClick}>
          <div className="grid grid-cols-[100px_minmax(0,1fr)_80px] gap-x-8 gap-y-4.5 items-center py-3 px-12">
            <h2 className="col-span-3 text-[26px] text-[#2E47A4] font-semibold px-3 py-2 mb-2 border-b-2 border-[#2E47A4]">
              회원 정보
            </h2>

            {/* 이름 */}
            <label className="pl-3 text-lg font-semibold text-[#2E47A4]">
              이름
            </label>
            <input
              type="text"
              value={myInfo.name || ""}
              disabled
              className={disabledInputClass}
            />
            <div className="block" aria-hidden />

            {/* 아이디 */}
            <label className="pl-3 text-lg font-semibold text-[#2E47A4]">
              아이디
            </label>
            <input
              type="text"
              value={myInfo.userId || ""}
              disabled
              className={disabledInputClass}
            />
            <div className="block" aria-hidden />

            {/* 비밀번호 */}
            <label className="pl-3 text-lg font-semibold text-[#2E47A4]">
              비밀번호
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={inputClass}
              required
              pattern="^(?!.*\s)(?=.{8,20}$)(?:(?=.*[A-Z])(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9])|(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])|(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])).*$"
              title="8~20자, 대문자/소문자/숫자/특수문자 중 3종 이상 조합, 공백 불가"
              minLength={8}
              maxLength={20}
            />
            <div className="block" aria-hidden />

            {/* 생년월일 */}
            <label className="pl-3 text-lg font-semibold text-[#2E47A4]">
              생년월일
            </label>
            <input
              type="date"
              value={myInfo.birth || ""}
              max={today}
              disabled
              className={disabledInputClass}
            />
            <div className="block" aria-hidden />

            {/* 전화번호 */}
            <label className="pl-3 text-lg font-semibold text-[#2E47A4]">
              전화번호
            </label>
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              className={inputClass}
              inputMode="numeric"
              placeholder="010-XXXX-XXXX"
              pattern="^010-\d{4}-\d{4}$"
              title="010-XXXX-XXXX 형식으로 입력해주세요"
              required
            />
            <div className="block" aria-hidden />

            {/* 이메일 */}
            <label className="pl-3 text-lg font-semibold text-[#2E47A4]">
              이메일
            </label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className={inputClass}
              autoComplete="email"
              pattern="^[a-zA-Z0-9._-]{1,}@[a-zA-Z0-9._-]{1,}\.[a-zA-Z]{2,}$"
              title="이메일 형식으로 5~50자 이내 입력 (특수문자는 ._- 만 허용)"
              minLength={5}
              maxLength={50}
              required
            />
            <div className="block" aria-hidden />

            {/* 멘토/멘티 */}
            <label className="pl-3 text-lg font-semibold text-[#2E47A4]">
              멘토/멘티
            </label>
            <div className="flex items-center gap-6 pl-1">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="MENTEE"
                  className="accent-[#2E47A4]"
                  checked={newRole === "MENTEE"}
                  onChange={(e) => setNewRole(e.target.value)}
                  required
                />
                <span className="text-[17px] text-[#2E47A4]">멘티</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="MENTOR"
                  className="accent-[#2E47A4]"
                  checked={newRole === "MENTOR"}
                  onChange={(e) => setNewRole(e.target.value)}
                />
                <span className="text-[17px] text-[#2E47A4]">멘토</span>
              </label>
            </div>
            <div className="block" aria-hidden />

            <div className="col-span-3 my-2 border-b-2 border-[#2E47A4]" />

            {/* 버튼 */}
            <div className="col-start-2">
              <button
                type="submit"
                className="w-full h-12 bg-[#2E47A4] text-white text-base rounded-lg hover:bg-[#2E47A4]/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                수정 완료
              </button>
            </div>
            <div className="block" aria-hidden />
          </div>
        </form>
      </div>
    </div>
  );
}
