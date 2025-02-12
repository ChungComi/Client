import React, {useEffect, useState} from 'react';
import '../components/ui/css/interestInfo.css';
import customFetch from "../components/ui/customFetch.jsx";

const TechCompanyInfo = () => {

    const [name, setName] = useState("");
    const [techStack, setTechStack] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [developerNews, setDeveloperNews] = useState([]);
    const [companyNewsInfo, setCompanyNewsInfo] = useState([]);
    const [techStackNewsInfo, setTechStackNewsInfo] = useState([]);
    const [apiType, setApiType] = useState("external"); // 기본값: 외부 API 사용



    useEffect(() => {
        refreshMemberInfo();
        fetchDeveloperNews();
    }, []);

    useEffect(() => {
        if (companies.length > 0) {
            if (apiType === "external") {
                fetchMyCompanyNews();
                fetchMyTechStackNews();
            } else {
                fetchMyCompanyInfoFromSpring();
                fetchMyTechStackInfoFromSpring();

            }
        }
    }, [companies, techStack, apiType]);

    const handleApiTypeChange = (event) => {
        setApiType(event.target.value);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "날짜 미상";

        const parts = dateString.split(",")[0].split("/"); // "01/08/2025, 08:00 AM, +0000 U" → ["01", "08", "2025"]

        if (parts.length === 3) {
            const [month, day, year] = parts;
            return `${year}-${month}-${day}`; // YYYY-MM-DD 형식으로 변환
        }

        return "날짜 형식 오류"; // 혹시라도 예외가 있으면 표시
    };

    // 회원 정보 불러오기
    const refreshMemberInfo = () => {
        customFetch("/api/member", {method: "GET"})
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

    const fetchMyTechStackInfoFromSpring = ()=> {
        customFetch("/api/my-tech-stack-info",{method: "GET"})
            .then(response => response.json())
            .then(data => {
                console.log(data.result.data)
                if (data.result.data) {
                    const newsData = data.result.data.map(news => ({
                        title: news.title,
                        link: news.link,
                        source: news.source.name ?? "출처 미상",
                        date: formatDate(news.date)
                    }));
                    setTechStackNewsInfo(newsData);
                }else {
                    setTechStackNewsInfo([]); // 실패 시 빈 배열 설정
                }
            })
    };

    const fetchMyCompanyInfoFromSpring = ()=>{
        customFetch("/api/my-company-info",{method: "GET"})
            .then(response => response.json())
            .then(data => {
                console.log(data.result.data)
                if (data.result.data) {
                    const newsData = data.result.data.map(news => ({
                        title: news.title,
                        link: news.link,
                        source: news.source.name ?? "출처 미상",
                        date: formatDate(news.date)
                    }));
                    setCompanyNewsInfo(newsData);
                }else {
                    setCompanyNewsInfo([]); // 실패 시 빈 배열 설정
                }
            })
    }

    const fetchMyTechStackNews = async () => {
        if (techStack.length === 0) return; // 회사 정보가 없으면 실행하지 않음

        try {
            const newsPromises = techStack.map(t =>
                fetch(`/external-api/search.json?engine=google_news&q=${encodeURIComponent(t.techStackName)}+개발&gl=kr&hl=ko&when=24h&api_key=41d2aa8433f65aebab48a03f43ddd467df634de09376c3ddb9d41fd3f6795672`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.news_results) {
                            return data.news_results.slice(0, 4).map(news => ({
                                title: news.title,
                                link: news.link,
                                source: news.source.name ?? "출처 미상",
                                date: formatDate(news.date)
                            }));
                        }
                        return [];
                    })
                    .catch(error => {
                        console.error(`Error fetching news for ${t.techStackName}:`, error);
                        return [];
                    })
            );

            // 모든 요청이 끝날 때까지 기다린 후 한 번에 업데이트
            const allNewsResults = await Promise.all(newsPromises);
            setTechStackNewsInfo(allNewsResults.flat()); // 중첩 배열을 평탄화하여 저장

        } catch (error) {
            console.error("Error fetching news:", error);
        }
    };

    const fetchMyCompanyNews = async () => {
        if (companies.length === 0) return; // 회사 정보가 없으면 실행하지 않음

        try {
            const newsPromises = companies.map(c =>
                fetch(`/external-api/search.json?engine=google_news&q=${encodeURIComponent(c.companyName)}+개발&gl=kr&hl=ko&when=24h&api_key=41d2aa8433f65aebab48a03f43ddd467df634de09376c3ddb9d41fd3f6795672`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.news_results) {
                            return data.news_results.slice(0, 4).map(news => ({
                                title: news.title,
                                link: news.link,
                                source: news.source.name ?? "출처 미상",
                                date: formatDate(news.date)
                            }));
                        }
                        return [];
                    })
                    .catch(error => {
                        console.error(`Error fetching news for ${c.companyName}:`, error);
                        return [];
                    })
            );

            // 모든 요청이 끝날 때까지 기다린 후 한 번에 업데이트
            const allNewsResults = await Promise.all(newsPromises);
            setCompanyNewsInfo(allNewsResults.flat()); // 중첩 배열을 평탄화하여 저장

        } catch (error) {
            console.error("Error fetching news:", error);
        }
    };


    // 개발자 행사 정보 불러오기
    const fetchDeveloperNews = () => {
        customFetch("/api/dev-events", {method: "GET"})
            .then(response => response.json())
            .then(data => {
                console.log(data.result.data)
                if (data.result.data.events) {
                    setDeveloperNews(data.result.data.events);
                }
            })
            .catch(error => console.error("개발자 행사 정보를 불러오는 중 에러 발생:", error));
    };

    return (
        <div className="container-interest">
                <label>
                    <input type="radio" name="apiType" value="external" checked={apiType === "external"}
                           onChange={handleApiTypeChange}/>
                    외부 API 사용
                </label>
                <label>
                    <input type="radio" name="apiType" value="internal" checked={apiType === "internal"}
                           onChange={handleApiTypeChange}/>
                    내부 API 사용
                </label>

                <div className="section tech-news">
                    <span className="title">설정한 기술 스택 </span>
                    <span className="tech-list">
                    {techStack.length > 0
                        ?
                        console.log(techStack)
                        : "설정된 기술 스택이 없습니다."}
                </span>
                    <ul>
                        {techStackNewsInfo.length > 0 ? (
                            techStackNewsInfo.map((news, index) => (
                                <li key={index}>
                                    <a href={news.link}>{news.title}</a>
                                    <p className="details">{news.source}, {news.date}</p>
                                </li>
                            ))
                        ) : (
                            <li>관심 기술 스택 관련 정보 가져오는 중...</li>
                        )}
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
                        {companyNewsInfo.length > 0 ? (
                            companyNewsInfo.map((news, index) => (
                                <li key={index}>
                                    <a href={news.link}>{news.title}</a>
                                    <p className="details">{news.source}, {news.date}</p>
                                </li>
                            ))
                        ) : (
                            <li>관심 기업 관련 정보 가져오는 중...</li>
                        )}
                    </ul>
                </div>
                <div className="section developer-news">
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
                <div className="section developer-clubs">
                    <span className="title">외부 동아리</span>
                    <ul>
                        {[
                            {
                                name: "DDD",
                                desc: "개발자와 디자이너가 함께하는 사이드 프로젝트",
                                link: "https://dddset.notion.site/DDD-7b73ca41b67c4658b292a4662581ee01"
                            },
                            {
                                name: "한이음",
                                desc: "대학생 멘티와 지도교수, 기업전문가 ICT멘토가 팀을 이루어 실무 프로젝트를 수행",
                                link: "https://www.hanium.or.kr/portal/index.do"
                            },
                            {name: "넥스터즈", desc: "개발자와 디자이너 연합 동아리", link: "https://nexters.co.kr/"},
                            {name: "YAPP", desc: "대학생 연합 기업형 IT 동아리", link: "http://yapp.co.kr/"},
                            {name: "Mash-Up", desc: "성장의 즐거움을 아는 친구들", link: "https://mash-up.kr/"},
                            {name: "AUSG", desc: "AWS 대학생 그룹", link: "https://ausg.me/"},
                            {name: "DND", desc: "서울거주 현직자들의 기술공유와 프로젝트를 진행하는 비영리단체", link: "https://dnd.ac/"},
                            {name: "SOPT", desc: "대학생 연합 IT벤처 창업 동아리", link: "https://www.sopt.org/"},
                            {name: "멋쟁이 사자처럼", desc: "대학생 연합 동아리", link: "https://likelion.net/"},
                            {
                                name: "Google Developer Student Clubs",
                                desc: "Google Developers 에서 후원하는 대학생 개발자 동아리",
                                link: "https://developers.google.com/community?hl=ko"
                            },
                            {name: "디프만", desc: "디자이너와 프로그래머가 만났을 때", link: "https://www.depromeet.com/"},
                            {name: "프로그라피", desc: "세상에 필요한 IT서비스를 만드는 모임", link: "https://prography.org/"},
                            {name: "CEOS", desc: "신촌 연합 IT 창업 동아리", link: "https://ceos-sinchon.com/"},
                            {name: "CMC", desc: "수익형 앱 런칭 동아리", link: "https://cmc.makeus.in/"},
                            {name: "UMC", desc: "대학교 연합 앱 런칭 동아리", link: "https://www.umc.com/en/home/Index"},
                            {name: "XREAL", desc: "세계 최고의 메타버스 학회, XREAL", link: "https://www.xreal.info/"},
                            {
                                name: "Cloud Club",
                                desc: "폭 넓은 클라우드 인프라를 경험할 수 있는 IT 동아리",
                                link: "https://www.cloudclub.kr/"
                            },
                            {name: "피로그래밍", desc: "비전공자를 위한 웹 프로그래밍 동아리", link: "https://pirogramming.com/"},
                            {name: "SIPE", desc: "개발자들이 함께 교류하며 성장하는 IT 커뮤니티", link: "https://sipe.team/"},
                            {
                                name: "9oormthonUNIV",
                                desc: "카카오와 구름이 함께하는 대학생 IT 연합 동아리",
                                link: "https://south-kryptops-4ca.notion.site/goormthon-Univ-446c55a140c34656a503479868c41cc0"
                            },
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
                <div className="section developer-edu">
                    <span className="title">개발자 교육</span>
                    <ul>
                        <li><a href="https://jungle.krafton.com/" target="_blank" rel="noopener noreferrer">크래프톤 정글</a>
                        </li>
                        <li><a href="https://www.ssafy.com/ksp/jsp/swp/swpMain.jsp" target="_blank"
                               rel="noopener noreferrer">삼성 청년 SW 아카데미</a></li>
                        <li><a href="https://www.kakaotechcampus.com/user/index.do/" target="_blank"
                               rel="noopener noreferrer">카카오 테크 캠퍼스</a></li>
                        <li><a href="https://42seoul.kr/seoul42/main/view" target="_blank" rel="noopener noreferrer">42
                            서울</a></li>
                        <li><a
                            href="https://techblog.woowahan.com/?s=%EC%9A%B0%EC%95%84%ED%95%9C%ED%85%8C%ED%81%AC%EC%BA%A0%ED%94%84"
                            target="_blank" rel="noopener noreferrer">우아한 테크캠프</a></li>
                        <li><a href="https://www.woowacourse.io/" target="_blank" rel="noopener noreferrer">우아한 테크코스</a>
                        </li>
                        <li><a href="https://boostcamp.connect.or.kr/" target="_blank" rel="noopener noreferrer">네이버 부스트
                            캠프</a></li>
                        <li><a href="https://sprint.codeit.kr/" target="_blank" rel="noopener noreferrer">코드잇 스프린트</a>
                        </li>
                    </ul>
                </div>

            </div>
            );
            };

            export default TechCompanyInfo;
