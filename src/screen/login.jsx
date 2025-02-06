import React from "react";
import "../components/ui/css/login.css";

const Login = () => {
    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form>
                <input type="text" placeholder="아이디" required />
                <input type="password" placeholder="비밀번호" required />
                <div className="button-group">
                    <button type="button">회원가입</button>
                    <button type="submit">로그인</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
