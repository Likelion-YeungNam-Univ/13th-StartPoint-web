import React, { useEffect, useMemo, useState } from "react";
import { signup } from "../apis/auth";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const SignUp = () => {
  const inputClass =
    "h-11 w-full border rounded-md px-4 bg-white focus:shadow-inner focus:outline-[#2E47A4] caret-[#2E47A4]";

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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

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
    setError("");

    const body = {
      name: form.name.trim(),
      birth: form.birth,
      email: form.email.trim(),
      userId: form.userId.trim(),
      password: form.password,
      role: form.role,
      phone: form.phone.trim(),
    };

    if (
      !form.name ||
      !form.password ||
      !form.birth ||
      !form.phone ||
      !form.email ||
      !form.role
    ) {
      setError("모든 필수 항목을 입력해 주세요.");
      return;
    }

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
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (name || role) {
    return null;
  }

  return (
    // 상단 NavBar 64px 가정: 화면 중앙 배치
    <div className="w-full max-w-7xl mx-auto px-4 min-h-[calc(100vh-64px)]">
      <h1 className="w-full max-w-5xl mx-auto mt-4 text-[30px] text-[#2E47A4] font-bold px-3 py-2 border-b-2 border-[#2E47A4]">
        회원가입
      </h1>

      {/* 폼 덩어리 자체를 화면 중앙으로 */}
      <div className="w-full max-w-4xl place-self-center ">
        <form onSubmit={onSubmit} noValidate>
          {/* 3열: [라벨 120px] [입력칸] [유령 칼럼 120px]  */}
          <div className="grid grid-cols-[110px_minmax(0,1fr)_110px] gap-x-8 gap-y-6 items-center py-10 px-12">
            <h2 className="col-span-3 text-[26px] text-[#2E47A4] font-semibold px-3 pb-3 mb-4 border-b-2 border-[#2E47A4]">
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
              required
              minLength={8}
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
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={onChange}
              className={inputClass}
              autoComplete="tel"
              inputMode="numeric"
              pattern="^(01[016789])[-]?\d{3,4}[-]?\d{4}$"
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

            {/* 구분선: 전체 열 가로지름 */}
            <div className="col-span-3 my-4 border-b-2 border-[#2E47A4]" />

            {/* 버튼: 같은 그리드의 2열(입력칸 폭 그대로) */}
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

          {error && (
            <div className="text-red-600 text-center -mt-6 mb-6" role="alert">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
