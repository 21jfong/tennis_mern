import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Typography,
  Container,
  Avatar,
  Stack,
  Box,
  Divider,
  Grid2,
  Paper,
  Button,
} from "@mui/material";

import { getPlayer } from "../../actions/player";

const Profile = ({ setIsAlert, setAlertMessage }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const player = useSelector((state) => state.player);
  const [user] = useState(JSON.parse(localStorage.getItem("profile")));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const playerRes = await dispatch(getPlayer(id));
      checkForAlert(playerRes);
    };

    fetchData();
  }, [id, dispatch]);

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 200) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  };

  return (
    <Container maxWidth="md">
      {/* Top Section */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="center"
        justifyContent="center"
        textAlign={{ xs: "center", md: "left" }}
        mb={5}
      >
        <Avatar
          src={user?.result?.imageURL || ""}
          alt={player?.name || "Player"}
          sx={{
            width: 150,
            height: 150,
            mr: { md: 4 },
            mb: { xs: 2, md: 0 },
            bgcolor: "primary.lighter",
          }}
        >
          {player?.name ? player.name.charAt(0) : "P"}
        </Avatar>
        <Box>
          <Typography variant="h3" fontWeight="bold" color="black">
            {player?.name || "Unnamed Player"}
          </Typography>
          <Typography variant="h6" color="primary.dark" mt={1}>
            {player?.location || "Unknown Location"}
          </Typography>

          {/* Edit Button appears only for own profile */}
          {user?.result?._id === player?._id && (
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => navigate(`edit`)}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Main Info Section */}
      <Grid2 container spacing={4}>
        {/* Left Info */}
        <Grid2 xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Racket
                </Typography>
                <Typography variant="body1">
                  {player?.racket || "Not specified"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  UTR
                </Typography>
                <Typography variant="body1">
                  {player?.utr ? player.utr : "No UTR available"}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid2>

        {/* Right Info */}
        <Grid2 xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: "100%" }}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                About Me
              </Typography>
              <Typography variant="body1" mt={1}>
                {player?.bio || "This player hasn't written a bio yet."}
              </Typography>
            </Box>
          </Paper>
        </Grid2>
      </Grid2>
    </Container>
  );
};

export default Profile;
