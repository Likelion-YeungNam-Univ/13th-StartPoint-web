import React, { useEffect, useMemo, useState } from "react";
import { signup } from "../apis/auth";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const SignUp = () => {
  const navigate = useNavigate();
  const { name, role } = useAuth();

  const [form, setForm] = useState({
    name: "",
    userId: "",
    password: "",
    birth: "",
    phone: "",
    email: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const inputClass =
    "h-10 w-full border rounded-md px-4 bg-white focus:shadow-inner caret-[#2E47A4] focus:outline-[#2E47A4]";

  useEffect(() => {
    if (name || role) {
      navigate("/");
      return;
    }
  }, [name, role, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (form.role === "mentor") {
      alert("현재는 멘티만 가입 가능합니다.");
      return;
    }

    const body = {
      name: form.name.trim(),
      birth: form.birth.trim(),
      email: form.email.trim(),
      userId: form.userId.trim(),
      password: form.password.trim(),
      role: form.role.trim(),
      phone: form.phone.trim(),
    };

    setLoading(true);
    try {
      await signup(body);
      alert("회원가입 성공!");
      navigate("/login");
    } catch (err) {
      console.error("SIGNUP ERROR:", err?.response || err);
      const msg =
        err?.response?.data?.message ||
        "회원가입에 실패했습니다. 입력값을 확인하세요.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  if (name || role) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 min-h-[calc(100vh-56px)]">
      <h1 className="w-full max-w-5xl mx-auto text-[30px] text-[#2E47A4] font-bold px-3 pt-3 py-2 border-b-2 border-[#2E47A4]">
        회원가입
      </h1>

      <div className="w-full max-w-3xl place-self-center ">
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-[100px_minmax(0,1fr)_80px] gap-x-8 gap-y-4.5 items-center py-3 px-12">
            <h2 className="col-span-3 text-[26px] text-[#2E47A4] font-semibold px-3 py-2 mb-2 border-b-2 border-[#2E47A4]">
              회원 정보 입력
            </h2>
            {/* 이름 */}
            <label
              className="pl-3 text-lg font-semibold text-[#2E47A4]"
              htmlFor="name"
            >
              이름
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              className={inputClass}
              autoComplete="name"
              pattern="^[가-힣a-zA-Z]{2,10}$"
              title="한글 또는 영문만 2~10자 이내로 입력해주세요 (특수문자, 숫자, 공백 불가)"
              required
            />
            <div className="block" aria-hidden />

            {/* 아이디 */}
            <label
              className="pl-3 text-lg font-semibold text-[#2E47A4]"
              htmlFor="uid"
            >
              아이디
            </label>
            <input
              name="userId"
              value={form.userId}
              onChange={onChange}
              className={inputClass}
              autoComplete="username"
              pattern="^[a-z][a-z0-9]{4,14}$"
              title="영문 소문자로 시작하여 영문 소문자와 숫자 조합 5~15자 (특수문자, 공백 불가)"
              required
            />
            <div className="block" aria-hidden />

            {/* 비밀번호 */}
            <label
              className="pl-3 text-lg font-semibold text-[#2E47A4]"
              htmlFor="pw"
            >
              비밀번호
            </label>
            <input
              id="pw"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              className={inputClass}
              autoComplete="new-password"
              pattern="^(?!.*\s)(?=.{8,20}$)(?:(?=.*[A-Z])(?=.*[a-z])(?=.*\d)|(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9])|(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])|(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9])).*$"
              title="8~20자, 대문자/소문자/숫자/특수문자 중 3종 이상 조합, 공백 불가"
              minLength={8}
              maxLength={20}
              required
            />
            <div className="block" aria-hidden />

            {/* 생년월일 */}
            <label
              className="pl-3 text-lg font-semibold text-[#2E47A4]"
              htmlFor="birth"
            >
              생년월일
            </label>
            <input
              id="birth"
              type="date"
              name="birth"
              value={form.birth}
              onChange={onChange}
              className={inputClass}
              autoComplete="bday"
              max={today}
              required
            />
            <div className="block" aria-hidden />

            {/* 전화번호 */}
            <label
              className="pl-3 text-lg font-semibold text-[#2E47A4]"
              htmlFor="phone"
            >
              전화번호
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="010-XXXX-XXXX"
              value={form.phone}
              onChange={onChange}
              className={inputClass}
              autoComplete="tel"
              inputMode="numeric"
              pattern="^010-\d{4}-\d{4}$"
              title="010-XXXX-XXXX 형식으로 입력해주세요"
              required
            />
            <div className="block" aria-hidden />

            {/* 이메일 */}
            <label
              className="pl-3 text-lg font-semibold text-[#2E47A4]"
              htmlFor="email"
            >
              이메일
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
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
            <div
              className="flex items-center gap-6 pl-1"
              role="radiogroup"
              aria-label="역할 선택"
            >
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="mentee"
                  checked={form.role === "mentee"}
                  onChange={onChange}
                  className="accent-[#2E47A4]"
                  required
                />
                <span className="text-[17px] text-[#2E47A4]">멘티</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="mentor"
                  checked={form.role === "mentor"}
                  onChange={onChange}
                  className="accent-[#2E47A4]"
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
                disabled={loading}
              >
                {loading ? "처리 중..." : "가입완료"}
              </button>
            </div>
            <div className="block" aria-hidden />
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
