import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid2,
  Box,
  Grow,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import useStyles from "../styles";
import { useNavigate, useParams } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

import { createMatch } from "../../../../actions/matches";
import { getTeam } from "../../../../actions/teams";

const CreateMatch = ({ setIsAlert, setAlertMessage }) => {
  const [matchData, setMatchData] = useState({
    teams: [],
    players: [],
    score: "",
    date: null,
  });
  const [doubles, setDoubles] = React.useState(false);
  const team = useSelector((state) => state.teams);
  const [players, setPlayers] = React.useState(team.players);
  const [selectedPlayers, setSelectedPlayers] = React.useState([]);
  const [error, setError] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();

  const winnerIndex = 0;
  const winnerTwoIndex = 1;
  const loserIndex = doubles ? 2 : 1;
  const loserTwoIndex = 3;
  const scoreRegex =
    /^([0-8]-[0-8])\s([0-8]-[0-8])(\s(1[0-9]|[2-9][0-9]|[1-9]\d?)-[1-9]\d?)?$/; // Matches the format "2-6 2-6 16-14"

  useEffect(() => {
    const fetchData = async () => {
      const team = await dispatch(getTeam(id));
      checkForAlert(team);
    };

    fetchData();
  }, [id, dispatch]);

  const handleScoreChange = (e) => {
    const value = e.target.value;
    setMatchData({ ...matchData, score: value });

    if (scoreRegex.test(value)) {
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(createMatch({}));
    checkForAlert(response);
    navigate(-1);
  };

  const handleSelectChange = (event, index) => {
    let newPlayers = [...matchData.players];
    newPlayers[index] = event.target.value;
    let shownPlayers = players.filter((player) => !newPlayers.includes(player));
    const selected = team.players.filter(
      (player) =>
        !shownPlayers.some((shownPlayer) => shownPlayer._id === player._id)
    );
    setSelectedPlayers(selected);
    setMatchData({ ...matchData, players: newPlayers });
  };

  const handleDoublesChange = (event) => {
    setDoubles(event.target.checked);
    const newPlayers = [
      matchData.players[0],
      ...(doubles ? [matchData.players[2]] : [undefined, matchData.players[1]]),
    ];
    setSelectedPlayers(newPlayers);
    setMatchData({ ...matchData, players: newPlayers });
  };

  const handleIsDisabled = (player) => {
    return selectedPlayers.some((p) => p?._id === player._id);
  };

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 201) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  };

  return (
    <Box>
      {players ? (
        <Grow in>
          <Grid2 container direction="column" sx={{ gap: 2 }}>
            <Paper
              sx={{ backgroundColor: (theme) => theme.palette.primary.main }}
              className={classes.paper}
            >
              <form
                autoComplete="off"
                noValidate
                className={`${classes.root} ${classes.form}`}
                onSubmit={handleSubmit}
              >
                <Box>
                  <Grid2 container justifyContent={"center"}>
                    <Typography variant="h6">Registering Match</Typography>
                  </Grid2>
                  <Grid2 container direction="column">
                    <Grid2 container justifyContent={"center"}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DateTimePicker
                          label="Match date and time"
                          defaultValue={dayjs()}
                          onChange={(e) =>
                            setMatchData({ ...matchData, date: e })
                          }
                        />
                      </LocalizationProvider>

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={doubles}
                            label="Doubles"
                            onChange={handleDoublesChange}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                        }
                        label="Doubles"
                      />
                    </Grid2>

                    <Grid2 container sx={{ gap: { md: 5 } }}>
                      <Grid2>
                        <FormControl sx={{ m: 1, minWidth: 100 }}>
                          <InputLabel>Winner</InputLabel>
                          <Select
                            value={matchData.players[winnerIndex] || ""}
                            onChange={(e) => handleSelectChange(e, winnerIndex)}
                            autoWidth
                            label="Winner"
                          >
                            {players?.length > 0
                              ? players.map((player) => (
                                  <MenuItem
                                    key={player._id}
                                    value={player}
                                    disabled={handleIsDisabled(player)}
                                  >
                                    {player.name}
                                  </MenuItem>
                                ))
                              : null}
                          </Select>
                        </FormControl>

                        {doubles ? (
                          <FormControl sx={{ m: 1, minWidth: 100 }}>
                            <InputLabel id="winner-two-label">
                              Winner
                            </InputLabel>
                            <Select
                              value={matchData.players[winnerTwoIndex] || ""}
                              onChange={(e) =>
                                handleSelectChange(e, winnerTwoIndex)
                              }
                              autoWidth
                              label="Winner"
                            >
                              {players?.length > 0
                                ? players.map((player) => (
                                    <MenuItem
                                      key={player._id}
                                      value={player}
                                      disabled={handleIsDisabled(player)}
                                    >
                                      {player.name}
                                    </MenuItem>
                                  ))
                                : null}
                            </Select>
                          </FormControl>
                        ) : null}
                      </Grid2>

                      <Grid2>
                        <FormControl sx={{ m: 1, minWidth: 100 }}>
                          <InputLabel id="loser-select-label">Loser</InputLabel>
                          <Select
                            value={matchData.players[loserIndex] || ""}
                            onChange={(e) => handleSelectChange(e, loserIndex)}
                            autoWidth
                            label="Loser"
                          >
                            {players?.length > 0
                              ? players.map((player) => (
                                  <MenuItem
                                    key={player._id}
                                    value={player}
                                    disabled={handleIsDisabled(player)}
                                  >
                                    {player.name}
                                  </MenuItem>
                                ))
                              : null}
                          </Select>
                        </FormControl>

                        {doubles ? (
                          <FormControl sx={{ m: 1, minWidth: 100 }}>
                            <InputLabel id="loser-two-select-label">
                              Loser
                            </InputLabel>
                            <Select
                              value={matchData.players[loserTwoIndex] || ""}
                              onChange={(e) =>
                                handleSelectChange(e, loserTwoIndex)
                              }
                              autoWidth
                              label="Loser"
                            >
                              {players?.length > 0
                                ? players.map((player) => (
                                    <MenuItem
                                      key={player._id}
                                      value={player}
                                      disabled={handleIsDisabled(player)}
                                    >
                                      {player.name}
                                    </MenuItem>
                                  ))
                                : null}
                            </Select>
                          </FormControl>
                        ) : null}
                      </Grid2>
                    </Grid2>

                    <TextField
                      name="Score"
                      variant="outlined"
                      label="Score (2-6 2-6)"
                      value={matchData.score}
                      onChange={handleScoreChange}
                      error={error}
                      helperText={
                        error ? "Format must be 'X-Y X-Y' or 'X-Y X-Y X-Y'" : ""
                      }
                    />
                  </Grid2>

                  <Grid2 container justifyContent="flex-end">
                    <Button
                      className={classes.buttonSubmit}
                      variant="contained"
                      color="secondary"
                      type="submit"
                    >
                      Submit
                    </Button>
                  </Grid2>
                </Box>
              </form>
            </Paper>
            <Grid2 container justifyContent="flex-end">
              <Button variant="contained" onClick={() => navigate(-1)}>
                Back
              </Button>
            </Grid2>
          </Grid2>
        </Grow>
      ) : (
        <Box>
          <Typography>
            Something went wrong, please go back to the previous page and try
            again.
          </Typography>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Back
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CreateMatch;
