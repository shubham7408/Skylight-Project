import React from 'react';
import { Box, Typography } from '@mui/material';
import Pie1 from '../atoms/SummaryView/PieChart';
import Pie2 from '../atoms/SummaryView/PieChart2';
import Pie3 from '../atoms/SummaryView/PieChart3';
import { useTheme } from "@mui/material/styles";

const SummaryView = () => {

  const theme = useTheme();

  return (
    <Box sx={{ padding: '20px' , 
      // backgroundColor: theme.palette.primary.main,
      // color: theme.palette.secondary.main,
    }}>
      {/* <Typography variant="h4" gutterBottom>Summary View</Typography> */}
      <Typography variant="h6" gutterBottom sx={{ marginBottom: '5px', fontWeight: 'bold', fontSize: "20px" }}>
        Summary View
      </Typography>
      <Box
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gap={4}
        sx={{
          '& > div': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.secondary.main,
          }
        }}
      >
        <Box >
          <Typography variant="h6" gutterBottom style={{ fontSize: "15px" }}>Packet Loss %</Typography>
          <Pie1 />
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom style={{ fontSize: "15px" }}>Delay (avg)</Typography>
          <Pie2 />
        </Box>
        <Box>
          <Typography variant="h6" gutterBottom style={{ fontSize: "15px" }}>Jitter (p95)</Typography>
          <Pie3 />
        </Box>
      </Box>
    </Box>
  );
};

export default SummaryView;