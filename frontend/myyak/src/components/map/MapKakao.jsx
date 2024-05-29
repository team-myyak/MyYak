import React, { useEffect } from "react";
import Navbar from "../Navbar";

const MapKakao = () => {
  useEffect(() => {
    let infowindow; // 정보창을 전역 변수로 선언합니다.

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const script = document.createElement("script");
          script.async = true;
          script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=ed7aebd67e4f0399324a8fefc3410ab0&libraries=services&autoload=false";
          document.head.appendChild(script);

          script.onload = () => {
            window.kakao.maps.load(() => {
              const container = document.getElementById("map");
              const options = {
                center: new window.kakao.maps.LatLng(latitude, longitude),
                level: 5
              };
              const map = new window.kakao.maps.Map(container, options);

              const places = new window.kakao.maps.services.Places();

              const radius = 1500;
              places.keywordSearch('약국', (results, status) => {
                if (status === window.kakao.maps.services.Status.OK) {
                  for (let i = 0; i < results.length; i++) {
                    const position = new window.kakao.maps.LatLng(results[i].y, results[i].x);
                    const marker = new window.kakao.maps.Marker({
                      map: map,
                      position: position
                    });

                    window.kakao.maps.event.addListener(marker, 'click', function() {
                      // 이미 열려있는 정보창이 있다면 닫습니다.
                      if (infowindow) {
                        infowindow.close();
                      }
                      infowindow = new window.kakao.maps.InfoWindow({
                        content: `
                          <div style="padding:5px;font-size:12px;">
                            <b style="font-size:15px;color:#244152;">${results[i].place_name}</b><br/>
                            ${results[i].address_name}<br/>
                            <a href="https://map.kakao.com/link/to/${results[i].place_name},${results[i].y},${results[i].x}" target="_blank">길찾기</a>
                          </>`,
                      });
                      infowindow.open(map, marker);
                    });
                  }
                }
              }, {
                location: new window.kakao.maps.LatLng(latitude, longitude),
                radius: radius
              });
            });
          };

          return () => {
            document.head.removeChild(script);
          };
        },
        error => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div id="container">
      <Navbar />
      <div id="contents">
        <h4 id="page-title" className="white-text">근처 약국 찾기</h4>
        <div id="map" className="z-depth-3"></div>
      </div>
    </div>
  );
};

export default MapKakao;
