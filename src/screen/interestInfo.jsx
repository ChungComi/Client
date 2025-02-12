import React, { useEffect, useState } from 'react';
import '../components/ui/css/interestInfo.css';
import customFetch from "../components/ui/customFetch.jsx";

const TechCompanyInfo = () => {

    const [name, setName] = useState("");
    const [techStack, setTechStack] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [developerNews, setDeveloperNews] = useState([]);

    useEffect(() => {
        refreshMemberInfo();
        fetchDeveloperNews();
    }, []);

    // 회원 정보 불러오기
    const refreshMemberInfo = () => {
        customFetch("/api/member", { method: "GET" })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.result) {
                    const member = data.result.data;
                    setName(member.name);
                    setTechStack(member.memberTechStacks);
                    setCompanies(member.memberCompanies);
                } else {
                    console.error("회원 정보를 가져오지 못했습니다.", data);
                }
            })
            .catch(error => console.error("회원 정보 요청 중 에러 발생:", error));
    };

    // 개발자 행사 정보 불러오기
    const fetchDeveloperNews = () => {
        fetch("/api/dev-events") // FastAPI 서버 주소에 맞게 수정
            .then(response => response.json())
            .then(data => {
                if (data.events) {
                    setDeveloperNews(data.events);
                }
            })
            .catch(error => console.error("개발자 행사 정보를 불러오는 중 에러 발생:", error));
    };

    return (
        <div className="container">
            <div className="section tech-news">
                <span className="title">설정한 기술 스택 </span>
                <span className="tech-list">
                    {techStack.length > 0
                        ? techStack.map(ts => ts.techStackName).join(", ")
                        : "설정된 기술 스택이 없습니다."}
                </span>
                <ul>
                    <li><a href="#">Python 3.12 새로운 기능 및 변경 사항</a></li>
                    <li><a href="#">FastAPI를 활용한 API 개발 트렌드</a></li>
                    <li><a href="#">React 18에서 성능 최적화하는 방법</a></li>
                </ul>
            </div>
            <div className="section company-news">
                <span className="title">설정한 기업 </span>
                <span className="company-list">
                    {companies.length > 0
                        ? companies.map(c => c.companyName).join(", ")
                        : "설정된 기업이 없습니다."}
                </span>
                <ul>
                    <li><a href="#">삼성전자, 차세대 반도체 기술 발표</a></li>
                    <li><a href="#">네이버 AI 연구소의 최신 프로젝트</a></li>
                    <li><a href="#">SpaceX, 화성 탐사 로드맵 업데이트</a></li>
                </ul>
            </div>
            <div className="section-developer-news">
                <span className="title">개발자 소식</span>
                <ul>
                    {developerNews.length > 0 ? (
                        developerNews.map((news, index) => (
                            <li key={index}>
                                <a href={news.링크} target="_blank" rel="noopener noreferrer">
                                    {news.제목}
                                </a>
                                <ul className="details">
                                    <li>{news.분류}</li>
                                    <li>{news.주최}</li>
                                    <li>{news.접수}</li>
                                </ul>
                            </li>
                        ))
                    ) : (
                        <li>개발자 행사 정보를 불러오는 중...</li>
                    )}
                </ul>
            </div>
            <div className="section-developer-clubs">
                <span className="title">외부 동아리</span>
                <ul>
                    {[
                        {name: "DDD", desc: "개발자와 디자이너가 함께하는 사이드 프로젝트", link: "https://dddset.notion.site/DDD-7b73ca41b67c4658b292a4662581ee01"},
                        {name: "한이음", desc: "대학생 멘티와 지도교수, 기업전문가 ICT멘토가 팀을 이루어 실무 프로젝트를 수행", link: "https://www.hanium.or.kr/portal/index.do"},
                        {name: "넥스터즈", desc: "개발자와 디자이너 연합 동아리", link: "https://nexters.co.kr/"},
                        {name: "YAPP", desc: "대학생 연합 기업형 IT 동아리", link: "http://yapp.co.kr/"},
                        {name: "Mash-Up", desc: "성장의 즐거움을 아는 친구들", link: "https://mash-up.kr/"},
                        {name: "AUSG", desc: "AWS 대학생 그룹", link: "https://ausg.me/"},
                        {name: "DND", desc: "서울거주 현직자들의 기술공유와 프로젝트를 진행하는 비영리단체", link: "https://dnd.ac/"},
                        {name: "SOPT", desc: "대학생 연합 IT벤처 창업 동아리", link: "https://www.sopt.org/"},
                        {name: "멋쟁이 사자처럼", desc: "대학생 연합 동아리", link: "https://likelion.net/"},
                        {name: "Google Developer Student Clubs", desc: "Google Developers 에서 후원하는 대학생 개발자 동아리", link: "https://developers.google.com/community?hl=ko"},
                        {name: "디프만", desc: "디자이너와 프로그래머가 만났을 때", link: "https://www.depromeet.com/"},
                        {name: "프로그라피", desc: "세상에 필요한 IT서비스를 만드는 모임", link: "https://prography.org/"},
                        {name: "CEOS", desc: "신촌 연합 IT 창업 동아리", link: "https://ceos-sinchon.com/"},
                        {name: "CMC", desc: "수익형 앱 런칭 동아리", link: "https://cmc.makeus.in/"},
                        {name: "UMC", desc: "대학교 연합 앱 런칭 동아리", link: "https://www.umc.com/en/home/Index"},
                        {name: "XREAL", desc: "세계 최고의 메타버스 학회, XREAL", link: "https://www.xreal.info/"},
                        {name: "Cloud Club", desc: "폭 넓은 클라우드 인프라를 경험할 수 있는 IT 동아리", link: "https://www.cloudclub.kr/"},
                        {name: "피로그래밍", desc: "비전공자를 위한 웹 프로그래밍 동아리", link: "https://pirogramming.com/"},
                        {name: "SIPE", desc: "개발자들이 함께 교류하며 성장하는 IT 커뮤니티", link: "https://sipe.team/"},
                        {name: "9oormthonUNIV", desc: "카카오와 구름이 함께하는 대학생 IT 연합 동아리", link: "https://south-kryptops-4ca.notion.site/goormthon-Univ-446c55a140c34656a503479868c41cc0"},
                        {name: "BOAZ", desc: "국내 최초 빅데이터 동아리", link: "https://www.bigdataboaz.com/"},
                        {name: "SUSC", desc: "대학 연합 개발자 동아리", link: "https://www.susc.kr/"},
                        {name: "ADA", desc: "소프트웨어마이스터고 IT 연합 동아리", link: "https://www.instagram.com/gbsw_ada/"}
                    ].map((club, index) => (
                        <li key={index}>
                            <a href={club.link} target="_blank" rel="noopener noreferrer">
                                {club.name}
                            </a>
                            <p>{club.desc}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TechCompanyInfo;
