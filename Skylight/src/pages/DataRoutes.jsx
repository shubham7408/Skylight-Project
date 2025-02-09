import React from 'react'
import Sidebar from '../atoms/sideBar/Sidebar'
import { Box } from '@mui/material';

function DataRoutes() {
  return (
    <>
      <Box style={{ width: "50px", position: "fixed", height: "100vh" }}>
        <Sidebar />
      </Box>
      <div>Data Routes</div>
    </>

  )
}

export default DataRoutes