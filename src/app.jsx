import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./screen/login.jsx";
import Chungboong from "./screen/chungboong.jsx";
import Register from "./screen/register.jsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register/>}/>
                <Route path="/home" element={<Chungboong/>} />
            </Routes>
        </Router>
    );
};

export default App;