import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Button, TextField, Box, IconButton, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import MonthSidebar from "./MonthSidebar";
import { useSelector } from "react-redux";

// Replace with real API calls
const fetchStats = async (date) => {
  // TODO: Fetch stats for the user and date from backend
  return { stat1: '', stat2: '' };
};
const fetchMonthStats = async (month) => {
  // TODO: Fetch all stats for the user for the month (YYYY-MM) from backend
  return {};
};
const saveStats = async (date, stat1, stat2) => {
  // TODO: Save stats for the user and date to backend
  return true;
};

const Tracking = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [stat1, setStat1] = useState("");
  const [stat2, setStat2] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [monthStats, setMonthStats] = useState({});

  // Load stats for selected day
  // Placeholder: get user and team info from Redux or localStorage
  const user = JSON.parse(localStorage.getItem("profile"));
  // TODO: Replace with real team/player fetching logic
  const isCaptain = user?.result?.isCaptain || false; // Set this based on your real user/team data
  const teamPlayers = []; // Fill with player objects: [{ _id, name }, ...]

  // Placeholder: fetch all player stats for the month (simulate with empty data)
  const [playerMonthStats, setPlayerMonthStats] = useState({});
  // TODO: Fetch real player stats for the month
  // playerMonthStats = { playerId: { 'YYYY-MM-DD': { stat1, stat2 }, ... }, ... }

  // Copy all players' stats for the month as TSV
  const handleCopyTeamStats = () => {
    if (!teamPlayers.length) return;
    const daysInMonth = selectedDate.daysInMonth();
    const monthStart = selectedDate.startOf("month");
    let tsv = 'Player';
    for (let d = 1; d <= daysInMonth; d++) {
      const date = monthStart.date(d).format("MMM D");
      tsv += `\t${date}`;
    }
    tsv += '\n';
    teamPlayers.forEach(player => {
      tsv += player.name;
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = monthStart.date(d).format("YYYY-MM-DD");
        const stats = playerMonthStats[player._id]?.[dateStr] || {};
        const nVal = stats.stat1 === undefined || stats.stat1 === '' ? '0' : stats.stat1;
        tsv += `\t${nVal}`;
      }
      tsv += '\n';
      tsv += player.name + ' (S)';
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = monthStart.date(d).format("YYYY-MM-DD");
        const stats = playerMonthStats[player._id]?.[dateStr] || {};
        const sVal = stats.stat2 === undefined || stats.stat2 === '' ? '0' : stats.stat2;
        tsv += `\t${sVal}`;
      }
      tsv += '\n';
    });
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tsv);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = tsv;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  };
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const stats = await fetchStats(selectedDate.format("YYYY-MM-DD"));
      setStat1(stats.stat1 || "");
      setStat2(stats.stat2 || "");
      setLoading(false);
    };
    loadStats();
  }, [selectedDate]);

  // Load all stats for the month
  useEffect(() => {
    const loadMonthStats = async () => {
      const month = selectedDate.format("YYYY-MM");
      const stats = await fetchMonthStats(month);
      setMonthStats(stats);
    };
    loadMonthStats();
  }, [selectedDate]);

  const handleSave = async () => {
    setLoading(true);
    const success = await saveStats(selectedDate.format("YYYY-MM-DD"), stat1, stat2);
    setMessage(success ? "Saved!" : "Error saving stats.");
    // Update monthStats in state for immediate UI feedback
    setMonthStats((prev) => ({
      ...prev,
      [selectedDate.format("YYYY-MM-DD")]: { stat1, stat2 },
    }));
    setLoading(false);
    setTimeout(() => setMessage(""), 2000);
  };


  const handleSelectDate = (date) => {
    setSelectedDate(date);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      {isCaptain && (
        <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>Team Player Stats (Month)</Typography>
          <Button variant="contained" color="primary" onClick={handleCopyTeamStats}>
            Copy Team Stats (TSV)
          </Button>
          {/* TODO: Show a preview table of player stats here if desired */}
        </Paper>
      )}
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        <Box flexShrink={0} width={{ xs: '100%', md: 280 }}>
          <MonthSidebar
            monthStats={monthStats}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
        </Box>
        <Box flexGrow={1}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h5" flexGrow={1}>Daily Tracking</Typography>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Select Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                maxDate={dayjs()}
                slotProps={{ textField: { fullWidth: true, margin: "normal" } }}
              />
            </LocalizationProvider>
            <TextField
              label="N"
              value={stat1}
              onChange={(e) => setStat1(e.target.value.replace(/[^\d-]/g, ""))}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="decrement N"
                      onClick={() => setStat1((v) => String((parseInt(v) || 0) - 1))}
                      edge="end"
                      size="small"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="increment N"
                      onClick={() => setStat1((v) => String((parseInt(v) || 0) + 1))}
                      edge="end"
                      size="small"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="S"
              value={stat2}
              onChange={(e) => setStat2(e.target.value.replace(/[^\d-]/g, ""))}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="decrement S"
                      onClick={() => setStat2((v) => String((parseInt(v) || 0) - 1))}
                      edge="end"
                      size="small"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="increment S"
                      onClick={() => setStat2((v) => String((parseInt(v) || 0) + 1))}
                      edge="end"
                      size="small"
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
            {message && (
              <Typography color="success.main" align="center" sx={{ mt: 2 }}>
                {message}
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </Container>
  );
};

export default Tracking;
