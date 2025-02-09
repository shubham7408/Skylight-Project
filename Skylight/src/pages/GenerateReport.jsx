import React, { useState } from "react";
import {
    Card,
    CardHeader,
    CardContent,
    TextField,
    Button,
    Alert,
    CircularProgress,
    Box,
    Typography,
    useTheme
} from "@mui/material";
import DocumentIcon from '@mui/icons-material/Description';
import SendIcon from '@mui/icons-material/Send';
import Sidebar from "../atoms/sideBar/Sidebar";
import { useDateTimeRange } from '../DateTimeContext';

const GenerateReport = () => {
    const theme = useTheme();

    const { allData, dateTimeRange } = useDateTimeRange();

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleInputChange = (e) => {
        setEmail(e.target.value);
        setError("");
        setSuccess(false);
    };

    const sendReport = async () => {
        setIsLoading(true);
        setError("");
        try {
            const response = await fetch('http://localhost:3000/generate-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, dateTimeRange })
            });

            if (!response.ok) throw new Error('Failed to generate report');
            setSuccess(true);
            setEmail("");
        } catch (error) {
            setError('Failed to generate report. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        sendReport();
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar wrapper */}
            <Box style={{ width: "50px", position: "fixed", height: "100vh" }}>
                <Sidebar />
            </Box>
            <Typography
                variant="h5"
                sx={{
                    textAlign: "center",
                    marginBottom: "20px",
                    fontWeight: "bold",
                    color: theme.palette.text.primary,
                }}
            >
                Create & Send Report
            </Typography>
            <center>
                <Box
                    sx={{
                        width: "50vw",
                        padding: "20px",
                        flexGrow: 1
                    }}
                >
                    <Card elevation={3} sx={{ padding: 1, borderRadius: 2 }}>
                        <CardHeader
                            title="Enter Email:"
                            titleTypographyProps={{ variant: "h6", textAlign: "center", fontWeight: "bold" }}
                            sx={{ backgroundColor: theme.palette.primary.light, color: theme.palette.primary.contrastText }}
                        />
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    fullWidth
                                    label="Enter your email"
                                    variant="outlined"
                                    value={email}
                                    onChange={handleInputChange}
                                    sx={{
                                        marginBottom: 2,
                                        '& .MuiOutlinedInput-root': {
                                            '&:hover fieldset': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                    }}
                                    required
                                />
                                {error && (
                                    <Alert severity="error" sx={{ marginBottom: 2 }}>
                                        {error}
                                    </Alert>
                                )}
                                {success && <Alert severity="success">Report sent successfully!</Alert>}
                                <Box textAlign="center">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                                        disabled={isLoading}
                                        sx={{
                                            marginTop: 2,
                                            padding: "10px 20px",
                                            fontWeight: "bold",
                                            textTransform: "none",
                                            borderRadius: "20px",
                                        }}
                                    >
                                        {isLoading ? 'Sending...' : 'Send Report'}
                                    </Button>
                                </Box>
                            </form>
                        </CardContent>
                    </Card>
                </Box>
            </center>
        </div>
    );
};

export default GenerateReport;
