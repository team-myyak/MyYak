import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../Navbar";


const CaseList = () => {

  // API 요청 url
  const URL = useSelector((state) => state.url.url);

  // store에 저장된 기기 목록 불러오기
  const caseList = useSelector((state) => state.caseList.caseList)

  // 긴 내용을 자르고 "..."으로 대체하는 함수
  const shortenContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + "...";
    }
    return content;
  };

  return (
    <div id="container">
      
      {/* 상단 네비게이션 바 */}
      <Navbar />

      <div id="contents">

        {/* 페이지 타이틀 */}
        <h4 id="page-title" className="white-text">내 기기 관리</h4>

        {/* 등록된 기기 리스트 */}
        <div className="row">
          <div className="col s12">
            {caseList.map((caseItem, index) => (
              <Link 
                to="/case/management"
                state={{ caseSn: caseItem.case_sn, regNickname: caseItem.reg_nickname }}
                key={ index }
              >
                <div id="list-box" className="waves-effect waves btn white z-depth-3">
                  <div id="list-box-content">
                    <div id="list-box-primary">{shortenContent(caseItem.reg_nickname, 9)}</div>
                    <div id="list-box-secondary">{caseItem.case_sn}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 추가하기 버튼 */}
        <div id="buttons" className="row">
          <div className="col s10 offset-s1">
            <Link to="/case/register">
              <div id="button" className="btn waves-effect waves white black-text z-depth-3">
                기기 추가하기
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CaseList