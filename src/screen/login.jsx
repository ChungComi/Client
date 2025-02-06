import React from "react";
import "../components/ui/css/login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        // 로그인 검증 로직 추가 (예: ID/PW 확인)
        navigate("/home"); // 로그인 성공 시 /home으로 이동
    };

    const handleRegister = () => {
        navigate("/register"); // 회원가입 페이지로 이동
    };

    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form onSubmit={handleLogin}>
                <input type="text" placeholder="아이디" required />
                <input type="password" placeholder="비밀번호" required />
                <div className="button-group">
                    <button type="button" onClick={handleRegister}>회원가입</button>
                    <button type="submit">로그인</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
