import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Typography, Paper, Grid2, Box, Container, Card, Grow, List, ListItem, ListItemAvatar, ListItemText, Avatar } from '@mui/material';

import useStyles from '../styles';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


import { editTeam, getTeam } from '../../../../actions/teams';

const EditTeam = ({ setIsAlert, setAlertMessage }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [teamData, setTeamData] = useState({ name: '', captain: null, players: [] });
  const user = JSON.parse(localStorage.getItem('profile'));
  const team = useSelector((state) => state.teams);

  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getTeam(id)); // Await the response from dispatch
      checkForAlert(response);
    };

    fetchData(); // Call the async function
  }, [id, dispatch]);

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
    <Grow in>
      <Container>
        <Typography color="primary"><strong>Team code: </strong>{`${team?.teamCode}`}</Typography>
        <Paper sx={{ backgroundColor: (theme) => theme.palette.primary.main }} className={classes.paper}>
          <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
            <Card sx={{ bgcolor: 'primary.lighter' }}>
              <Grid2 container direction="column" sx={{ padding: 2, gap: { xs: 3, md: 3 } }} >
                <Box>
                  <Grid2 container justifyContent={"center"}><Typography variant="h6">Editing {team.name}</Typography></Grid2>
                  <Grid2 container>
                    <TextField name="name" variant="outlined" label="Team Name" value={team.name} onChange={(e) => setTeamData({ ...teamData, name: e.target.value })} />
                    <TextField name="name" variant="outlined" label="Captain" value={team.captain.name} onChange={(e) => setTeamData({ ...teamData, name: e.target.value })} />
                  </Grid2>
                </Box>

                <Grid2>
                  <Typography variant="h5" sx={{ display: "flex", justifyContent: "center" }}>Players</Typography>
                  <hr sx={{ color: 'primary.lighter' }} />
                  {team?.players?.length > 0 ? team?.players.map((player, index) => (
                    <Grid2 xs={12} md={6} key={player._id}>
                      <List>
                        <ListItem
                          secondaryAction={
                            <IconButton edge="end" aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          }
                        >
                          <ListItemText
                            primary={`${index + 1}.${'\u00A0'.repeat(4)}${player.name}`}
                          />
                        </ListItem>
                      </List>
                    </Grid2>
                  )) : <Typography>No Players</Typography>}
                </Grid2>
                <Grid2 container justifyContent="flex-end">
                  <Button className={classes.buttonSubmit} variant="contained" color="secondary" type="submit">Submit</Button>
                </Grid2>
              </Grid2>
            </Card>
          </form>
        </Paper >
      </Container>
    </Grow>
  )
}

export default EditTeam
