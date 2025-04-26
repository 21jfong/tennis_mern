import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useStyles from "./styles";

import {
  Typography,
  Container,
  Box,
  Grow,
  Grid2,
  Button,
  Card,
  CardContent,
  Stack,
} from "@mui/material";

import PlayerCard from "./PlayerCard";
import MatchCard from "./MatchCard";

import { getTeam } from "../../../actions/teams";
import { getMatches } from "../../../actions/matches";

const Team = ({ setIsAlert, setAlertMessage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const team = useSelector((state) => state.teams);
  const matches = useSelector((state) => state.matches);
  const user = JSON.parse(localStorage.getItem("profile"));
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      const teamRes = await dispatch(getTeam(id));
      const matchRes = await dispatch(getMatches(id));
      checkForAlert(teamRes);
      checkForAlert(matchRes);
    };

    fetchData();
  }, [id, dispatch]);

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 200) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  };

  const handleEdit = () => {
    navigate(`/my-teams/${id}/edit-team`);
  };

  const handleCreateMatch = () => {
    navigate(`/${id}/matches/create-match`);
  };

  return (
    <Grow in>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Stack spacing={4}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", md: "center" }}
            gap={2}
          >
            <Box>
              <Typography variant="body1" color="primary">
                <strong>Team Code:</strong> {team?.teamCode}
              </Typography>
              <Typography variant="body1" color="primary">
                <strong>Captain:</strong> {team?.captain?.name}
              </Typography>
            </Box>
            <Box display="flex" gap={2}>
              {team?.captain?._id === user?.result?._id && (
                <Button variant="contained" onClick={handleEdit}>
                  Edit Team
                </Button>
              )}
              <Button
                variant="contained"
                onClick={handleCreateMatch}
                sx={{ alignSelf: { xs: "stretch", md: "center" } }}
              >
                Register Match
              </Button>
            </Box>
          </Box>

          {/* Team Name */}
          <Typography
            variant="h4"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 1,
              fontSize: { xs: "1.8rem", md: "2.2rem" },
            }}
          >
            {team?.name}
          </Typography>

          <Card sx={{ bgcolor: "primary.lighter", borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  maxHeight: { xs: 400, md: 600 },
                  overflowY: "auto",
                  px: 1,
                }}
              >
                <PlayerCard
                  players={team?.players?.length > 0 ? team.players : []}
                  matches={matches}
                />
              </Box>
            </CardContent>
          </Card>

          <Grid2 container spacing={2} sx={{ mt: 2 }}>
            {/* Matches */}
            <Grid2 xs={12} md={6}>
              <Card
                className={classes.card}
                sx={{ bgcolor: "primary.lighter" }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{
                      paddingBottom: 2,
                      fontSize: { xs: "1.5rem", md: "2rem" },
                    }}
                  >
                    Recent Matches
                  </Typography>
                  <Box
                    sx={{
                      maxHeight: { xs: 300, md: 400 },
                      overflowY: "auto",
                      padding: 1,
                    }}
                  >
                    <MatchCard matches={matches} />
                  </Box>
                </CardContent>
              </Card>
            </Grid2>
          </Grid2>

          {/* Bottom Buttons */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              variant="contained"
              onClick={() => navigate(-1)}
              sx={{
                backgroundColor: "primary.lighter",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              }}
            >
              Back
            </Button>
          </Box>
        </Stack>
      </Container>
    </Grow>
  );
};

export default Team;
