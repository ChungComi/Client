import React, { useState } from "react";
import "./css/timetable.css";

const Timetable = () => {
  // 모달 관련 상태
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");

  // 사용할 시간 목록 생성 (예: 06:00 ~ 19:00)
  const availableTimes = [];
  for (let hour = 6; hour <= 19; hour++) {
    const timeStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    availableTimes.push(timeStr);
  }

  // 시작 시간이 선택되면 종료 시간 선택 목록은 시작 시간보다 늦은 시간만 표시
  const filteredEndTimes = selectedStartTime
      ? availableTimes.filter(
          (time) =>
              parseInt(time.substring(0, 2), 10) >
              parseInt(selectedStartTime.substring(0, 2), 10)
      )
      : availableTimes;

  // 모달 열기/닫기 핸들러
  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDay("");
    setSelectedStartTime("");
    setSelectedEndTime("");
  };

  // 확인 버튼 핸들러
  const handleConfirm = () => {
    if (!selectedDay || !selectedStartTime || !selectedEndTime) {
      alert("요일, 시작 시간, 종료 시간을 모두 선택해주세요.");
      return;
    }
    if (
        parseInt(selectedEndTime.substring(0, 2), 10) <=
        parseInt(selectedStartTime.substring(0, 2), 10)
    ) {
      alert("종료 시간은 시작 시간보다 늦어야 합니다.");
      return;
    }
    alert(
        `선택한 일정: ${selectedDay}요일, ${selectedStartTime} ~ ${selectedEndTime}`
    );
    // 추가 로직(예: 서버 전송 등)을 여기에 추가하세요.
    closeModal();
  };

  return (
      <div className="timetable">
        <div className="timetable-header">
          <button onClick={openModal}>+</button>
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
          {[...Array(10)].map((_, index) => (
              <tr key={index}>
                <td>
                  {9 + index}:00 - {10 + index}:00
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
          ))}
          </tbody>
        </table>

        {/* 모달 */}
        {modalVisible && (
            <div className="modal-overlay">
                <div className="modal-content">
                  <h3>수업 시간 설정</h3>
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
                  <div className="modal-section select-time">
                    <div className="time-select">
                      <p>시작 시간 선택:</p>
                      <select
                          value={selectedStartTime}
                          onChange={(e) => {
                            setSelectedStartTime(e.target.value);
                            if (
                                selectedEndTime &&
                                parseInt(e.target.value.substring(0, 2), 10) >=
                                parseInt(selectedEndTime.substring(0, 2), 10)
                            ) {
                              setSelectedEndTime("");
                            }
                          }}
                      >
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
                      <select
                          value={selectedEndTime}
                          onChange={(e) => setSelectedEndTime(e.target.value)}
                      >
                        <option value="">-- 종료 시간 선택 --</option>
                        {filteredEndTimes.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button onClick={handleConfirm}>확인</button>
                    <button onClick={closeModal}>취소</button>
                  </div>
                </div>
            </div>
        )}
      </div>
  );
};

export default Timetable;
