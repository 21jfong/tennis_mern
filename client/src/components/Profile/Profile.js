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
  Button,
} from "@mui/material";
import { getViewedPlayer } from "../../actions/viewedPlayer";

const Profile = ({ setIsAlert, setAlertMessage }) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const viewedPlayer = useSelector((state) => state.viewedPlayer);
  const [user] = useState(JSON.parse(localStorage.getItem("profile")));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const playerRes = await dispatch(getViewedPlayer(id));
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
        mt={6}
        mb={8}
      >
        <Avatar
          src={viewedPlayer?.imageURL || ""}
          alt={viewedPlayer?.name || "Player"}
          sx={{
            width: 150,
            height: 150,
            mr: { md: 4 },
            mb: { xs: 2, md: 0 },
            bgcolor: "primary.lighter",
            fontSize: 48,
          }}
        >
          {viewedPlayer?.name ? viewedPlayer.name.charAt(0) : "P"}
        </Avatar>
        <Box>
          <Typography variant="h3" fontWeight="bold" color="black">
            {viewedPlayer?.name || "Unnamed Player"}
          </Typography>
          <Typography variant="h6" color="primary.dark" mt={1}>
            {viewedPlayer?.location || "Unknown Location"}
          </Typography>

          {user?.result?._id === viewedPlayer?._id && (
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => navigate("edit")}
            >
              Edit Profile
            </Button>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 6 }} />

      {/* Info Section */}
      <Stack spacing={5}>
        <Box>
          <Typography variant="h6" color="primary.main" gutterBottom>
            Racket
          </Typography>
          <Typography variant="body1">
            {viewedPlayer?.racket || "Not specified"}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" color="primary.main" gutterBottom>
            UTR
          </Typography>
          <Typography variant="body1">
            {viewedPlayer?.utr ? viewedPlayer.utr : "No UTR available"}
          </Typography>
        </Box>

        <Box>
          <Typography variant="h6" color="primary.main" gutterBottom>
            About Me
          </Typography>
          <Typography variant="body1">
            {viewedPlayer?.bio || "This player hasn't written a bio yet."}
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
};

export default Profile;
