import React from 'react';
import '../ui/css/interestInfo.css';

const TechCompanyInfo = () => {
    return (
        <div className="container">
            <div className="section tech-news">
                <span className="title">설정한 기술 스택 </span>
                <span className="tech-list">Python, FastAPI, React, Docker, AWS</span>
                <ul>
                    <li><a href="#">Python 3.12 새로운 기능 및 변경 사항</a></li>
                    <li><a href="#">FastAPI를 활용한 API 개발 트렌드</a></li>
                    <li><a href="#">React 18에서 성능 최적화하는 방법</a></li>
                </ul>
            </div>
            <div className="section company-news">
                <span className="title">설정한 기업 </span>
                <span className="company-list">삼성전자, LG전자, 네이버, 카카오, SpaceX</span>
                <ul>
                    <li><a href="#">삼성전자, 차세대 반도체 기술 발표</a></li>
                    <li><a href="#">네이버 AI 연구소의 최신 프로젝트</a></li>
                    <li><a href="#">SpaceX, 화성 탐사 로드맵 업데이트</a></li>
                </ul>
            </div>
        </div>
    );
};

export default TechCompanyInfo;