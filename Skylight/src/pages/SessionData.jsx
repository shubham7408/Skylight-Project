import React, { useState, useEffect, useMemo, useRef } from "react";
import { Map } from "react-map-gl";
import DeckGL from "@deck.gl/react";
import { LineLayer, IconLayer } from "@deck.gl/layers";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "../atoms/sideBar/Sidebar";
import { Box, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useParams } from "react-router-dom";
import { useDateTimeRange } from "../DateTimeContext";
import { useTheme } from "@mui/material/styles";

const MAPBOX_TOKEN = "pk.eyJ1Ijoic2F1cmFiaHBhdGlsMTcyMTk5OSIsImEiOiJjbTBvMm9kbDQwNGc5Mmxxc3gxdG9kdjZtIn0.y0md-sfeNDrW8dDpDOPP2g";

function SessionData() {
  const { sessionName } = useParams();
  const { allData, getAllData, dateTimeRange, getSpecificSessionBurst } = useDateTimeRange();

  const [sessionData, setSessionData] = useState(null);
  const [graphData1, setGraphData1] = useState([]);
  const [graphData2, setGraphData2] = useState([]);
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4,
    pitch: 45,
    bearing: 0,
  });
  const [packetPosition, setPacketPosition] = useState(0);
  const animationRef = useRef(null);
  const theme = useTheme();

  useEffect(() => {
    getAllData();
  }, [dateTimeRange]);

  const cityDetails = allData.find(
    (item) => item.SESSION_NAME === sessionData?.SESSION_NAME
  );

  const mapStyle = theme.palette.mode === 'dark'
    ? "mapbox://styles/mapbox/dark-v10"
    : "mapbox://styles/mapbox/light-v10";

  useEffect(() => {
    const fetchSessionData = async () => {
      if (!sessionName) return; // Avoid fetching if sessionName is not available

      try {
        const data = await getSpecificSessionBurst(sessionName);
        if (!data.length) return; // Handle case where no data is returned

        setSessionData(data[0]);

        const metrics = data[0]?.METRICS || [];
        const formattedGraphData1 = metrics.map((metric) => ({
          time: metric.interval_start,
          delay_variation: metric.delay_variation,
        }));
        const formattedGraphData2 = metrics.map((metric) => ({
          time: metric.interval_start,
          delay_max: metric.delay_max,
        }));

        setGraphData1(formattedGraphData1);
        setGraphData2(formattedGraphData2);
      } catch (error) {
        console.error("Error fetching session data:", error);
      }
    };

    fetchSessionData();
  }, [sessionName, dateTimeRange, getSpecificSessionBurst]);
  // Add getSpecificSessionBurst to dependencies

  useEffect(() => {
    const animate = () => {
      setPacketPosition((prev) => (prev + 0.01) % 1);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const layers = useMemo(() => {
    if (!sessionData) return [];

    const targetCoordinates = [
      parseFloat(sessionData.LONGITUDE),
      parseFloat(sessionData.LATITUDE),
    ];

    const DELHI_COORDINATES = [
      parseFloat(cityDetails.SOURCE_LONGITUDE),
      parseFloat(cityDetails.SOURCE_LATITUDE)
    ];

    const serverIcon = [
      {
        position: DELHI_COORDINATES,
        icon: { url: 'https://static-00.iconduck.com/assets.00/server-icon-2048x2048-7fmqupyo.png', width: 20, height: 20 },
      },
      {
        position: targetCoordinates,
        icon: { url: 'https://images.vexels.com/content/131977/preview/router-icon-3c58d9.png', width: 100, height: 100 },
      },
    ];

    // Calculate the position of the moving packet
    const packetLongitude = DELHI_COORDINATES[0] + (targetCoordinates[0] - DELHI_COORDINATES[0]) * packetPosition;
    const packetLatitude = DELHI_COORDINATES[1] + (targetCoordinates[1] - DELHI_COORDINATES[1]) * packetPosition;

    return [
      new LineLayer({
        id: "line-layer",
        data: [
          {
            source: DELHI_COORDINATES,
            target: targetCoordinates,
          },
        ],
        getSourcePosition: d => d.source,
        getTargetPosition: d => d.target,
        getColor: [0, 120, 255],
        getWidth: 3,
      }),
      new IconLayer({
        id: 'server-icon-layer',
        data: serverIcon,
        getIcon: d => ({ url: d.icon.url, width: d.icon.width, height: d.icon.height }),
        getPosition: d => d.position,
        sizeScale: 5,
        getSize: d => 5,
        getColor: [255, 255, 255],
      }),
      new IconLayer({
        id: 'packet-icon-layer',
        data: [{
          position: [packetLongitude, packetLatitude],
          icon: { url: 'https://cdn-icons-png.flaticon.com/512/2521/2521610.png', width: 25, height: 25 },
        }],
        getIcon: d => d.icon,
        getPosition: d => d.position,
        sizeScale: 10,
        getSize: 3,
        getColor: [0, 255, 0],
      }),
    ];
  }, [sessionData, packetPosition]);

  if (!sessionData || !cityDetails) {
    return (
      <div style={{ textAlign: "center", marginTop: "20vh", fontSize: "20px", fontWeight: "bold" }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      <Box style={{ width: "50px", position: "fixed", height: "100vh" }}>
        <Sidebar />
      </Box>
      <div style={{ display: "flex", height: "100vh", marginLeft: "60px", padding: "0" }}>
        <div style={{ width: "calc(100% - 30px)", display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ height: "50%", width: "100%", marginTop: "-18px", position: "relative" }}>
            <DeckGL initialViewState={viewState} controller={true} layers={layers}>
              <Map
                mapboxAccessToken={MAPBOX_TOKEN}
                style={{ width: "50%", height: "50%", position: "absolute" }}
                mapStyle={mapStyle}
              />
            </DeckGL>
            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: 20,
                padding: 2,
                backgroundColor: theme.palette.background.paper,
                borderRadius: "8px",
                boxShadow: 3,
                zIndex: 10,
              }}
            >
              <Typography variant="h6">{cityDetails.SOURCE_CITY} to {cityDetails.CITY}:</Typography>
              <Typography><strong>Session Name:</strong> {cityDetails.SESSION_NAME}</Typography>
              <Typography><strong>Source IP:</strong> {cityDetails.SOURCE_IP}</Typography>
              <Typography><strong>Destination IP:</strong> {cityDetails.DESTINATION_IP}</Typography>
              <Typography>
                <strong>Total Lost Packets:</strong> {cityDetails.TOTAL_RXPKTS === 0
                  ? 0
                  : cityDetails.TOTAL_LOSTPKTS > cityDetails.TOTAL_RXPKTS
                    ? cityDetails.TOTAL_RXPKTS
                    : cityDetails.TOTAL_LOSTPKTS}
              </Typography>
              <Typography><strong>Total Sent Packets:</strong> {cityDetails.TOTAL_RXPKTS}</Typography>
              <Typography
                style={{
                  background:
                    cityDetails.PACKET_LOSS > 5
                      ? "#FF7F7F"
                      : cityDetails.PACKET_LOSS >= 1
                        ? "#ff9248"
                        : "#90EE90",
                  padding: "2px",
                  borderRadius: "4px",
                }}
              >
                <strong>Packet Loss %:</strong>{" "}
                {cityDetails.PACKET_LOSS > 100
                  ? 100
                  : cityDetails.PACKET_LOSS.toFixed(2)}
                %
              </Typography>

              <Typography>
                <strong>Average Delay:</strong> {cityDetails.AVG_DELAY} ms.
              </Typography>
              <Typography><strong>Jitter:</strong> {cityDetails.DELAY_VARIATION} ms.</Typography>
              <Typography>
                <strong>Category:
                  {cityDetails.PACKET_LOSS > 5 ? (
                    <span style={{ color: 'red' }}>Critical</span>
                  ) : cityDetails.PACKET_LOSS >= 1 ? (
                    <span style={{ color: 'orange' }}>Major</span>
                  ) : (
                    <span style={{ color: 'green' }}>Minor</span>
                  )}
                </strong>
              </Typography>
            </Box>
          </div>
          <div style={{ flexGrow: 1, display: "flex", gap: "20px", height: "50vh", width: "100%", overflow: "auto" }}>
            <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: "20px" }}>
              <div style={{ fontSize: "20px", marginLeft: "30px", fontWeight: "bold" }}>
                Performance Metrics
              </div>
              <div style={{ fontSize: "15px", marginLeft: "30px", fontWeight: "bold" }}>
                Jitter (p95)
              </div>
              <div style={{ flexGrow: 1, width: "100%", height: "50%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData1}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="delay_variation"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div style={{ fontSize: "15px", marginLeft: "30px", fontWeight: "bold" }}>
                Delay (max)
              </div>
              <div style={{ flexGrow: 1, width: "100%", height: "50%" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData2}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="delay_max"
                      stroke="#82ca9d"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SessionData;
