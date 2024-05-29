import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const MedSearchResult = () => {

  const location = useLocation()

  const [searchResults, setSearchResults] = useState([])

  // 긴 내용을 자르고 "..."으로 대체하는 함수
  const shortenContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + "...";
    }
    return content;
  };


  // axios 요청에 필요한 data
  const URL = useSelector((state) => state.url.url)
  const userToken = useSelector((state) => state.auth.token)
  const connectedCase = useSelector((state) => state.connectedCase.connectedCase)
  const headers = {
    Authorization: `Token ${userToken}`
  }

  const requestData = {
    "case_sn": connectedCase.case_sn,
    "symptom": location.state.symptom,
  }

  useEffect(() => {
    axios.post(`${URL}/case/slot/search/`, requestData, { headers })
      .then((response) => {
        setSearchResults(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])


  return (
    <div id="container">

      {/* 상단 네비게이션 바 */}
      <Navbar />  

      <div id="contents" className="row">
        
        {/* 약 검색결과 안내 */}
        <div id="search-result-message">
          <h5 className="white-text">보유하고 있는</h5>
          <h4 className="white-text">{location.state.symptom}</h4>
          <h5 className="white-text">와 관련된 약입니다</h5>
        </div>

        {!searchResults || searchResults.length === 0 ? (
          <div id="message" className="white-text center">해당 증상에 맞는 약을<br />보유하고 있지 않습니다</div>
        ) : (
          searchResults.map((searchResult, index) => (
            <Link 
              to="/med/info"
              state={{ slotNum: searchResult.slot_id % 8 ? searchResult.slot_id % 8 : 8 }}
              key={ index }
            >
              <div className="col s12">
                <div id="list-box" className="waves-effect waves btn white black-text z-depth-3">
                  <div id="list-box-content">
                    <div id="list-box-primary">{shortenContent(searchResult.med_name, 10)}</div>
                    <div id="list-box-secondary">{shortenContent(searchResult.med_vendor, 18)}</div>
                  </div>
                  
                </div>
              </div>
            </Link>
          ))
        )}
        
        
      </div>
    </div>
  )
}

export default MedSearchResult