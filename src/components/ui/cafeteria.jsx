import React, { useState, useEffect } from "react";
import "./css/cafeteria.css";
import customFetch from "./customFetch"; // customFetch 임포트

const Cafeteria = () => {
    const [dormMenu, setDormMenu] = useState(null);
    const [cafeteriaMenu, setCafeteriaMenu] = useState(null);
    const [error, setError] = useState(null);
    const [selectedDorm, setSelectedDorm] = useState("yangjinjae");
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [selectedCafeteria, setSelectedCafeteria] = useState("hanbit");
    const [selectedCafeteriaDate, setSelectedCafeteriaDate] = useState(new Date().toISOString().split("T")[0]);

    // ✅ `fetchDormMenu`에서 customFetch 사용
    const fetchDormMenu = async (dormitory = selectedDorm) => {
        try {
            const response = await customFetch(`/api/dorm/${dormitory}`, {
                method: "GET"
            });

            console.log("🚀 요청 URL:", response.url);

            const data = await response.json();
            console.log("✅ 기숙사 응답 데이터:", data);
            setDormMenu(data.result.data);
            setError(null);
        } catch (err) {
            console.error("❌ API 요청 실패:", err);
            setError(err.message);
            setDormMenu(null);
        }
    };

    // ✅ `fetchCafeteriaMenu`에서 customFetch 사용
    const fetchCafeteriaMenu = async (cafeteria = selectedCafeteria) => {
        try {
            const response = await customFetch(`/api/cafeteria/${cafeteria}`, {
                method: "GET"
            });

            const data = await response.json();
            console.log("✅ 학식 응답 데이터:", data);
            setCafeteriaMenu(data.result.data);
            setError(null);
        } catch (err) {
            console.error("❌ API 요청 실패:", err);
            setError(err.message);
            setCafeteriaMenu(null);
        }
    };

    useEffect(() => {
        fetchDormMenu("yangjinjae");
        fetchCafeteriaMenu("hanbit");
    }, []);

    const getMealIndex = (selectedDate) => {
        const today = new Date().toISOString().split("T")[0];
        const diffDays = Math.floor((new Date(selectedDate) - new Date(today)) / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    return (
        <div>
            <div className="cafeteria-container">
                <div className="selector-container">
                    <select value={selectedDorm} onChange={(e) => setSelectedDorm(e.target.value)}>
                        <option value="yangjinjae">양진재</option>
                        <option value="yangsungjae">양성재</option>
                        <option value="bongwan">본관</option>
                    </select>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                    <button onClick={() => fetchDormMenu(selectedDorm)}>조회</button>
                </div>
                <h2>📅 기숙사 식단표</h2>
                <div className="menu-box">
                    {error && <p className="error">{error}</p>}
                    {dormMenu && dormMenu[selectedDate] ? (
                        <div className="menu-content">
                            <h3>🍽 {selectedDate} 식단</h3>
                            <p><strong>아침:</strong> {dormMenu[selectedDate].아침 || "없음"}</p>
                            <p><strong>점심:</strong> {dormMenu[selectedDate].점심 || "없음"}</p>
                            <p><strong>저녁:</strong> {dormMenu[selectedDate].저녁 || "없음"}</p>
                        </div>
                    ) : (
                        <p className="info">📢 날짜와 기숙사를 선택 후 조회하세요.</p>
                    )}
                </div>
            </div>

            <div className="cafeteria-container">
                <div className="selector-container">
                    <select value={selectedCafeteria} onChange={(e) => setSelectedCafeteria(e.target.value)}>
                        <option value="hanbit">한빛</option>
                        <option value="byulbit">별빛</option>
                        <option value="enhasu">은하수</option>
                    </select>
                    <input type="date" value={selectedCafeteriaDate} onChange={(e) => setSelectedCafeteriaDate(e.target.value)} />
                    <button onClick={() => fetchCafeteriaMenu(selectedCafeteria)}>조회</button>
                </div>
                <h2>🥘 학생식당 식단표</h2>
                <div className="menu-box">
                    {error && <p className="error">{error}</p>}
                    {cafeteriaMenu ? (
                        <div className="menu-content">
                            <h3>🍛 {selectedCafeteriaDate} 식단</h3>
                            {Object.entries(cafeteriaMenu).map(([mealType, meals]) => (
                                <div key={mealType}>
                                    <p><strong>{mealType}:</strong></p>
                                    {meals.length > 0 && getMealIndex(selectedCafeteriaDate) < meals.length ? (
                                        <p>{Object.values(meals[getMealIndex(selectedCafeteriaDate)])[0]}</p>
                                    ) : (
                                        <p>메뉴 없음</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="info">📢 학생식당을 선택 후 조회하세요.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cafeteria;
