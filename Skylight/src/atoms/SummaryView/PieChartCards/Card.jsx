import React from "react";
import { useTheme } from "@emotion/react";

const Card = ({ title, mainStat, subStat, color, onClick }) => {
  const theme = useTheme();
  return (
    <div
      style={{
        background: theme.palette.primary.main,
        width: "75px",
        height: "40px",
        padding: "5px",
        fontFamily: "Arial, sans-serif",
        borderRadius: "2px",
        position: "relative",
        overflow: "hidden",
        borderTopLeftRadius: "8px",
        borderBottomLeftRadius: "8px",
        marginBottom: "5px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "5px",
          backgroundColor: color,
          borderTopLeftRadius: "9px",
          borderBottomLeftRadius: "9px",
        }}
      />
      <div
        style={{
          padding: "0px 5px 4px 4px",
        }}
      >
        <div
          style={{
            color: theme.palette.secondary.main,
            fontSize: "9px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "3px",
          }}
        >
          <span>{title}</span>
          <span style={{ fontSize: "8px" }}>▼</span>
        </div>
        <div
          style={{
            color: theme.palette.secondary.main,
            fontSize: "9px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span>{subStat}</span>
          <span style={{ color: "#fff" }}>{mainStat}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
