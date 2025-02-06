import React from "react";
import Calendar from "../components/ui/calendar.jsx";
import Timetable from "../components/ui/timetable.jsx";
import Cafeteria from "../components/ui/cafeteria.jsx";
import Announcement from "../components/ui/announcement.jsx";

const ChoongBoong = ()=>{
    return (
        <div>
            <Calendar></Calendar>
            <Timetable></Timetable>
            <Cafeteria></Cafeteria>
            <Announcement></Announcement>
        </div>
    )
}

export default ChoongBoong