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
import heic2any from "heic2any";
import imageCompression from "browser-image-compression";

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
    imageURL: "",
  });
  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Clean up blob URLs on unmount or when preview changes
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // Load existing player data
  useEffect(() => {
    dispatch(getAuthPlayer(id)).then((res) => {
      if (res?.status && res.status !== 200) {
        setAlertMessage(res.response.data.message);
        setIsAlert(true);
      }
    });
  }, [id, dispatch, setAlertMessage, setIsAlert]);

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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Detect HEIC
    const isHeic =
      file.type === "image/heic" ||
      file.name.toLowerCase().endsWith(".heic") ||
      file.name.toLowerCase().endsWith(".heif");

    let processedFile = file;

    if (isHeic) {
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: "image/jpeg",
        });
        processedFile = new File(
          [convertedBlob],
          file.name.replace(/\.(heic|heif)$/i, ".jpeg"),
          {
            type: "image/jpeg",
          }
        );
      } catch (err) {
        console.error("HEIC conversion failed", err);
      }
    }

    try {
      // Compress and resize image
      const compressedFile = await imageCompression(processedFile, {
        maxSizeMB: 1, // Max size in MB
        maxWidthOrHeight: 1920, // Resize image if width or height exceeds this
        useWebWorker: true,
      });

      // Save compressed image to state
      setSelectedFile(compressedFile);

      // Generate preview
      const previewURL = URL.createObjectURL(compressedFile);
      setPreview(previewURL);
    } catch (err) {
      console.error("Image compression failed", err);
      // Fallback to using the original file
      setSelectedFile(processedFile);
      setPreview(URL.createObjectURL(processedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageURL = formData.imageURL;

    if (selectedFile) {
      setIsUploading(true);
      try {
        const uploadData = new FormData();
        uploadData.append("image", selectedFile);

        const response = await fetch(`${process.env.REACT_APP_API_URL}upload`, {
          method: "POST",
          body: uploadData,
        });
        const data = await response.json();

        if (data.url) {
          imageURL = data.url;
        } else {
          throw new Error("Upload failed: No URL returned");
        }
      } catch (err) {
        console.error("Image upload failed:", err);
        setAlertMessage(err);
        setIsAlert(true);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    const payload = { ...formData, imageURL };
    const updateRes = await dispatch(updateAuthPlayer(id, payload));
    if (updateRes?.status && updateRes.status !== 200) {
      setAlertMessage(updateRes.response.data.message);
      setIsAlert(true);
    } else {
      navigate(`/player/${id}`);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCancel = () => navigate(-1);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Edit Profile
        </Typography>

        <Box position="relative" display="flex" justifyContent="center" mb={3}>
          <Avatar
            src={preview}
            sx={{ width: 120, height: 120, bgcolor: "primary.lighter" }}
          >
            {formData.name.charAt(0) || "P"}
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
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleCancel}
                sx={{
                  backgroundColor: "primary.dark",
                  "&:hover": {
                    backgroundColor: "primary.lighter",
                  },
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" disabled={isUploading}>
                {isUploading ? "Uploading..." : "Save Changes"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default EditProfile;
