import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios"


const MedRegisterList = () => {
  
  // 불러온 data가 담기는 변수
  const [medList, setMedList] = useState([])

  // 빈칸에 뜰 플러스 아이콘
  const plusIcon = () => {
    return (
      <img src="/assets/plus_icon.png" alt="#" width="30%"/>
    )
  }

  // API 요청 보낼 url
  const URL = useSelector((state) => state.url.url);

  // 현재 접속한 기기 정보
  const connectedCase = useSelector((state) => state.connectedCase.connectedCase);
  
  // 유저토큰
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
        <h4 id="page-title" className="white-text">약 등록하기</h4>
        
        
        {/* 약통 슬롯 리스트 */}
        <div id="med-list">
          <div className="row">
            <div className="col s6">
              <Link to={ medList[0] ? "/med/register/update" : "/med/register/barcode" } state={{ slotNum: 1 }}>
                <div id="med-list-left" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[0]
                    ? <div><div>{medList[0].med_name}</div><div>{medList[0].slot_exp}</div></div>
                    : plusIcon()
                  }
                </div>
              </Link>
            </div>
            <div className="col s6">
              <Link to={ medList[1] ? "/med/register/update" : "/med/register/barcode" } state={{ slotNum: 2 }}>
                <div id="med-list-left" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[1]
                    ? <div><div>{medList[1].med_name}</div><div>{medList[1].slot_exp}</div></div>
                    : plusIcon()
                  }
                </div>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col s6">
              <Link to={ medList[2] ? "/med/register/update" : "/med/register/barcode" } state={{ slotNum: 3 }}>
                <div id="med-list-left" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[2]
                    ? <div><div>{medList[2].med_name}</div><div>{medList[2].slot_exp}</div></div>
                    : plusIcon()
                  }
                </div>
              </Link>
            </div>
            <div className="col s6">
              <Link to={ medList[3] ? "/med/register/update" : "/med/register/barcode" } state={{ slotNum: 4 }}>
                <div id="med-list-left" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[3]
                    ? <div><div>{medList[3].med_name}</div><div>{medList[3].slot_exp}</div></div>
                    : plusIcon()
                  }
                </div>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col s6">
              <Link to={ medList[4] ? "/med/register/update" : "/med/register/barcode" } state={{ slotNum: 5 }}>
                <div id="med-list-left" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[4]
                    ? <div><div>{medList[4].med_name}</div><div>{medList[4].slot_exp}</div></div>
                    : plusIcon()
                  }
                </div>
              </Link>
            </div>
            <div className="col s6">
              <Link to={ medList[5] ? "/med/register/update" : "/med/register/barcode" } state={{ slotNum: 6 }}>
                <div id="med-list-left" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[5]
                    ? <div><div>{medList[5].med_name}</div><div>{medList[5].slot_exp}</div></div>
                    : plusIcon()
                  }
                </div>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col s6">
              <Link to={ medList[6] ? "/med/register/update" : "/med/register/barcode" } state={{ slotNum: 7 }}>
                <div id="med-list-left" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[6]
                    ? <div><div>{medList[6].med_name}</div><div>{medList[6].slot_exp}</div></div>
                    : plusIcon()
                  }
                </div>
              </Link>
            </div>
            <div className="col s6">
              <Link to={ medList[7] ? "/med/register/update" : "/med/register/barcode" } state={{ slotNum: 8 }}>
                <div id="med-list-left" className="white waves-effect waves black-text z-depth-3">
                  { 
                    medList[7]
                    ? <div><div>{medList[7].med_name}</div><div>{medList[7].slot_exp}</div></div>
                    : plusIcon()
                  }
                </div>
              </Link>
            </div>
          </div>
        </div>
      
        <div id="bottom-area"></div>

      </div>
    </div>
  )
}

export default MedRegisterList