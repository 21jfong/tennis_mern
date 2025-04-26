import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Stack,
  Grow,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { createTeam } from "../../../../actions/teams";

const CreateTeam = ({ setIsAlert, setAlertMessage }) => {
  const [teamData, setTeamData] = useState({
    name: "",
    captain: null,
    players: [],
    teamCode: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("profile"));

  const clear = () => {
    setTeamData({ name: "", captain: null, players: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(createTeam({ ...teamData, captain: user }));
    checkForAlert(response);
    navigate("/my-teams");
    clear();
  };

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 201) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  };

  return (
    <Grow in>
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Box
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: "primary.main",
            boxShadow: 2,
          }}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Typography
                variant="h5"
                fontWeight={600}
                textAlign="center"
                color="white"
              >
                Create a Team
              </Typography>

              <TextField
                name="name"
                label="Team Name"
                variant="outlined"
                fullWidth
                value={teamData.name}
                onChange={(e) =>
                  setTeamData({ ...teamData, name: e.target.value })
                }
              />

              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={() => navigate(-1)}
                  sx={{
                    backgroundColor: "primary.dark",
                    "&:hover": {
                      backgroundColor: "primary.main",
                    },
                  }}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "primary.lighter",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  Create
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Container>
    </Grow>
  );
};

export default CreateTeam;
