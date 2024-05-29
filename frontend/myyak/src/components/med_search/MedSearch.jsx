import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";


const MedSearch = () => {

  const navigate = useNavigate()

  const symptomList = [
    "감기",
    "두통",
    "근육통",
    "구내염",
    "설사",
    "위염",
    "장염",
    "피부염"
  ]

  const [medList, setMedList] = useState([])
  const [symptom, setSymptom] = useState("")

  // axios 요청에 사용할 data
  const URL = useSelector((state) => state.url.url);
  const connectedCase = useSelector((state) => state.connectedCase.connectedCase);
  const userToken = useSelector((state) => state.auth.token)

  // get 요청으로 보낼 쿼리 파라미터
  const requestData = {
    params: {
      case_sn: connectedCase.case_sn
    },
    headers: {
      Authorization: `Token ${userToken}`
    }
  };

  // 내 약통 현황 불러오기
  useEffect(() => {
    axios.get(`${URL}/case/list/`, requestData)
      .then((response) => {
        setMedList(response.data)
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, []);

  const handleSymptom = (event) => {
    setSymptom(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate("/med/search/result", { state: { symptom: symptom }})
  }


  return (
    <div id="container">

      {/* 상단 네비게이션 바 */}
      <Navbar />  

      <div id="contents">

        {/* 페이지 타이틀1 */}
        <h5 id="page-title-small1" className="white-text">증상 검색</h5>

        {/* 증상 검색창 */}
        <div id="search-box" className="white z-depth-3">
          <form className="row" onSubmit={handleSubmit}>
            <div className="col s9">
              <input placeholder="증상을 입력해주세요" id="symptom" type="text" value={ symptom } onChange={ handleSymptom }/>
            </div>
            <div className="col s3">
              <Link to="/med/search/result" state={{ symptom: symptom }}>
                <div id="search-icon-box" className="btn waves-effect waves white z-depth-2 black-text">
                  검색
                </div>
              </Link>
            </div>
          </form>
        </div>

        {/* 페이지 타이틀2 */}
        <h5 id="page-title-small2" className="white-text">자주 찾는 증상</h5>

        {/* 자주찾는 증상 리스트 */}
        <div id="med-list">
          {symptomList.map((symptomItem, index) => (
            index % 2 === 0 && (
              <div className="row" key={index}>
                <div className="col s6">
                  <Link to="/med/search/result" state={{ symptom: symptomItem }}>
                    <div id="symptom-list-left" className="white btn waves-effect waves black-text z-depth-3">{symptomItem}</div>
                  </Link>
                </div>
                {symptomList[index + 1] && (
                  <div className="col s6">
                    <Link to="/med/search/result" state={{ symptom: symptomList[index + 1] }}>
                      <div id="symptom-list-right" className="white btn waves-effect waves black-text z-depth-3">{symptomList[index + 1]}</div>
                    </Link>
                  </div>
                )}
              </div>
            )
          ))}
        </div>


        {/* 페이지 타이틀3 */}
        <h5 id="page-title-small2" className="white-text">바로 꺼내기</h5>


        {/* 바로 꺼내기 약통 슬롯 리스트 */}
        <div id="med-list">
          <div className="row">
            <div className="col s6">
              <Link to={ medList[0] ? "/med/info" : "" } state={{ slotNum: 1 }}>
                <div id="med-list-left" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[0]
                    ? <div><div>{medList[0].med_name}</div><div>{medList[0].slot_exp}</div></div>
                    : "(비어있음)"
                  }
                </div>
              </Link>
            </div>
            <div className="col s6">
              <Link to={ medList[1] ? "/med/info" : "" } state={{ slotNum: 2 }}>
                <div id="med-list-right" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[1]
                    ? <div><div>{medList[1].med_name}</div><div>{medList[1].slot_exp}</div></div>
                    : "(비어있음)"
                  }
                </div>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col s6">
              <Link to={ medList[2] ? "/med/info" : "" } state={{ slotNum: 3 }}>
                <div id="med-list-left" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[2]
                    ? <div><div>{medList[2].med_name}</div><div>{medList[2].slot_exp}</div></div>
                    : "(비어있음)"
                  }
                </div>
              </Link>
            </div>
            <div className="col s6">
              <Link to={ medList[3] ? "/med/info" : "" } state={{ slotNum: 4 }}>
                <div id="med-list-right" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[3]
                    ? <div><div>{medList[3].med_name}</div><div>{medList[3].slot_exp}</div></div>
                    : "(비어있음)"
                  }
                </div>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col s6">
              <Link to={ medList[4] ? "/med/info" : "" } state={{ slotNum: 5 }}>
                <div id="med-list-left" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[4]
                    ? <div><div>{medList[4].med_name}</div><div>{medList[4].slot_exp}</div></div>
                    : "(비어있음)"
                  }
                </div>
              </Link>
            </div>
            <div className="col s6">
              <Link to={ medList[5] ? "/med/info" : "" } state={{ slotNum: 6 }}>
                <div id="med-list-right" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[5]
                    ? <div><div>{medList[5].med_name}</div><div>{medList[5].slot_exp}</div></div>
                    : "(비어있음)"
                  }
                </div>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col s6">
              <Link to={ medList[6] ? "/med/info" : "" } state={{ slotNum: 7 }}>
                <div id="med-list-left" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[6]
                    ? <div><div>{medList[6].med_name}</div><div>{medList[6].slot_exp}</div></div>
                    : "(비어있음)"
                  }
                </div>
              </Link>
            </div>
            <div className="col s6">
              <Link to={ medList[7] ? "/med/info" : "" } state={{ slotNum: 8 }}>
                <div id="med-list-right" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[7]
                    ? <div><div>{medList[7].med_name}</div><div>{medList[7].slot_exp}</div></div>
                    : "(비어있음)"
                  }
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* 최하단부 여유공간 */}
        <div id="bottom-area"></div>

      </div>


    </div>
  )
}

export default MedSearch