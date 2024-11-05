import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid2,
  Box,
  Grow,
  Card,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import useStyles from "../styles";
import { useNavigate, useParams } from "react-router-dom";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { createMatch } from "../../../../actions/matches";
import { getTeam } from "../../../../actions/teams";

import SelectFormControl from "./SelectFormControl";

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

    if (invalidForm()) return;

    const response = await dispatch(createMatch(matchData));
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
      setAlertMessage("Please enter a score.");
      setIsAlert(true);
      return true;
    }

    return false;
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
                <Card sx={{ bgcolor: "primary.lighter", padding: 2 }}>
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
                    </Grid2>

                    <Grid2 container justifyContent={"center"}>
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
                        <SelectFormControl
                          label="Winner"
                          value={matchData.players[winnerIndex]}
                          onChange={(e) => handleSelectChange(e, winnerIndex)}
                          players={players}
                          handleIsDisabled={handleIsDisabled}
                        />

                        {doubles && (
                          <SelectFormControl
                            label="Winner"
                            value={matchData.players[winnerTwoIndex]}
                            onChange={(e) =>
                              handleSelectChange(e, winnerTwoIndex)
                            }
                            players={players}
                            handleIsDisabled={handleIsDisabled}
                          />
                        )}
                      </Grid2>

                      <Grid2>
                        <SelectFormControl
                          label="Loser"
                          value={matchData.players[loserIndex]}
                          onChange={(e) => handleSelectChange(e, loserIndex)}
                          players={players}
                          handleIsDisabled={handleIsDisabled}
                        />

                        {doubles && (
                          <SelectFormControl
                            label="Loser"
                            value={matchData.players[loserTwoIndex]}
                            onChange={(e) =>
                              handleSelectChange(e, loserTwoIndex)
                            }
                            players={players}
                            handleIsDisabled={handleIsDisabled}
                          />
                        )}
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
                      required
                    />
                  </Grid2>

                  <Grid2 container justifyContent="flex-end">
                    <Button
                      className={classes.buttonSubmit}
                      variant="contained"
                      color="secondary"
                      type="submit"
                      sx={{ m: 2 }}
                    >
                      Submit
                    </Button>
                  </Grid2>
                </Card>
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
