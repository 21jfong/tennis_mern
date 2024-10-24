import React, { useState } from 'react'
import { TextField, Button, Typography, Paper, Grid2, Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import useStyles from './styles';
import { useNavigate } from 'react-router-dom';

import { joinTeam } from '../../../actions/teams';


const CreateTeam = ({ setIsAlert, setAlertMessage }) => {
  const [teamCode, setTeamCode] = useState({ code: "" });
  const dispatch = useDispatch();
  const classes = useStyles();
  const navigate = useNavigate();

  const clear = () => {
    setTeamCode({ code: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(joinTeam(teamCode.code));
    checkForAlert(response);
    navigate(-1);
    clear();
  };

  const checkForAlert = (res) => {
    console.log(res)
    if (res?.status && res.status !== 200) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  }

  return (
    <Paper sx={{ backgroundColor: (theme) => theme.palette.primary.main }} className={classes.paper}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Box>
          <Grid2 container justifyContent={"center"}><Typography variant="h6">Find Team</Typography></Grid2>
          <Grid2 container>
            <Grid2><TextField name="code" sx={{ backgroundColor: (theme) => theme.palette.primary.main, height: 56 }} variant="outlined" label="Team Code" value={teamCode.code} onChange={(e) => setTeamCode({ code: e.target.value })} /></Grid2>
            <Grid2 alignItems="center" display="flex"><Button className={classes.buttonSubmit} variant="contained" color="secondary" type="submit">Join</Button></Grid2>
          </Grid2>
        </Box>
      </form>
    </Paper>
  );
}

export default CreateTeam
