import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';
import { useDateTimeRange } from '../../DateTimeContext'; // Import your DateTimeContext
import { useNavigate } from 'react-router-dom';

const COLORS = ['#4caf50', '#ff9800', '#f44336'];

const Pie3 = () => {
  const [delayVariationData, setDelayVariationData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sessionData, setSessionData] = useState([]);

  const { allData } = useDateTimeRange(); // Access all data from the context
  const navigate = useNavigate();

  useEffect(() => {
    if (allData.length > 0) {
      const categorizedData = categorizeDelayVariationData(allData);
      setDelayVariationData(categorizedData);
    }
  }, [allData]); // Update data whenever allData changes

  const categorizeDelayVariationData = (data) => {
    const low = [];
    const medium = [];
    const high = [];

    data.forEach(item => {
      const delayVariation = item.DELAY_VARIATION;

      if (delayVariation < 5) {
        low.push(item);
      } else if (delayVariation >= 5 && delayVariation < 15) {
        medium.push(item);
      } else {
        high.push(item);
      }
    });

    const totalItems = data.length;

    return [
      {
        name: "<5 ms",
        value: (low.length / totalItems) * 100,
        color: "#4caf50",
        subStat: `${((low.length / totalItems) * 100).toFixed(2)}%`,
        data: low,
      },
      {
        name: "5-15 ms",
        value: (medium.length / totalItems) * 100,
        color: "#ff9800",
        subStat: `${((medium.length / totalItems) * 100).toFixed(2)}%`,
        data: medium,
      },
      {
        name: "≥15 ms",
        value: (high.length / totalItems) * 100,
        color: "#f44336",
        subStat: `${((high.length / totalItems) * 100).toFixed(2)}%`,
        data: high,
      }
    ];
  };

  const handlePieClick = (entry) => {
    setSelectedCategory(entry.name);
    const filteredSessions = delayVariationData.find(category => category.name === entry.name)?.data || [];
    setSessionData(filteredSessions);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <PieChart width={150} height={150}>
          <Pie
            data={delayVariationData}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
            onClick={handlePieClick}
          >
            {delayVariationData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2 }}>
          {delayVariationData.map((entry, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 },
              }}
              onClick={() => handlePieClick(entry)}
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
      </Box>

      <Dialog open={isModalOpen} onClose={handleCloseModal}>
        <DialogTitle>{selectedCategory} Session Data</DialogTitle>
        <DialogContent>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Session Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>City</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Jitter (ms)</th>
              </tr>
            </thead>
            <tbody>
              {sessionData.map((session, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: "8px", cursor: "pointer" }} onClick={() => navigate(`/sessionlist/sessions/${session.SESSION_NAME}`)}>{session.SESSION_NAME}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{session.CITY}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{session.DELAY_VARIATION}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Pie3;
