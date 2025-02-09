import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import DateTimeRangeSelector from "./atoms/timeframe/Timeframe.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
