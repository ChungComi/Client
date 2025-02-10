import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./screen/login.jsx";
import Chungboong from "./screen/chungboong.jsx";
import Register from "./screen/register.jsx";
import Navbar from "./components/ui/navbar.jsx";
import Header from "./components/ui/header.jsx";
import "./components/ui/css/app.css";
import MyPage from "./screen/myPage.jsx";
import InterestInfo from "./screen/interestInfo.jsx";
import Board from "./screen/board.jsx";
import Post from "./screen/post.jsx";
import Cafeteria from "./components/ui/cafeteria.jsx";

const App = () => {
    const location = useLocation();
    const hideNavbarAndHeader = location.pathname === "/" || location.pathname === "/register";

    return (
        <div className="app-container">
            {!hideNavbarAndHeader && <Header />} {/* 로그인 & 회원가입 페이지에서는 Header 숨김 */}
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Chungboong />} />
                    <Route path="/mypage" element={<MyPage />} />
                    <Route path="/interestInfo" element={<InterestInfo />} />
                    <Route path="/board" element={<Board />} />
                    <Route path="/post" element={<Post />} />
                    <Route path="/cafeteria" element={<Cafeteria />} />
                </Routes>
            </div>
            {!hideNavbarAndHeader && <Navbar />} {/* 로그인 & 회원가입 페이지에서는 Navbar 숨김 */}
        </div>
    );
};

export default App;
