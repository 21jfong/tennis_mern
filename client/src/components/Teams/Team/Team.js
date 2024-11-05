import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useStyles from "./styles";

import {
  Card,
  CardContent,
  Grid2,
  Button,
  Typography,
  Paper,
  Grow,
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
          <Grid2 container sx={{ gap: { xs: 1, md: 20 } }}>
            <Typography color="primary">
              <strong>Team code: </strong>
              {`${team?.teamCode}`}
            </Typography>
            <Typography color="primary">
              <strong>Captain: </strong>
              {`${team?.captain?.name}`}
            </Typography>
            <Button variant="contained" onClick={() => handleCreateMatch(id)}>
              Register Match
            </Button>
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

            <Card className={classes.card} sx={{ bgcolor: "primary.lighter" }}>
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
                {matches.length > 0 ? (
                  matches.map((match, index) => (
                    <Typography key={match._id}>{match.date}</Typography>
                  ))
                ) : (
                  <Typography>No Matches Yet</Typography>
                )}
              </CardContent>
            </Card>
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
