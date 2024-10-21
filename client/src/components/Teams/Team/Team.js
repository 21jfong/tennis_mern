import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';

import { Card, CardActions, CardContent, CardMedia, Button, Typography, Paper } from '@mui/material';

import { getTeam } from '../../../actions/teams';


const Team = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { id } = useParams();
  const team = useSelector((state) => state.teams);

  useEffect(() => {
    dispatch(getTeam(id)); // if I want to update whenever team is changed, then add a dependency called teamRefresh or something
  }, [id, dispatch])

  return (
    <Paper className={classes.paper} sx={{ bgcolor: 'secondary.main' }}>
      <Card className={classes.card} sx={{ minWidth: 150, bgcolor: 'primary' }}>
        {`Team code: ${team.teamCode}`}
      </Card>

      <Card className={classes.card} sx={{ minWidth: 150, bgcolor: 'primary' }}>
        <Typography variant="h3" sx={{ padding: 2 }}>{team.name}</Typography>

        <CardContent>
          {team?.players ? team?.players.map((player) => (
            <Typography component="p" key={player._id}>
              {`Player: ${player.name}`}
            </Typography>
          )) : <Typography sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)', textAlign: 'center' }}>Team Not Available</Typography>}
        </CardContent>
      </Card>
    </Paper>
  )
}

export default Team
