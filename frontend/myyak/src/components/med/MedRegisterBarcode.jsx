import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import { BarcodeScanner } from '@domore-hr/react-barcode-scanner';



const MedRegisterBarcode = () => {

  const location = useLocation()

  const [slotNum, setSlotNum] = useState(location.state.slotNum)
  
  const [medBarcode, setMedBarcode] = useState("")

  const handleMedBarcode = (event) => {
    setMedBarcode(event.target.value)
  }

  return (
    <div id="container">

      {/* 상단 네비게이션 바 */}
      <Navbar />

      <div id="contents">
        
        {/* 페이지 타이틀 */}
        <h4 id="page-title" className="white-text">약 등록하기</h4>

        {/* 약 등록 폼 */}
        <div id="contents-box" className="white z-depth-4 row">
          <div className="input-field col s12">
            <input id="med-barcode" type="text" className="validate" value={ medBarcode } onChange={ handleMedBarcode }/>
            <label htmlFor="med-barcode" className="active">상비약 바코드 번호</label>
          </div>
        </div>

        {/* 바코드 인식 카메라 */}
        <div id="barcode-camera">
          <BarcodeScanner
            onCapture={(result) => setMedBarcode(result.rawValue)}
            options={{formats: ['ean_13']}}
          />
        </div>

        {/* 확인 버튼 */}
        <div id="buttons" className="row">

          <Link to="/med/register/search" state={{ slotNum: slotNum }} className="col s10 offset-s1">
            <div id="button-up" className="btn waves-effect waves white black-text z-depth-3">
              이름으로 검색
            </div>
          </Link>


          <Link to="/med/register/new" state={{ slotNum: slotNum, medBarcode : medBarcode }} className="col s10 offset-s1">
            <div id="button-down" className="btn waves-effect waves white black-text z-depth-3">
              확인
            </div>
          </Link>


        </div>

      </div>
    </div>
  )
}

export default MedRegisterBarcode