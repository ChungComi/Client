import React, { useState } from "react";
import "../components/ui/css/register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  // 상태 관리: 아이디, 이름, 비밀번호, 비밀번호 확인
  const [loginId, setLoginId] = useState("");
  const [name, setName] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    // 비밀번호와 비밀번호 확인이 일치하는지 확인
    if (loginPw !== confirmPw) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const response = await fetch("/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // 백엔드에서 필요한 필드: name, loginId, loginPw
        body: JSON.stringify({
          loginId: loginId,
          name: name,
          loginPw: loginPw,
        }),
      });

      const result = await response.json();

      if (result.success) {
        // 회원가입 성공 시 (예: result.result.data 에 등록된 id 등 포함)
        alert("회원가입에 성공했습니다.");
        navigate("/"); // 예를 들어 로그인 페이지로 이동
      } else {
        // 회원가입 실패 시 (code: 400, success: false)
        alert(`회원가입 실패: ${result.result.message}`);
      }
    } catch (error) {
      console.error("회원가입 요청 중 오류 발생:", error);
      alert("회원가입 요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="register-container">
      <h2>회원가입</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="아이디"
          required
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
        />
        <input
          type="text"
          placeholder="이름"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          required
          value={loginPw}
          onChange={(e) => setLoginPw(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          required
          value={confirmPw}
          onChange={(e) => setConfirmPw(e.target.value)}
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Register;
