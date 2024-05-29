import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";

const CaseRegisterComplete = () => {
  return (
    <div id="container">
      
      {/* 상단 네비게이션 바 */}
      <Navbar />

      <div id="contents">

        {/* 안내 문구 */}
        <div id="message">
          <h5 className="white-text center">
            기기 등록이<br />완료되었습니다
          </h5>
        </div>

        {/* 홈으로 가기 */}
        <div id="buttons" className="row">
          <div className="col s10 offset-s1">
            <Link to="/home">
              <div 
                id="button"
                className="btn waves-effect waves white black-text z-depth-3"
              >
                홈으로
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CaseRegisterComplete
