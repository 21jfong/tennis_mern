import React, { useEffect, useState } from "react";
import { Button, Container, Typography, Grow, Box, Stack } from "@mui/material";
import { Link as React_Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { getTeams } from "../../actions/teams";

const Teams = ({ setIsAlert, setAlertMessage }) => {
  const teams = useSelector((state) => state.teams);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = localStorage.getItem("profile");
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getTeams(user));
      setLoading(false);
      checkForAlert(response);
    };

    fetchData();
  }, []);

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 200) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  };

  const getTeamLink = (teamId) => {
    return location.pathname.includes("/my-teams")
      ? `${teamId}`
      : `/my-teams/${teamId}`;
  };

  const handleCreateTeam = () => navigate("/my-teams/create-team");
  const handleJoinTeam = () => navigate("/my-teams/join-team");

  return (
    <Grow in>
      <Container maxWidth="md" sx={{ mt: 6 }}>
        <Stack spacing={4}>
          <Typography variant="h4" fontWeight={600}>
            My Teams
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button variant="contained" onClick={handleCreateTeam}>
              Create Team
            </Button>
            <Button variant="outlined" onClick={handleJoinTeam}>
              Join Team
            </Button>
          </Stack>

          {loading ? null : teams.length > 0 ? (
            <Stack spacing={2}>
              {teams.map((team) => (
                <Box
                  key={team._id}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "secondary.main",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.2s",
                    "&:hover": {
                      backgroundColor: "primary.lighter",
                    },
                  }}
                >
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      color="white"
                    >
                      {team.name}
                    </Typography>
                    <Typography variant="body2" color="Grey">
                      Captain: {team.captain.name}
                    </Typography>
                  </Box>

                  <Button
                    component={React_Link}
                    to={getTeamLink(team._id)}
                    variant="text"
                    endIcon={<ArrowForwardIosIcon fontSize="small" />}
                    sx={{ minWidth: "fit-content", color: "white" }}
                  >
                    View
                  </Button>
                </Box>
              ))}
            </Stack>
          ) : (
            <Typography variant="h6" color="text.secondary">
              No Teams Available
            </Typography>
          )}
        </Stack>
      </Container>
    </Grow>
  );
};

export default Teams;
