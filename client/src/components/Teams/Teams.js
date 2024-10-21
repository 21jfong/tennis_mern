import React, { useEffect } from 'react'
import useStyles from './styles'
import { Button, Container, Grid2, Link, Typography, Grow } from '@mui/material'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { getTeams, deleteTeam } from '../../actions/teams';

const Teams = () => {
  const classes = useStyles();
  const teams = useSelector((state) => state.teams);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = localStorage.getItem('profile');

  useEffect(() => {
    dispatch(getTeams(user));
  }, [teams, user, dispatch])

  const handleCreateTeam = () => {
    navigate('/my-teams/create-team');
  };

  const handleJoinTeam = () => {
    navigate('/my-teams/join-team');
  };
  return (
    <Grow in>
      <Grid2 container alignItems="stretch" spacing={3}>
        <Grid2 container>
          <Button variant="contained" color="primary" onClick={handleCreateTeam}>Create Team</Button>
          <Button variant="contained" color="primary" onClick={handleJoinTeam}>Join Team</Button>
        </Grid2>
        <Container className={classes.mainContainer}>
          <Typography variant='h4'>My Teams</Typography>
          {teams.length > 0 ? teams?.map((team) => (
            <Link href={`my-teams/${team._id}`} key={team._id}>
              {`${team.name} - Captain: ${team.captain.name}`} <br />
            </Link>
          )) : <Typography sx={{ fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)' }}>No Teams Available</Typography>}
        </Container>
      </Grid2>
    </Grow>
  )
}

export default Teams
