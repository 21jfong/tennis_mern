import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  Typography,
  Grid2,
  Box,
  IconButton,
  Fade,
  Button,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import florin4 from "../../images/florin1.webp";
import florin2 from "../../images/florin2.webp";
import florin3 from "../../images/florin3.webp";
import florin1 from "../../images/florin4.webp";
import florin5 from "../../images/florin5.webp";
import florin6 from "../../images/florin6.webp";

import { checkHealth } from "../../actions/auth";

const Home = () => {
  const dispatch = useDispatch();
  const photos = [florin1, florin2, florin3, florin4, florin5, florin6];

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [view, setView] = useState(false);
  const totalPhotos = photos.length;

  useEffect(() => {
    const checkAwake = async () => {
      await dispatch(checkHealth());
    };

    checkAwake();
  }, []);

  const handleNext = () => {
    setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % totalPhotos);
  };

  const handlePrev = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? totalPhotos - 1 : prevIndex - 1
    );
  };
  return (
    <Grid2
      container
      justifyContent={"center"}
      direction="column"
      sx={{ gap: 3 }}
    >
      <Card sx={{ maxWidth: "250px", mx: "auto" }}>
        <CardContent>
          <Typography align="center">Tennis Tracking Website</Typography>
        </CardContent>
      </Card>

      {view ? (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          maxWidth="300px"
          mx="auto"
        >
          <IconButton
            onClick={handlePrev}
            sx={{
              position: "absolute",
              left: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <ArrowBackIosIcon />
          </IconButton>
          {photos.map((photo, index) => (
            <Fade in={index === currentPhotoIndex} key={index} timeout={500}>
              <Box
                component="img"
                src={photo}
                alt={`Photo ${index + 1}`}
                sx={{
                  display: index === currentPhotoIndex ? "block" : "none",
                  width: "100%",
                  borderRadius: 2,
                }}
              />
            </Fade>
          ))}
          <IconButton
            onClick={handleNext}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      ) : null}

      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          width: "fit-content",
        }}
      >
        <Button
          variant="contained"
          onClick={() => setView(!view)}
          sx={{
            width: "150px",
            borderRadius: "8px",
          }}
        >
          {view ? "Hide Florin" : "View Florin"}
        </Button>
      </Box>
    </Grid2>
  );
};

export default Home;
