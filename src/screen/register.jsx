import React from "react";
import "../components/ui/css/register.css";

const Register = () => {
    return (
        <div className="register-container">
            <h2>회원가입</h2>
            <form>
                <input type="text" placeholder="아이디" required />
                <input type="text" placeholder="이름" required />
                <input type="password" placeholder="비밀번호" required />
                <input type="password" placeholder="비밀번호 확인" required />
                <button type="submit">회원가입</button>
            </form>
        </div>
    );
};

export default Register;