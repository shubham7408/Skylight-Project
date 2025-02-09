import React, { useState, useEffect } from "react";
import Sidebar from "../atoms/sideBar/Sidebar";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useDateTimeRange } from "../DateTimeContext";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

function Failed() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { consecutiveData, dateTimeRange, getFrequentFailed } =
    useDateTimeRange();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getFrequentFailed(dateTimeRange);
      setIsLoading(false);
    };

    fetchData();
  }, [getFrequentFailed, dateTimeRange]);

  const handleSessionClick = (session) => {
    navigate(`/sessionlist/sessions/${session.SESSION_NAME}`);
  };

  // Filter consecutiveData based on searchTerm
  const filteredData = consecutiveData.filter(item =>
    item.SESSION_NAME.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Box style={{ width: "50px", position: "fixed", height: "100vh" }}>
        <Sidebar />
      </Box>
      <div
        style={{
          fontSize: "22px",
          marginTop: "20px",
          marginLeft: "110px",
          fontWeight: "bold",
        }}
      >
        Most frequently failed
      </div>
      <div
        style={{
          fontSize: "18px",
          marginTop: "5px",
          marginLeft: "110px",
          fontWeight: "bold",
        }}
      >
        (&gt;1%) Packet Loss for 3 Consecutive Days: <span style={{color: "blue"}}>{filteredData.length} sessions</span>
      </div>

      {isLoading ? (
        <Typography
          variant="body1"
          style={{ marginLeft: "110px", marginTop: "20px" }}
        >
          Loading...
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          style={{ marginLeft: "110px", marginTop: "20px", width: "90%" }}
        >
          <Table style={{ borderCollapse: "collapse", width: "50%" }}>
            <TableHead
              style={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.secondary.main,
              }}
            >
              <TableRow>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    padding: "10px",
                    border: "1px solid #ddd",
                    position: "sticky",
                    zIndex: 1,
                    top: 0,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.secondary.main,
                  }}
                >
                  Session Name
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="🔍 Search Session"
                    style={{
                      marginLeft: "10px",
                      padding: "5px",
                      border: "1px solid #ddd",
                      borderRadius: "5px",
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.secondary.main,
                    }}
                  />
                </TableCell>
                <TableCell
                  style={{
                    textAlign: "center",
                    fontWeight: "bold",
                    padding: "10px",
                    border: "1px solid #ddd",
                    position: "sticky",
                    zIndex: 1,
                    top: 0,
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.secondary.main,
                  }}
                >
                  Provider
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    style={{
                      textAlign: "center",
                      padding: "10px",
                      border: "1px solid #ddd",
                    }}
                  >
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.1)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? "transparent" : "rgba(255, 255, 255, 0.1)")}
                      onClick={() => handleSessionClick(item)}
                    >
                      {item.SESSION_NAME}
                    </TableCell>
                    <TableCell
                      style={{
                        padding: "10px",
                        textAlign: "center",
                        border: "1px solid #ddd",
                      }}
                    >
                      {item.PROVIDER}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}

export default Failed;