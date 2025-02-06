import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./screen/login.jsx";
import Chungboong from "./screen/chungboong.jsx";
import Register from "./screen/register.jsx";
import Navbar from "./components/ui/navbar.jsx";

const App = () => {
    const location = useLocation(); // 현재 경로 가져오기
    const hideNavbar = location.pathname === "/" || location.pathname === "/register"; // 로그인 & 회원가입에서 숨김

    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Chungboong />} />
            </Routes>
            {!hideNavbar && <Navbar />} {/* 로그인 & 회원가입 페이지가 아닐 때만 네비게이션 표시 */}
        </>
    );
};

export default App;
