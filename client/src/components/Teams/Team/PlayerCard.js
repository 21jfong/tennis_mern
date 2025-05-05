import React, { useEffect, useState } from "react";
import { Link as React_Link } from "react-router-dom";
import { Typography, Card, Grid2, Button, Container } from "@mui/material";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const PlayerCard = ({ players, matches }) => {
  const [playerStats, setPlayerStats] = useState({});
  const [sortedPlayers, setSortedPlayers] = useState([]);

  useEffect(() => {
    calcRank();
  }, [matches]);

  const calcRank = () => {
    const stats = {};

    // Calculate wins and losses for each player
    matches.forEach((match) => {
      const { players } = match;

      if (players.length === 2) {
        const winner = players[0];
        const loser = players[1];

        if (!stats[winner._id]) stats[winner._id] = [0, 0];
        stats[winner._id][0] += 1;

        if (!stats[loser._id]) stats[loser._id] = [0, 0];
        stats[loser._id][1] += 1;
      }

      // Doubles match (4 players)
      else if (players.length === 4) {
        const winners = players.slice(0, 2);
        const losers = players.slice(2);

        winners.forEach((winner) => {
          if (!stats[winner._id]) stats[winner._id] = [0, 0];
          stats[winner._id][0] += 1;
        });

        losers.forEach((loser) => {
          if (!stats[loser._id]) stats[loser._id] = [0, 0];
          stats[loser._id][1] += 1;
        });
      }
    });

    setPlayerStats(stats);

    const sorted = players
      .map((player) => ({
        ...player,
        wins: stats[player._id] ? stats[player._id][0] : 0,
      }))
      .sort((a, b) => b.wins - a.wins);

    setSortedPlayers(sorted);
  };

  const getPlayerStats = (playerId, playerStats) => {
    if (Object.keys(playerStats).length === 0 || !playerStats[playerId]) {
      return "(Wins: 0 - Losses: 0)";
    }
    return `(Wins: ${playerStats[playerId][0]} - Losses: ${playerStats[playerId][1]})`;
  };

  return (
    <Grid2 container direction="column" sx={{ gap: 2 }}>
      {sortedPlayers.length > 0 ? (
        sortedPlayers.map((player, index) => (
          <Card
            sx={{
              bgcolor: "primary.main",
              padding: 1,
            }}
            key={player._id}
          >
            <Grid2
              container
              justifyContent="space-between"
              alignItems="center"
              direction="row"
              sx={{ gap: 2 }}
            >
              <Grid2>
                <Container>
                  <Typography component="p">
                    {`${index + 1}.${"\u00A0".repeat(4)}${player.name}`}
                  </Typography>
                  <Typography
                    color="ternary"
                    sx={{ marginLeft: { xs: "1.5rem", md: "3rem" } }}
                  >
                    {getPlayerStats(player._id, playerStats)}
                  </Typography>
                </Container>
              </Grid2>

              <Button
                component={React_Link}
                to={`/player/${player._id}`}
                sx={{
                  minWidth: { xs: "32px", md: "64px" },
                  height: { xs: "32px", md: "32px" },
                  padding: { xs: "4px 6px", md: "8px 16px" },
                  display: { xs: "none", md: "inline-flex" },
                }}
              >
                <ArrowForwardIosIcon color="secondary" />
              </Button>
            </Grid2>
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
