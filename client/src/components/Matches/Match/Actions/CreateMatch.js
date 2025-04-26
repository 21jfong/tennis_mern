import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Grow,
  Card,
  Stack,
  FormControlLabel,
  Checkbox,
  Container,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

import { createMatch } from "../../../../actions/matches";
import { getTeam } from "../../../../actions/teams";

import SelectFormControl from "./SelectFormControl";

const CreateMatch = ({ setIsAlert, setAlertMessage }) => {
  const [matchData, setMatchData] = useState({
    teams: [],
    players: [],
    score: "",
    date: dayjs(),
  });

  const [doubles, setDoubles] = useState(false);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [error, setError] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const team = useSelector((state) => state.teams);
  const players = team?.players || [];

  const winnerIndex = 0;
  const winnerTwoIndex = 1;
  const loserIndex = doubles ? 2 : 1;
  const loserTwoIndex = 3;
  const scoreRegex =
    /^(?:[0-8]-[0-8] [0-8]-[0-8])(\s[0-8]-[0-8])*(\s\d+-\d+)?$/;

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getTeam(id));
      checkForAlert(response);
    };
    fetchData();
  }, [id, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (invalidForm()) return;

    const response = await dispatch(
      createMatch({ ...matchData, teams: [team] })
    );
    checkForAlert(response);
    navigate(-1);
  };

  const invalidForm = () => {
    if (!matchData.players[winnerIndex]) {
      setAlertMessage("Please select a winner.");
      setIsAlert(true);
      return true;
    }

    if (!matchData.players[loserIndex]) {
      setAlertMessage("Please select a loser.");
      setIsAlert(true);
      return true;
    }

    if (!scoreRegex.test(matchData.score)) {
      setError(true);
      return true;
    }

    return false;
  };

  const handleSelectChange = (event, index) => {
    const updatedPlayers = [...matchData.players];
    updatedPlayers[index] = event.target.value;

    const shownPlayers = players.filter((p) => !updatedPlayers.includes(p));

    const selected = players.filter(
      (p) => !shownPlayers.some((s) => s._id === p._id)
    );

    setSelectedPlayers(selected);
    setMatchData({ ...matchData, players: updatedPlayers });
  };

  const handleDoublesChange = (e) => {
    const isChecked = e.target.checked;
    setDoubles(isChecked);

    const updated = [
      matchData.players[0],
      ...(isChecked
        ? [undefined, matchData.players[1], undefined]
        : [matchData.players[2]]),
    ];
    setSelectedPlayers(updated);
    setMatchData({ ...matchData, players: updated });
  };

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 201) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  };

  const isDisabled = (player) =>
    selectedPlayers.some((p) => p?._id === player._id);

  return (
    <Grow in>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        {players.length > 0 ? (
          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
            <Paper sx={{ p: 3, bgcolor: "primary.main" }}>
              <Card sx={{ bgcolor: "primary.lighter", p: 3 }}>
                <Stack spacing={3}>
                  <Typography variant="h6" textAlign="center">
                    Register Match
                  </Typography>

                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Match date and time"
                      value={matchData.date}
                      onChange={(date) => setMatchData({ ...matchData, date })}
                      sx={{ width: "100%" }}
                    />
                  </LocalizationProvider>

                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={doubles}
                        onChange={handleDoublesChange}
                      />
                    }
                    label="Doubles Match"
                  />

                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    justifyContent="center"
                  >
                    {/* Winners */}
                    <Stack spacing={2}>
                      <SelectFormControl
                        label="Winner"
                        value={matchData.players[winnerIndex]}
                        onChange={(e) => handleSelectChange(e, winnerIndex)}
                        players={players}
                        handleIsDisabled={isDisabled}
                      />
                      {doubles && (
                        <SelectFormControl
                          label="Winner"
                          value={matchData.players[winnerTwoIndex]}
                          onChange={(e) =>
                            handleSelectChange(e, winnerTwoIndex)
                          }
                          players={players}
                          handleIsDisabled={isDisabled}
                        />
                      )}
                    </Stack>

                    {/* Losers */}
                    <Stack spacing={2}>
                      <SelectFormControl
                        label="Loser"
                        value={matchData.players[loserIndex]}
                        onChange={(e) => handleSelectChange(e, loserIndex)}
                        players={players}
                        handleIsDisabled={isDisabled}
                      />
                      {doubles && (
                        <SelectFormControl
                          label="Loser"
                          value={matchData.players[loserTwoIndex]}
                          onChange={(e) => handleSelectChange(e, loserTwoIndex)}
                          players={players}
                          handleIsDisabled={isDisabled}
                        />
                      )}
                    </Stack>
                  </Stack>

                  <TextField
                    label="Score (6-2 6-4)"
                    value={matchData.score}
                    onChange={(e) =>
                      setMatchData({ ...matchData, score: e.target.value })
                    }
                    error={error}
                    helperText={
                      error
                        ? "Must have at least 2 sets and optional tiebreaker"
                        : ""
                    }
                    required
                  />

                  <Box display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      variant="contained"
                      onClick={() => navigate(-1)}
                      sx={{
                        backgroundColor: "secondary",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                    >
                      Back
                    </Button>
                    <Button type="submit" variant="contained" color="secondary">
                      Submit
                    </Button>
                  </Box>
                </Stack>
              </Card>
            </Paper>
          </form>
        ) : (
          <Box textAlign="center">
            <Typography>
              Something went wrong. Please go back and try again.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{
                mt: 2,
              }}
            >
              Back
            </Button>
          </Box>
        )}
      </Container>
    </Grow>
  );
};

export default CreateMatch;
