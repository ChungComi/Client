import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/ui/app.jsx";
import "./components/ui/css/index.css"

ReactDOM.createRoot(document.querySelector("#app")).render(
    <React.StrictMode>
        <div>
            <App></App>
        </div>
    </React.StrictMode>
);
