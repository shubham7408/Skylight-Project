import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { useDateTimeRange } from "../DateTimeContext";
import { Box, Typography, Button, Modal } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const Shimmer = () => (
  <div className="shimmer-wrapper">
    <div className="shimmer"></div>
  </div>
);

const ShimmerRow = () => (
  <tr>
    {[...Array(3)].map((_, index) => (
      <td key={index} style={{ padding: "10px", border: "1px solid #ddd" }}>
        <Shimmer />
      </td>
    ))}
  </tr>
);

const ShimmerPieChart = () => (
  <div style={{ width: "200px", height: "200px", position: "relative" }}>
    <Shimmer />
  </div>
);

const NoDataMessage = ({ message }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "200px",
      width: "100%",
      border: "1px solid #ddd",
      borderRadius: "4px",
      backgroundColor: "#f9f9f9",
      color: "#666",
      fontSize: "18px",
      fontWeight: "bold",
    }}
  >
    {message}
  </Box>
);

const Provider = () => {
  const theme = useTheme();
  const { providerData, getProviderData, dateTimeRange } = useDateTimeRange();
  const [loading, setLoading] = useState(true);
  const [hoveredProvider, setHoveredProvider] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getProviderData();
      setLoading(false);
    };
    fetchData();
  }, [getProviderData, dateTimeRange]);

  const handleOpenModal = (provider) => {
    setSelectedProvider(provider);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProvider(null);
  };

  const pieChartData = providerData.map((provider) => ({
    name: provider.PROVIDER,
    value: provider.PACKET_LOSS,
  }));

  const COLORS = ["#FF0000", "#00C49F"];

  const handleRedirect = () => {

    navigate(`/failed`);

  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "60%", marginRight: "16px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: theme.palette.background.paper }}>
                  <th style={{
                    padding: "10px", textAlign: "left", background: "#c1c1c1", backgroundColor: theme.palette.primary.main,
                    color: theme.palette.secondary.main,
                  }}>Provider</th>
                  <th style={{
                    padding: "10px", textAlign: "left", background: "#c1c1c1", backgroundColor: theme.palette.primary.main,
                    color: theme.palette.secondary.main,
                  }}>Packet Loss %</th>
                  <th style={{
                    padding: "10px", textAlign: "left", background: "#c1c1c1", backgroundColor: theme.palette.primary.main,
                    color: theme.palette.secondary.main,
                  }}>Jitter</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <ShimmerRow key={index} />
                ))}
              </tbody>
            </table>
          </Box>
          <Box
            sx={{
              width: "40%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ShimmerPieChart />
          </Box>
        </Box>
      );
    } else if (providerData.length === 0) {
      return <NoDataMessage message="No records found" />;
    } else {
      return (
        <Box sx={{ display: "flex" }}>
          <Box sx={{ width: "60%", marginRight: "16px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: theme.palette.background.paper, border: "1px solid #ddd", }}>
                  <th style={{ padding: "10px", textAlign: "left", background: "#c1c1c1", border: "1px solid #ddd", }}>Provider</th>
                  <th style={{ padding: "10px", textAlign: "left", background: "#c1c1c1", border: "1px solid #ddd", }}>Packet Loss %</th>
                  <th style={{ padding: "10px", textAlign: "left", background: "#c1c1c1", }}>Jitter</th>
                </tr>
              </thead>
              <tbody>
                {providerData.map((provider, index) => (
                  <tr
                    key={index}
                    style={{
                      padding: "10px",
                      border: "1px solid #ddd",
                      textAlign: "center",
                    }}
                    onMouseEnter={() => setHoveredProvider(provider.PROVIDER)}
                    onMouseLeave={() => setHoveredProvider(null)}
                  >
                    <td style={{ padding: "10px", display: "flex", alignItems: "center" }}>
                      {provider.PROVIDER}
                      {hoveredProvider === provider.PROVIDER && (
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<SendIcon />}
                          sx={{ marginLeft: "8px" }}
                          onClick={() => handleOpenModal(provider)}
                        />
                      )}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "10px" }}>
                      {provider.PACKET_LOSS.toFixed(2)}%
                    </td>
                    <td style={{ padding: "10px" }}>
                      {provider.DELAY_VARIATION.toFixed(2)} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
          <Box
            sx={{
              width: "40%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PieChart width={200} height={200}>
              <Pie
                data={pieChartData}
                cx={100}
                cy={76}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Box>
        </Box>
      );
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        borderRadius: "8px",
        padding: "16px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h6"
        sx={{ marginBottom: "16px", fontWeight: "bold" }}
      >
        Provider Statistics
      </Typography>
      {renderContent()}

      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="provider-modal-title"
        aria-describedby="provider-modal-description"
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
          {selectedProvider && (
            <>
              <Typography id="provider-modal-title" variant="h6" component="h2">
                {selectedProvider.PROVIDER} Details
              </Typography>
              <Typography id="provider-modal-description" sx={{ mt: 2 }}>
                <strong>Packet Loss:</strong>{" "}
                {selectedProvider.PACKET_LOSS.toFixed(2)}%
                <br />
                <strong>Delay Variation:</strong>{" "}
                {selectedProvider.DELAY_VARIATION.toFixed(2)} ms
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

      <style jsx>{`
        .shimmer-wrapper {
          width: 100%;
          height: 20px;
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
    </Box>
  );
};

export default Provider;
