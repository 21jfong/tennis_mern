import React, { useEffect, useState } from "react";

import { Card, CardContent, Grid2, Typography } from "@mui/material";
import dayjs from "dayjs";

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

  const getSeparator = (index, totalPlayers) => {
    if ((index + 1.0) / totalPlayers === 0.5) {
      return "\u00A0\u2014\u00A0"; // En dash separator for the middle
    }
    return index + 1 !== totalPlayers ? ",\u00A0" : "\u00A0"; // Comma or final space
  };

  return (
    <>
      {matches.length > 0 ? (
        <Grid2 container justifyContent="center" sx={{ gap: 2 }}>
          {matches.map((match) => (
            <Card
              sx={{
                width: { md: 275 },
                bgcolor: "primary.main",
                cursor: "pointer",
              }}
              key={match._id}
              onClick={() => handleMatchToggle(match._id)}
            >
              <CardContent>
                {expandedCards[match._id] ? (
                  <>
                    <Typography
                      gutterBottom
                      sx={{
                        color: "text.secondary",
                        fontSize: 14,
                      }}
                    >
                      {dayjs(match.date).format("MMMM D, YYYY -- h:mm A")}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ mb: 1.5 }}>
                      {match.score} (
                      {match.players.length > 2
                        ? `${match.players[0].name}, ${match.players[1].name}`
                        : match.players[0].name}
                      )
                    </Typography>
                    <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                      {match.players.length > 2 ? "Doubles" : "Singles"}
                    </Typography>
                    <Grid2 container>
                      {match.players.map((player, index) => (
                        <Typography sx={{ fontSize: ".9rem" }} key={player._id}>
                          {player.name}
                          {getSeparator(index, match.players.length)}
                        </Typography>
                      ))}
                    </Grid2>
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    {`Match on ${dayjs(match.date).format("MMMM D, YYYY")}`}
                    <br />
                    <strong>Click to expand</strong>
                  </Typography>
                )}
              </CardContent>
              {/* <CardActions>
              <Button size="small" color="secondary">
                View
              </Button>
            </CardActions> */}
            </Card>
          ))}
        </Grid2>
      ) : (
        <Typography>No Matches Yet</Typography>
      )}
    </>
  );
};

export default MatchCard;
