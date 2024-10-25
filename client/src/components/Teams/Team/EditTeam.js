import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { TextField, Button, Typography, Paper, Grid2, Box } from '@mui/material';

import useStyles from './styles';

import { editTeam } from '../../../actions/teams';

const EditTeam = ({ setIsAlert, setAlertMessage }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const classes = useStyles();

  const [teamData, setTeamData] = useState({ name: '', captain: null, players: [] });
  const user = JSON.parse(localStorage.getItem('profile'));

  const clear = () => {
    setTeamData({ name: '', captain: null, players: [] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(editTeam({ ...teamData, captain: user }));
    checkForAlert(response);
    navigate(-1);
  };

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 201) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  }

  return (
    <Paper sx={{ backgroundColor: (theme) => theme.palette.primary.main }} className={classes.paper}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Box>
          <Grid2 container justifyContent={"center"}><Typography variant="h6">Editing a Team</Typography></Grid2>
          <Grid2 container>
            <Grid2><TextField name="name" sx={{ backgroundColor: (theme) => theme.palette.primary.main, height: 56 }} variant="outlined" label="Team Name" value={teamData.name} onChange={(e) => setTeamData({ ...teamData, name: e.target.value })} /></Grid2>
            <Grid2 alignItems="center" display="flex"><Button className={classes.buttonSubmit} variant="contained" color="secondary" type="submit">Submit</Button></Grid2>
          </Grid2>
        </Box>
      </form>
    </Paper>
  )
}

export default EditTeam
