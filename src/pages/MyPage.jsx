import React from "react";
import "./mypage.css";

export default function MyPage() {
  return (
    <div className="mypage-wrap">
      <div className="mypage-inner">
        <h1 className="mypage-title">마이페이지</h1>
        <hr className="mypage-title-line" />

        <section className="mypage-card">
          <h2 className="mypage-section-title">회원 정보</h2>
          <hr className="mypage-section-line" />

          <form className="mypage-form">
            <label>이름</label>
            <input type="text" placeholder="입력해주세요" />

            <label>아이디</label>
            <input type="text" placeholder="입력해주세요" />

            <label>비밀번호</label>
            <input type="password" placeholder="입력해주세요" />

            <label>생년월일</label>
            <input type="date" />

            <label>전화번호</label>
            <input type="text" placeholder="입력해주세요" />

            <label>이메일</label>
            <input type="email" placeholder="입력해주세요" />

            <label>멘티 / 멘토</label>
            <div className="radio-row">
              <label><input type="radio" name="role" /> 멘티</label>
              <label><input type="radio" name="role" /> 멘토</label>
            </div>

            <button className="btn-primary" type="submit">수정하기</button>
          </form>
        </section>
      </div>
    </div>
  );
}
