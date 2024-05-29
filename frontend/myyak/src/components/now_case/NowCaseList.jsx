import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios"


const NowCaseList = () => {

  // 불러온 data가 담기는 변수
  const [medList, setMedList] = useState([])

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


  return (
    <div id="container">

      {/* 상단 네비게이션 바 */}
      <Navbar />  

      <div id="contents">

        {/* 페이지 타이틀 */}
        <h4 id="page-title" className="white-text">내 약통 현황</h4>

        {/* 약통 슬롯 리스트 */}
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

                

      </div>


    </div>
  )
}

export default NowCaseList