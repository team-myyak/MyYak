import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const MedRegisterSearch = () => {

  const location = useLocation()

  // 사용할 변수들 설정
  const [medName, setMedName] = useState("");
  const [keyword, setKeyword] = useState("");
  const [resultList, setResultList] = useState([]);
  const [slotNum, setSlotNum] = useState(location.state.slotNum);

  // axios 요청 보내는 URL
  const URL = useSelector((state) => state.url.url);

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
      params: {
        name: keyword,
      },
    };

    axios
      .get(`${URL}/medicines/search`, requestData)
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
        <h4 id="page-title" className="white-text">
          약 등록하기
        </h4>

        {/* 검색창 */}
        <div id="search-box" className="white z-depth-3">
          <form className="row" onSubmit={handleSubmit}>
            <div className="col s9">
              <input
                placeholder="약 이름으로 검색"
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

        {/* 검색결과 */}
        <div className="row">
          {resultList.map((result, index) => (
            <div key={index} className="col s12">
              <Link to="/med/register/name" state={{ slotNum: slotNum, medNum: result.med_id, medName: result.med_name, medCompany: result.med_vendor }}>
                <div
                  id="list-box"
                  className="btn waves-effect waves white z-depth-2 black-text"
                >
                  {result.med_name}
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default MedRegisterSearch;
