import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import { useDateTimeRange } from '../../DateTimeContext'; // Import your DateTimeContext
import { useNavigate } from 'react-router-dom';

const COLORS = ['#f44336', '#ff9800', '#4caf50'];

const Pie1 = () => {
  const [packetLossData, setPacketLossData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sessionData, setSessionData] = useState([]);
  
  const { allData, dateTimeRange } = useDateTimeRange(); // Access your DateTime context
  const navigate = useNavigate();

  useEffect(() => {
    if (allData.length > 0) {
      const categorizedData = categorizeData(allData);
      setPacketLossData(categorizedData);
    }
  }, [allData]); // Update data when allData changes

  const categorizeData = (data) => {
    const critical = [];
    const major = [];
    const minor = [];

    data.forEach(item => {
      const packetLoss = item.PACKET_LOSS;

      if (packetLoss > 5) {
        critical.push(item);
      } else if (packetLoss >= 1 && packetLoss <= 5) {
        major.push(item);
      } else {
        minor.push(item);
      }
    });

    const totalPackets = data.length;

    return [
      {
        name: "Minor(<1%)",
        value: (minor.length / totalPackets) * 100,
        color: "#4caf50",
        subStat: `${((minor.length / totalPackets) * 100).toFixed(2)}%`,
        data: minor,
      },
      {
        name: "Major(1 - 5%)",
        value: (major.length / totalPackets) * 100,
        color: "#ff9800",
        subStat: `${((major.length / totalPackets) * 100).toFixed(2)}%`,
        data: major,
      },
      {
        name: "Critical(>5%)",
        value: (critical.length / totalPackets) * 100,
        color: "#f44336",
        subStat: `${((critical.length / totalPackets) * 100).toFixed(2)}%`,
        data: critical,
      },
    ];
  };

  const handleClick = (entry) => {
    setSelectedCategory(entry.name);
    const filteredSessions = packetLossData.find(category => category.name === entry.name)?.data || [];
    setSessionData(filteredSessions);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <PieChart width={150} height={150}>
        <Pie
          data={packetLossData}
          cx="50%"
          cy="50%"
          innerRadius={40}
          outerRadius={60}
          paddingAngle={5}
          dataKey="value"
          onClick={handleClick}
        >
          {packetLossData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {packetLossData.map((entry, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': { opacity: 0.8 },
            }}
            onClick={() => handleClick(entry)}
          >
            <Box
              sx={{
                width: 15,
                height: 15,
                backgroundColor: entry.color,
                marginRight: 1,
              }}
            />
            <Typography variant="caption">
              {entry.name}: {entry.subStat}
            </Typography>
          </Box>
        ))}
      </Box>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{selectedCategory} Session Data</DialogTitle>
        <DialogContent>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Session Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Packet Loss (%)</th>
              </tr>
            </thead>
            <tbody>
              {sessionData.map((session, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px", cursor: "pointer" }} onClick={() => navigate(`/sessionlist/sessions/${session.SESSION_NAME}`)}>{session.SESSION_NAME}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {session.PACKET_LOSS > 100 ? 100 : session.PACKET_LOSS.toFixed(2)}%
                  </td>
                </tr>
              ))}
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

export default Pie1;