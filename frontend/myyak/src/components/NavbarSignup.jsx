import React from "react";
import { useNavigate } from "react-router-dom";

const NavbarSignup = () => {

  const navigate = useNavigate()

  // 홈으로 이동하는 함수
  const goToHome = () => {
    navigate("/home")
  }

  return (
    <div>

      {/* 상단 네비게이션 바 */}
      <div id="navbar">
        <div id="navbar-left">
        </div>
        <div id="navbar-center">
          <img src="/assets/myyak_logo.png" alt="#" width="70%" onClick={goToHome}/>
        </div>
        <div id="navbar-right-only" className="white-text">
        </div>
      </div>
      
    </div>
  )
}
export default NavbarSignup