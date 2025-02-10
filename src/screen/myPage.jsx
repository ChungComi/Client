import React, { useState } from 'react';
import '../components/ui/css/mypage.css';

const MyPage = () => {
    const [techStack, setTechStack] = useState(["Python", "FastAPI", "React", "Docker", "AWS"]);
    const [companies, setCompanies] = useState(["삼성전자", "LG전자", "네이버", "카카오", "SpaceX"]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);

    const exampleTechStack = ["Java", "Spring", "Node.js", "TypeScript", "GraphQL"];
    const exampleCompanies = ["구글", "애플", "마이크로소프트", "테슬라", "아마존"];

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
    };

    const addItem = (item) => {
        if (modalType === "tech") {
            setTechStack([...techStack, item]);
        } else if (modalType === "company") {
            setCompanies([...companies, item]);
        }
        closeModal();
    };

    return (
        <div className="mypage-container">
            <h1>마이페이지</h1>
            <div className="profile">
                <h2>기본 정보</h2>
                <p><strong>이름:</strong> 홍길동</p>
                <p><strong>학과:</strong> 전자공학과</p>
                <p><strong>학교:</strong> 한국대학교</p>
            </div>
            <div className="tech-stack">
                <div className="section-header">
                    <h2>관심 기술 스택</h2>
                    <button className="add-button" onClick={() => openModal("tech")}>+</button>
                </div>
                <ul>
                    {techStack.map((tech, index) => (
                        <li key={index}>
                            <span>{tech}</span>
                            <button className="remove-button" onClick={() => setTechStack(techStack.filter((_, i) => i !== index))}>-</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="companies">
                <div className="section-header">
                    <h2>관심 기업</h2>
                    <button className="add-button" onClick={() => openModal("company")}>+</button>
                </div>
                <ul>
                    {companies.map((company, index) => (
                        <li key={index}>
                            <span>{company}</span>
                            <button className="remove-button" onClick={() => setCompanies(companies.filter((_, i) => i !== index))}>-</button>
                        </li>
                    ))}
                </ul>
            </div>
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content popup" onClick={(e) => e.stopPropagation()}>
                        <h2>{modalType === "tech" ? "추가할 기술 스택 선택" : "추가할 기업 선택"}</h2>
                        <div className="modal-buttons">
                            {(modalType === "tech" ? exampleTechStack : exampleCompanies).map((item, index) => (
                                <button key={index} className="modal-button" onClick={() => addItem(item)}>
                                    {item}
                                </button>
                            ))}
                        </div>
                        <button className="close-button" onClick={closeModal}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPage;
