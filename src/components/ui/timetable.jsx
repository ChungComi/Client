import React from "react";
import "./css/timetable.css"

const Timetable = () => {
    return (
        <div className="timetable">
            <div className="timetable-header">
                <span>시간표</span>
                <button>+</button>
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
                        <td>{9 + index}:00 {10 + index}:00</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Timetable;
