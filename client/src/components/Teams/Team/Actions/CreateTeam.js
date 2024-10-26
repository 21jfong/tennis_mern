import React, { useState } from 'react'
import { TextField, Button, Typography, Paper, Grid2, Box, Grow } from '@mui/material';
import { useDispatch } from 'react-redux';
import useStyles from '../styles';
import { useNavigate } from 'react-router-dom';

import { createTeam } from '../../../../actions/teams';


const CreateTeam = ({ setIsAlert, setAlertMessage }) => {
  const [teamData, setTeamData] = useState({ name: '', captain: null, players: [], teamCode: '' });
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('profile'));

  const clear = () => {
    setTeamData({ name: '', captain: null, players: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(createTeam({ ...teamData, captain: user }));
    checkForAlert(response);
    navigate("/my-teams");
    clear();
  };

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 201) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  }

  return (
    <Grow in>
      <Paper sx={{ backgroundColor: (theme) => theme.palette.primary.main }} className={classes.paper}>
        <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
          <Box>
            <Grid2 container justifyContent={"center"}><Typography variant="h6">Creating a Team</Typography></Grid2>
            <Grid2 container>
              <Grid2><TextField name="name" sx={{ backgroundColor: (theme) => theme.palette.primary.main, height: 56 }} variant="outlined" label="Team Name" value={teamData.name} onChange={(e) => setTeamData({ ...teamData, name: e.target.value })} /></Grid2>
              <Grid2 alignItems="center" display="flex"><Button className={classes.buttonSubmit} variant="contained" color="secondary" type="submit">Submit</Button></Grid2>
            </Grid2>
          </Box>
        </form>
      </Paper>
    </Grow>
  );
}

export default CreateTeam
