import React from "react";
import { Link } from "react-router-dom";
import NavbarUnregister from "../NavbarUnregister";

const CaseUnregister = () => {
  return (
    <div id="container">
      
      {/* 상단 네비게이션 바 */}
      <NavbarUnregister />

      <div id="contents">

        {/* 안내 문구 */}
        <div id="message">
          <h5 className="white-text center">
            기기를<br />먼저 등록해주세요
          </h5>
        </div>

        {/* 기기등록하러 가기 */}
        <div id="buttons" className="row">
          <div className="col s10 offset-s1">
            <Link to="/case/register">
              <div 
                id="button"
                className="btn waves-effect waves white z-depth-3"
              >
                기기 등록하기
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CaseUnregister