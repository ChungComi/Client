import React, { useState, useEffect } from 'react';
import '../components/ui/css/mypage.css';
import customFetch from '../components/ui/customFetch.jsx'; // 실제 경로에 맞게 수정

const MyPage = () => {
  // 기본 정보 및 관심 정보 상태
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [techStack, setTechStack] = useState([]);
  const [companies, setCompanies] = useState([]);

  // 모달 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // "school", "tech", "company"
  const [schoolInput, setSchoolInput] = useState("");

  // 모달에서 보여줄 옵션 (백엔드에서 받아온 전체 옵션 목록)
  const [interestOptions, setInterestOptions] = useState([]);

  // 회원 정보를 새로고침하는 함수 (GET /api/member)
  const refreshMemberInfo = () => {
    customFetch("/api/member", { method: "GET" })
      .then(response => response.json())
      .then(data => {
        if (data.success && data.result) {
          const member = data.result.data;
          setName(member.name);
          setSchool(member.school ? member.school.name : "");
          const techStacks = member.memberTechStacks
          const companiesData = member.memberCompanies
          console.log("기술 스택:", techStacks);
          console.log("관심 기업:", companiesData);
          setTechStack(techStacks);
          setCompanies(companiesData);
        } else {
          console.error("회원 정보를 가져오지 못했습니다.", data);
        }
      })
      .catch(error => console.error("회원 정보 요청 중 에러 발생:", error));
  };

  // 컴포넌트가 마운트될 때 회원 정보를 불러옵니다.
  useEffect(() => {
    refreshMemberInfo();
  }, []);

  // 모달 열기 함수
  // - modalType이 "tech"이면 /tech-stack, "company"이면 /company를 호출하여 옵션을 가져옵니다.
  const openModal = (type) => {
    setModalType(type);
    if (type === "tech") {
      customFetch("/tech-stack", { method: "GET" })
        .then(response => response.json())
        .then(data => {
          if (data.success && data.result) {
            setInterestOptions(data.result.data);
          } else {
            console.error("기술 스택 정보를 가져오지 못했습니다.", data);
          }
        })
        .catch(error => console.error("기술 스택 요청 중 에러 발생:", error));
    } else if (type === "company") {
      customFetch("/company", { method: "GET" })
        .then(response => response.json())
        .then(data => {
          if (data.success && data.result) {
            setInterestOptions(data.result.data);
          } else {
            console.error("관심 기업 정보를 가져오지 못했습니다.", data);
          }
        })
        .catch(error => console.error("관심 기업 요청 중 에러 발생:", error));
    }
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setSchoolInput("");
    setInterestOptions([]);
  };

  // 모달에서 항목 선택 시 추가
  // - 기술 스택 추가: POST /api/member/tech-stack/{techStackName}
  // - 기업 추가: POST /api/member/company/{companyName}
  const addItem = (item) => {
    const value = typeof item === "string" ? item : item.name;
    if (modalType === "tech") {
      customFetch(`/api/member/tech-stack/${encodeURIComponent(value)}`, {
        method: "POST",
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            refreshMemberInfo();
          } else {
            console.error("기술 스택 추가 실패:", data);
          }
          closeModal();
        })
        .catch(error => {
          console.error("기술 스택 추가 요청 중 에러 발생:", error);
          closeModal();
        });
    } else if (modalType === "company") {
      customFetch(`/api/member/company/${encodeURIComponent(value)}`, {
        method: "POST",
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            refreshMemberInfo();
          } else {
            console.error("기업 추가 실패:", data);
          }
          closeModal();
        })
        .catch(error => {
          console.error("기업 추가 요청 중 에러 발생:", error);
          closeModal();
        });
    }
  };

  // 관심 기업 삭제 (DELETE /api/member/company/{companyName})
  const removeCompany = (companyName) => {
    customFetch(`/api/member/company/${encodeURIComponent(companyName)}`, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          refreshMemberInfo();
        } else {
          console.error("관심 기업 삭제 실패:", data);
        }
      })
      .catch(error => console.error("관심 기업 삭제 요청 중 에러 발생:", error));
  };

  // 기술 스택 삭제 함수
  const removeTechStack = (techStackName) => {
    customFetch(`/api/member/tech-stack/${encodeURIComponent(techStackName)}`, {
      method: "DELETE",
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          refreshMemberInfo();
        } else {
          console.error("기술 스택 삭제 실패:", data);
        }
      })
      .catch(error => console.error("기술 스택 삭제 요청 중 에러 발생:", error));
  };


  // 학교 입력 및 저장 (POST /api/member/school)
  const handleSchoolChange = (e) => {
    setSchoolInput(e.target.value);
  };

  const saveSchool = () => {
    if (schoolInput.trim() !== "") {
      customFetch("/api/member/school", {
        method: "POST",
        body: JSON.stringify({ name: schoolInput }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            refreshMemberInfo();
          } else {
            console.error("학교 저장 실패:", data);
          }
          closeModal();
        })
        .catch(error => {
          console.error("학교 저장 요청 중 에러 발생:", error);
          closeModal();
        });
    }
  };

  return (
    <div className="mypage-container">
      <h1>마이페이지</h1>
      <div className="profile">
        <h3>기본 정보</h3>
        <p><strong>이름:</strong> {name}</p>
        <p>
          <strong>학교:</strong>{" "}
          {school === "" ? (
            <button className="add-button" onClick={() => openModal("school")}>+</button>
          ) : (
            school
          )}
        </p>
      </div>

      <div className="tech-stack">
        <div className="section-header">
          <h3>관심 스택</h3>
          <button className="add-button" onClick={() => openModal("tech")}>+</button>
        </div>
        <ul>
          {techStack.map((tech, index) => (
            <li key={index}>
              <span>{tech.techStackName}</span>
              <button className="remove-button" onClick={() => removeTechStack(tech)}>-</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="companies">
        <div className="section-header">
          <h3>관심 기업</h3>
          <button className="add-button" onClick={() => openModal("company")}>+</button>
        </div>
        <ul>
          {companies.map((company, index) => (
            <li key={index}>
              <span>{company.companyName}</span>
              <button className="remove-button" onClick={() => removeCompany(company)}>-</button>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content popup" onClick={(e) => e.stopPropagation()}>
            {modalType === "school" ? (
              <>
                <h2>학교 입력</h2>
                <input
                  type="text"
                  placeholder="학교 이름을 입력하세요"
                  value={schoolInput}
                  onChange={handleSchoolChange}
                />
                <div className="modal-buttons">
                  <button className="save-button" onClick={saveSchool}>저장</button>
                  <button className="close-button" onClick={closeModal}>닫기</button>
                </div>
              </>
            ) : (
              <>
                <h2>
                  {modalType === "tech"
                    ? "추가할 기술 스택 선택"
                    : "추가할 기업 선택"}
                </h2>
                <div className="modal-buttons">
                  {interestOptions
                    .filter(item =>
                      modalType === "tech"
                        ? !techStack.includes(item.name)
                        : !companies.includes(item.name)
                    )
                    .map((item, index) => (
                      <button
                        key={index}
                        className="modal-button"
                        onClick={() => addItem(item)}
                      >
                        <div>{item.name}</div>
                        <div style={{ fontSize: '0.85em', color: '#555' }}>
                          {item.description}
                        </div>
                      </button>
                    ))}
                </div>
                <button className="close-button" onClick={closeModal}>닫기</button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
