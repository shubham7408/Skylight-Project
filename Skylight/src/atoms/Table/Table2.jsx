import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@mui/material/styles";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import { BsArrowDownUp } from "react-icons/bs";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";
import { useDateTimeRange } from "../../DateTimeContext";

// Shimmer effect component
const Shimmer = () => {
  return (
    <div className="shimmer-wrapper">
      <div className="shimmer"></div>
    </div>
  );
};

const Table2 = ({ columnsToShow = [] }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Descending");
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredSession, setHoveredSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { sessions, listSessions, dateTimeRange } = useDateTimeRange();
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    listSessions().then(() => {
      setIsLoading(false);
    });
  }, [listSessions]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5677777000);
    return () => clearInterval(intervalId);
  }, [fetchData, dateTimeRange]);

  useEffect(() => {
    let data = [...sessions];

    if (searchTerm !== "") {
      data = data.filter((session) =>
        session.SESSION_NAME.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder === "Ascending") {
      data.sort((a, b) => a.PACKET_LOSS - b.PACKET_LOSS);
    } else if (sortOrder === "Descending") {
      data.sort((a, b) => b.PACKET_LOSS - a.PACKET_LOSS);
    }

    setFilteredData(data);
  }, [searchTerm, sortOrder, sessions]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) =>
      prevOrder === "Ascending" ? "Descending" : "Ascending"
    );
  };

  const handleSessionClick = (session) => {
    navigate(`/sessionlist/sessions/${session.SESSION_NAME}`);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <h3 style={{ marginLeft: "20px", width: "100%", marginBottom: "0" }}>
          Session Data Table
        </h3>
        <div
          style={{
            overflowX: "auto",
            maxHeight: "80%",
            maxWidth: "98%",
            marginLeft: "10px",
            marginTop: "10px",
          }}
        >
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead
              style={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.secondary.main,
              }}
            >
              <tr>
                {columnsToShow.includes("Session Name") && (
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      position: "sticky",
                      zIndex: 1,
                      top: 0,
                      background: "#c1c1c1",
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
                  </th>
                )}
                {columnsToShow.includes("Packet Loss %") && (
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      position: "sticky",
                      zIndex: 10,
                      top: 0,
                      background: "#c1c1c1",
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.secondary.main,
                    }}
                  >
                    Packet Loss %
                    <IconButton
                      onClick={toggleSortOrder}
                      style={{ marginLeft: "10px" }}
                    >
                      <BsArrowDownUp />
                    </IconButton>
                  </th>
                )}
                {columnsToShow.includes("Jitter") && (
                  <th
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      position: "sticky",
                      zIndex: 1,
                      top: 0,
                      background: "#c1c1c1",
                      backgroundColor: theme.palette.primary.main,
                      color: theme.palette.secondary.main,
                    }}
                  >
                    Jitter
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={columnsToShow.length}
                    style={{ padding: "10px", border: "1px solid #ddd" }}
                  >
                    <Shimmer />
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columnsToShow.length}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                  >
                    No records found
                  </td>
                </tr>
              ) : (
                filteredData.map((session) => (
                  <tr
                    key={session.SESSION_NAME}
                    onClick={() => handleSessionClick(session)}
                    onMouseEnter={() => setHoveredSession(session.SESSION_NAME)}
                    onMouseLeave={() => setHoveredSession(null)}
                    style={{
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                    }}
                  >
                    {columnsToShow.includes("Session Name") && (
                      <td
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {session.SESSION_NAME}
                        {hoveredSession === session.SESSION_NAME && (
                          <Button
                            style={{ margin: "0" }}
                            variant="contained"
                            size="small"
                            endIcon={<SendIcon />}
                          />
                        )}
                      </td>
                    )}
                    {columnsToShow.includes("Packet Loss %") && (
                      <td
                        style={{
                          padding: "10px",
                          border: "1px solid #ddd",
                          position: "relative",
                          overflow: "hidden",
                        }}
                      >
                        {(() => {
                          const packetLossValue = Number(session.PACKET_LOSS);
                          const cappedPacketLoss = Math.min(
                            packetLossValue,
                            100
                          );

                          if (
                            session.PACKET_LOSS !== null &&
                            session.PACKET_LOSS !== undefined &&
                            !isNaN(packetLossValue)
                          ) {
                            return (
                              <>
                                <div
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    width: `${Math.min(packetLossValue, 100)}%`,
                                    backgroundColor: "lightblue",
                                    transition:
                                      "width 0.5s ease-out, background-color 0.3s",
                                    zIndex: 0,
                                  }}
                                />
                                <span
                                  style={{
                                    position: "relative",
                                    zIndex: 1,
                                    fontWeight: "bold",
                                    textShadow:
                                      "0px 0px 2px rgba(255,255,255,0.5)",
                                  }}
                                >
                                  {cappedPacketLoss.toFixed(2)}%
                                </span>
                              </>
                            );
                          } else {
                            return (
                              <span style={{ color: "red" }}>Invalid Data</span>
                            );
                          }
                        })()}
                      </td>
                    )}
                    {columnsToShow.includes("Jitter") && (
                      <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                        {session.DELAY_VARIATION.toFixed(2)} ms
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="session-modal-title"
        aria-describedby="session-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {selectedSession && (
            <>
              <Typography id="session-modal-title" variant="h6" component="h2">
                {selectedSession.source_city} to {selectedSession.SESSION_NAME} Details
              </Typography>
              <Typography id="session-modal-description" sx={{ mt: 2 }}>
                <strong>Packet Loss Percentage:</strong>{" "}
                {(selectedSession.PACKET_LOSS * 100).toFixed(2)}%
                <br />
                <strong>Jitter:</strong>{" "}
                {selectedSession.DELAY_VARIATION.toFixed(2)} ms
              </Typography>
            </>
          )}
        </Box>
      </Modal>
      <style jsx>{`
        .shimmer-wrapper {
          width: 100%;
          height: 40px;
          position: relative;
          overflow: hidden;
        }
        .shimmer {
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            #f0f0f0 25%,
            #e0e0e0 50%,
            #f0f0f0 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </>
  );
};

export default Table2;
