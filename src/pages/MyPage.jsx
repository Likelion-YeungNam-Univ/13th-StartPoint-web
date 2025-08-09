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

          <div className="mypage-grid">
            <label>이름</label>
            <div className="skeleton-input" />

            <label>생년월일</label>
            <div className="skeleton-input" />

            <label>전화번호</label>
            <div className="skeleton-input" />

            <label>이메일</label>
            <div className="skeleton-input" />

            <label>멘티 / 멘토</label>
            <div className="radio-row">
              <label><input type="radio" name="role" /> 멘티</label>
              <label><input type="radio" name="role" /> 멘토</label>
            </div>
          </div>

          <div className="btn-row">
            <button className="btn-primary" type="button">수정</button>
          </div>

          <div className="danger-row">
            <button className="btn-ghost" type="button">회원탈퇴</button>
          </div>
        </section>
      </div>
    </div>
  );
}
