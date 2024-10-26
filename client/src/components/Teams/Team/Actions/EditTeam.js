import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  TextField, Button, Typography, Paper, Grid2, Box, Container, Card, Grow, List, ListItem, ListItemText,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  FormControl, InputLabel, MenuItem, Select
} from '@mui/material';

import useStyles from '../styles';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { editTeam, getTeam, deleteTeam } from '../../../../actions/teams';

const EditTeam = ({ setIsAlert, setAlertMessage }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const team = useSelector((state) => state.teams);
  const [teamData, setTeamData] = useState({ name: team.name, captain: team.captain, players: team.players, teamCode: team.teamCode });
  const [open, setOpen] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getTeam(id));
      checkForAlert(response);
    };

    fetchData();
  }, [id, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(editTeam(id, { ...teamData, oldCaptain: team.captain }));
    checkForAlert(response);
    navigate(-1);
  };

  const handleRemovePlayer = async (p) => {
    const newPlayers = teamData.players.filter(player => player !== p);
    setTeamData({ ...teamData, players: newPlayers })
  };

  const handleConfirmDelete = async () => {
    handleDelete();
    setOpen(false);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCaptainSelectChange = (event) => {
    const p = teamData.players.find(player => player._id === event.target.value)
    if (p) {
      setTeamData({ ...teamData, captain: p })
    } else {
      setTeamData({ ...teamData, captain: team.captain })
    }
  };

  const handleDelete = async () => {
    const response = await dispatch(deleteTeam(id));
    checkForAlert(response);
    navigate('/my-teams');
  }

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 201) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  }

  return (
    <Container>
      <Grow in>
        <Grid2 container direction="column" sx={{ gap: 2 }}>
          <Typography color="primary"><strong>Team code: </strong>{`${team.teamCode}`}</Typography>
          <Paper sx={{ backgroundColor: (theme) => theme.palette.primary.main }} className={classes.paper}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
              <Card sx={{ bgcolor: 'primary.lighter' }}>
                <Grid2 container direction="column" sx={{ padding: 2, gap: { xs: 3, md: 3 } }} >
                  <Box>
                    <Grid2 container justifyContent={"center"}><Typography variant="h6">Editing <strong>{team.name}</strong></Typography></Grid2>
                    <Grid2 container>
                      <TextField
                        name="name"
                        variant="outlined"
                        label="Team Name"
                        value={teamData.name}
                        onChange={(e) => setTeamData({ ...teamData, name: e.target.value })}
                      />
                      <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                        <InputLabel id="select-captain-label">Captain</InputLabel>
                        <Select
                          labelId="select-captain-label"
                          id="select-captain"
                          value={teamData.captain._id}
                          onChange={handleCaptainSelectChange}
                          label="Captain"
                        >
                          <MenuItem value={team.captain._id}>
                            <strong>{team.captain?.name}</strong>
                          </MenuItem>

                          {teamData.players?.length > 0 && teamData.players.map((player) => (
                            <MenuItem key={player} value={player._id}>
                              {player.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid2>
                  </Box>

                  <Grid2>
                    <Typography variant="h5" sx={{ display: "flex", justifyContent: "center" }}>Players</Typography>
                    <hr sx={{ color: 'primary.lighter' }} />
                    {teamData.players?.length > 0 ? teamData.players.map((player, index) => (
                      <Grid2 xs={12} md={6} key={player._id}>
                        <List>
                          <ListItem
                            secondaryAction={
                              <IconButton edge="end" aria-label="delete" onClick={() => handleRemovePlayer(player)}>
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
          <Grid2 container justifyContent="flex-end">
            <Button variant='contained' onClick={handleClickOpen} sx={{ '&:hover': { backgroundColor: 'darkred' } }}>Delete Team</Button>
          </Grid2>
        </Grid2>
      </Grow>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Are you sure you want to delete this team?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. Please confirm if you want to permanently delete this team.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default EditTeam
