import React, { useState, useEffect } from 'react'
import { TextField, Button, Typography, Paper, Grid2, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import useStyles from './styles';

import { createTeam } from '../../../actions/teams';


const CreateTeam = ({ currentId, setCurrentId }) => {
  const [teamData, setTeamData] = useState({ name: '', captain: null, players: [] });
  const team = useSelector((state) => (currentId ? state.teams.find((team) => team._id === currentId) : null));
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = JSON.parse(localStorage.getItem('profile'));

  useEffect(() => {
    if (team) setTeamData(team);
  }, [team]);

  const clear = () => {
    setCurrentId(0);
    setTeamData({ name: '', captain: null, players: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentId === 0) {
      dispatch(createTeam({ ...teamData, captain: user }));
      clear();
    } else {
      // dispatch(updatePost(currentId, { ...teamData, name: user?.result?.name }));
      clear();
    }
  };

  return (
    <Paper sx={{ backgroundColor: (theme) => theme.palette.primary.main }} className={classes.paper}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Box>
          <Grid2 container justifyContent={"center"}><Typography variant="h6">{currentId ? `Editing "${team.name}"` : 'Creating a Team'}</Typography></Grid2>
          <Grid2 container>
            <Grid2><TextField name="name" sx={{ backgroundColor: (theme) => theme.palette.primary.main, height: 56 }} variant="outlined" label="Team Name" value={teamData.name} onChange={(e) => setTeamData({ ...teamData, name: e.target.value })} /></Grid2>
            <Grid2 alignItems="center" display="flex"><Button className={classes.buttonSubmit} variant="contained" color="secondary" type="submit">Submit</Button></Grid2>
          </Grid2>
        </Box>
      </form>
    </Paper>
  );
}

export default CreateTeam
