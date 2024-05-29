import React from "react";
import { Link } from "react-router-dom";
import NavbarSignup from "./NavbarSignup";

const SignupComplete = () => {
  return (
    <div>

      {/* 상단 내비게이션 바 */}
      <NavbarSignup />

      <div id="contents">

        {/* 안내 문구 */}
        <div id="message">
          <h5 className="white-text center">
            회원가입이 <br />완료되었습니다
          </h5>
        </div>

        {/* 로그인페이지로 */}
        <div id="buttons" className="row">
          <div className="col s10 offset-s1">
            <Link to="/login">
              <div id="button" className="btn waves-effect waves white z-depth-3">
                로그인 하기
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default SignupComplete