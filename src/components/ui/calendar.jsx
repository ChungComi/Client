import React, { useState, useEffect } from "react";
import "./css/calendar.css";
import "./css/modal.css";
import customFetch from "./customFetch"; // customFetch 파일 import

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [content, setContent] = useState("");
  const [schedules, setSchedules] = useState([]); // 선택한 날짜의 일정 목록
  const [monthSchedules, setMonthSchedules] = useState([]); // 현재 달의 모든 일정 목록

  // 월 이동
  const changeMonth = (step) => {
    let newMonth = currentMonth + step;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // 선택한 날짜(예: "2025-02-10T00:00:00")에 해당하는 일정 조회
  const fetchSchedulesForDate = async (dateStr) => {
    try {
      const response = await customFetch(
          `/api/schedule/${encodeURIComponent(dateStr)}`,
          { method: "GET" }
      );
      const data = await response.json();
      // 응답 JSON 구조가 { success, code, result: { data: [...] } } 인 경우
      setSchedules(data.result?.data || []);
    } catch (error) {
      console.log("스케줄 조회 오류:", error.message);
      setSchedules([]);
    }
  };

  // 현재 달에 해당하는 모든 일정 조회 (GET /schedule/{month})
  const fetchAllSchedulesForMonth = async () => {
    try {
      const monthMap = {
        1: "JAN",
        2: "FEB",
        3: "MAR",
        4: "APR",
        5: "MAY",
        6: "JUN",
        7: "JUL",
        8: "AUG",
        9: "SEP",
        10: "OCT",
        11: "NOV",
        12: "DEC"
      };
      const monthEnum = monthMap[currentMonth + 1]; // 예: 2 -> "FEB"
      const response = await customFetch(`/schedule/${monthEnum}`, {
        method: "GET",
      });
      const data = await response.json();
      setMonthSchedules(data.result?.data || []);
      console.log("월별 일정:", data.result?.data || []);
    } catch (error) {
      console.log("월별 일정 조회 오류:", error.message);
      setMonthSchedules([]);
    }
  };

  // 날짜 버튼 클릭 시 모달 열기 및 해당 날짜 일정 조회
  const openModal = (day) => {
    const selected = { year: currentYear, month: currentMonth + 1, day };
    setSelectedDate(selected);
    setModalVisible(true);
    const formattedMonth = ("0" + selected.month).slice(-2);
    const formattedDay = ("0" + selected.day).slice(-2);
    const dateStr = `${selected.year}-${formattedMonth}-${formattedDay}T00:00:00`;
    fetchSchedulesForDate(dateStr);
  };

  // 달력 생성 (날짜에 일정이 있다면 파란 점을 표시)
  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    let days = [];
    // 해당 월 시작 전 빈 칸 추가
    for (let i = 0; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`}></td>);
    }
    // 날짜 버튼 생성 (해당 날짜에 일정이 있다면 파란 점을 표시)
    for (let day = 1; day <= daysInMonth; day++) {
      // monthSchedules는 현재 달의 모든 일정입니다.
      const hasSchedule = monthSchedules.some((schedule) => {
        const scheduleDate = new Date(schedule);
        return (
            scheduleDate.getFullYear() === currentYear &&
            scheduleDate.getMonth() === currentMonth &&
            scheduleDate.getDate() === day
        );
      });
      days.push(
          <td key={day}>
            <button onClick={() => openModal(day)}>
              {day}
              {hasSchedule && <span className="schedule-dot"></span>}
            </button>
          </td>
      );
    }
    // 7일씩 잘라서 행(tr)로 묶기
    let rows = [];
    for (let i = 0; i < days.length; i += 7) {
      rows.push(<tr key={i}>{days.slice(i, i + 7)}</tr>);
    }
    return rows;
  };

  // "저장" 버튼 클릭 시 POST 요청 보내기
  const handleSaveSchedule = async () => {
    if (!selectedDate) {
      alert("날짜를 선택해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }
    const formattedMonth = ("0" + selectedDate.month).slice(-2);
    const formattedDay = ("0" + selectedDate.day).slice(-2);
    const dateStr = `${selectedDate.year}-${formattedMonth}-${formattedDay}T00:00:00`;
    const payload = {
      content: content,
      date: dateStr,
    };
    try {
      const response = await customFetch("/schedule", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      alert("일정이 저장되었습니다!");
      // 저장 후 해당 날짜와 현재 달의 일정 목록 갱신
      fetchSchedulesForDate(dateStr);
      fetchAllSchedulesForMonth();
    } catch (error) {
      alert("저장 실패: " + error.message);
      console.log(error.message);
    }
    // 입력값 초기화 (모달은 그대로 유지)
    setContent("");
  };

  // 등록된 일정 삭제 - schedule.id를 이용하여 DELETE 요청 보내기
  const handleDeleteSchedule = async (scheduleId) => {
    try {
      const response = await customFetch(`/schedule/${scheduleId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        alert("일정이 삭제되었습니다!");
        // 삭제 후 선택한 날짜와 월별 일정 목록 갱신
        if (selectedDate) {
          const formattedMonth = ("0" + selectedDate.month).slice(-2);
          const formattedDay = ("0" + selectedDate.day).slice(-2);
          const dateStr = `${selectedDate.year}-${formattedMonth}-${formattedDay}T00:00:00`;
          fetchSchedulesForDate(dateStr);
        }
        fetchAllSchedulesForMonth();
      } else {
        alert("삭제 실패: " + data.result.message);
      }
    } catch (error) {
      alert("삭제 중 오류 발생: " + error.message);
    }
  };

  // 컴포넌트 마운트 및 currentMonth 변경 시, 월별 일정 조회
  useEffect(() => {
    fetchAllSchedulesForMonth();
  }, [currentMonth]);

  return (
      <div className="calendar">
        <div className="calendar-header">
        <span className="prev" onClick={() => changeMonth(-1)}>
          &#9665;
        </span>
          <h3>
            {currentYear}년 {currentMonth + 1}월
          </h3>
          <span className="next" onClick={() => changeMonth(1)}>
          &#9655;
        </span>
        </div>
        <table>
          <thead>
          <tr>
            <th>일</th>
            <th>월</th>
            <th>화</th>
            <th>수</th>
            <th>목</th>
            <th>금</th>
            <th>토</th>
          </tr>
          </thead>
          <tbody>{generateCalendar()}</tbody>
        </table>

        {/* 모달 창 */}
        {modalVisible && (
            <div className="modal-overlay">
              <div className="modal">
                <div className="modal-header">
                  <h3>
                    {selectedDate?.year}년 {selectedDate?.month}월 {selectedDate?.day}일 일정 등록
                  </h3>
                </div>
                <div className="modal-body">
                  {/* 입력칸과 조회된 일정 목록을 나란히 표시 */}
                  <div className="modal-body-content" style={{ display: "flex", gap: "1rem" }}>
                    {/* 일정 입력 영역 */}
                    <div className="input-section" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                  <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="일정 내용을 입력하세요..."
                      style={{ width: "100%", height: "150px", marginBottom: "0.5rem" }}
                  ></textarea>
                      <button onClick={handleSaveSchedule}>저장</button>
                    </div>
                    {/* 조회된 일정 목록 영역 */}
                    <div className="schedule-list" style={{ flex: 1 }}>
                      <h4>등록된 일정</h4>
                      {schedules.length === 0 ? (
                          <p>등록된 일정이 없습니다.</p>
                      ) : (
                          <ul>
                            {schedules.map((schedule, index) => (
                                <li
                                    key={index}
                                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                                >
                                  <span>{schedule.content}</span>
                                  <button
                                      onClick={() => handleDeleteSchedule(schedule.id)}
                                      className="delete-btn"
                                  >
                                    -
                                  </button>
                                </li>
                            ))}
                          </ul>
                      )}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                      onClick={() => {
                        setModalVisible(false);
                        setContent("");
                      }}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default Calendar;