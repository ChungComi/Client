import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ navigate 추가
import Calendar from "../components/ui/calendar.jsx";
import Timetable from "../components/ui/timetable.jsx";
import Announcement from "../components/ui/announcement.jsx";
import "../components/ui/css/choongboong.css"; // ✅ CSS 파일 불러오기

const ChoongBoong = () => {
    const navigate = useNavigate(); // ✅ useNavigate 추가

    return (
        <div>
            <Calendar />
            <Timetable />
            <button className="cafeteria-button" onClick={() => navigate("/cafeteria")}>
                식단 보기
            </button>
            <Announcement />
        </div>
    );
};

export default ChoongBoong;
