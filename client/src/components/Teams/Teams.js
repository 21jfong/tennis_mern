import React from 'react'
import useStyles from './styles'
import { Button, Container, Grid2, Link, Typography } from '@mui/material'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { deleteTeam } from '../../actions/teams';

const Teams = () => {
  const classes = useStyles();
  const teams = useSelector((state) => state.teams);
  const navigate = useNavigate();

  const handleGoToTeam = () => {
    navigate('/my-teams/create-team'); // Replace with your route
  };

  return (
    <Grid2 className={classes.container} container alignItems="stretch" spacing={3}>
      <Grid2>
        <Button variant="contained" color="primary" onClick={handleGoToTeam}>Create Team</Button>
        <Container>
          {teams ? teams?.map((team) => (
            <Link href={`my-teams/${team._id}`}>
              {team.name}
            </Link>
          )) : <Typography sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)' }}>No Teams Available</Typography>}</Container>
      </Grid2>
    </Grid2>
  )
}

export default Teams
