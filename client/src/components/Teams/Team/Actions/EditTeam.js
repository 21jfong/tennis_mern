import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Grow,
  Stack,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { editTeam, getTeam, deleteTeam } from "../../../../actions/teams";

const EditTeam = ({ setIsAlert, setAlertMessage }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const team = useSelector((state) => state.teams);

  const [teamData, setTeamData] = useState({
    name: "",
    captain: {},
    players: [],
    teamCode: "",
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await dispatch(getTeam(id));
      checkForAlert(response);
    };
    fetchData();
  }, [id, dispatch]);

  useEffect(() => {
    if (team && team._id === id) {
      setTeamData({
        name: team.name,
        captain: team.captain,
        players: team.players,
        teamCode: team.teamCode,
      });
    }
  }, [team, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await dispatch(
      editTeam(id, { ...teamData, oldCaptain: team.captain })
    );
    checkForAlert(response);
    navigate(-1);
  };

  const handleRemovePlayer = (p) => {
    const newPlayers = teamData.players.filter((player) => player !== p);
    setTeamData({ ...teamData, players: newPlayers });
  };

  const handleDelete = async () => {
    const response = await dispatch(deleteTeam(id));
    checkForAlert(response);
    navigate("/my-teams");
  };

  const handleConfirmDelete = () => {
    setOpen(false);
    handleDelete();
  };

  const handleCaptainSelectChange = (e) => {
    const selected = teamData.players.find((p) => p._id === e.target.value);
    if (selected) {
      setTeamData({ ...teamData, captain: selected });
    }
  };

  const checkForAlert = (res) => {
    if (res?.status && res.status !== 201) {
      setAlertMessage(res.response.data.message);
      setIsAlert(true);
    }
  };

  return (
    <Grow in>
      <Container maxWidth="md" sx={{ mt: 5 }}>
        <Stack spacing={3}>
          <Typography variant="h6" color="primary">
            <strong>Team code:</strong> {teamData.teamCode}
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              p: 4,
              borderRadius: 3,
              backgroundColor: "primary.main",
              boxShadow: 2,
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h5" textAlign="center" color="white">
                Editing <strong>{teamData.name}</strong>
              </Typography>

              <TextField
                name="name"
                label="Team Name"
                variant="outlined"
                fullWidth
                value={teamData.name}
                onChange={(e) =>
                  setTeamData({ ...teamData, name: e.target.value })
                }
              />

              <FormControl fullWidth>
                <InputLabel id="captain-label">Captain</InputLabel>
                <Select
                  labelId="captain-label"
                  id="select-captain"
                  value={teamData.captain?._id || ""}
                  label="Captain"
                  onChange={handleCaptainSelectChange}
                >
                  {teamData.players?.map((player) => (
                    <MenuItem key={player._id} value={player._id}>
                      {player.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Typography variant="h6" gutterBottom color="secondary.main">
                  Players
                </Typography>
                {teamData.players?.length > 0 ? (
                  <List dense>
                    {teamData.players.map((player, index) => (
                      <ListItem
                        key={player._id}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleRemovePlayer(player)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText
                          primary={`${index + 1}. ${player.name}`}
                          sx={{
                            color: "secondary.main",
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography>No players on this team.</Typography>
                )}
              </Box>

              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button
                  variant="contained"
                  onClick={() => navigate(-1)}
                  sx={{
                    backgroundColor: "primary.dark",
                    "&:hover": {
                      backgroundColor: "primary.lighter",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    backgroundColor: "primary.lighter",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  Save Changes
                </Button>
              </Box>
            </Stack>
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="error"
              onClick={() => setOpen(true)}
              sx={{ "&:hover": { backgroundColor: "#c62828" } }}
            >
              Delete Team
            </Button>
          </Box>
        </Stack>

        {/* Confirm Delete Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Are you sure you want to delete this team?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This action cannot be undone. Please confirm if you want to
              permanently delete this team.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error" autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Grow>
  );
};

export default EditTeam;
