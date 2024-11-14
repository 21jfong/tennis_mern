import React from "react";

import { Typography, Card, Grid2 } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";

const PlayerCard = ({ players }) => {
  return (
    <Grid2 container direction="column" sx={{ gap: 1 }}>
      {players.length > 0 ? (
        players.map((player, index) => (
          <Card
            sx={{
              bgcolor: "primary.main",
              padding: 1,
            }}
            key={player._id}
          >
            <Typography component="p">
              {`${index + 1}.${"\u00A0".repeat(4)}${player.name}`}
            </Typography>
            <Typography sx={{ marginLeft: { xs: "1.5rem", md: "3rem" } }}>
              (Wins: 1 - Losses: 2)
            </Typography>
          </Card>
        ))
      ) : (
        <Typography>
          No Players <SentimentVeryDissatisfiedIcon />
        </Typography>
      )}
    </Grid2>
  );
};

export default PlayerCard;
