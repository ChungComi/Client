import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/navbar.css";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <button onClick={() => navigate("/home")}>홈</button>
            <button onClick={() => navigate("/interestInfo")}>관심사</button>
            <button onClick={() => navigate("/board")}>게시판</button>
        </nav>
    );
};

export default Navbar;
