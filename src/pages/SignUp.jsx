import React from "react";

const SignUp = () => {
  return (
    <div className="flex flex-col justify-center mx-75 my-8">
      <h1 className="text-2xl font-bold py-1 border-b-2 border-blue-900">
        회원가입
      </h1>

      <h2 className="text-lg font-semibold py-1 mx-30 my-8 border-b-1 border-blue-900">
        회원 정보 입력
      </h2>
      <div className="mx-auto my-3">
        <form>
          <div className="grid grid-cols-3 gap-x-12 gap-y-5 items-center">
            <label className="text-left text-sm">이름</label>
            <input
              type="text"
              className="col-span-2 w-full border rounded-md px-3 py-1.5 bg-gray-100"
            />

            <label className="text-left text-sm">생년월일</label>
            <input
              type="date"
              className="col-span-2 w-full border rounded-md px-3 py-1.5 bg-gray-100"
            />

            <label className="text-left text-sm">전화번호</label>
            <input
              type="tel"
              className="col-span-2 w-full border rounded-md px-3 py-1.5 bg-gray-100"
            />

            <label className="text-left text-sm">이메일</label>
            <input
              type="email"
              className="col-span-2 w-full border rounded-md px-3 py-1.5 bg-gray-100"
            />

            <label className="text-left text-sm">아이디</label>
            <input
              type="text"
              className="col-span-2 w-full border rounded-md px-3 py-1.5 bg-gray-100"
            />

            <label className="text-left text-sm">비밀번호</label>
            <input
              type="password"
              className="col-span-2 w-full border rounded-md px-3 py-1.5 bg-gray-100"
            />

            <label className="text-left text-sm">멘토 / 멘티</label>
            <div className="col-span-2 flex justify-center space-x-6">
              <label className="flex justify-center space-x-1">
                <input
                  type="radio"
                  name="role"
                  value="mentor"
                  className="accent-blue-800"
                />
                <span className="text-sm">멘토</span>
              </label>
              <label className="flex justify-center space-x-1">
                <input
                  type="radio"
                  name="role"
                  value="mentee"
                  className="accent-blue-800"
                />
                <span className="text-sm">멘티</span>
              </label>
            </div>
          </div>

          <div className="text-center mt-8">
            <button
              type="submit"
              className="bg-blue-800 text-white text-sm py-2 px-10 rounded-lg hover:bg-blue-900"
            >
              가입 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
