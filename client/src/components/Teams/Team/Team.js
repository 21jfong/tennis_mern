import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useStyles from "./styles";
import dayjs from "dayjs";

import {
  Card,
  CardContent,
  CardActions,
  Grid2,
  Button,
  Typography,
  Paper,
  Grow,
  Box,
  Tabs,
  Tab,
} from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

import { getTeam } from "../../../actions/teams";
import { getMatches } from "../../../actions/matches";

const Team = ({ setIsAlert, setAlertMessage }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const team = useSelector((state) => state.teams);
  const matches = useSelector((state) => state.matches);
  const user = JSON.parse(localStorage.getItem("profile"));

  const [tab, setTab] = React.useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const team = await dispatch(getTeam(id));
      const matches = await dispatch(getMatches(id));
      checkForAlert(team);
      checkForAlert(matches);
    };

    fetchData();
  }, [id, dispatch]);

  const handleEdit = (id) => {
    navigate(`/my-teams/${id}/edit-team`);
  };

  const handleCreateMatch = (id) => {
    navigate(`/${id}/matches/create-match/`);
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 200) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  };

  return (
    <Grow in>
      <Grid2
        container
        direction="column"
        justifyContent="space-between"
        sx={{ gap: 2 }}
      >
        <Grid2>
          <Grid2
            container
            direction={{ xs: "column", md: "row" }}
            justifyContent={{ xs: "flex-start", md: "space-between" }}
            alignItems={{ md: "center" }}
            sx={{ gap: { md: 15 }, marginBottom: 2 }}
          >
            <Grid2 xs="auto">
              <Typography color="primary">
                <strong>Team code: </strong>
                {`${team?.teamCode}`}
              </Typography>
            </Grid2>
            <Grid2 xs="auto">
              <Typography color="primary">
                <strong>Captain: </strong>
                {`${team?.captain?.name}`}
              </Typography>
            </Grid2>

            <Grid2 xs="auto" sx={{ mt: { xs: 1, md: 0 }, ml: "auto" }}>
              <Button variant="contained" onClick={() => handleCreateMatch(id)}>
                Register Match
              </Button>
            </Grid2>
          </Grid2>

          <Paper className={classes.paper} sx={{ bgcolor: "primary.main" }}>
            <Typography
              variant="h3"
              sx={{
                padding: { xs: 1, md: 2 },
                fontSize: { xs: "1.5rem", md: "2rem" },
              }}
            >
              {team.name}
            </Typography>

            <Tabs
              value={tab}
              onChange={handleTabChange}
              centered
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab label="Team View" />
              <Tab label="Matches" />
            </Tabs>

            {tab === 1 ? (
              <Card
                className={classes.card}
                sx={{ bgcolor: "primary.lighter" }}
              >
                <CardContent>
                  <Typography
                    variant="h3"
                    sx={{
                      padding: { xs: 1, md: 2 },
                      fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                  >
                    Recent Matches
                  </Typography>
                  <hr />
                  <Box
                    sx={{
                      maxHeight: { xs: 300, md: 400 },
                      overflowY: "auto",
                      padding: 2,
                    }}
                  >
                    {matches.length > 0 ? (
                      <Grid2 container sx={{ gap: 2 }}>
                        {matches.map((match, index) => (
                          <Card
                            sx={{ minWidth: 200, bgcolor: "primary.main" }}
                            key={match._id}
                          >
                            <CardContent>
                              <Typography
                                gutterBottom
                                sx={{ color: "text.secondary", fontSize: 14 }}
                              >
                                {dayjs(match.date).format(
                                  "MMMM D, YYYY -- h:mm A"
                                )}
                              </Typography>
                              <Typography
                                variant="h6"
                                component="div"
                                sx={{ mb: 1.5 }}
                              >
                                <strong>{match.score}</strong> (
                                {match.players.length > 2
                                  ? `${match.players[0].name}, ${match.players[1].name}`
                                  : match.players[0].name}
                                )
                              </Typography>
                              <Grid2 container>
                                {match.players.map((player, index) => (
                                  <Typography
                                    sx={{ fontSize: ".9rem" }}
                                    key={player._id}
                                  >
                                    {player.name}
                                    {(index + 1.0) / match.players.length ===
                                    0.5
                                      ? "\u00A0\u2014\u00A0"
                                      : "\u00A0"}
                                  </Typography>
                                ))}
                              </Grid2>
                            </CardContent>
                            <CardActions>
                              <Button size="small" color="secondary">
                                View
                              </Button>
                            </CardActions>
                          </Card>
                        ))}
                      </Grid2>
                    ) : (
                      <Typography>No Matches Yet</Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            ) : (
              <Card
                className={classes.card}
                sx={{ minWidth: 150, bgcolor: "primary.lighter" }}
              >
                <CardContent>
                  <Typography
                    variant="h3"
                    sx={{
                      padding: { xs: 1, md: 2 },
                      fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                  >
                    Roster
                  </Typography>
                  <hr />
                  {team?.players?.length > 0 ? (
                    team?.players.map((player, index) => (
                      <Typography component="p" key={player._id}>
                        {`${index + 1}.${"\u00A0".repeat(4)}${player.name}`}
                      </Typography>
                    ))
                  ) : (
                    <Typography>
                      No Players <SentimentVeryDissatisfiedIcon />
                    </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Paper>
        </Grid2>
        <Grid2 container justifyContent="flex-end" sx={{ gap: 2 }}>
          <Button variant="contained" onClick={() => navigate(-1)}>
            Back
          </Button>

          {team?.captain?.user_id === user.result._id ? (
            <Button variant="contained" onClick={() => handleEdit(id)}>
              Edit Team
            </Button>
          ) : null}
        </Grid2>
      </Grid2>
    </Grow>
  );
};

export default Team;
