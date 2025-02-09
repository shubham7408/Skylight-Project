import React, { useCallback, useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
// import { FaSkyatlas } from "react-icons/fa";
import { GiRadarDish } from "react-icons/gi";
import { RiRadarLine } from "react-icons/ri";
import {
  IoSunnyOutline,
  IoMoonOutline,
  IoCalendarOutline,
  IoCloseOutline,
} from "react-icons/io5";
import DateTimeRangeSelector from "../atoms/timeframe/Timeframe";
import { useDateTimeRange } from "../DateTimeContext";

import logo from "../assets/logo.jpg";

const Navigator = ({ toggleDarkMode, setSelectedValue }) => {
  const theme = useTheme();
  const [openModal, setOpenModal] = useState(false);
  const { dateTimeRange } = useDateTimeRange();

  const sdate1 = new Date(dateTimeRange.sdate).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const edate1 = new Date(dateTimeRange.edate).toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  return (
    <>
      <header
        style={{
          height: "80px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0px 40px",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: theme.palette.primary.main,
          zIndex: 1000,
        }}
      >
        <NavLink to="/" style={{ textDecoration: "none" }} className="flex justify-end no-underline">
          {/*<h1
            style={{
              display: "flex",
              alignItems: "center",
              margin: 0,
              // color: theme.palette.secondary.main,
              color: "#024CAA",
              marginLeft: "30px",
              fontWeight: "bold"
            }}
          >
          </h1>*/}
          {/* <GiRadarDish style={{ marginRight: "10px" }} /> Beacon AI */}
          {/* <RiRadarLine style={{ marginRight: "10px", fontSize: "45px", color: "#FA4032" }} /> <span className="text-blue-500">Beacon AI</span> */}
          <img style={{ width: "200px", marginLeft: "20px" }} src={logo} alt="Beacon AI Logo" />
        </NavLink>
        <div
          style={{
            position: "absolute",
            right: "160px", 
            display: "flex",
            alignItems: "center",
            cursor: "default",
          }}
          onClick={() => setOpenModal((prev) => !prev)}
        >
          <div style={{ padding: "10px" }}>
            <h4>Selected date:</h4>
          </div>
          <div style={{ padding: "10px" }}>{sdate1}</div>
          To
          <div style={{ padding: "10px" }}>{edate1}</div>
        </div>

        <div style={{ display: "flex", width: "25vw", justifyContent: "end" }}>
          <div>
            <button
              onClick={() => setOpenModal((prev) => !prev)}
              style={{
                padding: "5px",
                borderRadius: "5px",
                width: "30px",
                cursor: "pointer",
                border: "none",
                fontSize: "20px",
                background: "transparent",
                color: theme.palette.secondary.main,
                marginRight: "15px",
              }}
              aria-label="Open calendar"
              aria-expanded={openModal}
            >
              <IoCalendarOutline />
            </button>
            {openModal && (
              <div
                style={{
                  position: "fixed",
                  background: theme.palette.background.paper,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  overflow: "auto",
                  borderRadius: "10px",
                  top: "80px",
                  right: "40px",
                  zIndex: 1001,
                }}
              >
                <button
                  onClick={() => setOpenModal(false)}
                  style={{
                    padding: "5px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    position: "absolute",
                    color: theme.palette.text.primary,
                  }}
                  aria-label="Close modal"
                >
                  <IoCloseOutline />
                </button>
                <DateTimeRangeSelector />
              </div>
            )}
          </div>
          <button
            onClick={toggleDarkMode}
            style={{
              padding: "5px",
              borderRadius: "5px",
              width: "30px",
              cursor: "pointer",
              border: "none",
              fontSize: "20px",
              background: "transparent",
              color: theme.palette.secondary.main,
            }}
            aria-label="Toggle dark mode"
          >
            {theme.palette.mode === "dark" ? (
              <IoSunnyOutline />
            ) : (
              <IoMoonOutline />
            )}
          </button>
        </div>
      </header>
      <div style={{ display: "flex", marginTop: "100px" }}></div>
    </>
  );
};

export default Navigator;
