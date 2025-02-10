import React, { useState } from "react";
import "../components/ui/css/login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [loginId, setLoginId] = useState("");
    const [loginPw, setLoginPw] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch("/auth/sign-in", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    loginId: loginId,
                    loginPw: loginPw,
                }),
            });

            // 백엔드에서 항상 JSON 응답을 보낸다고 가정
            const data = await response.json();

            // 응답 객체가 Response.success()를 통해 성공한 경우
            if (data.success) {
                // 성공 응답일 때 토큰은 data.result.data에 담겨있다고 가정
                localStorage.setItem("token", data.result.data);
                navigate("/home");
            } else {
                // 실패 응답일 경우 (code: 400, success: false)
                alert(`로그인 실패: ${data.result.message}`);
            }
        } catch (error) {
            console.error("로그인 요청 중 에러 발생:", error);
            alert("로그인 도중 에러가 발생했습니다.");
        }
    };

    const handleRegister = () => {
        navigate("/register");
    };

    return (
        <div className="login-container">
            <h2>로그인</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="아이디"
                    required
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    required
                    value={loginPw}
                    onChange={(e) => setLoginPw(e.target.value)}
                />
                <div className="button-group">
                    <button type="button" onClick={handleRegister}>
                        회원가입
                    </button>
                    <button type="submit">로그인</button>
                </div>
            </form>
        </div>
    );
};

export default Login;
