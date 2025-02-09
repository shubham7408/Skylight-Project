import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Map } from "react-map-gl";
import {
  DeckGL,
  ArcLayer,
  LineLayer,
  ScatterplotLayer,
  PathLayer,
  log,
} from "deck.gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  IoSunnyOutline,
  IoMoonOutline,
  IoChevronForward,
  IoRemoveOutline,
} from "react-icons/io5";

import { useDateTimeRange } from "../DateTimeContext";

const MAPBOX_TOKEN =
  "pk.eyJ1Ijoic2F1cmFiaHBhdGlsMTcyMTk5OSIsImEiOiJjbTBvMm9kbDQwNGc5Mmxxc3gxdG9kdjZtIn0.y0md-sfeNDrW8dDpDOPP2g";

const MapComponent3 = () => {
  const { allData, getAllData, dateTimeRange } = useDateTimeRange();
  const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/light-v10");
  const [hoveredArc, setHoveredArc] = useState(null);
  const [filter, setFilter] = useState("all");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [isFilterPanelOpen2, setIsFilterPanelOpen2] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);
  const [clickedArc, setClickedArc] = useState(null);
  const [straightArc, setStraightArc] = useState(true);
  const [viewState, setViewState] = useState({
    longitude: 78.9629,
    latitude: 20.5937,
    zoom: 4,
    pitch: 45,
    bearing: 0,
  });
  const [citiesData, setCitiesData] = useState([]);
  const [selectedSource, setSelectedSource] = useState("Pune");

  const navigate = useNavigate();

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setClickedArc(null);
  };

  const handleRedirect = () => {
    if (selectedCity) {
      navigate(`/sessionlist/sessions/${selectedCity.SESSION_NAME}`);
    }
  };

  

  useEffect(() => {
    const fetchData = async () => {
      await getAllData();
      setCitiesData(allData);
    };

    fetchData();
  }, [dateTimeRange, getAllData]);

  const toggleMapStyle = () => {
    setMapStyle((prevStyle) =>
      prevStyle === "mapbox://styles/mapbox/dark-v10"
        ? "mapbox://styles/mapbox/light-v10"
        : "mapbox://styles/mapbox/dark-v10"
    );
  };

  const toggleFilterPanel = () => {
    setIsFilterPanelOpen(!isFilterPanelOpen);
  };

  const toggleFilterPanel2 = () => {
    setIsFilterPanelOpen2(!isFilterPanelOpen2);
  };

  const dataCenter = useMemo(
    () => citiesData.find((city) => city.CITY === "Delhi"),
    [citiesData]
  );

  const connections = useMemo(
    () =>
      citiesData
        .filter((city) => city.CITY !== "Delhi")
        .map((city) => ({
          source: dataCenter,
          target: city,
          ...city,
        })),
    [dataCenter, citiesData]
  );

  const filteredConnections = useMemo(() => {
    let filtered = connections;

    if (selectedSource !== "All") {
      filtered = filtered.filter((conn) => conn.SOURCE_CITY === selectedSource);
    }

    switch (filter) {
      case "noPacketLoss":
        return filtered.filter((conn) => conn.PACKET_LOSS === 0);
      case "packetLoss":
        return filtered.filter((conn) => conn.PACKET_LOSS > 0);
      case "all":
      default:
        return filtered;
    }
  }, [connections, filter, selectedSource]);

  const getColor = (packetLoss) => {
    return packetLoss > 0 ? [255, 0, 0, 180] : [0, 128, 0, 180];
  };

  const getWidth = (packetLoss) => {
    return packetLoss > 0 ? 3 : 3;
  };

  const onHoverArc = useCallback((info) => {
    setHoveredArc(info.object || null);
  }, []);

  const createArrowPath = (source, target, isArc) => {
    const [x1, y1] = source;
    const [x2, y2] = target;

    if (isArc) {
      // For arc, we'll create a curved path with a very small arrow at the end
      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const controlX = midX;
      const controlY = midY + Math.abs(y2 - y1) * 0.5; // Adjust this factor to change the arc curvature

      // Calculate the position for the arrowhead (very close to the end point)
      const t = 0.99; // Moved even closer to the end point
      const arrowX =
        (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * controlX + t * t * x2;
      const arrowY =
        (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * controlY + t * t * y2;

      // Reduce the size of the arrow significantly
      const arrowScale = 0.01; // Reduced from 0.03 to 0.01

      return [
        [x1, y1],
        [controlX, controlY],
        [x2, y2],
        // Very Small Arrow
        [arrowX, arrowY],
        [
          x2 + (arrowX - x2) * arrowScale - (arrowY - y2) * arrowScale,
          y2 + (arrowY - y2) * arrowScale + (arrowX - x2) * arrowScale,
        ],
        [x2, y2],
        [
          x2 + (arrowX - x2) * arrowScale + (arrowY - y2) * arrowScale,
          y2 + (arrowY - y2) * arrowScale - (arrowX - x2) * arrowScale,
        ],
        [arrowX, arrowY],
      ];
    } else {
      // For straight line, we'll create a simple line with a very small arrow at the end
      const dx = x2 - x1;
      const dy = y2 - y1;
      const angle = Math.atan2(dy, dx);
      const length = Math.sqrt(dx * dx + dy * dy);
      const arrowSize = Math.max(length * 0.01, 0.05); // Reduced from 0.03 to 0.01, with a minimum size

      return [
        [x1, y1],
        [x2, y2],
        // Very Small Arrow
        [
          x2 - arrowSize * Math.cos(angle - Math.PI / 6),
          y2 - arrowSize * Math.sin(angle - Math.PI / 6),
        ],
        [x2, y2],
        [
          x2 - arrowSize * Math.cos(angle + Math.PI / 6),
          y2 - arrowSize * Math.sin(angle + Math.PI / 6),
        ],
      ];
    }
  };

  const createLayer = (isArc) =>
    new PathLayer({
      id: isArc ? "arc-layer" : "line-layer",
      data: filteredConnections,
      getPath: (d) =>
        createArrowPath(
          [parseFloat(d.SOURCE_LONGITUDE), parseFloat(d.SOURCE_LATITUDE)],
          [parseFloat(d.LONGITUDE), parseFloat(d.LATITUDE)],
          isArc
        ),
      getColor: (d) => getColor(d.PACKET_LOSS),
      getWidth: (d) => getWidth(d.PACKET_LOSS),
      pickable: true,
      onHover: onHoverArc,
      onClick: (info) => {
        if (info.object) {
          setClickedArc(info.object);
          handleCityClick(info.object);
        }
      },
      widthMinPixels: 2,
  });

  const layers = useMemo(
    () => [
      // Scatterplot layer for cities
      new ScatterplotLayer({
        id: "city-layer",
        data: citiesData,
        getPosition: (d) => [parseFloat(d.LONGITUDE), parseFloat(d.LATITUDE)],
        getFillColor: (d) =>
          d.CITY === "Delhi" ? [255, 0, 0] : [135, 206, 235], // City colors
        getRadius: (d) => (d.CITY === "Delhi" ? 12000 : 10000), // City radius
        pickable: true,
      }),
  
      // Toggle between PathLayer for straight lines and ArcLayer for arcs based on straightArc
      straightArc
        ? new PathLayer({
            id: "line-path-layer",
            data: filteredConnections,
            getPath: (d) =>
              createArrowPath(
                [parseFloat(d.SOURCE_LONGITUDE), parseFloat(d.SOURCE_LATITUDE)],
                [parseFloat(d.LONGITUDE), parseFloat(d.LATITUDE)],
                false // Use false since it's a straight line
              ),
            getColor: (d) => getColor(d.PACKET_LOSS),
            getWidth: (d) => getWidth(d.PACKET_LOSS),
            pickable: true,
            onHover: onHoverArc,
            onClick: (info) => {
              if (info.object) {
                setClickedArc(info.object);
                handleCityClick(info.object);
              }
            },
            widthMinPixels: 2,
          })
        : new ArcLayer({
            id: "arc-layer",
            data: filteredConnections,
            getSourcePosition: (d) => [
              parseFloat(d.SOURCE_LONGITUDE),
              parseFloat(d.SOURCE_LATITUDE),
            ],
            getTargetPosition: (d) => [
              parseFloat(d.LONGITUDE),
              parseFloat(d.LATITUDE),
            ],
            getSourceColor: (d) => getColor(d.PACKET_LOSS),
            getTargetColor: (d) => getColor(d.PACKET_LOSS),
            getWidth: (d) => getWidth(d.PACKET_LOSS),
            pickable: true,
            autoHighlight: true,
            onHover: onHoverArc,
            onClick: (info) => {
              if (info.object) {
                setClickedArc(info.object);
                handleCityClick(info.object);
              }
            },
          }),
    ],
    [
      straightArc, // This controls the switch between ArcLayer and PathLayer
      filteredConnections,
      getColor,
      getWidth,
      onHoverArc,
      citiesData,
      clickedArc,
    ]
  );
  

  useEffect(() => {
    if (searchTerm === "") {
      setSearchResults([]);
    } else {
      const results = citiesData.filter((city) =>
        city.CITY.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    }
  }, [searchTerm, citiesData]);

  const zoomToCity = (city) => {
    setViewState({
      longitude: parseFloat(city.LONGITUDE),
      latitude: parseFloat(city.LATITUDE),
      zoom: 8,
      pitch: 45,
      bearing: 0,
    });
    setSearchTerm("");
    setSearchResults([]);
  };

  const totalConnections = useMemo(
    () => filteredConnections.length,
    [filteredConnections]
  );

  const totalNoPacketLoss = useMemo(() => {
    return filteredConnections.filter((conn) => conn.PACKET_LOSS === 0).length;
  }, [filteredConnections]);

  const totalPacketLoss = useMemo(() => {
    return filteredConnections.filter((conn) => conn.PACKET_LOSS > 0).length;
  }, [filteredConnections]);

  const renderInfoPanel = () => {
    if (!hoveredArc) return null;
    const {
      SOURCE_CITY,
      CITY,
      SOURCE_IP,
      DESTINATION_IP,
      PACKET_LOSS,
      AVG_DELAY,
      TOTAL_LOSTPKTS,
      TOTAL_RXPKTS,
    } = hoveredArc;

    return (
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          padding: "10px",
          background: "rgba(0, 0, 0, 0.8)",
          color: "#fff",
          borderRadius: "4px",
          fontSize: "14px",
          maxWidth: "300px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          zIndex: 1,
        }}
      >
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
          Session Information
        </div>
        <div style={{ marginBottom: "0px" }}>Source: {SOURCE_CITY}</div>
        <div style={{ marginBottom: "0px" }}>Destination: {CITY}</div>
        <div>Source IP: {SOURCE_IP}</div>
        <div>Destination IP: {DESTINATION_IP}</div>
        <div>
          Packet Loss:
          {TOTAL_RXPKTS === 0
            ? "0"
            : PACKET_LOSS > 100
            ? 100
            : PACKET_LOSS.toFixed(2)}
          %
        </div>
        <div>
          Total Lost Packets:{" "}
          {TOTAL_RXPKTS === 0
            ? "0"
            : TOTAL_LOSTPKTS > TOTAL_RXPKTS
            ? TOTAL_RXPKTS
            : TOTAL_LOSTPKTS}
        </div>
        <div>Total Sent Packets: {TOTAL_RXPKTS}</div>
        <div>Average Delay: {AVG_DELAY.toFixed(2)} ms</div>
      </div>
    );
  };

  const renderFilterButtons = () => {
    const filters = [
      { value: "all", label: `All Connections: ${totalConnections}` },
      { value: "noPacketLoss", label: `No Packet Loss: ${totalNoPacketLoss}` },
      { value: "packetLoss", label: `Packet Loss: ${totalPacketLoss}` },
    ];

    const sourceCities = [
      "All",
      ...new Set(connections.map((conn) => conn.SOURCE_CITY)),
    ];

    return (
      <div
        style={{
          position: "absolute",
          top: "25%",
          right: "0",
          height: "50%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          transition: "transform 0.3s ease-in-out",
          transform: isFilterPanelOpen ? "translateX(-1%)" : "translateX(90%)",
          zIndex: 2,
        }}
      >
        <FormControl fullWidth style={{ marginBottom: "10px" }}>
          <InputLabel id="source-select-label"></InputLabel>
          <Select
            sx={{
              background: "rgba(255, 255, 255, 0.8)",
              zIndex: 3,
            }}
            labelId="source-select-label"
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
          >
            {sourceCities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {filters.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            style={{
              margin: "5px",
              padding: "5px 10px",
              backgroundColor: filter === value ? "#4CAF50" : "#f1f1f1",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              color: filter === value ? "white" : "black",
            }}
          >
            {label}
          </button>
        ))}
      </div>
    );
  };
  //for left

  const renderSearchBar = () => (
    <div
      style={{
        position: "absolute",
        top: "10px",
        left: "620px",
        zIndex: 2,
        background: "white",
        padding: "5px 5px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
      }}
    >
      <input
        type="text"
        placeholder="Search City"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "200px",
          padding: "5px",
          borderRadius: "4px",
          border: "none",
          fontSize: "14px",
        }}
      />
      {searchResults.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            margin: "0",
            padding: "0",
            maxHeight: "200px",
            overflowY: "auto",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            position: "absolute",
            top: "35px",
            left: "0",
            zIndex: 2,
            width: "200px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          }}
        >
          {searchResults.map((city) => (
            <li
              key={city.CITY}
              onClick={() => zoomToCity(city)}
              style={{
                padding: "5px",
                cursor: "pointer",
                borderBottom: "1px solid #ccc",
              }}
            >
              {city.CITY}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <DeckGL
        initialViewState={viewState}
        controller
        layers={layers}
        onViewStateChange={(e) => setViewState(e.viewState)}
        style={{ position: "relative", zIndex: 1 }}
      >
        <Map
          mapStyle={mapStyle}
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: "100%", height: "100%" }}
        />
      </DeckGL>

      {renderInfoPanel()}
      {renderSearchBar()}

      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 2,
          background: "white",
          padding: "10px",
          borderRadius: "4px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      >
        <div>
          <button
            onClick={toggleMapStyle}
            style={{ fontSize: "18px", border: "none", cursor: "pointer" }}
          >
            {mapStyle === "mapbox://styles/mapbox/dark-v10" ? (
              <IoSunnyOutline />
            ) : (
              <IoMoonOutline />
            )}
          </button>
        </div>

        <div className="arcToggle" style={{ marginTop: "10px" }}>
          <button
            onClick={() => setStraightArc((prev) => !prev)}
            style={{ fontSize: "18px", border: "none", cursor: "pointer" }}
          >
            {!straightArc ? (
              <IoRemoveOutline />
            ) : (
              <img
                src="https://cdn-icons-png.flaticon.com/512/7601/7601424.png"
                alt="Arc Icon"
                style={{ width: "18px", height: "18px" }}
              />
            )}
          </button>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "0",
          zIndex: 2,
        }}
      >
        <button
          onClick={toggleFilterPanel}
          style={{
            position: "absolute",
            top: "50%",
            right: isFilterPanelOpen ? "160px" : "0",
            transform: "translateY(-50%)",
            padding: "10px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            border: "none",
            borderRadius: "5px 0 0 5px",
            cursor: "pointer",
            zIndex: 3,
            transition: "right 0.0s ease-in-out",
          }}
        >
          <IoChevronForward
            style={{
              transform: isFilterPanelOpen ? "rotate(0deg)" : "rotate(180deg)",
              transition: "transform 0.1s ease-in-out",
            }}
          />
        </button>
      </div>

      {isFilterPanelOpen && renderFilterButtons()}

      

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
                {selectedCity.TOTAL_RXPKTS === 0
                  ? "0"
                  : selectedCity.PACKET_LOSS > 100
                  ? 100
                  : selectedCity.PACKET_LOSS.toFixed(2)}
                %
                <br />
                <strong>Total Lost Packets:</strong>{" "}
                {selectedCity.TOTAL_RXPKTS === 0
                  ? 0
                  : selectedCity.TOTAL_LOSTPKTS > selectedCity.TOTAL_RXPKTS
                  ? selectedCity.TOTAL_RXPKTS
                  : selectedCity.TOTAL_LOSTPKTS}
                <br />
                <strong>Total Sent Packets:</strong> {selectedCity.TOTAL_RXPKTS}
                <br />
                <strong>Average Delay:</strong>{" "}
                {selectedCity.AVG_DELAY.toFixed(4)} ms
                <br />
                <strong>Jitter:</strong> {selectedCity.DELAY_VARIATION} ms
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
    </div>
  );
};

export default MapComponent3;
