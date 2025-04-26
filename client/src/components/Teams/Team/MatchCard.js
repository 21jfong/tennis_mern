import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Grid2,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
// import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Optional icon

const MatchCard = ({ matches }) => {
  const [expandedCards, setExpandedCards] = useState({});

  useEffect(() => {
    if (matches.length > 0) {
      const initialExpandedState = matches.reduce((acc, match) => {
        acc[match._id] = true;
        return acc;
      }, {});
      setExpandedCards(initialExpandedState);
    }
  }, [matches]);

  const handleMatchToggle = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return matches.length > 0 ? (
    <Grid2 container justifyContent="center" sx={{ gap: 2 }}>
      {matches.map((match) => {
        const isDoubles = match.players.length > 2;
        const winnerNames = match.players
          .slice(0, isDoubles ? 2 : 1)
          .map((p) => p.name)
          .join(", ");
        const loserNames = match.players
          .slice(isDoubles ? 2 : 1)
          .map((p) => p.name)
          .join(", ");

        return (
          <Card
            key={match._id}
            onClick={() => handleMatchToggle(match._id)}
            sx={{
              width: { md: 275 },
              bgcolor: "primary.dark",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: 3,
              cursor: "pointer",
              transition: "0.3s",
              "&:hover": { boxShadow: 6 },
            }}
          >
            <CardContent>
              {expandedCards[match._id] ? (
                <>
                  <Typography
                    gutterBottom
                    sx={{ color: "text.secondary", fontSize: 14 }}
                  >
                    {dayjs(match.date).format("MMMM D, YYYY — h:mm A")}
                  </Typography>

                  <Typography variant="h6" component="div">
                    {match.score}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    sx={{ color: "text.secondary", mb: 1 }}
                  >
                    {isDoubles ? "Doubles" : "Singles"}
                  </Typography>

                  <Divider sx={{ mb: 1 }} />

                  <Box>
                    <Typography variant="subtitle2" color="success.main">
                      {/* <EmojiEventsIcon fontSize="small" sx={{ mr: 0.5 }} /> */}
                      Winner{isDoubles ? "s" : ""}:
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      {winnerNames}
                    </Typography>

                    <Typography variant="subtitle2" color="error.main">
                      Loser{isDoubles ? "s" : ""}:
                    </Typography>
                    <Typography variant="body2">{loserNames}</Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  {`Match on ${dayjs(match.date).format("MMM D, YYYY")} | ${
                    match.score
                  }`}
                  <br />
                  <strong>Click to expand</strong>
                </Typography>
              )}
            </CardContent>
          </Card>
        );
      })}
    </Grid2>
  ) : (
    <Typography>No Matches Yet</Typography>
  );
};

export default MatchCard;
