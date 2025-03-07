import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.jsx";
import "./components/ui/css/index.css";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.createRoot(document.querySelector("#app")).render(
    <React.StrictMode>
        <Router>
            <App/>
        </Router>
    </React.StrictMode>
);
