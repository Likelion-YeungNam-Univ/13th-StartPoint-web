import React from "react";
export default function MyPage() {
  const inputClass =
    "w-full border rounded-md px-4 py-2 bg-white focus:shadow-inner focus:outline-[#2E47A4] caret-[#2E47A4]";
  const disabledInputClass =
    "w-full border rounded-md px-4 py-2 bg-gray-100 text-gray-500 cursor-not-allowed";

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <h1 className="text-[30px] text-[#2E47A4] font-bold px-3 py-2 border-b-2 border-[#2E47A4]">
        마이페이지
      </h1>

      <div className="flex flex-col mx-auto w-full max-w-2xl">
        <div className="mt-10">
          <h2 className="text-[26px] text-[#2E47A4] font-semibold px-3 mb-2">
            회원 정보
          </h2>
        </div>

        <form className="border-t-2 border-[#2E47A4]">
          <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-x-8 gap-y-6 items-center border-b-2 border-[#2E47A4] py-10 pl-4 pr-20">
            <label className="text-lg text-left font-semibold text-[#2E47A4]">
              이름
            </label>
            <input
              type="text"
              value="변경 불가능한 내용"
              disabled
              className={disabledInputClass}
            />

            <label className="text-lg text-left font-semibold text-[#2E47A4]">
              아이디
            </label>
            <input
              type="text"
              value="변경 불가능한 내용"
              disabled
              className={disabledInputClass}
            />

            <label className="text-lg text-left font-semibold text-[#2E47A4]">
              비밀번호
            </label>
            <input type="password" className={inputClass} />

            <label className="text-lg text-left font-semibold text-[#2E47A4]">
              생년월일
            </label>
            <input
              type="text"
              value="변경 불가능한 내용"
              disabled
              className={disabledInputClass}
            />

            <label className="text-lg text-left font-semibold text-[#2E47A4]">
              전화번호
            </label>
            <input type="tel" className={inputClass} />

            <label className="text-lg text-left font-semibold text-[#2E47A4]">
              이메일
            </label>
            <input type="email" className={inputClass} />

            <label className="text-lg text-left font-semibold text-[#2E47A4]">
              멘토/멘티
            </label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="mentee"
                  className="accent-[#2E47A4]"
                />
                <span className="text-[17px] text-[#2E47A4]">멘티</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="mentor"
                  className="accent-[#2E47A4]"
                />
                <span className="text-[17px] text-[#2E47A4]">멘토</span>
              </label>
            </div>
          </div>

          <div className="my-10 flex justify-center">
            <button
              type="submit"
              className="bg-[#2E47A4] text-white text-base py-3 px-[50px] rounded-lg hover:bg-[#2E47A4]/90 transition"
            >
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}