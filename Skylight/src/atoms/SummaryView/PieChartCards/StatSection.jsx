import React, { useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import Card from "./Card";
import packetLossData from "../../../data/packet_loss_categories.json";
import { CgOverflow } from "react-icons/cg";

const StatSection = ({ title, PieComponent, cardData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleCardClick = (item) => {
    setSelectedCard(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCard(null);
  };

  const getSessionDataForCategory = (category) => {
    return packetLossData[category] || [];
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns="repeat(2, 85%)"
      style={{ position: "relative", left: "-24px", top: "60px" }}
    >
      <div>
        <PieComponent />
      </div>
      <Box style={{ marginTop: "20px" }}>
        {cardData.map((item, index) => (
          <Card
            key={index}
            title={item.name}
            mainStat={`${item.value.toFixed(2)}%`}
            subStat={item.subStat || ""}
            color={item.color}
            onClick={() => handleCardClick(item)}
          />
        ))}
      </Box>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{selectedCard?.name} Session Data</DialogTitle>
        <DialogContent style={{ scrollBehavior:"" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Session Name
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Packet Loss (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {getSessionDataForCategory(selectedCard?.name).map(
                (session, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {session.session_name}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {session.packet_lost_perc > 100
                        ? 100
                        : session.packet_lost_perc.toFixed(2)}
                      %
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StatSection;
