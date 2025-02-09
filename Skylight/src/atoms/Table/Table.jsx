import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  TextField,
} from "@mui/material";
import { BsArrowDownUp } from "react-icons/bs";
import { useDateTimeRange } from "../../DateTimeContext";

const Shimmer = () => (
  <div className="shimmer-wrapper">
    <div className="shimmer"></div>
  </div>
);

const Table = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("Descending");
  const [selectedCity, setSelectedCity] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredCity, setHoveredCity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const { allData, getAllData, dateTimeRange } = useDateTimeRange();
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    getAllData().then(() => {
      setIsLoading(false);
    });
  }, [getAllData]);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5677777000); // Refresh every ~65 days
    return () => clearInterval(intervalId);
  }, [fetchData, dateTimeRange]);

  useEffect(() => {
    let data = [...allData];

    // Filter based on destination city name
    if (searchTerm !== "") {
      data = data.filter((city) =>
        city.CITY.toLowerCase().includes(searchTerm.toLowerCase()) || city.SOURCE_CITY.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort based on packet loss
    data.sort((a, b) => {
      const aLoss = Number(a.PACKET_LOSS);
      const bLoss = Number(b.PACKET_LOSS);
      return sortOrder === "Ascending" ? aLoss - bLoss : bLoss - aLoss;
    });

    setFilteredData(data);
  }, [allData, searchTerm, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) =>
      prevOrder === "Ascending" ? "Descending" : "Ascending"
    );
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleRedirect = () => {
    if (selectedCity) {
      navigate(`/sessionlist/sessions/${selectedCity.SESSION_NAME}`);
    }
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        <h3 style={{ marginLeft: "20px", marginBottom: "0" }}>
          Ping Loss Test
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Search City"
            style={{
              width: "20%",
              marginLeft: "10px",
              padding: "5px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.secondary.main,
            }}
          />
        </h3>
        <div
          style={{
            overflowX: "auto",
            maxHeight: "80%",
            maxWidth: "100%",
            marginLeft: "10px",
            marginTop: "10px",
          }}
        >
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead
              style={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.secondary.main,
                lineHeight: "8px",
              }}
            >
              <tr>
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
                  Source City
                </th>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    position: "sticky",
                    zIndex: 1,
                    top: 1,
                    background: "#c1c1c1",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.secondary.main,
                  }}
                >
                  Destination City
                </th>
                <th
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    position: "sticky",
                    zIndex: 1,
                    top: 0,
                    lineHeight: "20px",
                    background: "#c1c1c1",
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.secondary.main,
                  }}
                >
                  Source IP
                </th>
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
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{ padding: "10px", border: "1px solid #ddd" }}
                  >
                    <Shimmer />
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
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
                filteredData.map((city, i) => (
                  <tr
                    key={city.SESSION_NAME + i}
                    onClick={() => handleCityClick(city)}
                    onMouseEnter={() => setHoveredCity(city.CITY)}
                    onMouseLeave={() => setHoveredCity(null)}
                    style={{
                      cursor: "pointer",
                      transition: "background-color 0.3s",
                      backgroundColor:
                        hoveredCity === city.CITY ? "#f0f0f0" : "transparent",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      {city.CITY}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {city.SOURCE_CITY}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {city.SOURCE_IP}
                    </td>
                    <td
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      {(() => {
                        const packetLossValue = Number(city.PACKET_LOSS);
                        const cappedPacketLoss = Math.min(packetLossValue, 100);

                        if (
                          city.PACKET_LOSS !== null &&
                          city.PACKET_LOSS !== undefined &&
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
                                  width: `${cappedPacketLoss}%`,
                                  backgroundColor: "lightblue",
                                  transition:
                                    "width 0.5s ease-out, background-color 0.3s",
                                  animation:
                                    hoveredCity === city.CITY
                                      ? "pulse 1.5s infinite"
                                      : "none",
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
        aria-labelledby="city-modal-title"
        aria-describedby="city-modal-description"
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
          {selectedCity && (
            <>
              <Typography id="city-modal-title" variant="h6" component="h2">
                {selectedCity.SOURCE_CITY} to {selectedCity.CITY} Details
              </Typography>
              <Typography id="city-modal-description" sx={{ mt: 2 }}>
                <strong>Session Name:</strong> {selectedCity.SESSION_NAME}
                <br />
                <strong>Source IP:</strong> {selectedCity.SOURCE_IP}
                <br />
                <strong>Destination IP:</strong> {selectedCity.DESTINATION_IP}
                <br />
                <strong>Packet Loss:</strong>{" "}
                {selectedCity.PACKET_LOSS > 100
                  ? 100
                  : selectedCity.PACKET_LOSS.toFixed(2)}
                %
                <br />
                <strong>Average Delay:</strong>{" "}
                {selectedCity.AVG_DELAY.toFixed(4)} seconds
                <br />
                <strong>Jitter:</strong> {selectedCity.DELAY_VARIATION} ms.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRedirect}
                sx={{ mt: 3 }}
              >
                More Details ↗
              </Button>
            </>
          )}
        </Box>
      </Modal>

      <style jsx global>{`
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
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default Table;
