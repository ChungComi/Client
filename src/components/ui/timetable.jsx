import React, { useState, useEffect } from "react";
import "./css/timetable.css";
import customFetch from "./customFetch.jsx";

const Timetable = () => {
  // 모달 관련 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [professor, setProfessor] = useState("");
  const [className, setClassName] = useState("");
  const [timetableData, setTimetableData] = useState([]); // 시간표 데이터 상태

  // 사용할 시간 목록 생성 (예: 08:00 ~ 19:00)
  const availableTimes = [];
  for (let hour = 8; hour <= 19; hour++) {
    const timeStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    availableTimes.push(timeStr);
  }

  // 서버에서 시간표 데이터를 불러오는 함수
  const fetchTimetable = async () => {
    try {
      const response = await customFetch("/time-table", { method: "GET" });
      const responseData = await response.json();
      console.log(responseData.result.data);
      setTimetableData(responseData.result.data); // 최신 시간표 상태 업데이트
    } catch (error) {
      alert(`시간표 불러오기 실패: ${error.message}`);
    }
  };

  // 컴포넌트가 마운트될 때 시간표 불러오기
  useEffect(() => {
    fetchTimetable();
  }, []);

  // 시작 시간이 선택되면 종료 시간 선택 목록은 시작 시간보다 늦은 시간만 표시
  const filteredEndTimes = selectedStartTime
    ? availableTimes.filter(
        (time) =>
          parseInt(time.substring(0, 2), 10) >
          parseInt(selectedStartTime.substring(0, 2), 10)
      )
    : availableTimes;

  // 추가 모달 열기/닫기 핸들러
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDay("");
    setSelectedStartTime("");
    setSelectedEndTime("");
    setProfessor("");
    setClassName("");
  };

  // 삭제 모달 열기/닫기 핸들러
  const openDeleteModal = () => {
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
  };

  const convertDayToEnum = (day) => {
    const days = {
      "월": "MON",
      "화": "TUE",
      "수": "WED",
      "목": "THU",
      "금": "FRI",
    };
    return days[day] || null;
  };

  const formatDateTime = (time) => {
    const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 (YYYY-MM-DD)
    return `${today}T${time}:00`; // LocalDateTime 형식 (YYYY-MM-DDTHH:mm:ss)
  };

  // 수업 등록 확인 버튼 핸들러
  const handleConfirm = async () => {
    if (!selectedDay || !selectedStartTime || !selectedEndTime || !professor || !className) {
      alert("요일, 시작 시간, 종료 시간, 교수명, 수업명을 모두 입력해주세요.");
      return;
    }

    if (parseInt(selectedEndTime.substring(0, 2), 10) <= parseInt(selectedStartTime.substring(0, 2), 10)) {
      alert("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }

    const requestData = {
      className,
      professor,
      dayOfWeek: convertDayToEnum(selectedDay),
      startTime: formatDateTime(selectedStartTime),
      endTime: formatDateTime(selectedEndTime),
    };

    try {
      const response = await customFetch("/time-table", {
        method: "POST",
        body: JSON.stringify(requestData),
      });

      const responseData = await response.json();

      if (!responseData.success) {
        throw new Error(responseData.result.message || "수업 등록 중 오류가 발생했습니다.");
      }

      alert(`수업 등록 성공! ID: ${responseData.result.data}`);
      fetchTimetable(); // 최신 시간표 불러오기
      closeModal(); // 모달 닫기
    } catch (error) {
      console.error("수업 등록 실패:", error);
      alert(`수업 등록 실패: ${error.message}`);
    }
  };

  // 수업 삭제 핸들러
  const handleDelete = async (timeTableId) => {
    if (!window.confirm("해당 수업을 삭제하시겠습니까?")) return;
    console.log(timeTableId)
    try {
      const response = await customFetch(`/time-table/${timeTableId}`, {
        method: "DELETE",
      });
      const responseData = await response.json();

      if (!responseData.success) {
        throw new Error(responseData.result.message || "수업 삭제 중 오류가 발생했습니다.");
      }

      alert("수업 삭제 성공!");
      fetchTimetable(); // 최신 시간표 불러오기
      closeDeleteModal(); // 모달 닫기
    } catch (error) {
      console.error("수업 삭제 실패:", error);
      alert(`수업 삭제 실패: ${error.message}`);
    }
  };

  return (
    <div className="timetable">
      <div className="timetable-header">
        <button onClick={openModal}>+</button>
        <button onClick={openDeleteModal}>-</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>시간</th>
            <th>월</th>
            <th>화</th>
            <th>수</th>
            <th>목</th>
            <th>금</th>
          </tr>
        </thead>
        <tbody>
          {availableTimes.map((time, rowIndex) => {
            return (
              <tr key={rowIndex}>
                <td>
                  {time} - {`${parseInt(time) + 1}:00`}
                </td>
                {["MON", "TUE", "WED", "THU", "FRI"].map((day) => {
                  const classData = timetableData.find((entry) => {
                    const startHour = parseInt(entry.startTime.split("T")[1].split(":")[0], 10);
                    const endHour = parseInt(entry.endTime.split("T")[1].split(":")[0], 10);
                    const currentHour = parseInt(time.split(":")[0], 10);
                    return entry.dayOfWeek === day && currentHour >= startHour && currentHour < endHour;
                  });

                  return (
                    <td key={day}>
                      {classData ? (
                        <>
                          {classData.className} <br />
                          {classData.professor}
                        </>
                      ) : (
                        ""
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* 수업 등록 모달 */}
      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>수업 시간 설정</h3>
            {/* 요일 선택 */}
            <div className="modal-section">
              <p>요일 선택:</p>
              <div className="day-buttons">
                {["월", "화", "수", "목", "금"].map((day) => (
                  <button
                    key={day}
                    className={selectedDay === day ? "selected" : ""}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            {/* 시작 및 종료 시간 선택 */}
            <div className="modal-section select-time">
              <div className="time-select">
                <p>시작 시간 선택:</p>
                <select value={selectedStartTime} onChange={(e) => setSelectedStartTime(e.target.value)}>
                  <option value="">-- 시작 시간 선택 --</option>
                  {availableTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
              <div className="time-select">
                <p>종료 시간 선택:</p>
                <select value={selectedEndTime} onChange={(e) => setSelectedEndTime(e.target.value)}>
                  <option value="">-- 종료 시간 선택 --</option>
                  {filteredEndTimes.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {/* 수업명 & 교수명 입력 */}
            <div className="modal-section">
              <p>수업명:</p>
              <input
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="수업명을 입력하세요"
              />
            </div>
            <div className="modal-section">
              <p>교수명:</p>
              <input
                type="text"
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                placeholder="교수명을 입력하세요"
              />
            </div>
            {/* 모달 액션 버튼 */}
            <div className="modal-actions">
              <button onClick={handleConfirm}>확인</button>
              <button onClick={closeModal}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* 수업 삭제 모달 */}
      {deleteModalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>수업 삭제</h3>
            <div className="delete-list">
              {timetableData.length > 0 ? (
                timetableData.map((entry, index) => (
                  <button key={`${entry.id}-${index}`} onClick={() => handleDelete(entry.id)}>
                    {entry.className} - {entry.professor}
                  </button>
                ))
              ) : (
                <p>삭제할 수업이 없습니다.</p>
              )}
            </div>
            <div className="modal-actions">
              <button onClick={closeDeleteModal}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timetable;
