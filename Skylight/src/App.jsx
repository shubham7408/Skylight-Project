import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import Navigator from "./Navigation/Navigator";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import { DateTimeProvider } from "./DateTimeContext";

import Dashboard from "./pages/Dashboard";
import SessionData from "./pages/SessionData";

import DataRoutes from "./pages/DataRoutes";
import Failed from "./pages/Failed";
import Networks from "./pages/Networks";
import ProfileSetting from "./pages/ProfileSetting";
import Settings from "./pages/Settings";
import GenerateReport from "./pages/GenerateReport";
import Report from "./pages/Report";
import SessionList from "./components/SessionList";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [packetLossData, setPacketLossData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedValue, setSelectedValue] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!fileName) return;

      try {
        const response = await axios.get(`/File/${selectedValue}.json`);
        setPacketLossData(response.data);
      } catch (err) {
        setError("Error fetching data");
        console.error(err);
      }
    };

    fetchData();
  }, [fileName]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: darkMode ? "#000" : "#fff",
      },
      secondary: {
        main: darkMode ? "#fff" : "#000",
      },
    },
  });

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <>
      <DateTimeProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Navigator
            setSelectedValue={setSelectedValue}
            toggleDarkMode={toggleDarkMode}
            theme={theme}
          />
          <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/home" element={<Dashboard />}></Route>
            {/* <Route path="/sessions" element={<SessionData />}></Route> */}
            <Route path="/sessionlist" element={<SessionList />}></Route>
            <Route
              path="/sessionlist/sessions/:sessionName"
              element={<SessionData />}
            />
            <Route path="/dataroutes" element={<DataRoutes />}></Route>
            <Route path="/failed" element={<Failed />}></Route>
            <Route path="/networks" element={<Networks />}></Route>
            <Route path="/profile" element={<ProfileSetting />}></Route>
            <Route path="/settings" element={<Settings />}></Route>
            <Route path="/generate-report" element={<GenerateReport />}></Route>
            <Route path="/report" element={<Report />}></Route>
          </Routes>
        </ThemeProvider>
      </DateTimeProvider>
    </>
  );
}

export default App;
