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
import { fetchUserMonthStats, fetchTeamMonthStats, saveUserDayStat } from '../../api';

const Tracking = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [N, setN] = useState("");
  const [S, setS] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [monthStats, setMonthStats] = useState({});


  // Get user and team info
  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.result?._id;
  const isCaptain = user?.result?.isCaptain || false;
  const teamId = user?.result?.teamId || null;
  const teamPlayers = user?.result?.teamPlayers || [];

  // Player stats for captain/team view
  const [playerMonthStats, setPlayerMonthStats] = useState({});

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
  const nVal = stats.N === undefined || stats.N === null || stats.N === '' ? '0' : stats.N;
  tsv += `\t${nVal}`;
      }
      tsv += '\n';
      tsv += player.name + ' (S)';
      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = monthStart.date(d).format("YYYY-MM-DD");
        const stats = playerMonthStats[player._id]?.[dateStr] || {};
  const sVal = stats.S === undefined || stats.S === null || stats.S === '' ? '0' : stats.S;
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

  // Load stats for selected day

  // Auto-populate N and S from monthStats when selecting a date
  useEffect(() => {
    const stats = monthStats[selectedDate.format("YYYY-MM-DD")] || { N: '', S: '' };
    setN(stats.N || "");
    setS(stats.S || "");
  }, [selectedDate, monthStats]);


  // Load all stats for the month (personal)
  useEffect(() => {
    const loadMonthStats = async () => {
      if (!userId) return;
      const month = selectedDate.format("YYYY-MM");
      try {
        const res = await fetchUserMonthStats(userId, month);
        // Transform array to object keyed by date
        const arr = res.data || [];
        const obj = {};
        for (const entry of arr) {
          obj[entry.date] = { N: entry.N, S: entry.S };
        }
        setMonthStats(obj);
      } catch (err) {
        setMonthStats({});
      }
    };
    loadMonthStats();
  }, [selectedDate, userId]);

  // Load all player stats for the month (captain/team)
  useEffect(() => {
    const loadPlayerMonthStats = async () => {
      if (!isCaptain || !teamId) return;
      const month = selectedDate.format("YYYY-MM");
      try {
        const res = await fetchTeamMonthStats(teamId, month);
        // Transform array to nested object: { playerId: { date: {N, S} } }
        const arr = res.data?.stats || [];
        const players = res.data?.players || [];
        const obj = {};
        for (const player of players) {
          obj[player._id] = {};
        }
        for (const entry of arr) {
          if (obj[entry.user]) {
            obj[entry.user][entry.date] = { N: entry.N, S: entry.S };
          }
        }
        setPlayerMonthStats(obj);
      } catch (err) {
        setPlayerMonthStats({});
      }
    };
    loadPlayerMonthStats();
  }, [selectedDate, isCaptain, teamId]);

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveUserDayStat({
        userId,
        date: selectedDate.format("YYYY-MM-DD"),
        N,
        S,
      });
      setMessage("Saved!");
      setMonthStats((prev) => ({
        ...prev,
        [selectedDate.format("YYYY-MM-DD")]: { N, S },
      }));
    } catch (err) {
      setMessage("Error saving stats.");
    }
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
              value={N}
              onChange={(e) => setN(e.target.value.replace(/[^\d-]/g, ""))}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="decrement N"
                      onClick={() => setN((v) => String((parseInt(v) || 0) - 1))}
                      edge="end"
                      size="small"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="increment N"
                      onClick={() => setN((v) => String((parseInt(v) || 0) + 1))}
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
              value={S}
              onChange={(e) => setS(e.target.value.replace(/[^\d-]/g, ""))}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="decrement S"
                      onClick={() => setS((v) => String((parseInt(v) || 0) - 1))}
                      edge="end"
                      size="small"
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      aria-label="increment S"
                      onClick={() => setS((v) => String((parseInt(v) || 0) + 1))}
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
