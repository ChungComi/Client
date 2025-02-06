import React, { useState } from "react";
import "./css/calendar.css";

const Calendar = () => {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());

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

    const generateCalendar = () => {
        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        let days = [];

        for (let i = 0; i < firstDay; i++) {
            days.push(<td key={`empty-${i}`}></td>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(
                <td key={day}>
                    <button onClick={() => alert(`${currentYear}년 ${currentMonth + 1}월 ${day}일 선택`)}>
                        {day}
                    </button>
                </td>
            );
        }

        let rows = [];
        for (let i = 0; i < days.length; i += 7) {
            rows.push(<tr key={i}>{days.slice(i, i + 7)}</tr>);
        }

        return rows;
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <span className="prev" onClick={() => changeMonth(-1)}>&#9665;</span>
                <h2>{currentYear}년 {currentMonth + 1}월</h2>
                <span className="next" onClick={() => changeMonth(1)}>&#9655;</span>
            </div>
            <table>
                <thead>
                <tr>
                    <th>일</th><th>월</th><th>화</th><th>수</th><th>목</th><th>금</th><th>토</th>
                </tr>
                </thead>
                <tbody>
                {generateCalendar()}
                </tbody>
            </table>
        </div>
    );
};

export default Calendar;
