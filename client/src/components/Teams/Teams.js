import React from 'react'
import useStyles from './styles'
import { Button, Container, Grid2, Link, Typography } from '@mui/material'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { createTeam, deleteTeam } from '../../actions/teams';

const Teams = () => {
  const classes = useStyles();
  const teams = useSelector((state) => state.teams);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCreateTeam = () => {
    navigate('/my-teams/create-team'); // Replace with your route
  };

  return (
    <Grid2 className={classes.container} container alignItems="stretch" spacing={3}>
      <Grid2>
        <Button variant="contained" color="primary" onClick={handleCreateTeam}>Create Team</Button>
        <Container>
          {teams ? teams?.map((team) => (
            <Link href={`my-teams/${team._id}`}>
              {team.name}
            </Link>
          )) : <Typography variant="h3">No Teams Available</Typography>}</Container>
      </Grid2>
    </Grid2>
  )
}

export default Teams
