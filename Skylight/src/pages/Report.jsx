import React from "react"
import MapComponent3 from "../components/Map2";
import Provider from "../components/Provider";
import SummaryView from "../components/SummaryView";
import SessionData from "./SessionData";
import { Box, useTheme } from "@mui/material";
import Table from "../atoms/Table/Table";
import Table2 from "../atoms/Table/Table2";
import LineChart1 from "../atoms/linechart/LineChart";

const data = [
    { time: "01:51", maxLostBurst: 63.3, avgLostBurst: 0.016 },
    { time: "02:00", maxLostBurst: 70, avgLostBurst: 0.02 },
    { time: "03:00", maxLostBurst: 80, avgLostBurst: 0.015 },
    { time: "04:00", maxLostBurst: 86, avgLostBurst: 0.018 },
    { time: "05:00", maxLostBurst: 90, avgLostBurst: 0.014 },
    { time: "06:00", maxLostBurst: 75, avgLostBurst: 0.017 },
    { time: "07:00", maxLostBurst: 65, avgLostBurst: 0.016 },
    { time: "08:00", maxLostBurst: 60, avgLostBurst: 0.015 },
    { time: "09:00", maxLostBurst: 55, avgLostBurst: 0.013 },
];

const Report = () => {
    const theme = useTheme();

    return (
        <>
            <Box style={{ display: "flex", height: "100vh" }}>
                <Box
                    id="main"
                    m="20px"
                    p="10px"
                    style={{
                        marginTop: "-30px",
                        marginLeft: "50px",
                        flexGrow: 1,
                        borderRadius: "1rem",
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.secondary.main,
                    }}
                >
                    <Box
                        display="grid"
                        gridTemplateColumns="repeat(12, 1fr)"
                        gridAutoRows="140px"
                        gap="15px"
                    >
                        <Box
                            gridColumn="span 6"
                            gridRow="span 3"
                            id="box"
                            style={{ position: "relative" }}
                        >
                            <MapComponent3 />
                        </Box>

                        <Box
                            gridColumn="span 6"
                            gridRow="span 2"
                            overflow="hidden"
                            id="box"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                        // style={{ backgroundColor: theme.palette.primary.main,
                        //          color: theme.palette.secondary.main, }}
                        >
                            {/* <h4 style={{ marginTop: "5vh" }}>Summary view</h4> */}
                            <SummaryView />
                        </Box>

                        <Box gridColumn="span 6" gridRow="span 1" p="" id="box">
                            <LineChart1 data={data} />
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                mt="25px"
                            ></Box>
                        </Box>


                        {/* <SessionData /> */}
                        <Box
                            gridColumn="span 12"
                            gridRow="span 3"
                            id="box"
                            display="flex"
                            flexDirection="row"
                        >
                            <Table style={{ flex: 1, marginRight: "10px" }} />
                            <Table2
                                columnsToShow={["Session Name", "Packet Loss %", "Jitter"]}
                                style={{ flex: 1 }}
                            />
                        </Box>
                        <Box
                            gridColumn="span 6"
                            gridRow="span 2"
                            id="box"
                            style={{ backgroundColor: "yellow", position: "relative" }}
                        >
                            <Provider />
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Report