import React from "react";
import Table2 from "../atoms/Table/Table2";
import { Box, Typography, useTheme } from "@mui/material";
import Sidebar from "../atoms/sideBar/Sidebar";

const SessionList = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          width: "50px",
          position: "fixed",
          height: "100vh",
          backgroundColor: theme.palette.background.default, // Use theme background
        }}
      >
        <Sidebar />
      </Box>
      <Box
        sx={{
          marginLeft: "70px",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
            color: theme.palette.text.primary,
          }}
        >
          Session List
        </Typography>
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            border: "1px solid",
            borderColor: theme.palette.divider,
            borderRadius: "8px",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.9)",
            padding: "20px",
          }}
        >
          <Table2
            columnsToShow={["Session Name", "Packet Loss %", "Jitter"]}
          />
        </Box>
      </Box>
    </>
  );
};

export default SessionList;
