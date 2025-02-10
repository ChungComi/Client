import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./screen/login.jsx";
import Chungboong from "./screen/chungboong.jsx";
import Register from "./screen/register.jsx";
import Navbar from "./components/ui/navbar.jsx";
import Header from "./components/ui/header.jsx";
import "./components/ui/css/app.css"
import MyPage from "./screen/myPage.jsx";
import InterestInfo from "./screen/interestInfo.jsx";
import Board from "./screen/board.jsx";
import Post from "./screen/post.jsx";
const App = () => {
    const location = useLocation();
    const hideNavbar = location.pathname === "/" || location.pathname === "/register";

    return (
        <div className="app-container">
            <Header /> {/* 페이지 제목 표시 */}
            <div className="main-content"> {/* 헤더 & 네비게이션 사이에 공간 확보 */}
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Chungboong />} />
                    <Route path="/mypage" element={<MyPage/>}/>
                    <Route path="/interestInfo" element={<InterestInfo/>}/>
                    <Route path="/board" element={<Board/>}/>
                    <Route path="/post" element={<Post/>}/>
                </Routes>
            </div>
            {!hideNavbar && <Navbar />}
        </div>
    );
};

export default App;
