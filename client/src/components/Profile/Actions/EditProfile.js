import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  Avatar,
  IconButton,
  Box,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { getAuthPlayer, updateAuthPlayer } from "../../../actions/authPlayer";

const EditProfile = ({ setIsAlert, setAlertMessage }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const player = useSelector((state) => state.authPlayer);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    racket: "",
    utr: "",
    bio: "",
    imageURL: "", // Cloudinary URL will be stored here
  });

  const [preview, setPreview] = useState(""); // For avatar preview

  useEffect(() => {
    const fetchData = async () => {
      const playerRes = await dispatch(getAuthPlayer(id));
      checkForAlert(playerRes);
    };

    fetchData();
  }, [id, dispatch]);

  useEffect(() => {
    if (player) {
      setFormData({
        name: player.name || "",
        location: player.location || "",
        racket: player.racket || "",
        utr: player.utr || "",
        bio: player.bio || "",
        imageURL: player.imageURL || "",
      });
      setPreview(player.imageURL || "");
    }
  }, [player]);

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 200) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        handleImageUpload(file); // Upload to backend
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to upload image to backend, which then uploads to Cloudinary
  const handleImageUpload = (file) => {
    const formData = new FormData();
    formData.append("image", file);

    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.url) {
          console.log("Image uploaded successfully:", data.url);
          // Save the URL in formData so it gets submitted with the profile
          setFormData((prev) => ({ ...prev, imageURL: data.url }));
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateRes = await dispatch(updateAuthPlayer(id, formData));
    checkForAlert(updateRes);
    navigate(`/player/${id}`);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Edit Profile
        </Typography>

        {/* Avatar Upload */}
        <Box position="relative" display="flex" justifyContent="center" mb={3}>
          <Avatar
            src={preview}
            sx={{ width: 120, height: 120, bgcolor: "primary.lighter" }}
          >
            {formData.name ? formData.name.charAt(0) : "P"}
          </Avatar>
          <IconButton
            component="label"
            sx={{
              position: "absolute",
              bottom: 0,
              right: "calc(50% - 30px)",
              bgcolor: "primary.main",
              border: "1px solid #ccc",
            }}
          >
            <EditIcon />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </IconButton>
        </Box>

        {/* Form Fields */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Racket"
              name="racket"
              value={formData.racket}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="UTR"
              name="utr"
              value={formData.utr}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />

            {/* Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProfile;
