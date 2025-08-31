import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import dayjs from "dayjs";
import MonthSidebar from "./MonthSidebar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  fetchUserMonthStats,
  fetchTeamMonthStats,
  saveUserDayStat,
  fetchTeams,
  fetchTeam,
} from "../../api";

function Tracking() {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [N, setN] = useState("");
  const [S, setS] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [monthStats, setMonthStats] = useState({});
  const [teamMonthPicker, setTeamMonthPicker] = useState(dayjs());

  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.result?._id;
  const [captainTeams, setCaptainTeams] = useState([]); // [{ _id, name, players }]

  // Fetch all teams for the user and filter for captain status
  useEffect(() => {
    const loadTeams = async () => {
      if (!userId) return;
      try {
        const res = await fetchTeams();
        // res.data should be an array of teams
        const teams = res.data || [];
        const myCaptainTeams = teams.filter(
          (team) => String(team.captain?._id) === String(userId)
        );
        // Populate players for each team
        const teamsWithPlayers = await Promise.all(
          myCaptainTeams.map(async (team) => {
            if (!team.players || typeof team.players[0] === "string") {
              // Need to fetch full team info
              const tRes = await fetchTeam(team._id);
              return { ...team, players: tRes.data.players };
            }
            return team;
          })
        );
        setCaptainTeams(teamsWithPlayers);
      } catch (err) {
        setCaptainTeams([]);
      }
    };
    loadTeams();
  }, [userId]);

  // Player stats for captain/team view
  const [playerMonthStats, setPlayerMonthStats] = useState({});

  // Copy all players' stats for the month as TSV
  const handleCopyTeamStats = (team, monthDate) => {
    if (!team.players.length) {
      alert("No team players found to copy stats for.");
      return;
    }
    const monthObj = monthDate || dayjs();
    const daysInMonth = monthObj.daysInMonth();
    const monthStart = monthObj.startOf("month");
    // Header row: player names, each with 3 columns (name, empty, empty), then 3 empty columns for spacing
    let rows = [];
    let header = [];
    team.players.forEach((player) => {
      header.push(player.name, '', '');
      header.push(''); // single space after each player
    });
    rows.push(header.join('\t'));
    // Second row: N, S for each player, then 1 empty column for spacing
    let subHeader = [];
    team.players.forEach(() => {
      subHeader.push('N', 'S');
      subHeader.push('');
    });
    rows.push(subHeader.join('\t'));
    // Data rows
    for (let d = 1; d <= daysInMonth; d++) {
      let row = [];
      const dateObj = monthStart.date(d);
      const dateStr = dateObj.format("YYYY-MM-DD");
      team.players.forEach((player) => {
        const stats = playerMonthStats[player._id]?.[dateStr] || {};
        const nVal = stats.N === undefined || stats.N === null || stats.N === "" ? "0" : stats.N;
        const sVal = stats.S === undefined || stats.S === null || stats.S === "" ? "0" : stats.S;
        row.push(nVal, sVal);
        row.push(''); // single space after each player
      });
      rows.push(row.join('\t'));
    }
    const tsv = rows.join('\n');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(tsv);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = tsv;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
  };

  // Load stats for selected day

  // Auto-populate N and S from monthStats when selecting a date
  useEffect(() => {
    const stats = monthStats[selectedDate.format("YYYY-MM-DD")] || {
      N: "",
      S: "",
    };
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

  // Load all player stats for the month for all captain teams
  useEffect(() => {
    const loadAllPlayerMonthStats = async () => {
      if (!captainTeams.length) return;
      const month = selectedDate.format("YYYY-MM");
      let mergedStats = {};
      for (const team of captainTeams) {
        try {
          const res = await fetchTeamMonthStats(team._id, month);
          const arr = res.data?.stats || [];
          const players = res.data?.players || [];
          for (const player of players) {
            if (!mergedStats[player._id]) mergedStats[player._id] = {};
          }
          for (const entry of arr) {
            if (mergedStats[entry.user]) {
              mergedStats[entry.user][entry.date] = { N: entry.N, S: entry.S };
            }
          }
        } catch (err) {
          // skip this team if error
        }
      }
      setPlayerMonthStats(mergedStats);
    };
    loadAllPlayerMonthStats();
  }, [selectedDate, captainTeams]);

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
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={2}>
        <Box flexShrink={0} width={{ xs: "100%", md: 280 }}>
          <MonthSidebar
            monthStats={monthStats}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
        </Box>
        <Box flexGrow={1}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Typography variant="h5" flexGrow={1}>
                Daily Tracking
              </Typography>
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
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="decrement N"
                        onClick={() =>
                          setN((v) => String((parseInt(v) || 0) - 1))
                        }
                        edge="end"
                        size="small"
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="increment N"
                        onClick={() =>
                          setN((v) => String((parseInt(v) || 0) + 1))
                        }
                        edge="end"
                        size="small"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <TextField
              label="S"
              value={S}
              onChange={(e) => setS(e.target.value.replace(/[^\d-]/g, ""))}
              fullWidth
              margin="normal"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="decrement S"
                        onClick={() =>
                          setS((v) => String((parseInt(v) || 0) - 1))
                        }
                        edge="end"
                        size="small"
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="increment S"
                        onClick={() =>
                          setS((v) => String((parseInt(v) || 0) + 1))
                        }
                        edge="end"
                        size="small"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
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

          {captainTeams.length > 0 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 8, mb: 2 }}
            >
              <Paper
                elevation={2}
                sx={{
                  minWidth: 280,
                  maxWidth: 380,
                  width: "100%",
                  borderRadius: 2.5,
                  px: 3,
                  py: 2.5,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    color: "text.primary",
                    letterSpacing: 0.5,
                    mb: 1.2,
                  }}
                >
                  Teams
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    views={["year", "month"]}
                    label="Select Month"
                    value={teamMonthPicker}
                    onChange={(newValue) => setTeamMonthPicker(newValue)}
                    sx={{ mb: 2, width: "100%" }}
                  />
                </LocalizationProvider>
                <Box
                  display="flex"
                  flexDirection="column"
                  gap={0.5}
                  width="100%"
                >
                  {captainTeams.map((team, idx) => (
                    <Box
                      key={team._id}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{
                        py: 0.5,
                        px: 0.5,
                        borderBottom:
                          idx !== captainTeams.length - 1
                            ? "1px solid #e0e0e0"
                            : "none",
                        fontSize: 16,
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 500, color: "text.primary", flex: 1 }}
                      >
                        {team.name}
                      </Typography>
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={() => handleCopyTeamStats(team, teamMonthPicker)}
                        sx={{
                          ml: 1,
                          color: "#fff",
                          fontWeight: 600,
                          minWidth: 90,
                          boxShadow: 1,
                        }}
                      >
                        Copy
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default Tracking;
