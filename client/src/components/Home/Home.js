import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid2,
  Box,
  IconButton,
  Fade,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import florin1 from "../../images/florin1.webp";
import florin2 from "../../images/florin2.webp";
import florin3 from "../../images/florin3.webp";
import florin4 from "../../images/florin4.webp";
import florin5 from "../../images/florin5.webp";
import florin6 from "../../images/florin6.webp";

const Home = () => {
  const photos = [florin1, florin2, florin3, florin4, florin5, florin6];

  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const totalPhotos = photos.length;

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
    </Grid2>
  );
};

export default Home;
