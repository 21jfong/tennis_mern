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

import { joinTeam } from "../../../../actions/teams";

const JoinTeam = ({ setIsAlert, setAlertMessage }) => {
  const [teamCode, setTeamCode] = useState({ code: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const clear = () => setTeamCode({ code: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(joinTeam(teamCode.code));
    checkForAlert(response);
    navigate(-1);
    clear();
  };

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 200) {
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
              <Typography variant="h5" fontWeight={600} textAlign="center" color="white">
                Join a Team
              </Typography>

              <TextField
                name="code"
                label="Team Code"
                variant="outlined"
                fullWidth
                value={teamCode.code}
                onChange={(e) => setTeamCode({ code: e.target.value })}
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
                  Join
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Container>
    </Grow>
  );
};

export default JoinTeam;
