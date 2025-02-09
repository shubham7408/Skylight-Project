import React from 'react'
import Sidebar from '../atoms/sideBar/Sidebar'
import { Box } from '@mui/material';

function Networks() {
  return (
    <>
    <Box style={{ width: "50px", position: "fixed", height: "100vh" }}> 
        <Sidebar />
      </Box>
    <div>    Networks</div>
    </>
    
  )
}

export default Networks