import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  Box,
  FormControl,
  Select,
  MenuItem,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { CalendarToday, AccessTime } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { format, addHours, addDays, setHours, setMinutes } from "date-fns";
import { useDateTimeRange } from "../.././DateTimeContext";

const DateTimeRangeSelector = () => {
  const theme = useTheme();
  const { dateTimeRange, setDateTimeRange, setInteraction } =
    useDateTimeRange();
  const [fromDate, setFromDate] = useState(new Date(dateTimeRange.sdate));
  const [toDate, setToDate] = useState(new Date(dateTimeRange.edate));
  const [startTime, setStartTime] = useState(new Date(dateTimeRange.sdate));
  const [endTime, setEndTime] = useState(new Date(dateTimeRange.edate));
  const [selectedTimeOption, setSelectedTimeOption] = useState("1 Hour");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [granularityOptions, setGranularityOptions] = useState([]);
  const [selectedGranularity, setSelectedGranularity] = useState("");
  const [startAmPm, setStartAmPm] = useState(
    startTime.getHours() >= 12 ? "PM" : "AM"
  );
  const [endAmPm, setEndAmPm] = useState(
    endTime.getHours() >= 12 ? "PM" : "AM"
  );

  const updateGranularityOptions = () => {
    const options = [
      { granularity: "1 day", maxInterval: "180 days", precision: "-96x" },
      { granularity: "6 hours", maxInterval: "30 days", precision: "-24x" },
      { granularity: "1 hour", maxInterval: "7 days", precision: "-4x" },
      { granularity: "15 minutes", maxInterval: "1 day", precision: "1x" },
      { granularity: "1 minute", maxInterval: "8 hours", precision: "15x" },
      { granularity: "1 second", maxInterval: "1 hour", precision: "900x" },
    ];
    setGranularityOptions(options);
    setSelectedGranularity(options[0].granularity);
  };

  useEffect(() => {
    updateGranularityOptions();
  }, []);

  useEffect(() => {
    const newDateTimeRange = {
      sdate: new Date(
        fromDate.setHours(startTime.getHours(), startTime.getMinutes())
      ).toISOString(),
      edate: new Date(
        toDate.setHours(endTime.getHours(), endTime.getMinutes())
      ).toISOString(),
    };
    setDateTimeRange(newDateTimeRange);
    if (selectedGranularity) {
      const duration = selectedGranularity.toUpperCase();
      setInteraction(duration, newDateTimeRange);
    }
  }, [
    fromDate,
    toDate,
    startTime,
    endTime,
    setDateTimeRange,
    setInteraction,
    selectedGranularity,
  ]);

  const getGranularityForTimeOption = (option) => {
    switch (option) {
      case "1 Hour":
        return "1 second";
      case "8 Hours":
        return "1 minute";
      case "1 Day":
        return "15 minutes";
      case "7 Days":
        return "1 hour";
      case "30 Days":
        return "6 hours";
      case "180 Days":
        return "1 day";
      default:
        return "1 minute";
    }
  };

  const getTimeOptionForGranularity = (granularity) => {
    switch (granularity) {
      case "1 second":
        return "1 Hour";
      case "1 minute":
        return "8 Hours";
      case "15 minutes":
        return "1 Day";
      case "1 hour":
        return "7 Days";
      case "6 hours":
        return "30 Days";
      case "1 day":
        return "180 Days";
      default:
        return "1 Hour";
    }
  };

  const handleTimeOptionClick = (option) => {
    setSelectedTimeOption(option);
    localStorage.setItem("selectedTimeOption", option);

    const currentStartDateTime = new Date(fromDate);
    currentStartDateTime.setHours(
      startTime.getHours(),
      startTime.getMinutes(),
      0,
      0
    );

    let updatedEndTime;
    switch (option) {
      case "1 Hour":
        updatedEndTime = addHours(currentStartDateTime, 1);
        break;
      case "8 Hours":
        updatedEndTime = addHours(currentStartDateTime, 8);
        break;
      case "1 Day":
        updatedEndTime = addDays(currentStartDateTime, 1);
        break;
      case "7 Days":
        updatedEndTime = addDays(currentStartDateTime, 7);
        break;
      case "30 Days":
        updatedEndTime = addDays(currentStartDateTime, 30);
        break;
      case "180 Days":
        updatedEndTime = addDays(currentStartDateTime, 180);
        break;
      default:
        updatedEndTime = addHours(currentStartDateTime, 1);
    }

    setEndTime(updatedEndTime);
    setToDate(updatedEndTime);
    setEndAmPm(updatedEndTime.getHours() >= 12 ? "PM" : "AM");

    const newGranularity = getGranularityForTimeOption(option);
    setSelectedGranularity(newGranularity);
  };

  const handleGranularityChange = (event) => {
    event.stopPropagation();
    const newGranularity = event.target.value;
    setSelectedGranularity(newGranularity);

    const newTimeOption = getTimeOptionForGranularity(newGranularity);
    handleTimeOptionClick(newTimeOption);
  };

  const handleCardClick = (event) => {
    event.stopPropagation();
  };

  const formatDateTimeRange = () => {
    const fromDateStr = format(fromDate, "EEE MMM dd yyyy");
    const toDateStr = format(toDate, "EEE MMM dd yyyy");
    const startTimeStr = format(startTime, "hh:mm a");
    const endTimeStr = format(endTime, "hh:mm a");

    return fromDateStr === toDateStr
      ? `${fromDateStr} ${startTimeStr} - ${endTimeStr}`
      : `${fromDateStr} ${startTimeStr} - ${toDateStr} ${endTimeStr}`;
  };

  const handleTimeChange = (newValue, isStartTime) => {
    const [hours, minutes] = newValue.split(":").map(Number);
    const updatedTime = isStartTime ? new Date(startTime) : new Date(endTime);
    const amPm = isStartTime ? startAmPm : endAmPm;

    let adjustedHours = hours;
    if (amPm === "PM" && hours !== 12) {
      adjustedHours += 12;
    } else if (amPm === "AM" && hours === 12) {
      adjustedHours = 0;
    }

    updatedTime.setHours(adjustedHours);
    updatedTime.setMinutes(minutes);

    if (isStartTime) {
      setStartTime(updatedTime);
      const duration = {
        "1 Hour": 1,
        "8 Hours": 8,
        "1 Day": 24,
        "7 Days": 168,
        "30 Days": 720,
        "180 Days": 4320,
      }[selectedTimeOption];
      const newEndTime = addHours(updatedTime, duration);
      setEndTime(newEndTime);
      setEndAmPm(newEndTime.getHours() >= 12 ? "PM" : "AM");
    } else {
      setEndTime(updatedTime);
    }
  };

  const handleAmPmChange = (event, newAmPm, isStartTime) => {
    if (newAmPm !== null) {
      const updatedTime = isStartTime ? new Date(startTime) : new Date(endTime);
      let hours = updatedTime.getHours();

      if (newAmPm === "PM" && hours < 12) {
        hours += 12;
      } else if (newAmPm === "AM" && hours >= 12) {
        hours -= 12;
      }

      updatedTime.setHours(hours);

      if (isStartTime) {
        setStartTime(updatedTime);
        setStartAmPm(newAmPm);
      } else {
        setEndTime(updatedTime);
        setEndAmPm(newAmPm);
      }
    }
  };
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Card
        sx={{
          width: 400,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
        }}
        onClick={handleCardClick}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Time range
          </Typography>
          <Typography variant="caption" display="block" gutterBottom>
            Select a date range for your query
          </Typography>

          <Grid
            container
            spacing={1}
            sx={{ mt: 2 }}
            justifyContent="space-between"
          >
            {[
              "1 Hour",
              "8 Hours",
              "1 Day",
              "7 Days",
              "30 Days",
              "180 Days",
            ].map((option) => (
              <Grid item xs={2} key={option}>
                <Button
                  fullWidth
                  size="small"
                  variant={
                    selectedTimeOption === option ? "contained" : "outlined"
                  }
                  onClick={() => handleTimeOptionClick(option)}
                  sx={{
                    backgroundColor:
                      selectedTimeOption === option
                        ? theme.palette.primary.main
                        : theme.palette.background.paper,
                    color: theme.palette.text.primary,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {option.split(" ").map((text, index) => (
                    <Typography
                      key={index}
                      variant={index === 0 ? "body2" : "caption"}
                    >
                      {text}
                    </Typography>
                  ))}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
            <Grid item>
              <IconButton onClick={() => setShowCalendar(!showCalendar)}>
                <CalendarToday sx={{ color: theme.palette.text.primary }} />
              </IconButton>
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                value={formatDateTimeRange()}
                InputProps={{
                  readOnly: true,
                  sx: { color: theme.palette.text.primary, fontSize: "12.5px" },
                }}
                onClick={() => setShowCalendar(!showCalendar)}
              />
            </Grid>
            <Grid item>
              <IconButton onClick={() => setShowTimePicker(!showTimePicker)}>
                <AccessTime sx={{ color: theme.palette.text.primary }} />
              </IconButton>
            </Grid>
          </Grid>

          {showCalendar && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <DatePicker
                  label="From Date"
                  value={fromDate}
                  onChange={(newValue) => setFromDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      onClick={(e) => e.stopPropagation()}
                      sx={{ color: theme.palette.text.primary }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="To Date"
                  value={toDate}
                  onChange={(newValue) => setToDate(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      onClick={(e) => e.stopPropagation()}
                      sx={{ color: theme.palette.text.primary }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          )}

          {showTimePicker && (
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Typography variant="caption">Start Time</Typography>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={8}>
                    <TextField
                      type="time"
                      value={format(startTime, "HH:mm")}
                      onChange={(e) => handleTimeChange(e.target.value, true)}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300,
                      }}
                      sx={{ color: theme.palette.text.primary }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <ToggleButtonGroup
                      value={startAmPm}
                      exclusive
                      onChange={(e, v) => handleAmPmChange(e, v, true)}
                      aria-label="start time AM/PM"
                      size="small"
                      orientation="vertical"
                      style={{ width: "3em" }}
                    >
                      <ToggleButton value="AM" aria-label="AM">
                        AM
                      </ToggleButton>
                      <ToggleButton value="PM" aria-label="PM">
                        PM
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption">End Time</Typography>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={8}>
                    <TextField
                      type="time"
                      value={format(endTime, "HH:mm")}
                      onChange={(e) => handleTimeChange(e.target.value, false)}
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        step: 300,
                      }}
                      sx={{ color: theme.palette.text.primary }}
                    />
                  </Grid>
                  <Grid item xs={4} direction="column">
                    <ToggleButtonGroup
                      value={endAmPm}
                      exclusive
                      onChange={(e, v) => handleAmPmChange(e, v, false)}
                      aria-label="end time AM/PM"
                      size="small"
                      orientation="vertical"
                      style={{ width: "3em" }}
                    >
                      <ToggleButton value="AM" aria-label="AM">
                        AM
                      </ToggleButton>
                      <ToggleButton value="PM" aria-label="PM">
                        PM
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}

          <Box mt={2}>
            <FormControl fullWidth>
              <Typography variant="caption" display="block" gutterBottom>
                Granularity
              </Typography>
              <Select
                value={selectedGranularity}
                onChange={handleGranularityChange}
                sx={{
                  color: theme.palette.text.primary,
                  cursor: "default",
                }}
              >
                {granularityOptions.map((option, index) => (
                  <MenuItem
                    key={index}
                    value={option.granularity}
                    sx={{
                      cursor: "default",
                    }}
                  >
                    <Grid container>
                      <Grid item xs={4}>
                        {option.granularity}
                      </Grid>
                      <Grid item xs={4}>
                        {option.maxInterval}
                      </Grid>
                      <Grid item xs={4}>
                        {option.precision}
                      </Grid>
                    </Grid>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default DateTimeRangeSelector;
