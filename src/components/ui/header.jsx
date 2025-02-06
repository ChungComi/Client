import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./css/header.css";

const Header = () => {
    const location = useLocation(); // 현재 경로 가져오기
    const navigate = useNavigate(); // 페이지 이동 함수

    // 경로별 페이지 제목 설정
    const pageTitles = {
        "/": "로그인",
        "/register": "회원가입",
        "/home": "홈"
    };

    // 마이페이지 버튼 클릭 시 이동
    const goToMyPage = () => {
        navigate("/mypage");
    };

    return (
        <header className="header">
            <div className="header-title">{pageTitles[location.pathname] || "페이지"}</div>
            <span className="mypage-button-container">
                <button className="mypage-button" onClick={goToMyPage}>마이페이지</button>
            </span>
        </header>
    );
};

export default Header;
