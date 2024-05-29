import React from "react";
import { Link } from "react-router-dom";


const SearchResult = ({ resultList }) => {

  return (

    <div>
      <div id="contents-box" className="white z-depth-4 row">
        {resultList.map((result, index) => (
          <div key={index} className="col s12">
              <div id="search-result-list" className="waves-effect waves">
                <Link to="/usedmed/register/detail" state={{preId: result.pre_id, preName: result.pre_name}}>
                  <div id="search-result-list-medname">{result.pre_name}</div>
                  {/* <div id="search-result-list-company">{result.med_vendor}</div> */}
                </Link>    
              </div>
          </div>
        ))}

      </div>
    </div>

  )
}

export default SearchResult;
