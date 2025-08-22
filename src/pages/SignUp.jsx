// src/pages/SignUp.jsx
import React, { useState } from "react";
import { signup } from "../api/auth";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const inputClass =
    "w-full border rounded-md px-4 py-2 bg-white focus:shadow-inner focus:outline-[#2E47A4] caret-[#2E47A4]";

  const [form, setForm] = useState({
    name: "",
    id: "",
    password: "",
    birth: "",
    phone: "",
    email: "",
    role: "mentee",
  });

  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signup({
        name: form.name,
        birth: form.birth, // YYYY-MM-DD
        email: form.email,
        id: form.id,
        userId: form.id, // 둘 다 보냄
        password: form.password,
        role: form.role, // auth.js에서 대문자 변환됨
        phone: form.phone,
      });
      alert("회원가입 성공!");
      navigate("/login");
    } catch (err) {
      console.error("SIGNUP ERROR:", err?.response || err);
      const msg =
        err?.response?.data?.message ||
        "회원가입에 실패했습니다. 입력값을 확인하세요.";
      setError(msg);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h1 className="text-[30px] text-[#2E47A4] font-bold px-3 py-2 border-b-2 border-[#2E47A4]">
        회원가입
      </h1>

      <div className="flex flex-col mx-auto w-full max-w-2xl">
        <form className="border-t-2 border-[#2E47A4]" onSubmit={onSubmit}>
          <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-8 gap-y-6 items-center border-b-2 border-[#2E47A4] py-10 pl-4 pr-20">
            <label className="text-lg font-semibold text-[#2E47A4]">이름</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className={inputClass}
            />

            <label className="text-lg font-semibold text-[#2E47A4]">
              아이디
            </label>
            <input
              name="id"
              value={form.id}
              onChange={onChange}
              className={inputClass}
            />

            <label className="text-lg font-semibold text-[#2E47A4]">
              비밀번호
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              className={inputClass}
            />

            <label className="text-lg font-semibold text-[#2E47A4]">
              생년월일
            </label>
            <input
              type="date"
              name="birth"
              value={form.birth}
              onChange={onChange}
              className={inputClass}
            />

            <label className="text-lg font-semibold text-[#2E47A4]">
              전화번호
            </label>
            <input
              name="phone"
              placeholder="010-0000-0000"
              value={form.phone}
              onChange={onChange}
              className={inputClass}
            />

            <label className="text-lg font-semibold text-[#2E47A4]">
              이메일
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className={inputClass}
            />

            <label className="text-lg font-semibold text-[#2E47A4]">
              멘토/멘티
            </label>
            <div className="flex items-center gap-6">
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
          </div>

          {error && (
            <div className="text-red-600 text-center mt-4">{error}</div>
          )}

          <div className="my-10 flex justify-center">
            <button
              type="submit"
              className="bg-[#2E47A4] text-white text-base py-3 px-[50px] rounded-lg hover:bg-[#2E47A4]/90 transition"
            >
              가입완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
