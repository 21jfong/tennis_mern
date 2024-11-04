import React, { useState } from 'react'
import { TextField, Button, Typography, Paper, Grid2, Box, Grow } from '@mui/material';
import { useDispatch } from 'react-redux';
import useStyles from '../styles';
import { useNavigate } from 'react-router-dom';

import { createMatch } from '../../../../actions/matches';

const CreateMatch = ({ setIsAlert, setAlertMessage }) => {
  const [matchData, setMatchData] = useState({ teams: [], players: [], score: '' });
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();

  const clear = () => {
    setMatchData({ teams: [], players: [], score: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(createMatch({}));
    checkForAlert(response);
    navigate(-1);
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
      <Grid2 container direction="column" sx={{ gap: 2 }}>
        <Paper sx={{ backgroundColor: (theme) => theme.palette.primary.main }} className={classes.paper}>
          <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
            <Box>
              <Grid2 container justifyContent={"center"}><Typography variant="h6">Registering Match</Typography></Grid2>
              <Grid2 container>
                <Grid2><TextField name="name" sx={{ backgroundColor: (theme) => theme.palette.primary.main, height: 56 }} variant="outlined" label="Team Name" value={matchData.name} onChange={(e) => setMatchData({ ...matchData, name: e.target.value })} /></Grid2>
                <Grid2 alignItems="center" display="flex"><Button className={classes.buttonSubmit} variant="contained" color="secondary" type="submit">Submit</Button></Grid2>
              </Grid2>
            </Box>
          </form>
        </Paper>
        <Grid2 container justifyContent="flex-end">
          <Button variant='contained' onClick={() => navigate(-1)}>Back</Button>
        </Grid2>
      </Grid2>
    </Grow>
  );
}

export default CreateMatch
