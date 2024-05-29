import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import SearchResult from "./SearchResult";
import NoSearchResult from "./NoSearchResult";


const UsedMedRegister = () => {

  // 사용할 변수들 설정
  const [medName, setMedName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [resultList, setResultList] = useState([]);

  // axios 요청 보내는 URL
  const URL = useSelector((state) => state.url.url);
  const userToken = useSelector((state) => state.auth.token)
  const headers = {
    Authorization: `Token ${userToken}`
  }

  // 
  const handleMedName = (event) => {
    setMedName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setKeyword(medName.trim());
  };

  useEffect(() => {
    if (keyword === "") {
      setResultList([]);
      return;
    }

    const requestData = {
      "pre_name": keyword
    };

    axios
      .post(`${URL}/medicines/used/search/`, requestData, { headers })
      .then((response) => {
        console.log(response.data);
        setResultList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [keyword, URL]);

  return (
    <div id="container">

      {/* 상단 네비게이션 바 */}
      <Navbar />

      <div id="contents">

        {/* 페이지 타이틀 */}
        <h4 id="page-title" className="white-text">복용약 등록</h4>


        {/* 검색안내문구 */}
        <p id="search-info" className="white-text">약 이름을 검색해주세요</p>

        {/* 검색창 */}
        <div id="search-box" className="white z-depth-3">
          <form className="row" onSubmit={handleSubmit}>
            <div className="col s9">
              <input
                type="text"
                value={medName}
                onChange={handleMedName}
              />
              
            </div>
            <div className="col s3">
              <div
                id="search-icon-box"
                className="btn waves-effect waves white z-depth-2 black-text"
                onClick={handleSubmit}
              >
                검색
              </div>
            </div>
          </form>
        </div>

        {/* 검색결과문구 */}
        <h5 id="search-result-title" className="white-text">검색결과</h5>

        {/* 검색 결과 */}
        {resultList && resultList.length > 0 ? (
          <SearchResult resultList={resultList} />
        ) : (
          <NoSearchResult />
        )}
        
        {/* 하단 여유영역 */}
        <div id="bottom-area"></div>
        
        





      </div>
    </div>
  );
};

export default UsedMedRegister